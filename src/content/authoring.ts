/**
 * Small helpers that keep lesson files short and readable.
 *
 * Every helper takes the English text first and the Hebrew text second.
 * Hebrew is optional in the type system so a lesson can be drafted in English
 * first, but every shipped lesson must provide both.
 */
import type {
  Block,
  ChoiceOption,
  CodeCheck,
  Exercise,
  ExerciseMode,
  Localized,
  Question,
  Text,
  TestCase,
} from './schema';

/** Localized text pair. */
export function t(en: string, he?: string): Text {
  return he === undefined ? { en } : { en, he };
}

/** Paragraph. */
export function p(en: string, he?: string): Block {
  return { kind: 'p', text: t(en, he) };
}

/** Sub-heading inside a section. */
export function h(en: string, he?: string): Block {
  return { kind: 'h', text: t(en, he) };
}

/**
 * Code block. `code` is language-independent (code is always left-to-right).
 * Use `output` to show what the program prints.
 */
export function code(
  source: string | Localized<string>,
  opts: {
    output?: string | Localized<string>;
    caption?: Text;
    runnable?: boolean;
    lang?: 'python' | 'text';
  } = {},
): Block {
  return { kind: 'code', code: source, ...opts };
}

/** Bulleted (or ordered) list of localized items. */
export function list(items: Array<[en: string, he?: string]>, ordered = false): Block {
  return { kind: 'list', items: items.map(([en, he]) => t(en, he)), ordered };
}

/** Callout box. Tones: tip | why | warning | note | story. */
export function callout(
  tone: 'tip' | 'why' | 'warning' | 'note' | 'story',
  en: string,
  he?: string,
  title?: Text,
): Block {
  return { kind: 'callout', tone, text: t(en, he), title };
}

/** New-term card: the original term stays in English; the explanation is localized. */
export function term(name: string, en: string, he?: string): Block {
  return { kind: 'term', term: name, text: t(en, he) };
}

/** Table with localized header cells and rows. */
export function table(header: Array<[string, string?]>, rows: Array<Array<[string, string?]>>): Block {
  return {
    kind: 'table',
    header: header.map(([en, he]) => t(en, he)),
    rows: rows.map((row) => row.map(([en, he]) => t(en, he))),
  };
}

/** Step-by-step visualisation of a snippet (variables, loops, function calls). */
export function viz(source: string, caption?: Text): Block {
  return { kind: 'viz', code: source, caption };
}

/** Multiple-choice option. */
export function opt(
  en: string,
  he?: string,
  extra: { correct?: boolean; feedback?: [string, string?] } = {},
): ChoiceOption {
  const option: ChoiceOption = { text: t(en, he) };
  if (extra.correct) option.correct = true;
  if (extra.feedback) option.feedback = t(extra.feedback[0], extra.feedback[1]);
  return option;
}

/** Multiple-choice question. */
export function choice(
  id: string,
  prompt: Block[] | [string, string?],
  options: ChoiceOption[],
  concepts: string[],
  extra: { explanation?: [string, string?]; multiple?: boolean } = {},
): Question {
  const promptBlocks = Array.isArray(prompt) && typeof prompt[0] === 'string'
    ? [p(prompt[0] as string, prompt[1] as string | undefined)]
    : (prompt as Block[]);
  const q: Question = { type: 'choice', id, prompt: promptBlocks, options, concepts };
  if (extra.explanation) q.explanation = t(extra.explanation[0], extra.explanation[1]);
  if (extra.multiple) q.multiple = true;
  return q;
}

/** "Predict the output" question in a quiz or test. */
export function predictQ(
  id: string,
  source: string,
  answer: string | string[],
  explanation: [string, string?],
  concepts: string[],
  extra: { prompt?: [string, string?]; loose?: boolean } = {},
): Question {
  const q: Question = {
    type: 'predict',
    id,
    code: source,
    answer,
    explanation: t(explanation[0], explanation[1]),
    concepts,
  };
  if (extra.prompt) q.prompt = t(extra.prompt[0], extra.prompt[1]);
  if (extra.loose) q.loose = true;
  return q;
}

/** Output test: run the program with `stdin` lines and compare what it prints. */
export function outputTest(
  expected: string,
  extra: { stdin?: string[]; match?: 'trimmed' | 'loose' | 'contains' | 'regex'; name?: [string, string?] } = {},
): TestCase {
  const tc: TestCase = { type: 'output', expected };
  if (extra.stdin) tc.stdin = extra.stdin;
  if (extra.match) tc.match = extra.match;
  if (extra.name) tc.name = t(extra.name[0], extra.name[1]);
  return tc;
}

/** Function test: `call` is a Python expression, `expected` a Python expression for the expected value. */
export function functionTest(call: string, expected: string, name?: [string, string?]): TestCase {
  const tc: TestCase = { type: 'function', call, expected };
  if (name) tc.name = t(name[0], name[1]);
  return tc;
}

/** Python-script test with asserts. See TestCase docs for available names. */
export function pythonTest(script: string, extra: { stdin?: string[]; name?: [string, string?] } = {}): TestCase {
  const tc: TestCase = { type: 'python', script };
  if (extra.stdin) tc.stdin = extra.stdin;
  if (extra.name) tc.name = t(extra.name[0], extra.name[1]);
  return tc;
}

/** Requirement that the source code matches a regular expression. */
export function requires(pattern: string, en: string, he?: string) {
  return { pattern, message: t(en, he) };
}

/** Exercise (also used for the building task and the harder challenge). */
export function exercise(spec: {
  id: string;
  title: [string, string?];
  mode: ExerciseMode;
  instructions: Block[];
  starterCode: string | Localized<string>;
  sampleStdin?: string[];
  check: CodeCheck;
  hints: Array<[string, string?]>;
  solution: string;
  solutionNote?: [string, string?];
  concepts: string[];
}): Exercise {
  const ex: Exercise = {
    id: spec.id,
    title: t(spec.title[0], spec.title[1]),
    mode: spec.mode,
    instructions: spec.instructions,
    starterCode: spec.starterCode,
    check: spec.check,
    hints: spec.hints.map(([en, he]) => t(en, he)),
    solution: spec.solution,
    concepts: spec.concepts,
  };
  if (spec.sampleStdin) ex.sampleStdin = spec.sampleStdin;
  if (spec.solutionNote) ex.solutionNote = t(spec.solutionNote[0], spec.solutionNote[1]);
  return ex;
}

/** Coding question inside a quiz/test (same shape as an exercise). */
export function codeQ(spec: {
  id: string;
  title: [string, string?];
  mode: ExerciseMode;
  instructions: Block[];
  starterCode: string | Localized<string>;
  sampleStdin?: string[];
  check: CodeCheck;
  hints: Array<[string, string?]>;
  solution: string;
  concepts: string[];
}): Question {
  const q: Question = {
    type: 'code',
    id: spec.id,
    title: t(spec.title[0], spec.title[1]),
    mode: spec.mode,
    instructions: spec.instructions,
    starterCode: spec.starterCode,
    check: spec.check,
    hints: spec.hints.map(([en, he]) => t(en, he)),
    solution: spec.solution,
    concepts: spec.concepts,
  };
  if (spec.sampleStdin) q.sampleStdin = spec.sampleStdin;
  return q;
}

/**
 * Tagged template for Python code: removes the common leading indentation and
 * surrounding blank lines so code can be written inline in TypeScript.
 *
 *   py`
 *     for i in range(3):
 *         print(i)
 *   `
 */
export function py(strings: TemplateStringsArray, ...values: unknown[]): string {
  // Use the raw strings so Python escapes such as "\n" are kept verbatim.
  let raw = strings.raw.reduce((acc, s, i) => acc + s + (i < values.length ? String(values[i]) : ''), '');
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  while (lines.length && lines[0].trim() === '') lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
  const indents = lines.filter((l) => l.trim() !== '').map((l) => l.match(/^[ \t]*/)![0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  raw = lines.map((l) => l.slice(Math.min(min, l.match(/^[ \t]*/)![0].length))).join('\n');
  return raw;
}
