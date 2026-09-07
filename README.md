# CodePath — learn to program from zero to games and AI

CodePath is a bilingual (English / Hebrew) learning app that takes a complete
beginner from "what is a computer" to writing real Python programs, and lays
out an honest, prerequisite-driven path towards 2D/3D games, machine learning,
LLMs and reinforcement-learning agents inside games.

Python runs **inside the browser** (Pyodide, CPython compiled to WebAssembly)
in a sandboxed Web Worker with time and output limits. No learner code ever
runs on a server, no account is needed, and progress is stored on the device.

## What works today (first release)

* **Curriculum map** for all ten stages with prerequisites and unlock rules.
  Stage 1 is fully written; Stages 2–10 list their planned modules and
  lessons and are labelled *planned* — nothing pretends to be finished.
* **29 complete beginner Python lessons** (Stage 1, seven modules), each with
  the eight required sections in order: objective + prerequisite check,
  explanation (with "explain more simply"), worked example (with "show another
  example" and "give me a harder challenge"), predict-the-output, a runnable
  exercise, a building task, an understanding check with feedback, and a recap
  with "what this prepares you for". Exercise modes mix writing, fixing bugs,
  completing partial programs, modifying examples and building independently.
* **Automated checks** that test behaviour (output, return values, structural
  assertions), so any valid alternative solution passes; a progression of
  hints before a full solution; friendly, localized explanations of Python
  errors; an interactive console for `input()`; a step-by-step **visualiser**
  of variables, loops and function calls.
* **Seven module tests** with question pools (retries draw different
  variants), coding tasks inside tests, exam mode (limited hints, hidden
  solutions, tutor off), scoring, weak-concept detection and a review path.
* **Placement assessment / test-out** per module for experienced learners.
* **Four runnable projects** built step by step with checks, hints and
  reference code: number guessing game, calculator, quiz game, text adventure.
* **Spaced review** of older material, weak-spot tracking, achievements and
  streaks that never punish a missed day.
* **Glossary** with beginner definitions; the English term is always shown.
* **Persistent progress** (localStorage) with export/import, resumable
  projects, "continue where you left off".
* **English and Hebrew** throughout — navigation, lessons, exercises, hints,
  tests, feedback, glossary, tutor — with proper right-to-left layout and
  left-to-right code. Switching language keeps progress. Missing translations
  are shown in English with a visible notice, never silently.
* **Built-in guide** (rule-based tutor, no API, works offline) that knows the
  current lesson, learned concepts, the last error and failed checks, and
  nudges instead of solving. An **optional connected AI tutor** via a small
  server you run with your own key; costs are explained and must be
  acknowledged before it can be enabled.
* **Preview labs** for later stages: gradient descent, a trainable neuron,
  and a grid-world Q-learning agent with a reward chart.
* Accessible typography, keyboard access (skip link, focus rings,
  Ctrl+Enter to run), light/dark themes, playful/focused styles, text-size,
  reduced-motion and high-contrast options.
* Export any editor's code as a `.py` file, plus a "continue locally" page.

## Technology stack (and why)

| Part | Choice | Reason |
|------|--------|--------|
| App | React 19 + TypeScript + Vite 7 | Small, fast, widely known; static hosting (no backend needed) |
| Python runtime | Pyodide 314 (Python 3.14) in a module Web Worker | Real CPython in the browser; sandboxed; the main thread terminates runaway programs after 8 s and output is capped |
| Editor | CodeMirror 6 | Lightweight, accessible, forced LTR |
| State | zustand + localStorage | Versioned, minimal personal data (an optional display name) |
| Content | Typed TypeScript files (`src/content/`) discovered automatically | Adding a lesson = adding one file and listing its id; the validator and unit tests keep it correct |
| Tests | Vitest (logic/content), Playwright (browser flows), a Node content validator that runs every solution in Pyodide | The learning loop is verified end to end |
| Optional tutor server | Node + `@anthropic-ai/sdk` | API key stays server-side; rate limited; never required |

## Running it

```bash
npm install          # also copies the Pyodide runtime into public/pyodide
npm run dev          # http://localhost:5173
npm run build && npm run preview
```

Checks:

```bash
npm run typecheck     # TypeScript
npm test              # Vitest: unlock rules, spaced review, i18n parity, content integrity
npm run test:content  # runs every exercise solution/starter, predict answer, documented output,
                      # project step and module test through the Python sandbox (Node + Pyodide)
npm run test:e2e      # Playwright: real browser, real Python — see e2e/core-flows.spec.ts
```

Optional connected tutor (paid API, your own key):

```bash
cd server && npm install
ANTHROPIC_API_KEY=... npm start        # http://localhost:8787
```

Then in the app: Settings → AI tutor → enter the address, acknowledge the cost
notice, enable. Nothing is sent until you enable it and send a message.

## Repository layout

```
src/content/         schema.ts (types), authoring.ts (helpers), concepts.ts (concept map),
                     curriculum.ts (10 stages), lessons/mN/ (lessons, test, glossary),
                     projects/, index.ts (registry)
src/runtime/         harness.py (sandbox: run/grade/trace), pyodide.worker.ts, runner.ts, errors.ts
src/components/      Workbench (editor+console), ExercisePanel, QuizRunner, Tracer, Tutor, Blocks…
src/pages/           Home, Curriculum, Module, Lesson, Assessment, Placement, Projects, Project,
                     Glossary, Review, Achievements, Settings, Local, Labs
src/labs/            gradient descent, neuron, grid-world labs
src/state/           store (settings + progress), unlock rules, review scheduling, achievements
src/i18n/            en.ts, he.ts, languages.ts
scripts/             copy-pyodide.mjs, validate-content.mjs
server/              optional tutor proxy
docs/CONTENT_GUIDE.md  how to write lessons (structure, style, Hebrew rules, checks)
```

## Adding content

Read `docs/CONTENT_GUIDE.md`. A lesson is one TypeScript file exporting a
`Lesson` object; its id is listed in the module's `lessonIds` and its concepts
in `concepts.ts`. Run `npm run test:content` — it executes the starter and the
solution of every exercise, checks the predicted outputs and the documented
outputs of examples, validates prerequisites (a lesson can only use concepts
taught earlier), and reports missing translations.

To add a language: add it to `src/i18n/languages.ts`, add a UI dictionary,
and fill the new field on content objects. Untranslated content falls back to
English with a notice.

## Safety and privacy

* Learner code runs only in the browser sandbox (WebAssembly, Web Worker);
  the app has no server-side execution at all. Inside the sandbox the modules
  that bridge into the JavaScript host (`js`, `pyodide`, …) are hidden from
  learner code, and interpreter state (imported modules, built-ins, recursion
  limit) is reset after every run so one program cannot affect the next.
* Time limit (8 s per run, 20 s per check), output cap, automatic restart of
  a hung or crashed worker; the harness's control signals cannot be swallowed
  by a learner's `except Exception:`.
* No API keys in client code. The optional tutor server holds the key and
  rate-limits requests; the client shows an explicit cost notice.
* No training jobs, GPU jobs or paid services are ever started by the app.
* Data stored: settings, progress, code drafts, optional display name — all
  in the browser, exportable and deletable in Settings.

## What is verified

All of the following were run in this repository at delivery:

| Check | Result |
|-------|--------|
| `npm run typecheck` | 0 errors |
| `npm test` (Vitest, 17 tests) | unlock rules (including test-out, recommendations and project prerequisites), streaks, spaced review, i18n key parity and fallback, content integrity (29 lessons, 7 tests, 4 projects), answer normalisation — all pass |
| `npm run test:content` | 29 lessons, 7 module tests, 4 projects, 111 glossary entries; **355 sandbox checks pass**: every exercise/build/challenge solution passes its tests and every starter fails them, every predicted output and documented example output matches real Python 3.14 output, every project step's reference code passes its cumulative checks, prerequisites are in order, no missing translations |
| `npm run test:e2e` (Playwright, real Chromium, real Pyodide) | 8/8 flows pass: onboarding → first lesson → run code → friendly SyntaxError → fix → console output → exercise passes → building task passes → lesson completes and unlocks the next → progress survives reload and "resume" returns to it; wrong answer shows expected/actual diff, three hints, then the solution; placement test-out → exam mode (tutor off) → scoring → retry draws different variants; Hebrew UI is RTL with LTR editors and language switch keeps the page; curriculum shows all ten stages with "planned" explanations; `input()` answered interactively in the console; an infinite loop is stopped with a friendly message and the runtime recovers; a project saves code across reloads and checks a step |
| Tutor server | starts, `/health` responds, request validation works (no live API call was made) |

## What remains (honestly)

* Stages 2–10 are mapped (modules, planned lessons, prerequisites, compute
  requirements) but their lessons are not written. The labs are previews, not
  lessons.
* Lessons that need local software (Pygame, PyTorch, engines) are marked as
  such in the stage descriptions; the local-setup page covers Python + VS Code
  only.
* The connected AI tutor is implemented but was not exercised against a live
  API in this environment (no key); the built-in guide is fully functional.
* Translation review: all Hebrew content was written by the authors following
  the style guide and passes structural checks; a native-speaker editorial
  pass is still worthwhile.
* Messages produced by `assert` statements inside Python check scripts
  (`pythonTest`) exist only in English; the app labels them "Shown in English"
  in other languages. Output/function checks are fully localized.
* Code drafts are saved to localStorage; there is no cloud sync or accounts by
  design.
