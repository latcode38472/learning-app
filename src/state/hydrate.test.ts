/**
 * Regression test: the store must restore settings and progress from
 * localStorage when the module loads. zustand swallows errors thrown during
 * hydration, so a bug here shows up only as "every setting silently reset".
 */
import { describe, expect, it } from 'vitest';

describe('store hydration from localStorage', () => {
  it('restores persisted settings and progress on load (including v1 data)', async () => {
    const mem = new Map<string, string>();
    const stored = {
      state: {
        settings: { language: 'he', onboarded: true, pace: 'slow', name: 'Dana', tutor: { remoteEnabled: true } },
        progress: {
          version: 1,
          lessons: { 'l01-what-computers-do': { status: 'completed', startedAt: 'a', completedAt: 'b' } },
          exercises: {},
          drafts: { 'l02-ex': 'print(1)' },
          assessments: {},
          projects: {},
          concepts: {},
          testedOut: ['m1'],
          achievements: { 'first-lesson': 'c' },
          activeDays: ['2026-01-01'],
          runCount: 4,
          errorRuns: 0,
          fixedErrors: 0,
          reviewSessions: 0,
        },
      },
      version: 0,
    };
    mem.set('codepath.v1', JSON.stringify(stored));
    (globalThis as unknown as { window: unknown }).window = {
      localStorage: { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v), removeItem: (k: string) => void mem.delete(k) },
    };
    const { useStore } = await import('./store');
    const s = useStore.getState();
    expect(s.settings.onboarded).toBe(true);
    expect(s.settings.language).toBe('he');
    expect(s.settings.pace).toBe('slow');
    expect(s.settings.name).toBe('Dana');
    expect(s.settings.lessonView).toBe('guided');
    expect((s.settings as unknown as Record<string, unknown>).tutor).toBeUndefined();
    expect(s.progress.version).toBe(2);
    expect(s.progress.lessons['l01-what-computers-do'].status).toBe('completed');
    expect(s.progress.lessons['l01-what-computers-do'].completedUnderV1).toBe(true);
    expect(s.progress.testedOut).toEqual(['m1']);
    expect(s.progress.drafts['l02-ex']).toBe('print(1)');
    expect(s.progress.achievements['first-lesson']).toBe('c');
    expect(s.progress.runCount).toBe(4);
  });
});
