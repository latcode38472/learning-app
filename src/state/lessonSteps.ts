/**
 * Turns a lesson into the ordered list of steps shown by the guided view.
 *
 * The three paces produce genuinely different sequences from the same content:
 *
 *  slow      Small steps. The explanation is split at its headings (long
 *            chunks are split further), the "simpler" text is its own step,
 *            every extra example is its own step, and the lesson's mini
 *            checks are interleaved after explanation chunks. Nothing is
 *            hidden behind a button.
 *  standard  One explanation step (with "explain more simply" one click
 *            away), one example step (extra examples open one at a time).
 *  fast      A compact lesson: the brisk summary (or the explanation) and the
 *            worked example on one step, with the full text one click away,
 *            plus an offer to demonstrate existing knowledge by taking the
 *            understanding check first. The exercise, build task and check
 *            are still required — every pace teaches the same essentials.
 */
import type { Block, Lesson, Question } from '@/content/schema';
import type { LessonPosition, PaceSetting } from './store';

export type StepSection = 'objective' | 'explanation' | 'example' | 'predict' | 'exercise' | 'build' | 'check' | 'recap';

export type StepKind = 'objective' | 'explain' | 'simpler' | 'example' | 'extra-example' | 'mini-check' | 'predict' | 'exercise' | 'build' | 'check' | 'recap';

export interface LessonStep {
  id: string;
  section: StepSection;
  kind: StepKind;
  /** Content blocks for explain / simpler / example / extra-example / recap steps. */
  blocks?: Block[];
  /** One question for a mini check. */
  question?: Question;
  /** "Part i of n" for split explanations and numbered extra examples. */
  part?: { i: number; n: number };
  /** Optional help the learner may open inside this step. */
  optional?: {
    simpler?: boolean;
    moreExamples?: boolean;
    harder?: boolean;
    /** In brisk pace: the summary is shown; the full explanation can be opened. */
    fullExplanation?: boolean;
  };
  /** Brisk pace: offer to take the understanding check straight away. */
  offerSkipToCheck?: boolean;
}

export const SECTION_ORDER: StepSection[] = ['objective', 'explanation', 'example', 'predict', 'exercise', 'build', 'check', 'recap'];

/** Step id prefix → section, for resuming after the pace (and so the step list) changed. */
const STEP_PREFIX_SECTION: Record<string, StepSection> = {
  objective: 'objective',
  explain: 'explanation',
  mini: 'explanation',
  simpler: 'explanation',
  example: 'example',
  extra: 'example',
  predict: 'predict',
  exercise: 'exercise',
  build: 'build',
  check: 'check',
  recap: 'recap',
};

const MAX_CHUNK = 4;

/** Split explanation blocks into small readable chunks (at headings, then by size). */
export function chunkExplanation(blocks: Block[]): Block[][] {
  const byHeading: Block[][] = [];
  let current: Block[] = [];
  for (const b of blocks) {
    if (b.kind === 'h' && current.length > 0) {
      byHeading.push(current);
      current = [];
    }
    current.push(b);
  }
  if (current.length) byHeading.push(current);

  const out: Block[][] = [];
  for (const chunk of byHeading) {
    if (chunk.length <= MAX_CHUNK + 1) {
      out.push(chunk);
      continue;
    }
    // Keep the heading with the first group; never separate a code block from
    // the paragraph that introduces it.
    let group: Block[] = [];
    for (let i = 0; i < chunk.length; i += 1) {
      group.push(chunk[i]);
      const next = chunk[i + 1];
      const nextIsCode = next && (next.kind === 'code' || next.kind === 'viz' || next.kind === 'term');
      if (group.length >= MAX_CHUNK && !nextIsCode) {
        out.push(group);
        group = [];
      }
    }
    if (group.length) {
      // Avoid a dangling one-block chunk.
      if (group.length === 1 && out.length) out[out.length - 1].push(...group);
      else out.push(group);
    }
  }
  return out.length ? out : [blocks];
}

export function buildLessonSteps(lesson: Lesson, pace: PaceSetting): LessonStep[] {
  const steps: LessonStep[] = [];
  const minis = lesson.miniChecks ?? [];

  if (pace === 'slow') {
    steps.push({ id: 'objective', section: 'objective', kind: 'objective' });
    const chunks = chunkExplanation(lesson.explanation);
    chunks.forEach((blocks, i) => {
      steps.push({ id: `explain-${i}`, section: 'explanation', kind: 'explain', blocks, part: { i: i + 1, n: chunks.length } });
      if (minis[i]) steps.push({ id: `mini-${i}`, section: 'explanation', kind: 'mini-check', question: minis[i] });
    });
    for (let i = chunks.length; i < minis.length; i += 1) {
      steps.push({ id: `mini-${i}`, section: 'explanation', kind: 'mini-check', question: minis[i] });
    }
    if (lesson.simpler.length) steps.push({ id: 'simpler', section: 'explanation', kind: 'simpler', blocks: lesson.simpler });
    steps.push({ id: 'example', section: 'example', kind: 'example', blocks: lesson.workedExample });
    lesson.moreExamples.forEach((blocks, i) => {
      steps.push({ id: `extra-${i}`, section: 'example', kind: 'extra-example', blocks, part: { i: i + 1, n: lesson.moreExamples.length } });
    });
    steps.push({ id: 'predict', section: 'predict', kind: 'predict' });
    steps.push({ id: 'exercise', section: 'exercise', kind: 'exercise' });
    steps.push({ id: 'build', section: 'build', kind: 'build' });
    steps.push({ id: 'check', section: 'check', kind: 'check' });
    steps.push({ id: 'recap', section: 'recap', kind: 'recap', blocks: lesson.recap, optional: { harder: !!lesson.harderChallenge } });
    return steps;
  }

  if (pace === 'fast') {
    steps.push({ id: 'objective', section: 'objective', kind: 'objective', offerSkipToCheck: true });
    const compact = lesson.briskSummary && lesson.briskSummary.length ? lesson.briskSummary : lesson.explanation;
    steps.push({
      id: 'explain-0',
      section: 'explanation',
      kind: 'explain',
      blocks: [...compact, ...lesson.workedExample],
      optional: { simpler: true, moreExamples: lesson.moreExamples.length > 0, fullExplanation: compact !== lesson.explanation },
    });
    steps.push({ id: 'predict', section: 'predict', kind: 'predict' });
    steps.push({ id: 'exercise', section: 'exercise', kind: 'exercise' });
    steps.push({ id: 'build', section: 'build', kind: 'build', optional: { harder: !!lesson.harderChallenge } });
    steps.push({ id: 'check', section: 'check', kind: 'check' });
    steps.push({ id: 'recap', section: 'recap', kind: 'recap', blocks: lesson.recap });
    return steps;
  }

  // standard
  steps.push({ id: 'objective', section: 'objective', kind: 'objective' });
  steps.push({ id: 'explain-0', section: 'explanation', kind: 'explain', blocks: lesson.explanation, optional: { simpler: lesson.simpler.length > 0 } });
  steps.push({ id: 'example', section: 'example', kind: 'example', blocks: lesson.workedExample, optional: { moreExamples: lesson.moreExamples.length > 0, harder: !!lesson.harderChallenge } });
  steps.push({ id: 'predict', section: 'predict', kind: 'predict' });
  steps.push({ id: 'exercise', section: 'exercise', kind: 'exercise' });
  steps.push({ id: 'build', section: 'build', kind: 'build' });
  steps.push({ id: 'check', section: 'check', kind: 'check' });
  steps.push({ id: 'recap', section: 'recap', kind: 'recap', blocks: lesson.recap });
  return steps;
}

/**
 * Where to resume. The saved position stores the step id, so a pace change
 * (which changes the number of steps) still lands the learner in the same
 * section instead of on an unrelated step.
 */
export function restoreStepIndex(steps: LessonStep[], saved?: LessonPosition): number {
  if (!saved) return 0;
  if (saved.stepId) {
    const exact = steps.findIndex((s) => s.id === saved.stepId);
    if (exact >= 0) return exact;
    const prefix = saved.stepId.split('-')[0];
    const section = STEP_PREFIX_SECTION[prefix] ?? (prefix as StepSection);
    // The same section, or the nearest earlier one that exists in this pace
    // (brisk merges the example into the explanation step, for instance).
    for (let i = SECTION_ORDER.indexOf(section); i >= 0; i -= 1) {
      const bySection = steps.findIndex((s) => s.section === SECTION_ORDER[i]);
      if (bySection >= 0) return bySection;
    }
  }
  if (saved.total === steps.length && saved.step >= 0 && saved.step < steps.length) return saved.step;
  return Math.min(Math.max(0, saved.step), steps.length - 1);
}

export function firstStepOfSection(steps: LessonStep[], section: StepSection): number {
  const i = steps.findIndex((s) => s.section === section);
  return i >= 0 ? i : 0;
}
