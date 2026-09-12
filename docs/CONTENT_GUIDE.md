# CodePath content guide

This document is the contract for everyone who writes lessons, tests and
projects. The app renders content from typed TypeScript files under
`src/content/`. If a lesson follows this guide it will render, grade and
translate correctly without any change to the application code.

Read `src/content/schema.ts` (types) and `src/content/authoring.ts`
(helpers) before writing. `src/content/lessons/m2/l06-variables.ts` is the
reference lesson: copy its structure exactly.

## 1. Who we write for

* Absolute beginners, children and adults. Assume they have never heard of
  `def`, `for`, a variable, or `sum`. Assume they may be nervous.
* Tone: warm, respectful, plain. Never childish, never condescending. No
  exclamation-mark enthusiasm; explain instead. Short sentences.
* One idea at a time. If an example needs a second new idea, either explain
  it first with a `term()` card or choose a different example.
* Every new symbol (`=`, `:`, `()`, `""`, `#`, `[]`) and every new word
  (string, variable, loop) gets a `term()` card before it is relied on.
* Always say **what** the thing does, **why** it exists, and **when** to use it.
* Beginner-friendly is not shallow: mention the precise rule (e.g. "`=` puts
  the value on the right into the name on the left; it never asks a question").

## 2. Languages

Every text is written as an `(english, hebrew)` pair through the helpers:

```ts
p('A variable is a name for a value.', 'משתנה הוא שם שניתן לערך.')
```

English rules:
* Address the learner as "you". Define every technical word the first time.

Hebrew rules:
* Natural, modern Hebrew as used in good Israeli textbooks. Not a word-for-word
  translation: rephrase so it reads well.
* Address the learner in the plural imperative ("כתבו", "הריצו", "שימו לב") —
  the inclusive convention in Hebrew teaching materials.
* Keep programming keywords, function names and library names in English
  (`print`, `for`, `def`, `input`). On first use of a concept give the Hebrew
  term with the English original in parentheses: "משתנה (variable)". After
  that the Hebrew term alone is fine.
* Put every piece of code inside backticks so it renders left-to-right:
  ``הפקודה `print("Hi")` מדפיסה``. Never write bare code inside Hebrew prose.
* Numbers, file names and outputs stay as they are (they are language-neutral).

Code, expected outputs and tests are identical in every language. Programs print
English text (`Hello`, `Name:`), and the Hebrew instructions say exactly which
English text to print, e.g. ``הדפיסו בדיוק את המילה `Hello` ``. Prefer tasks
whose output is numbers or short given words.

## 3. Inline markup inside text

* `**bold**`
* `` `code` `` (rendered LTR, monospace)
* `{{term-id}}` – glossary reference, rendered as the term name with a tooltip
  definition. Use for the first mention of a glossary term in a lesson.
* `[[lesson-id|label]]` – link to another lesson.

Do not use Markdown headings, links or HTML. Use blocks (`h`, `list`, `callout`,
`table`, `code`, `term`, `viz`) instead.

## 4. The eight lesson sections (required, in this order)

| # | Field(s)                                  | Content |
|---|-------------------------------------------|---------|
| 1 | `objective`, `prerequisiteCheck`          | One sentence each. Prerequisite check names the lessons/skills needed ("You can print text and run a program"). |
| 2 | `explanation` + `simpler`                 | 5–9 blocks. `simpler` is the "explain more simply" version: 3–5 blocks with an everyday analogy and no new vocabulary. |
| 3 | `workedExample` + `moreExamples`          | A complete small program walked through line by line, with output. `moreExamples` = 2 additional complete examples (2–4 blocks each). Add a `viz()` block when stepping through the code helps (variables, loops, functions). |
| 3b| `harderChallenge` (optional but preferred) | A stretch exercise using only concepts taught so far. |
| 4 | `predict`                                 | Short code; learner predicts the exact output (free text) or picks an option. `explanation` says why. |
| 5 | `exercise`                                | Immediately runnable, 3–10 lines of learner code. |
| 6 | `build`                                   | A slightly bigger, more open task that *builds* something (a card, a mini tool, a message generator). Checks must accept any valid solution. |
| 7 | `check`                                   | 2–3 `choice()` questions. Every option has `feedback` explaining why it is right or wrong. |
| 8 | `recap`, `next`                           | `recap`: a `list` of 3–5 bullet reminders plus one paragraph. `next`: one sentence on what this prepares the learner for. |

Exercise modes mix across the module: `write`, `fix` (buggy starter),
`complete` (partial program with `# ...` gaps), `modify` (working program
to change), `build` (independent building task).

## 5. Exercises and automated checks

* `starterCode` must **not** pass the tests. `solution` must pass them.
  (A validation script runs every solution and every starter.)
* Tests check behaviour. Never require exact code text unless the lesson is
  about that construct; then use `requires('\\bfor\\b', 'Use a for loop …', 'השתמשו בלולאת for …')`.
* Prefer `outputTest(expected, { stdin })`. Default matching trims trailing
  spaces per line and ignores trailing blank lines but is case-sensitive.
  Use `match: 'loose'` when wording may vary in capitalisation/spacing, and
  `match: 'contains'` for open-ended output.
* During grading `input()` **does not print its prompt** and input is not
  echoed, so expected outputs contain only what `print` printed. Say in the
  instructions that the prompt wording is free ("Ask for a number (any prompt text)").
* `functionTest('add(2, 3)', '5')` for functions (lesson 19 onward).
* `pythonTest(script)` for structural checks: `ns` (learner globals),
  `stdout`, `source`, `run(lines)`, `run_all(lines)`. Always give assert
  messages the learner can act on, localized with `M("English", "עברית")`
  (see section 9) — keep them short.
* Programs that use `random` are seeded per run, but never test exact random
  values; test structure or ranges instead.
* `sampleStdin`: lines pre-filled in the console for the Run button when the
  program reads input.
* Hints: exactly 3, from gentle nudge → concrete pointer → nearly the solution.
* `concepts`: the concept ids the exercise practises (from the table below).

## 6. Prerequisite discipline

A lesson may use only the concepts introduced by earlier lessons plus its own.
`requires` must list the ids it relies on; `introduces` lists its own. The
validator checks that `requires` ⊆ ids introduced earlier.

### Module and lesson map (Stage 1)

Module ids and lesson ids are fixed. Concept ids listed under each lesson are
introduced there.

**m1 — How computers think** (`src/content/lessons/m1/`)
* `l01-what-computers-do` — `computer-basics`, `input-output`, `program`, `print-basic`
  (print appears here only as "type this and press Run"; the full lesson is l05).
* `l02-programs-and-files` — `file`, `running-programs`, `console`, `sequence`
* `l03-thinking-in-steps` — `algorithm`, `precision`, `step-by-step`
* `l04-first-bug` — `bug`, `error-message`, `syntax-error`, `debugging`

**m2 — Talking to the computer: Python basics** (`m2/`)
* `l05-print-and-strings` — `print`, `string`, `quotes`, `comment`, `print-multiple`
* `l06-variables` — `variable`, `assignment`, `naming`, `reassignment`
* `l07-numbers-and-math` — `int`, `float`, `arithmetic`, `integer-division`, `modulo`, `power`, `precedence`
* `l08-data-types` — `type`, `type-conversion`, `type-mismatch`
* `l09-input` — `input`, `input-is-text`
* `l10-fstrings` — `f-string`, `concatenation`, `len`, `upper-lower`

**m3 — Making decisions** (`m3/`)
* `l11-comparisons` — `comparison`, `boolean`, `equality`
* `l12-if-else` — `if`, `else`, `indentation`, `block`
* `l13-elif` — `elif`, `condition-order`
* `l14-logic` — `and`, `or`, `not`, `nested-if`

**m4 — Repeating things: loops** (`m4/`)
* `l15-while` — `while`, `loop-condition`, `counter`, `infinite-loop`
* `l16-for-range` — `for`, `range`, `loop-variable`
* `l17-accumulators` — `accumulator`, `break`, `continue`
* `l18-nested-loops` — `nested-loop`, `string-repeat`, `print-end`
* `l19-random` — `import`, `module`, `random-randint`, `math-module` (lists are not known yet, so no `random.choice`)

**m5 — Functions: reusable pieces** (`m5/`)
* `l20-def` — `function`, `def`, `call`
* `l21-parameters` — `parameter`, `argument`, `default-parameter`
* `l22-return` — `return`, `return-value`, `none`
* `l23-scope` — `scope`, `local-variable`, `global-variable`, `program-structure`

**m6 — Collections: lists and dictionaries** (`m6/`)
* `l24-lists` — `list`, `index`, `append`, `index-error`, `negative-index`
* `l25-list-loops` — `for-each`, `in-operator`, `list-modify`, `remove-pop`, `sum-min-max`, `sorted`
* `l26-dictionaries` — `dictionary`, `key-value`, `dict-get`, `dict-loop`, `key-error`
* `l27-nested-data` — `nested-data`, `split-join`, `choosing-structures`

**m7 — When things go wrong: errors** (`m7/`)
* `l28-reading-errors` — `traceback`, `name-error`, `value-error`, `zero-division`, `attribute-error`
* `l29-try-except` — `try`, `except`, `exception`, `validation-loop`

The canonical copy of this map lives in `src/content/concepts.ts`. A lesson's
`introduces` must match its entry there exactly. If a lesson truly needs an
extra concept id, add it to `concepts.ts` (keep it in that lesson's entry) and
add a glossary entry for it.

Validate a whole module with `node scripts/validate-content.mjs m3`
(module id) or a single item with `node scripts/validate-content.mjs l12`.
Run `npx tsc --noEmit -p tsconfig.json` to type-check.

### Module tests

Each module has `src/content/lessons/mX/test.ts` exporting `const test: Assessment`
with id `mX-test`, `kind: 'module-test'`, `passScore: 0.7`, `hintsAllowed: 1`,
8–10 pools. Each pool has **2 variants** (so retries differ). Mix:
`choice`, `predictQ`, and at least 2 `codeQ` pools (real coding tasks). Question
ids: `mX-t-qN-a` / `mX-t-qN-b`. Cover every lesson of the module.

### Glossary

Each module has `src/content/lessons/mX/glossary.ts` exporting
`const glossary: GlossaryEntry[]`: one entry per concept id introduced in the
module (id = concept id), with a friendly one- or two-sentence definition in
both languages and a tiny example when useful.

### Projects

Projects live in `src/content/projects/<id>.ts` and export `const project: Project`
(see `schema.ts`). A project is one program the learner grows step by step:

* `starterCode`: a small skeleton with comments (may be nearly empty).
* `steps`: 4–7 steps. Each step has `instructions` (blocks), 2–3 `hints`, a
  `check` (a `CodeCheck` that the program must pass **after this step**; checks
  are cumulative, so the final program must still pass every earlier step's
  check), and `referenceCode` = the complete program as it should look after
  this step. The validator runs each step's `referenceCode` against its own
  check and the final one against all checks.
* Checks must accept any reasonable solution: test behaviour with several
  `outputTest`s that use `stdin`, `functionTest`s, or `pythonTest`s with
  `run(lines)`. Do not depend on prompt wording. For randomness, the program
  is seeded per run but do not assert exact random values.
* `extensions`: 3–5 ideas for going further.
* `prerequisites`: lesson ids that must be completed first.
* `sampleStdin`: lines pre-filled for the Run button.

## 7. File template

```ts
import type { Lesson } from '../../schema';
import { p, h, code, list, callout, term, table, viz, t, opt, choice, exercise,
         outputTest, functionTest, pythonTest, requires, py } from '../../authoring';

export const lesson: Lesson = {
  id: 'l06-variables',
  moduleId: 'm2',
  title: t('Variables: giving values a name', 'משתנים: לתת שם לערך'),
  tagline: t('…', '…'),
  estimatedMinutes: 20,
  introduces: ['variable', 'assignment', 'naming', 'reassignment'],
  requires: ['print', 'string'],
  runsInBrowser: true,
  objective: t('…', '…'),
  prerequisiteCheck: t('…', '…'),
  explanation: [ … ],
  simpler: [ … ],
  workedExample: [ … ],
  moreExamples: [[ … ], [ … ]],
  harderChallenge: exercise({ … }),
  predict: { code: py`…`, answer: '…', explanation: t('…', '…') },
  exercise: exercise({ … }),
  build: exercise({ … }),
  check: [ choice(…), choice(…) ],
  recap: [ list([…]), p('…', '…') ],
  next: t('…', '…'),
};
```

Ids: exercise `lNN-ex`, build `lNN-build`, harder challenge `lNN-hard`,
check questions `lNN-c1`, `lNN-c2`…

## 7b. Lessons learned from the first release

* The `py` tagged template uses raw strings: inside `py\`…\``, write `"\n"` for a
  Python newline escape (it reaches Python unchanged). Do not double the
  backslash.
* Explanation sections may exceed 9 blocks when a lesson introduces several
  concept ids that each need a `term()` card; keep each block short instead of
  dropping cards.
* `{{term-id}}` glossary references render as a term with a tooltip; using
  **bold** with the English original in parentheses on first mention is an
  acceptable alternative (the reference lesson does this).
* A snippet that intentionally raises an error must not contain `print(` and
  must not declare `output` (the validator executes runnable Python blocks);
  show the traceback in a following `lang: 'text'` block.
* `functionTest` runs the program first with no input, so programs that call
  `input()` at top level cannot use it — use `pythonTest` with `stdin` and call
  `ns['fn'](…)` directly instead.
* The grading sandbox seeds `random` per run; tests must never assert exact
  random values.

## 8. Quality checklist before you finish a lesson

- [ ] All eight sections present, in order, both languages everywhere.
- [ ] Every new symbol/term has a `term()` card before use.
- [ ] Exercise and build use only concepts from this and earlier lessons.
- [ ] `starterCode` fails, `solution` passes (run `npm run test:content`).
- [ ] Expected outputs match the solution's real output exactly (run it).
- [ ] Hebrew reads naturally, uses plural imperative, code in backticks.
- [ ] Feedback on every choice option; hints go from gentle to specific.
- [ ] `estimatedMinutes` realistic (15–30 for beginners).
- [ ] File compiles: `npm run typecheck`.

## 9. Additions in the polished-beginner release

### Localized check messages: `M()`

`pythonTest` scripts can (and for new content must) localize their assert
messages with the `M(en, he)` helper that the sandbox injects:

```python
assert len(lines) == 3, M("Print exactly three lines.", "הדפיסו בדיוק שלוש שורות.")
```

The learner sees the message in their language; plain string messages still
work and are labelled "Shown in English" in Hebrew.

`run_all(lines)` is also available: it re-runs the program with the given
input lines and returns `{"stdout", "ns", "error", "needInput"}`, which lets a
check look at variables *after* a specific input sequence (used by the growing
project to check the inventory list).

### Personal text in any language

Building tasks and project steps should accept the learner's own words in any
language. Check the **shape** (number of lines, distinct lines, a variable
exists, a function returns a number) rather than English words. When a check
must find a keyword, accept an English and a Hebrew form (see lesson 3's
"toast" task), and say so in the instructions.

### Guided view fields

* `miniChecks?: Question[]` — one-question checks used only in *slow* pace,
  interleaved after explanation chunks. Two per lesson is plenty. They never
  gate progress.
* `briskSummary?: Block[]` — a compact version of the explanation used in
  *brisk* pace (the full explanation stays one click away). It must still
  cover every essential the exercise relies on.

The guided view splits the explanation at `h()` headings in slow pace, so put
a heading before each new idea.

### Growing projects

A project with `growing: true` opens after its first step's `requires` lessons
and unlocks steps one by one. Each step lists `requires` (lesson ids),
`concepts`, and an optional `milestone` heading. Rules the validator enforces:

* steps unlock in curriculum order;
* a step practises only concepts taught by its required lessons;
* the final reference code passes every step's check (checks are cumulative),
  so every check must supply enough `stdin` for the finished game as well.

The tutor/assistant context for a project uses the active step's last
required lesson as the "current lesson".
