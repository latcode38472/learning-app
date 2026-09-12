"""
CodePath execution harness.

This module runs inside the Python sandbox (Pyodide, i.e. Python compiled to
WebAssembly). In the app it lives in a Web Worker inside the learner's own
browser; the same file is used by the Node-based content validator.

Learner code never touches the application server.

Public functions (all return JSON-friendly dicts):
  run_program(code, stdin_lines, seed, echo, show_prompt)  -> {stdout, error, needInput, truncated}
  grade(code, check_spec, seed)                            -> {passed, results: [...]}
  trace_program(code, stdin_lines, seed, max_steps)        -> {steps: [...], error, stdout}
"""

import ast
import builtins
import io
import json
import linecache
import random as _random_module
import re
import sys
import tokenize
import traceback

USER_FILE = "main.py"
MAX_OUTPUT = 60_000

# Assert messages in check scripts can be localized: M("English", "עברית")
# returns a marker string that the grader turns back into {"en": ..., "he": ...}.
I18N_MARKER = "@@i18n@@"


def _localized_message(en, he=None):
    return I18N_MARKER + json.dumps({"en": str(en), "he": str(he if he is not None else en)}, ensure_ascii=False)


def _decode_message(text):
    """A plain string, or a dict when the message came from M()."""
    text = _safe_str(text)
    if text.startswith(I18N_MARKER):
        try:
            return json.loads(text[len(I18N_MARKER):])
        except ValueError:
            return text[len(I18N_MARKER):]
    return text

# Modules that would let learner code reach the JavaScript host (worker scope,
# fetch, postMessage). They are hidden while learner code runs.
BLOCKED_MODULE_PREFIXES = ("js", "pyodide", "pyodide_js", "_pyodide")


# Control-flow signals derive from BaseException so that a learner's
# `except Exception:` cannot swallow them (a bare `except:` still can; the
# main-thread timeout is the backstop for that).
class OutputLimitExceeded(BaseException):
    pass


class NeedInput(BaseException):
    def __init__(self, prompt):
        super().__init__(prompt)
        self.prompt = prompt


class TraceLimit(BaseException):
    pass


class _LimitedOut:
    """A stdout replacement that stops runaway programs from printing forever."""

    def __init__(self, limit=MAX_OUTPUT):
        self.buf = []
        self.size = 0
        self.limit = limit
        self.exceeded = False

    def write(self, s):
        if self.exceeded:
            return 0
        if not isinstance(s, str):
            s = str(s)
        if self.size + len(s) > self.limit:
            room = self.limit - self.size
            if room > 0:
                self.buf.append(s[:room])
                self.size += room
            self.exceeded = True
            raise OutputLimitExceeded()
        self.buf.append(s)
        self.size += len(s)
        return len(s)

    def flush(self):
        pass

    def getvalue(self):
        return "".join(self.buf)


def _make_input(lines, out, echo, show_prompt):
    queue = list(lines)

    def _input(prompt=""):
        prompt = str(prompt)
        if show_prompt:
            out.write(prompt)
        if queue:
            value = queue.pop(0)
            if echo:
                out.write(value + "\n")
            return value
        raise NeedInput(prompt)

    return _input


def _register_source(code):
    linecache.cache[USER_FILE] = (len(code), None, code.splitlines(True), USER_FILE)


def _safe_str(value):
    try:
        return str(value)
    except BaseException:  # noqa: BLE001 - a broken __str__ must not crash the harness
        return "<unprintable message>"


def _format_error(exc, code):
    tb = exc.__traceback__
    line = None
    frames = []
    if tb is not None:
        try:
            for entry in traceback.extract_tb(tb):
                if entry.filename == USER_FILE:
                    frames.append(entry)
                    line = entry.lineno
        except BaseException:  # noqa: BLE001
            frames = []
    if isinstance(exc, SyntaxError) and exc.filename == USER_FILE:
        line = exc.lineno
        message = exc.msg or _safe_str(exc)
    else:
        message = _safe_str(exc)
    lines = code.split("\n")
    source = lines[line - 1] if line and 0 < line <= len(lines) else None
    parts = []
    try:
        if frames:
            parts.append("Traceback (most recent call last):\n")
            parts.extend(traceback.format_list(frames))
        parts.extend(traceback.format_exception_only(type(exc), exc))
    except BaseException:  # noqa: BLE001
        parts = [type(exc).__name__ + ": " + message + "\n"]
    return {
        "type": type(exc).__name__,
        "message": message,
        "line": line,
        "source": source,
        "traceback": "".join(parts),
    }


class _BlockedFinder:
    """Import hook that refuses the modules bridging into the JavaScript host."""

    def find_spec(self, name, path=None, target=None):
        root = name.split(".")[0]
        if root in BLOCKED_MODULE_PREFIXES:
            raise ImportError("The module '" + root + "' is not available inside the learning sandbox.")
        return None


def _fresh_namespace():
    return {"__name__": "__main__", "__builtins__": builtins}


class _Sandbox:
    """Hides host-bridge modules and restores interpreter state after a run."""

    def __enter__(self):
        self.hidden = {}
        for name in list(sys.modules):
            if name.split(".")[0] in BLOCKED_MODULE_PREFIXES:
                self.hidden[name] = sys.modules.pop(name)
        self.finder = _BlockedFinder()
        sys.meta_path.insert(0, self.finder)
        self.modules_before = set(sys.modules)
        self.builtins_before = dict(builtins.__dict__)
        # The random module is shared (check scripts may patch it on purpose);
        # learner patches made during the run are undone afterwards.
        self.random_before = dict(_random_module.__dict__)
        self.recursion_limit = sys.getrecursionlimit()
        return self

    def __exit__(self, *exc):
        try:
            sys.meta_path.remove(self.finder)
        except ValueError:
            pass
        # Drop modules the learner imported so their patches do not leak into later runs.
        for name in list(sys.modules):
            if name not in self.modules_before:
                sys.modules.pop(name, None)
        sys.modules.update(self.hidden)
        _restore_dict(builtins.__dict__, self.builtins_before)
        _restore_dict(_random_module.__dict__, self.random_before)
        sys.setrecursionlimit(self.recursion_limit)
        return False


def _restore_dict(target, snapshot):
    for key in list(target):
        if key not in snapshot:
            del target[key]
    target.update(snapshot)


def _seed_random(seed):
    _random_module.seed(seed)


def _execute(code, stdin_lines, seed, echo, show_prompt, output_limit=MAX_OUTPUT, before_exec=None, after_exec=None):
    out = _LimitedOut(output_limit)
    saved = (sys.stdout, sys.stderr, builtins.input)
    result = {"stdout": "", "error": None, "needInput": None, "truncated": False}
    ns = _fresh_namespace()
    _register_source(code)
    with _Sandbox():
        sys.stdout = out
        sys.stderr = out
        builtins.input = _make_input(stdin_lines, out, echo, show_prompt)
        _seed_random(seed)
        try:
            compiled = compile(code, USER_FILE, "exec")
            if before_exec:
                before_exec()
            exec(compiled, ns)
        except NeedInput as e:
            result["needInput"] = e.prompt
        except OutputLimitExceeded:
            result["truncated"] = True
        except TraceLimit:
            result["traceLimit"] = True
        except SystemExit:
            pass
        except BaseException as e:  # noqa: BLE001 - we want to report every learner error
            result["error"] = _format_error(e, code)
        finally:
            if after_exec:
                after_exec()
            sys.stdout, sys.stderr, builtins.input = saved
    result["stdout"] = out.getvalue()[:output_limit]
    return result, ns


def run_program(code, stdin_lines=(), seed=0, echo=True, show_prompt=True):
    result, _ns = _execute(code, stdin_lines, seed, echo, show_prompt)
    return result


# ---------------------------------------------------------------- grading


def _normalize(text, mode):
    text = text if isinstance(text, str) else _safe_str(text)
    lines = [l.rstrip() for l in text.replace("\r\n", "\n").split("\n")]
    while lines and lines[-1] == "":
        lines.pop()
    while lines and lines[0] == "":
        lines.pop(0)
    joined = "\n".join(lines)
    if mode == "loose":
        joined = " ".join(joined.lower().split())
    return joined


def _safe_repr(value, limit=80):
    try:
        r = repr(value)
    except BaseException:  # noqa: BLE001
        r = "<unprintable>"
    if len(r) > limit:
        r = r[: limit - 1] + "…"
    return r


def _code_only(source):
    """Source with comments removed, so structural requirements ignore `# notes`."""
    try:
        tokens = []
        for tok in tokenize.generate_tokens(io.StringIO(source).readline):
            if tok.type == tokenize.COMMENT:
                continue
            tokens.append(tok)
        return tokenize.untokenize(tokens)
    except BaseException:  # noqa: BLE001 - unparsable code is matched as written
        return source


def _capture(fn):
    """Run fn() capturing stdout; returns (value, printed_text, error_or_None)."""
    out = _LimitedOut()
    saved = (sys.stdout, sys.stderr)
    sys.stdout = out
    sys.stderr = out
    try:
        value = fn()
        return value, out.getvalue(), None
    except BaseException as e:  # noqa: BLE001
        return None, out.getvalue(), e
    finally:
        sys.stdout, sys.stderr = saved


def _bad_test(kind, message):
    return {
        "kind": kind,
        "passed": False,
        "reason": "bad-test",
        "message": {"en": "This check is misconfigured: " + message, "he": "הבדיקה הזאת מוגדרת בצורה שגויה: " + message},
    }


def _pattern_matches(pattern, text):
    try:
        return re.search(pattern, text, re.MULTILINE) is not None, None
    except re.error as e:
        return False, "invalid pattern (" + _safe_str(e) + ")"


def grade(code, check, seed=0):
    results = []
    all_passed = True
    code_only = _code_only(code)

    for req in check.get("requires") or []:
        ok, problem = _pattern_matches(req.get("pattern", ""), code_only)
        if problem:
            results.append(_bad_test("requires", problem))
        else:
            results.append({"kind": "requires", "passed": ok, "message": req.get("message")})
        all_passed = all_passed and ok and not problem

    for req in check.get("forbids") or []:
        found, problem = _pattern_matches(req.get("pattern", ""), code_only)
        ok = not found
        if problem:
            results.append(_bad_test("forbids", problem))
        else:
            results.append({"kind": "forbids", "passed": ok, "message": req.get("message")})
        all_passed = all_passed and ok and not problem

    for index, tc in enumerate(check.get("tests") or []):
        r = {"kind": "test", "index": index, "type": tc.get("type"), "name": tc.get("name"), "passed": False}
        stdin_lines = tc.get("stdin") or []
        res, ns = _execute(code, stdin_lines, seed, echo=False, show_prompt=False)
        r["stdin"] = stdin_lines
        r["actual"] = res["stdout"]
        # A program that reads input at top level can still define correct functions.
        ran_to_end = res["needInput"] is None or tc.get("type") == "function"
        if res["error"]:
            r["error"] = res["error"]
        elif not ran_to_end:
            r["reason"] = "need-input"
        elif res["truncated"]:
            r["reason"] = "too-much-output"
        elif tc.get("type") == "output":
            mode = tc.get("match") or "trimmed"
            expected = tc.get("expected", "")
            actual = res["stdout"]
            if mode == "contains":
                passed = _normalize(expected, "trimmed") in _normalize(actual, "trimmed")
            elif mode == "regex":
                passed, problem = _pattern_matches(expected, actual)
                if problem:
                    r["reason"] = "bad-test"
                    r["message"] = _bad_test("test", problem)["message"]
            else:
                passed = _normalize(actual, mode) == _normalize(expected, mode)
            r["passed"] = bool(passed)
            r["expected"] = expected if isinstance(expected, str) else _safe_str(expected)
            r["match"] = mode
        elif tc.get("type") == "function":
            value, printed, err = _capture(lambda: eval(tc["call"], ns))
            r["call"] = tc["call"]
            if isinstance(err, OutputLimitExceeded):
                r["reason"] = "too-much-output"
            elif isinstance(err, NeedInput):
                r["reason"] = "need-input"
            elif err is not None:
                r["error"] = _format_error(err, code)
            else:
                try:
                    expected = eval(tc["expected"], {"__builtins__": builtins})
                except BaseException as e:  # noqa: BLE001
                    r["reason"] = "bad-test"
                    r["message"] = _bad_test("test", "expected value cannot be evaluated: " + _safe_str(e))["message"]
                    expected = None
                if "reason" not in r:
                    try:
                        same = value == expected and isinstance(value, bool) == isinstance(expected, bool)
                    except BaseException:  # noqa: BLE001
                        same = False
                    r["passed"] = bool(same)
                    r["expected"] = _safe_repr(expected)
                    r["actualValue"] = _safe_repr(value)
                    if not same and value is None and printed.strip():
                        r["reason"] = "printed-not-returned"
                        r["printed"] = printed
        elif tc.get("type") == "python":
            def _run(lines=()):
                inner, _ = _execute(code, list(lines), seed, echo=False, show_prompt=False)
                return inner["stdout"]

            def _run_all(lines=()):
                """Re-run with input lines; returns {"stdout", "ns", "error"} for structural checks."""
                inner, inner_ns = _execute(code, list(lines), seed, echo=False, show_prompt=False)
                return {"stdout": inner["stdout"], "ns": inner_ns, "error": inner["error"], "needInput": inner["needInput"]}

            env = {
                "__builtins__": builtins,
                "ns": ns,
                "stdout": res["stdout"],
                "source": code,
                "run": _run,
                "run_all": _run_all,
                "M": _localized_message,
            }
            _v, _printed, err = _capture(lambda: exec(tc.get("script", ""), env))
            if err is None:
                r["passed"] = True
            elif isinstance(err, AssertionError):
                r["message"] = _decode_message(err) if _safe_str(err) else "A check did not pass."
            elif isinstance(err, NeedInput):
                r["reason"] = "need-input"
            elif isinstance(err, OutputLimitExceeded):
                r["reason"] = "too-much-output"
            else:
                r["message"] = "Check error: " + type(err).__name__ + ": " + _safe_str(err)
        else:
            r["reason"] = "bad-test"
            r["message"] = _bad_test("test", "unknown test type")["message"]
        all_passed = all_passed and r["passed"]
        results.append(r)

    return {"passed": all_passed, "results": results}


# ---------------------------------------------------------------- tracing


def _is_hidden(name, value):
    if name.startswith("__"):
        return True
    tname = type(value).__name__
    if tname in ("module", "function", "builtin_function_or_method", "type", "method"):
        return True
    return False


def _condition_map(code):
    """Lines that hold an if / elif / while test, with where each branch starts.

    Used after tracing to work out what the condition evaluated to: the line
    that runs next tells us whether the body, the else part, or the code after
    the statement was chosen.
    """
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return {}
    out = {}

    def record(node, kind):
        try:
            src = ast.get_source_segment(code, node.test) or ""
        except Exception:  # noqa: BLE001
            src = ""
        entry = {
            "kind": kind,
            "src": src,
            "body": node.body[0].lineno if node.body else None,
            "orelse": node.orelse[0].lineno if node.orelse else None,
            "elif": bool(node.orelse) and len(node.orelse) == 1 and isinstance(node.orelse[0], ast.If) and kind != "while",
            "start": node.lineno,
            "end": getattr(node, "end_lineno", node.lineno),
        }
        out.setdefault(node.lineno, entry)

    for node in ast.walk(tree):
        if isinstance(node, ast.If):
            record(node, "if")
        elif isinstance(node, ast.While):
            record(node, "while")
    return out


def _annotate_conditions(steps, cond_map):
    """Attach {src, result, taken} to steps that sit on a condition line."""
    for i, step in enumerate(steps):
        if step["event"] != "line":
            continue
        entry = cond_map.get(step["line"])
        if not entry:
            continue
        nxt = None
        for later in steps[i + 1:]:
            if later["depth"] == step["depth"] and later["func"] == step["func"]:
                nxt = later
                break
            if later["depth"] < step["depth"]:
                break
        info = {"src": entry["src"], "kind": entry["kind"], "result": None, "taken": None}
        if nxt is None:
            # Nothing else ran in this frame: the condition ended the block.
            if entry["kind"] == "while":
                info["result"] = False
                info["taken"] = "exit"
        elif nxt["event"] == "return":
            pass
        elif nxt["line"] == entry["body"]:
            info["result"] = True
            info["taken"] = "body"
        elif entry["orelse"] is not None and nxt["line"] == entry["orelse"]:
            info["result"] = False
            info["taken"] = "elif" if entry["elif"] else "else"
        elif nxt["line"] < entry["start"] or nxt["line"] > entry["end"] or nxt["line"] == step["line"]:
            info["result"] = False
            info["taken"] = "exit" if entry["kind"] == "while" else "skip"
        if info["result"] is not None:
            step["cond"] = info


def trace_program(code, stdin_lines=(), seed=0, max_steps=400):
    steps = []
    depth = [-1]
    state = {"out": None}

    def snapshot(frame, event, arg):
        variables = {}
        try:
            items = list(frame.f_locals.items())
        except BaseException:  # noqa: BLE001
            items = []
        for k, v in items:
            if _is_hidden(k, v):
                continue
            variables[k] = _safe_repr(v)
        steps.append(
            {
                "line": frame.f_lineno,
                "event": event,
                "func": frame.f_code.co_name,
                "depth": depth[0],
                "vars": variables,
                "stdout": state["out"].getvalue() if state["out"] else "",
                "ret": _safe_repr(arg) if event == "return" else None,
            }
        )
        if len(steps) >= max_steps:
            raise TraceLimit()

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != USER_FILE:
            return None
        if event == "call":
            depth[0] += 1
            snapshot(frame, "call", arg)
        elif event == "line":
            snapshot(frame, "line", arg)
        elif event == "return":
            snapshot(frame, "return", arg)
            depth[0] -= 1
        return tracer

    def before():
        state["out"] = sys.stdout
        sys.settrace(tracer)

    def after():
        sys.settrace(None)

    result, ns = _execute(code, stdin_lines, seed, echo=True, show_prompt=True, before_exec=before, after_exec=after)
    _annotate_conditions(steps, _condition_map(code))
    final_vars = {k: _safe_repr(v) for k, v in ns.items() if not _is_hidden(k, v)}
    return {
        "steps": steps,
        "finalVars": final_vars,
        "stdout": result["stdout"],
        "error": result["error"],
        "needInput": result["needInput"],
        "truncated": bool(result.get("traceLimit")),
    }


# ---------------------------------------------------------------- JSON entry points
# The worker and the validator talk to the harness with JSON strings so no
# Python objects cross the boundary.


def run_json(request):
    req = json.loads(request)
    return json.dumps(
        run_program(
            req["code"],
            req.get("stdin") or [],
            req.get("seed", 0),
            req.get("echo", True),
            req.get("showPrompt", True),
        )
    )


def grade_json(request):
    req = json.loads(request)
    return json.dumps(grade(req["code"], req["check"], req.get("seed", 0)))


def trace_json(request):
    req = json.loads(request)
    return json.dumps(trace_program(req["code"], req.get("stdin") or [], req.get("seed", 0), req.get("maxSteps", 400)))
