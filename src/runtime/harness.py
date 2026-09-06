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

import builtins
import linecache
import random
import re
import sys
import traceback

USER_FILE = "main.py"
MAX_OUTPUT = 60_000


class OutputLimitExceeded(Exception):
    pass


class NeedInput(Exception):
    def __init__(self, prompt):
        super().__init__(prompt)
        self.prompt = prompt


class TraceLimit(Exception):
    pass


class _LimitedOut:
    """A stdout replacement that stops runaway programs from printing forever."""

    def __init__(self, limit=MAX_OUTPUT):
        self.buf = []
        self.size = 0
        self.limit = limit

    def write(self, s):
        if not isinstance(s, str):
            s = str(s)
        self.buf.append(s)
        self.size += len(s)
        if self.size > self.limit:
            raise OutputLimitExceeded()
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


def _format_error(exc, code):
    tb = exc.__traceback__
    line = None
    frames = []
    if tb is not None:
        for entry in traceback.extract_tb(tb):
            if entry.filename == USER_FILE:
                frames.append(entry)
                line = entry.lineno
    if isinstance(exc, SyntaxError) and exc.filename == USER_FILE:
        line = exc.lineno
        message = exc.msg or str(exc)
    else:
        message = str(exc)
    lines = code.split("\n")
    source = lines[line - 1] if line and 0 < line <= len(lines) else None
    parts = []
    if frames:
        parts.append("Traceback (most recent call last):\n")
        parts.extend(traceback.format_list(frames))
    parts.extend(traceback.format_exception_only(type(exc), exc))
    return {
        "type": type(exc).__name__,
        "message": message,
        "line": line,
        "source": source,
        "traceback": "".join(parts),
    }


def _fresh_namespace():
    return {"__name__": "__main__", "__builtins__": builtins}


def _execute(code, stdin_lines, seed, echo, show_prompt, output_limit=MAX_OUTPUT, before_exec=None, after_exec=None):
    out = _LimitedOut(output_limit)
    saved = (sys.stdout, sys.stderr, builtins.input)
    sys.stdout = out
    sys.stderr = out
    builtins.input = _make_input(stdin_lines, out, echo, show_prompt)
    random.seed(seed)
    ns = _fresh_namespace()
    result = {"stdout": "", "error": None, "needInput": None, "truncated": False}
    _register_source(code)
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
    except Exception:  # noqa: BLE001
        r = "<unprintable>"
    if len(r) > limit:
        r = r[: limit - 1] + "…"
    return r


def _capture(fn):
    """Run fn() capturing stdout; returns (value, printed_text, error_dict_or_None)."""
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


def grade(code, check, seed=0):
    results = []
    all_passed = True

    for req in check.get("requires") or []:
        ok = re.search(req["pattern"], code, re.MULTILINE) is not None
        results.append({"kind": "requires", "passed": ok, "message": req.get("message")})
        all_passed = all_passed and ok

    for req in check.get("forbids") or []:
        ok = re.search(req["pattern"], code, re.MULTILINE) is None
        results.append({"kind": "forbids", "passed": ok, "message": req.get("message")})
        all_passed = all_passed and ok

    for index, tc in enumerate(check.get("tests") or []):
        r = {"kind": "test", "index": index, "type": tc["type"], "name": tc.get("name"), "passed": False}
        stdin_lines = tc.get("stdin") or []
        res, ns = _execute(code, stdin_lines, seed, echo=False, show_prompt=False)
        r["stdin"] = stdin_lines
        r["actual"] = res["stdout"]
        if res["error"]:
            r["error"] = res["error"]
        elif res["needInput"] is not None:
            r["reason"] = "need-input"
        elif res["truncated"]:
            r["reason"] = "too-much-output"
        elif tc["type"] == "output":
            mode = tc.get("match") or "trimmed"
            expected = tc["expected"]
            actual = res["stdout"]
            if mode == "contains":
                passed = _normalize(expected, "trimmed") in _normalize(actual, "trimmed")
            elif mode == "regex":
                passed = re.search(expected, actual, re.MULTILINE) is not None
            else:
                passed = _normalize(actual, mode) == _normalize(expected, mode)
            r["passed"] = passed
            r["expected"] = expected
            r["match"] = mode
        elif tc["type"] == "function":
            value, printed, err = _capture(lambda: eval(tc["call"], ns))
            r["call"] = tc["call"]
            if err is not None:
                r["error"] = _format_error(err, code)
            else:
                try:
                    expected = eval(tc["expected"], {"__builtins__": builtins})
                except Exception as e:  # noqa: BLE001
                    r["reason"] = "bad-expected"
                    r["message"] = "Test error: " + type(e).__name__ + ": " + str(e)
                    expected = None
                if "reason" not in r:
                    same = value == expected and isinstance(value, bool) == isinstance(expected, bool)
                    r["passed"] = bool(same)
                    r["expected"] = _safe_repr(expected)
                    r["actualValue"] = _safe_repr(value)
                    if not same and value is None and printed.strip():
                        r["reason"] = "printed-not-returned"
                        r["printed"] = printed
        elif tc["type"] == "python":
            def _run(lines=()):
                inner, _ = _execute(code, list(lines), seed, echo=False, show_prompt=False)
                return inner["stdout"]

            env = {
                "__builtins__": builtins,
                "ns": ns,
                "stdout": res["stdout"],
                "source": code,
                "run": _run,
            }
            _v, _printed, err = _capture(lambda: exec(tc["script"], env))
            if err is None:
                r["passed"] = True
            elif isinstance(err, AssertionError):
                r["message"] = str(err) or "A check did not pass."
            else:
                r["message"] = "Check error: " + type(err).__name__ + ": " + str(err)
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


def trace_program(code, stdin_lines=(), seed=0, max_steps=400):
    steps = []
    depth = [-1]
    state = {"out": None}

    def snapshot(frame, event, arg):
        variables = {}
        try:
            items = list(frame.f_locals.items())
        except Exception:  # noqa: BLE001
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

import json  # noqa: E402


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
