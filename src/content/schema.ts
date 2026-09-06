/**
 * Content schema for CodePath.
 *
 * Everything a learner reads is *localized*: each text leaf is an object with
 * one entry per language. English (`en`) is required; other languages are
 * optional and fall back to English (the UI shows a clear notice when a
 * fallback happens — the app never switches language silently).
 *
 * Code, expected outputs and automated tests are language-independent so that
 * exercises and assessments are equally accurate in every language.
 *
 * To add a language: add its code to `LANGUAGES` in src/i18n/languages.ts,
 * add a UI dictionary, and fill in the optional field on content objects.
 */

export type LangCode = 'en' | 'he';

/** A localized value. `en` is mandatory, other languages optional. */
export type Localized<T = string> = { en: T } & Partial<Record<Exclude<LangCode, 'en'>, T>>;

/** Inline text supports a tiny markup: **bold**, `code`, {{glossary-term}} and [[lesson-id|label]]. */
export type Text = Localized<string>;

/* ------------------------------------------------------------------ */
/* Rich content blocks                                                 */
/* ------------------------------------------------------------------ */

export type Block =
  | { kind: 'p'; text: Text }
  | { kind: 'h'; text: Text }
  | {
      kind: 'code';
      /** Python by default. Code is shown left-to-right in every language. */
      code: string | Localized<string>;
      lang?: 'python' | 'text';
      /** What the program prints, shown under the code as "Output". */
      output?: string | Localized<string>;
      caption?: Text;
      /** Let the learner run this snippet in place (default: true for python). */
      runnable?: boolean;
    }
  | { kind: 'list'; items: Text[]; ordered?: boolean }
  | { kind: 'callout'; tone: 'tip' | 'why' | 'warning' | 'note' | 'story'; title?: Text; text: Text }
  /** A card that introduces a new symbol or term. `term` is the original English/Python form. */
  | { kind: 'term'; term: string; text: Text }
  | { kind: 'table'; header: Text[]; rows: Text[][] }
  /** Interactive step-by-step visualisation of a snippet (variables, loops, calls). */
  | { kind: 'viz'; code: string; caption?: Text };

/* ------------------------------------------------------------------ */
/* Automated checks                                                    */
/* ------------------------------------------------------------------ */

/**
 * Test cases run inside the browser sandbox against the learner's program.
 * They check behaviour (output, return values), never the exact code text,
 * so any valid alternative solution passes.
 */
export type TestCase =
  | {
      type: 'output';
      /** Lines returned by successive input() calls. */
      stdin?: string[];
      expected: string;
      /**
       * trimmed  – compare line by line after trimming trailing spaces (default)
       * loose    – ignore case and repeated whitespace
       * contains – expected must appear somewhere in the output
       * regex    – expected is a regular expression matched against the output
       */
      match?: 'trimmed' | 'loose' | 'contains' | 'regex';
      name?: Text;
    }
  | {
      type: 'function';
      /** Python expression, e.g. `add(2, 3)`. The program is executed first (its output is discarded). */
      call: string;
      /** Python expression for the expected value, compared with ==. */
      expected: string;
      name?: Text;
    }
  | {
      type: 'python';
      /**
       * A Python script with `assert` statements. Available names:
       *   ns      – the learner's global namespace (dict) after running their code
       *   stdout  – everything the program printed while it ran
       *   run(lines) – re-run the program with the given input lines, returns stdout
       *   source  – the learner's code as a string
       * Use `assert cond, "message shown to the learner"`.
       */
      script: string;
      /** Input lines for the initial run of the program. */
      stdin?: string[];
      name?: Text;
    };

export interface CodeRequirement {
  /** Regular expression applied to the learner's source code. */
  pattern: string;
  /** Explained to the learner when the requirement is not met. */
  message: Text;
}

export interface CodeCheck {
  tests: TestCase[];
  /** Things that must appear in the code, e.g. a `for` loop, when the lesson is about that concept. */
  requires?: CodeRequirement[];
  /** Things that must not appear (rarely needed). */
  forbids?: CodeRequirement[];
}

/* ------------------------------------------------------------------ */
/* Exercises                                                           */
/* ------------------------------------------------------------------ */

export type ExerciseMode = 'write' | 'fix' | 'complete' | 'modify' | 'build';

export interface Exercise {
  id: string;
  title: Text;
  mode: ExerciseMode;
  instructions: Block[];
  starterCode: string | Localized<string>;
  /** Input lines pre-filled in the console when the learner presses Run. */
  sampleStdin?: string[];
  check: CodeCheck;
  /** Progressive hints, from gentle to specific. */
  hints: Text[];
  solution: string;
  solutionNote?: Text;
  /** Concept ids exercised. Used for weak-spot detection and spaced review. */
  concepts: string[];
}

/* ------------------------------------------------------------------ */
/* Questions (quizzes, understanding checks, tests, placement)         */
/* ------------------------------------------------------------------ */

export interface ChoiceOption {
  text: Text;
  correct?: boolean;
  /** Shown after answering: why this option is right or wrong. */
  feedback?: Text;
}

export type Question =
  | {
      type: 'choice';
      id: string;
      prompt: Block[];
      options: ChoiceOption[];
      /** More than one option may be correct. */
      multiple?: boolean;
      explanation?: Text;
      concepts: string[];
    }
  | {
      type: 'predict';
      id: string;
      /** The code the learner reads. */
      code: string;
      prompt?: Text;
      /** Accepted answers (compared after trimming; case-insensitive when `loose`). */
      answer: string | string[];
      loose?: boolean;
      explanation: Text;
      concepts: string[];
    }
  | {
      type: 'code';
      id: string;
      title: Text;
      mode: ExerciseMode;
      instructions: Block[];
      starterCode: string | Localized<string>;
      sampleStdin?: string[];
      check: CodeCheck;
      hints: Text[];
      solution: string;
      concepts: string[];
    };

/** A pool of interchangeable questions; one is drawn per attempt so retries vary. */
export interface QuestionPool {
  variants: Question[];
}

export interface Assessment {
  id: string;
  kind: 'module-test' | 'placement' | 'quiz';
  moduleId?: string;
  title: Text;
  description: Block[];
  pools: QuestionPool[];
  /** Fraction of points required to pass, e.g. 0.7. */
  passScore: number;
  /** Hints allowed per coding question during the test (0 = none). */
  hintsAllowed: number;
  /** Rough time estimate shown to the learner (no hard limit unless set). */
  estimatedMinutes: number;
  timeLimitMinutes?: number;
}

/* ------------------------------------------------------------------ */
/* Lessons                                                             */
/* ------------------------------------------------------------------ */

export interface PredictQuestion {
  code: string;
  prompt?: Text;
  /** Either free-text answers or multiple-choice options. */
  answer?: string | string[];
  options?: ChoiceOption[];
  loose?: boolean;
  explanation: Text;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: Text;
  /** Short subtitle shown on cards. */
  tagline: Text;
  estimatedMinutes: number;
  /** Concept ids introduced here. Later lessons may rely on them. */
  introduces: string[];
  /** Concept ids the lesson relies on (must all be introduced by earlier lessons). */
  requires: string[];
  /** Whether the code runs in the browser sandbox (true for all Stage 1 lessons). */
  runsInBrowser: boolean;
  /** Set when a lesson needs local software or cloud compute; explained to the learner. */
  needsLocalSetup?: Text;

  // The eight required sections, in order:
  /** 1. Objective and prerequisite check. */
  objective: Text;
  prerequisiteCheck: Text;
  /** 2. Short accessible explanation. */
  explanation: Block[];
  /** "Explain more simply" — an even gentler version, often with an analogy. */
  simpler: Block[];
  /** 3. Worked example. */
  workedExample: Block[];
  /** "Show another example" — each entry is a complete additional example. */
  moreExamples: Block[][];
  /** "Give me a harder challenge" — optional stretch task with a check. */
  harderChallenge?: Exercise;
  /** 4. Predict the output or behaviour. */
  predict: PredictQuestion;
  /** 5. Immediately runnable exercise. */
  exercise: Exercise;
  /** 6. Small building task using what was just taught. */
  build: Exercise;
  /** 7. Understanding check (2–3 quick questions with feedback). */
  check: Question[];
  /** 8. Recap and what this prepares the learner for. */
  recap: Block[];
  next: Text;
}

/* ------------------------------------------------------------------ */
/* Curriculum structure                                                */
/* ------------------------------------------------------------------ */

export type ModuleStatus = 'available' | 'planned';

export interface Module {
  id: string;
  stageId: string;
  title: Text;
  description: Text;
  /** Module ids that must be completed (or tested out of) first. */
  prerequisites: string[];
  status: ModuleStatus;
  /** Ordered lesson ids (only for available modules). */
  lessonIds: string[];
  /** For planned modules: the lessons we intend to write. */
  plannedLessons?: Text[];
  /** Module test id (if any). */
  testId?: string;
  /** Project ids that belong to this module. */
  projectIds?: string[];
  /** Assessment used to test out of this module (placement). */
  testOutId?: string;
}

export interface Stage {
  id: string;
  number: number;
  title: Text;
  summary: Text;
  /** Longer description of what the stage covers and why. */
  description: Block[];
  status: 'available' | 'partial' | 'planned';
  moduleIds: string[];
  /** Human explanation of what unlocks this stage. */
  unlockNote: Text;
  /** Whether the stage's work needs local software / cloud compute. */
  compute?: 'browser' | 'local' | 'cloud';
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export interface ProjectStep {
  id: string;
  title: Text;
  instructions: Block[];
  /** Optional automated check for this step (runs on the project's current code). */
  check?: CodeCheck;
  hints: Text[];
  /** Reference code for this step (shown after enough hints / on request). */
  referenceCode?: string;
}

export interface Project {
  id: string;
  moduleId: string;
  title: Text;
  tagline: Text;
  description: Block[];
  /** Lesson ids that should be completed before starting. */
  prerequisites: string[];
  estimatedMinutes: number;
  starterCode: string | Localized<string>;
  sampleStdin?: string[];
  steps: ProjectStep[];
  /** Ideas for going further once every step passes. */
  extensions: Text[];
  concepts: string[];
}

/* ------------------------------------------------------------------ */
/* Glossary and concepts                                               */
/* ------------------------------------------------------------------ */

export interface GlossaryEntry {
  /** Key used in {{term}} references. */
  id: string;
  /** The original (English / Python) term, always shown. */
  term: string;
  /** Translated display name (falls back to `term`). */
  name: Localized<string>;
  definition: Text;
  example?: string;
  /** Lesson where it is introduced. */
  lessonId?: string;
}

export interface Concept {
  id: string;
  name: Text;
  lessonId: string;
}
