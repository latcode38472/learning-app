import { describe, expect, it } from 'vitest';
import { lessons } from '@/content';
import { buildLessonSteps, chunkExplanation, restoreStepIndex } from './lessonSteps';
import type { Block } from '@/content/schema';

const l01 = lessons['l01-what-computers-do'];
const l02 = lessons['l02-programs-and-files'];

describe('guided lesson steps per pace', () => {
  it('produces genuinely different sequences for slow, standard and brisk', () => {
    const slow = buildLessonSteps(l02, 'slow');
    const standard = buildLessonSteps(l02, 'standard');
    const fast = buildLessonSteps(l02, 'fast');
    expect(slow.length).toBeGreaterThan(standard.length);
    expect(standard.length).toBeGreaterThan(fast.length);
    // Slow: the explanation is split and the simpler text and extra examples are their own steps.
    expect(slow.filter((s) => s.kind === 'explain').length).toBeGreaterThan(1);
    expect(slow.some((s) => s.kind === 'simpler')).toBe(true);
    expect(slow.filter((s) => s.kind === 'extra-example').length).toBe(l02.moreExamples.length);
    // Standard: one explanation step with optional help.
    expect(standard.filter((s) => s.kind === 'explain').length).toBe(1);
    expect(standard.find((s) => s.kind === 'explain')?.optional?.simpler).toBe(true);
    // Brisk: explanation and example merged, with an offer to prove existing knowledge.
    expect(fast.some((s) => s.kind === 'example')).toBe(false);
    expect(fast[0].offerSkipToCheck).toBe(true);
  });

  it('never drops a required part in any pace', () => {
    for (const pace of ['slow', 'standard', 'fast'] as const) {
      for (const lesson of [l01, l02]) {
        const kinds = buildLessonSteps(lesson, pace).map((s) => s.kind);
        for (const k of ['objective', 'predict', 'exercise', 'build', 'check', 'recap']) expect(kinds).toContain(k);
        expect(kinds.some((k) => k === 'explain')).toBe(true);
      }
    }
  });

  it('interleaves mini checks after explanation chunks in slow pace', () => {
    const withMinis = { ...l02, miniChecks: [l02.check[0], l02.check[1], l02.check[2]] };
    const slow = buildLessonSteps(withMinis, 'slow');
    const ids = slow.map((s) => s.id);
    const firstExplain = ids.indexOf('explain-0');
    expect(ids[firstExplain + 1]).toBe('mini-0');
    expect(slow.filter((s) => s.kind === 'mini-check').length).toBe(3);
    // Standard and brisk do not interleave them.
    expect(buildLessonSteps(withMinis, 'standard').some((s) => s.kind === 'mini-check')).toBe(false);
  });

  it('uses the brisk summary when present and keeps the full explanation reachable', () => {
    const summary: Block[] = [{ kind: 'p', text: { en: 'Summary.', he: 'סיכום.' } }];
    const fast = buildLessonSteps({ ...l02, briskSummary: summary }, 'fast');
    const explain = fast.find((s) => s.kind === 'explain')!;
    expect(explain.blocks?.[0]).toBe(summary[0]);
    expect(explain.optional?.fullExplanation).toBe(true);
  });
});

describe('chunkExplanation', () => {
  const p = (n: number): Block => ({ kind: 'p', text: { en: `p${n}` } });
  const h = (n: number): Block => ({ kind: 'h', text: { en: `h${n}` } });
  const code: Block = { kind: 'code', code: 'print(1)' };

  it('splits at headings and keeps the heading with its text', () => {
    const chunks = chunkExplanation([p(1), h(1), p(2), p(3), h(2), p(4)]);
    expect(chunks.map((c) => c.length)).toEqual([1, 3, 2]);
    expect(chunks[1][0].kind).toBe('h');
  });

  it('splits long chunks without separating a code block from its intro', () => {
    const chunks = chunkExplanation([p(1), p(2), p(3), p(4), code, p(5), p(6), p(7)]);
    expect(chunks.length).toBeGreaterThan(1);
    for (const c of chunks) expect(c[0].kind).not.toBe('code');
  });
});

describe('restoreStepIndex', () => {
  it('resumes at the exact step, or the same section after a pace change', () => {
    const slow = buildLessonSteps(l02, 'slow');
    const fast = buildLessonSteps(l02, 'fast');
    const exerciseIdx = slow.findIndex((s) => s.id === 'exercise');
    const saved = { step: exerciseIdx, total: slow.length, pace: 'slow' as const, stepId: 'exercise', updatedAt: 'x' };
    expect(restoreStepIndex(slow, saved)).toBe(exerciseIdx);
    expect(fast[restoreStepIndex(fast, saved)].id).toBe('exercise');
    const extra = { step: 5, total: slow.length, pace: 'slow' as const, stepId: 'extra-1', updatedAt: 'x' };
    expect(fast[restoreStepIndex(fast, extra)].section).toBe('explanation');
    expect(restoreStepIndex(slow, undefined)).toBe(0);
    expect(restoreStepIndex(slow, { step: 999, total: 3, pace: 'slow', updatedAt: 'x' })).toBe(slow.length - 1);
  });
});
