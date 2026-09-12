# CodePath — learn to program from zero to games and AI

CodePath is a bilingual (English / Hebrew) learning app that takes a complete
beginner from "what is a computer" to writing real Python programs, and lays
out an honest, prerequisite-driven path towards 2D/3D games, machine learning,
LLMs and reinforcement-learning agents inside games.

Python runs **inside the browser** (Pyodide, CPython compiled to WebAssembly)
in a sandboxed Web Worker with time and output limits. No learner code ever
runs on a server, no account is needed, and progress is stored on the device.

Live site: <https://learningcomputerscience.netlify.app/> (built from this
repository by Netlify; see *Publishing*).

## What works today

* **Guided lessons, one step at a time.** Every lesson opens as a sequence of
  steps with Back / Next, a progress indicator and keyboard arrows; the
  position is remembered so a learner returns to the step they were on. A
  "whole lesson" view shows everything on one page. Three paces produce
  genuinely different sequences from the same content: *slow* (smaller
  steps, the simpler wording as its own step, quick one-question checks
  between explanation steps, extra examples one at a time), *standard*
  (concise, help one click away), *brisk* (compact summary with the full text
  one click away, plus "already know this? take the understanding check
  now"). Every pace requires the same exercise, building task and check.
* **A clear definition of "complete".** Practice (the exercise and the
  building task) and demonstrated understanding (the check) are tracked
  separately; a lesson is complete only when both are done. A missed check
  question can be retried after reading the feedback. Progress from the
  previous release is migrated and previously earned completions are kept.
* **First-use flow** that asks only for language and a starting point (new
  to programming / programmed before), shows a small example of what learners
  will build, states honestly what is finished and what is planned, and
  leaves look, pace and nickname optional (Settings has them too).
* **29 beginner Python lessons** (Stage 1, seven modules), each with the
  eight sections in order: objective + prerequisite check, explanation (with
  "explain more simply"), worked example (with more examples and a harder
  challenge), predict-the-output, a runnable exercise, a building task, an
  understanding check with feedback, and a recap. The first five lessons were
  audited and polished: scoped claims (top-to-bottom is stated as a property
  of *these* programs, with choosing and repeating pointed to later), building
  tasks accept the learner's own words in any language, check messages are
  localized, and each has quick checks and a brisk summary.
* **One growing project path: *Your text adventure*.** Fifteen steps in six
  milestones that open as the lessons they need are learned (printing → story;
  variables and input → the player; if/elif → choices; while and counters →
  turns; functions and return → scenes; lists and dictionaries → inventory,
  rooms, a locked door and a win). The story, names and messages are the
  learner's own, in any language; checks look at structure and behaviour.
  Each step has hints and a reference version; the finished game is playable
  and runs unchanged with Python 3 outside the browser. Three module projects
  (guessing game, calculator, quiz game) remain.
* **Interactive explanations.** The step-through visualiser shows the executing
  line, the variables (changed ones highlighted), the output so far, calls and
  returns, and for `if` / `elif` / `while` lines the evaluated condition and
  which branch was taken. Keyboard controls, small screens and reduced motion
  are supported.
* **Automated checks** that test behaviour (output, return values, structural
  assertions), so any valid alternative solution passes; progressive hints
  before a solution; localized, friendly Python error explanations; an
  interactive console for `input()`.
* **Seven module tests**, **placement / test-out**, **spaced review**,
  weak-spot tracking, **achievements** and streaks that never punish a missed
  day, a **glossary**, progress export/import, resumable projects.
* **English and Hebrew** throughout with right-to-left layout and
  left-to-right code; switching language keeps progress; missing translations
  show English with a notice, never silently.
* **Two kinds of help, clearly separated.** The *built-in guide* is scripted
  from the lesson, the learner's last error and check results; it is free and
  always available. The *AI assistant* is a real language model through the
  site owner's OpenRouter account: the owner signs in on `/#/owner`, pastes
  the key once (stored encrypted on the server), picks the model, tests it,
  sets limits and budgets, and decides when learners may use it. Replies
  stream with Stop / Retry / New chat, in English or Hebrew, in a lesson mode
  (lesson, code and results as context) or a general mode. Errors are shown
  as errors; scripted text is never presented as AI.
* **Continue in PyCharm**: download a project as a folder (`main.py` +
  `README.md` in a zip) and follow seven steps from unzipping to running and
  changing the program, with no terminal required.
* Accessible typography, keyboard access, light/dark themes, playful/focused
  styles, text size, reduced-motion and high-contrast options.

Stages 2–10 are mapped with prerequisites and labelled *planned* everywhere.
There are no reviews, testimonials, learner counts, certificates or payments in
the app; see `docs/COMMERCIAL-READINESS.md` and `docs/PILOT.md`.

## Technology stack

| Part | Choice | Reason |
|------|--------|--------|
| App | React 19 + TypeScript + Vite 7 | Small, fast; static hosting |
| Python runtime | Pyodide 314 (Python 3.14) in a module Web Worker | Real CPython in the browser; sandboxed; runaway programs are terminated after 8 s and output is capped |
| Editor | CodeMirror 6 | Lightweight, accessible, forced LTR |
| State | zustand + localStorage (`codepath.v1`, progress format v2 with migration) | Versioned, minimal personal data |
| Content | Typed TypeScript files (`src/content/`) discovered automatically | Adding a lesson = one file + one id; the validator keeps it correct |
| Assistant backend | Netlify Function (`netlify/functions/assistant.mjs`) + Netlify Blobs | Same handler runs locally with a file store; key encrypted with a server secret |
| Tests | Vitest (logic, migration, backend with a mocked OpenRouter), Playwright (browser flows), a Node content validator that runs every solution in Pyodide | The learning loop and the assistant are verified end to end |

## Running it

```bash
npm install          # also copies the Pyodide runtime into public/pyodide
npm run dev          # http://localhost:5173 (lessons work without any backend)

# optional: the AI assistant backend, with a fake OpenRouter that costs nothing
npm run api:mock     # terminal 2
OWNER_PASSWORD=choose-a-long-password ASSISTANT_SECRET=0123456789abcdef0123 \
OPENROUTER_BASE_URL=http://127.0.0.1:8790/api/v1 npm run api   # terminal 3
```

Checks:

```bash
npm run typecheck     # TypeScript
npm test              # Vitest: unlock rules, progress migration, guided steps, zip writer,
                      #         assistant backend against the mocked OpenRouter
npm run test:content  # runs every exercise solution/starter, predict answer, documented output,
                      # project step and module test through the Python sandbox (Node + Pyodide)
npm run test:e2e      # Playwright: real browser, real Python, mocked OpenRouter — e2e/core-flows.spec.ts
```

## Publishing it on the web

The app is a static site plus one serverless function for the assistant.

### Netlify (current production)

`netlify.toml` holds the configuration: build `npm run build`, publish `dist`,
Node 22, cache headers, and the functions directory. Connect the repository
once at [app.netlify.com](https://app.netlify.com); every push to the
connected branch rebuilds and republishes. The repository can stay private.

For the AI assistant, add two environment variables in the Netlify UI and
redeploy, then paste the OpenRouter key on `/#/owner`. Details, limits, costs
and what was and was not verified: `docs/ASSISTANT-SETUP.md`.

### Static hosts without functions

`npm run build` (or `VITE_BASE=/subfolder/ npm run build` for a sub-path) and
serve `dist/`. Everything except the AI assistant works; the app detects the
missing backend and shows the assistant as unavailable while the built-in
guide keeps working. A GitHub Pages workflow is included
(`.github/workflows/deploy-pages.yml`; Pages needs a public repository or a
paid plan).

## Repository layout

```
src/content/         schema.ts (types), authoring.ts (helpers), concepts.ts (concept map),
                     curriculum.ts (10 stages), lessons/mN/ (lessons, test, glossary),
                     projects/ (p-text-adventure.ts is the growing project), index.ts
src/runtime/         harness.py (sandbox: run/grade/trace with condition tracing), worker, runner, errors
src/state/           store (settings + progress v2 + migration), lessonSteps (guided view),
                     unlock rules (incl. growing projects), review, achievements
src/components/      Workbench, ExercisePanel, QuizRunner, Tracer, Tutor (guide + AI tabs), Blocks…
src/pages/           Home, Onboarding, Curriculum, Module, Lesson (guided/full), Assessment,
                     Placement, Projects, Project, Glossary, Review, Achievements, Settings,
                     Local (PyCharm), Owner (assistant settings), Labs
src/assistant/       client (SSE), conversations (per-device store), errors (localized)
src/i18n/            en.ts, he.ts, languages.ts
src/utils/           download, zip
server/assistant/    handler (routes, auth, limits, budgets, usage), crypto, storage,
                     openrouter (checked against the official API reference), prompts,
                     mock-openrouter, handler.test.ts
server/dev-server.mjs   local backend (file store)
netlify/functions/   assistant.mjs (production entry)
scripts/             copy-pyodide.mjs, validate-content.mjs
docs/                CONTENT_GUIDE.md, ASSISTANT-SETUP.md, PILOT.md, COMMERCIAL-READINESS.md
```

## Adding content

Read `docs/CONTENT_GUIDE.md`, including section 9 (localized check messages
with `M()`, personal text in any language, `miniChecks` / `briskSummary` for
the guided view, and growing projects). Run `npm run test:content`.

## Safety and privacy

* Learner code runs only in the browser sandbox; the assistant cannot run
  code. Inside the sandbox the modules that bridge into the JavaScript host
  are hidden and interpreter state is reset after every run.
* Time limit (8 s per run, 20 s per check), output cap, automatic restart of a
  hung worker.
* The OpenRouter key exists only encrypted on the server and in server memory
  during a request; it is never in the bundle, in a response, in browser
  storage or in logs. Owner rights come from a server-verified session, not
  from anything in the frontend.
* AI assistant requests carry the message, the current lesson, the learner's
  code and last results to the server and on to the model provider; nothing
  is sent unless the learner presses Send in the AI tab. Conversations are
  stored only in the learner's browser; the server records counts, tokens and
  costs.
* No analytics, tracking, payments or accounts. Data stored in the browser:
  settings, progress, code drafts, chats, an optional display name — all
  exportable and deletable in Settings.

## What is verified

See the delivery report in the pull request / session summary for the exact
numbers of the last run. The suites are:

| Check | Covers |
|-------|--------|
| `npm run typecheck` | whole app incl. tests and config |
| `npm test` | migration v1→v2 (completions, achievements, drafts kept), completion rule, guided steps per pace and position restore, unlock rules incl. growing project steps, zip archive read back by Python's strict `zipfile`, assistant backend: owner auth (401 without session, forged tokens, CSRF header, login rate limit), key encrypted at rest and never returned, key/model test, learner access switch, streaming with usage, Hebrew, size limits, per-minute/per-day limits (also under parallel bursts), daily/monthly budgets, provider errors surfaced as errors, cancellation recorded, system prompt free of secrets |
| `npm run test:content` | 29 lessons, 7 tests, 4 projects, glossary: every solution passes and every starter fails its checks, predicted and documented outputs match real Python, the growing project's reference code passes every cumulative step check, prerequisites in order, translations present |
| `npm run test:e2e` | fresh learner completes lesson 1 in the guided view (including the understanding-check retry) and lesson 2 unlocks; position and code survive a reload; the three paces differ and the full view works; hints then solution; module test exam mode; Hebrew RTL with keyboard step navigation; ten stages with planned labels; interactive input; runaway loop stopped; tracer shows the branch taken; project workspace; growing project accepts a Hebrew story and locks later milestones; v1 progress migrates; owner routes refused without session; owner signs in, saves/tests/removes key, enables learners; chat streams, stops, retries, isolates conversations, reports provider errors |

## What remains (honestly)

* Stages 2–10 are mapped but not written. The labs are previews, not lessons.
* Lessons 6–29 keep the earlier authoring standard; they were not re-audited
  to the depth of lessons 1–5 in this release (their check messages are
  English-only and are labelled as such in Hebrew).
* The AI assistant was verified against a mocked OpenRouter and the official
  API reference, not against a live key; the first real call is the owner's
  **Test key and model** button.
* Netlify's per-minute rate limit is per function instance; budgets are
  estimates from reported costs. The per-key limit on openrouter.ai is the
  hard cap.
* Hebrew content was written by the authors and passes structural checks; a
  native-speaker editorial pass is still worthwhile.
* Accounts, sync, payments and cancellation flows are not built; see
  `docs/COMMERCIAL-READINESS.md`.
