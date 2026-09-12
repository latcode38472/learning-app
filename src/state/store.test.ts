import { describe, expect, it } from 'vitest';
import { emptyProgress, lessonCompletionState, migrateProgress, sanitizeSettings, DEFAULT_SETTINGS, PROGRESS_VERSION, type Progress } from './store';

/** A realistic v1 export as written by the previous release. */
function v1Progress(): Record<string, unknown> {
  return {
    version: 1,
    lessons: {
      'l01-what-computers-do': { status: 'completed', startedAt: '2026-01-01T10:00:00.000Z', completedAt: '2026-01-01T10:20:00.000Z', predictDone: true },
      'l02-programs-and-files': { status: 'started', startedAt: '2026-01-02T10:00:00.000Z', checkDone: true },
    },
    exercises: {
      'l01-ex': { passed: true, attempts: 2, hintsUsed: 1, passedAt: '2026-01-01T10:10:00.000Z' },
      'l01-build': { passed: true, attempts: 1, hintsUsed: 0, passedAt: '2026-01-01T10:19:00.000Z' },
      'l02-ex': { passed: true, attempts: 1, hintsUsed: 0 },
    },
    drafts: { 'l02-ex': 'print("Good morning")' },
    assessments: { 'm1-test': { attempts: [], best: 0.8, passed: true } },
    projects: { 'p-guessing-game': { code: 'import random', stepsDone: ['setup'], updatedAt: '2026-01-03T10:00:00.000Z' } },
    concepts: {},
    testedOut: ['m2'],
    achievements: { 'first-run': '2026-01-01T10:05:00.000Z', 'first-lesson': '2026-01-01T10:20:00.000Z' },
    activeDays: ['2026-01-01', '2026-01-02'],
    runCount: 12,
    errorRuns: 3,
    fixedErrors: 2,
    reviewSessions: 1,
    lastLocation: { path: '/lesson/l02-programs-and-files', at: '2026-01-02T10:30:00.000Z' },
  };
}

describe('progress migration v1 → v2', () => {
  it('keeps every completion, achievement, tested-out module and draft', () => {
    const p = migrateProgress(v1Progress());
    expect(p.version).toBe(PROGRESS_VERSION);
    expect(p.lessons['l01-what-computers-do'].status).toBe('completed');
    expect(p.lessons['l01-what-computers-do'].completedUnderV1).toBe(true);
    expect(p.lessons['l02-programs-and-files'].status).toBe('started');
    expect(p.lessons['l02-programs-and-files'].completedUnderV1).toBeUndefined();
    expect(p.achievements).toEqual({ 'first-run': '2026-01-01T10:05:00.000Z', 'first-lesson': '2026-01-01T10:20:00.000Z' });
    expect(p.testedOut).toEqual(['m2']);
    expect(p.drafts['l02-ex']).toBe('print("Good morning")');
    expect(p.projects['p-guessing-game'].stepsDone).toEqual(['setup']);
    expect(p.assessments['m1-test'].passed).toBe(true);
    expect(p.runCount).toBe(12);
    expect(p.lastLocation?.path).toBe('/lesson/l02-programs-and-files');
    expect(p.lessonPositions).toEqual({});
  });

  it('is idempotent and does not mark v2 completions as legacy', () => {
    const once = migrateProgress(v1Progress());
    const twice = migrateProgress(once);
    expect(twice).toEqual(once);
    const v2: Progress = { ...emptyProgress(), lessons: { x: { status: 'completed', startedAt: 'a', checkPassed: true } } };
    expect(migrateProgress(v2).lessons.x.completedUnderV1).toBeUndefined();
  });

  it('tolerates missing or malformed fields', () => {
    expect(migrateProgress(undefined)).toEqual(emptyProgress());
    const p = migrateProgress({ version: 1, lessons: { bad: null }, testedOut: 'nope' });
    expect(p.lessons).toEqual({});
    expect(p.testedOut).toEqual([]);
    expect(p.version).toBe(PROGRESS_VERSION);
  });
});

describe('lesson completion rule', () => {
  const ids = ['l01', 'l01-ex', 'l01-build'] as const;

  it('requires practice (exercise + build) and demonstrated understanding', () => {
    const p = emptyProgress();
    p.exercises['l01-ex'] = { passed: true, attempts: 1, hintsUsed: 0 };
    p.exercises['l01-build'] = { passed: true, attempts: 1, hintsUsed: 0 };
    let s = lessonCompletionState(...ids, p);
    expect(s.practiceDone).toBe(true);
    expect(s.understood).toBe(false);
    expect(s.complete).toBe(false);

    p.lessons['l01'] = { status: 'started', startedAt: 'x', checkDone: true, checkPassed: false, checkBest: 0.5 };
    s = lessonCompletionState(...ids, p);
    expect(s.complete).toBe(false);

    p.lessons['l01'] = { status: 'started', startedAt: 'x', checkDone: true, checkPassed: true };
    s = lessonCompletionState(...ids, p);
    expect(s.understood).toBe(true);
    expect(s.complete).toBe(true);
  });

  it('understanding alone is not enough', () => {
    const p = emptyProgress();
    p.lessons['l01'] = { status: 'started', startedAt: 'x', checkPassed: true };
    p.exercises['l01-ex'] = { passed: true, attempts: 1, hintsUsed: 0 };
    expect(lessonCompletionState(...ids, p).complete).toBe(false);
  });

  it('honours lessons completed under the old rule', () => {
    const p = migrateProgress(v1Progress());
    const s = lessonCompletionState('l01-what-computers-do', 'l01-ex', 'l01-build', p);
    expect(s.understood).toBe(true);
    expect(s.complete).toBe(true);
  });
});

describe('settings sanitising', () => {
  it('drops removed tutor-server settings and fills new defaults', () => {
    const s = sanitizeSettings({ language: 'he', tutor: { remoteEnabled: true, endpoint: 'x' } } as never);
    expect((s as unknown as Record<string, unknown>).tutor).toBeUndefined();
    expect(s.language).toBe('he');
    expect(s.lessonView).toBe(DEFAULT_SETTINGS.lessonView);
    expect(s.pace).toBe('standard');
  });

  it('rejects unknown enum values', () => {
    const s = sanitizeSettings({ pace: 'turbo', lessonView: 'weird', language: 'xx' } as never);
    expect(s.pace).toBe('standard');
    expect(s.lessonView).toBe('guided');
    expect(s.language).toBe('en');
  });
});
