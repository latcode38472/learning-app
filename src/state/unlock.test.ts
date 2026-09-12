import { describe, expect, it } from 'vitest';
import { emptyProgress, currentStreak, todayKey, type Progress } from './store';
import {
  isLessonUnlocked,
  isModuleUnlocked,
  isModuleCompleted,
  moduleState,
  nextRecommendedLesson,
  canTakeModuleTest,
  lessonBlockedBy,
  stage1Summary,
  isProjectUnlocked,
  missingProjectPrerequisites,
  dueConceptIds,
  isProjectStepUnlocked,
  missingStepPrerequisites,
  availableStepCount,
  stepRequirements,
} from './unlock';
import { scheduleAfterAnswer, initialConceptStats, isDue, isWeak } from './review';
import { modules, lessons, lessonOrder, conceptMap, conceptToLesson, conceptsKnownAt, assessments, projects } from '@/content';
import { en } from '@/i18n/en';
import { he } from '@/i18n/he';
import { translate, hasMissingTranslation, localizeWithInfo } from '@/i18n';
import { normalizeAnswer, isPredictCorrect } from '@/components/QuizRunner';
import { pickVariants } from '@/pages/Assessment';

function withCompleted(ids: string[], extra: Partial<Progress> = {}): Progress {
  const p = emptyProgress();
  for (const id of ids) p.lessons[id] = { status: 'completed', startedAt: 'x', completedAt: 'x' };
  return { ...p, ...extra };
}

describe('unlock logic', () => {
  const m1 = modules.find((m) => m.id === 'm1')!;
  const m2 = modules.find((m) => m.id === 'm2')!;

  it('opens only the first module and first lesson at the start', () => {
    const p = emptyProgress();
    expect(isModuleUnlocked('m1', p)).toBe(true);
    expect(isModuleUnlocked('m2', p)).toBe(false);
    expect(isLessonUnlocked(m1.lessonIds[0], p)).toBe(true);
    expect(isLessonUnlocked(m1.lessonIds[1], p)).toBe(false);
    expect(lessonBlockedBy(m1.lessonIds[1], p)).toBe(m1.lessonIds[0]);
    expect(nextRecommendedLesson(p)).toBe(m1.lessonIds[0]);
  });

  it('unlocks the next lesson when the previous one is completed', () => {
    const p = withCompleted([m1.lessonIds[0]]);
    expect(isLessonUnlocked(m1.lessonIds[1], p)).toBe(true);
    expect(nextRecommendedLesson(p)).toBe(m1.lessonIds[1]);
  });

  it('requires the module test to complete a module and unlock the next', () => {
    const p = withCompleted(m1.lessonIds);
    expect(isModuleCompleted('m1', p)).toBe(false);
    expect(moduleState('m1', p)).toBe('in-progress');
    expect(canTakeModuleTest('m1', p)).toBe(true);
    expect(isModuleUnlocked('m2', p)).toBe(false);
    p.assessments['m1-test'] = { attempts: [], best: 1, passed: true };
    expect(isModuleCompleted('m1', p)).toBe(true);
    expect(moduleState('m1', p)).toBe('completed');
    expect(isModuleUnlocked('m2', p)).toBe(true);
    expect(isLessonUnlocked(m2.lessonIds[0], p)).toBe(true);
  });

  it('testing out of a module opens all its lessons and the next module', () => {
    const p = emptyProgress();
    p.testedOut = ['m1'];
    expect(moduleState('m1', p)).toBe('tested-out');
    expect(isLessonUnlocked(m1.lessonIds[3], p)).toBe(true);
    expect(isModuleUnlocked('m2', p)).toBe(true);
    // The recommendation skips the tested-out module and progress counts its lessons as learned.
    expect(nextRecommendedLesson(p)).toBe(m2.lessonIds[0]);
    expect(stage1Summary(p).done).toBe(m1.lessonIds.length);
  });

  it('project prerequisites are satisfied by tested-out modules', () => {
    const guessing = projects['p-guessing-game'];
    const p = emptyProgress();
    p.testedOut = ['m1', 'm2', 'm3'];
    for (const id of modules.find((m) => m.id === 'm4')!.lessonIds) p.lessons[id] = { status: 'completed', startedAt: 'x', completedAt: 'x' };
    expect(isProjectUnlocked(guessing, p)).toBe(true);
    expect(missingProjectPrerequisites(guessing, p)).toEqual([]);
    const q = emptyProgress();
    expect(isProjectUnlocked(guessing, q)).toBe(false);
    expect(missingProjectPrerequisites(guessing, q).length).toBeGreaterThan(0);
  });

  it('the growing text adventure opens after lesson 5 and unlocks steps as their lessons are learned', () => {
    const adventure = projects['p-text-adventure'];
    expect(adventure.growing).toBe(true);
    const fresh = emptyProgress();
    expect(isProjectUnlocked(adventure, fresh)).toBe(false);
    expect(missingProjectPrerequisites(adventure, fresh)).toEqual(['l05-print-and-strings']);

    const p = withCompleted([...m1.lessonIds, 'l05-print-and-strings']);
    expect(isProjectUnlocked(adventure, p)).toBe(true);
    expect(isProjectStepUnlocked(adventure, adventure.steps[0], p)).toBe(true);
    const variablesStep = adventure.steps.find((s) => s.id === 'ta-2-variables')!;
    expect(isProjectStepUnlocked(adventure, variablesStep, p)).toBe(false);
    expect(missingStepPrerequisites(adventure, variablesStep, p)).toEqual(['l06-variables']);
    expect(availableStepCount(adventure, p)).toBe(1);

    p.lessons['l06-variables'] = { status: 'completed', startedAt: 'x', completedAt: 'x' };
    expect(isProjectStepUnlocked(adventure, variablesStep, p)).toBe(true);
    expect(availableStepCount(adventure, p)).toBe(2);

    // Every step requires a lesson that exists, and requirements never go backwards.
    let last = -1;
    for (const step of adventure.steps) {
      const reqs = stepRequirements(adventure, step);
      expect(reqs.length).toBeGreaterThan(0);
      const idx = Math.max(...reqs.map((id) => lessonOrder.indexOf(id)));
      expect(idx).toBeGreaterThanOrEqual(last);
      last = idx;
    }
    // Testing out of the project's module opens everything.
    const all = emptyProgress();
    all.testedOut = ['m7'];
    expect(availableStepCount(adventure, all)).toBe(adventure.steps.length);
  });

  it('only counts due concepts from learned lessons', () => {
    const p = emptyProgress();
    p.concepts['variable'] = { ...initialConceptStats(new Date('2020-01-01')), nextReview: '2020-01-02T00:00:00Z' };
    expect(dueConceptIds(p)).toEqual([]);
    p.testedOut = ['m1', 'm2'];
    expect(dueConceptIds(p)).toEqual(['variable']);
  });

  it('never unlocks planned modules', () => {
    const p = emptyProgress();
    p.testedOut = modules.filter((m) => m.status === 'available').map((m) => m.id);
    for (const m of modules.filter((m) => m.status === 'planned')) {
      expect(isModuleUnlocked(m.id, p)).toBe(false);
      expect(moduleState(m.id, p)).toBe('planned');
    }
  });
});

describe('streaks', () => {
  it('counts consecutive days without punishing a gap', () => {
    const today = new Date();
    const d = (n: number) => {
      const x = new Date(today);
      x.setDate(x.getDate() - n);
      return todayKey(x);
    };
    expect(currentStreak([d(0), d(1), d(2)], today)).toBe(3);
    expect(currentStreak([d(1), d(2)], today)).toBe(2); // yesterday still counts
    expect(currentStreak([d(0), d(2)], today)).toBe(1);
    expect(currentStreak([], today)).toBe(0);
  });
});

describe('spaced review', () => {
  it('grows intervals on correct answers and resets on wrong ones', () => {
    const now = new Date('2026-01-01T12:00:00Z');
    let s = initialConceptStats(now);
    expect(isDue(s, now)).toBe(true);
    s = scheduleAfterAnswer(s, true, now);
    expect(s.interval).toBe(1);
    expect(isDue(s, now)).toBe(false);
    s = scheduleAfterAnswer(s, true, now);
    expect(s.interval).toBe(3);
    s = scheduleAfterAnswer(s, true, now);
    expect(s.interval).toBeGreaterThan(3);
    s = scheduleAfterAnswer(s, false, now);
    expect(s.interval).toBe(1);
    expect(s.wrong).toBe(1);
    // One mistake after three successes is not yet a weak spot; a fresh miss is.
    expect(isWeak(s)).toBe(false);
    expect(isWeak(scheduleAfterAnswer(initialConceptStats(now), false, now))).toBe(true);
  });
});

describe('i18n', () => {
  function keys(obj: Record<string, unknown>, prefix = ''): string[] {
    return Object.entries(obj).flatMap(([k, v]) => (typeof v === 'string' ? [prefix + k] : keys(v as Record<string, unknown>, `${prefix}${k}.`)));
  }
  it('Hebrew dictionary has exactly the English keys', () => {
    expect(keys(he as unknown as Record<string, unknown>).sort()).toEqual(keys(en as unknown as Record<string, unknown>).sort());
  });
  it('interpolates placeholders and falls back to English', () => {
    expect(translate('en', 'home.lessonsDone', { done: 2, total: 5 })).toBe('2 of 5 lessons completed');
    expect(translate('he', 'home.lessonsDone', { done: 2, total: 5 })).toContain('2');
  });
  it('reports content fallback explicitly', () => {
    expect(localizeWithInfo({ en: 'a', he: 'ב' }, 'he')).toEqual({ value: 'ב', fellBack: false });
    expect(localizeWithInfo({ en: 'a' }, 'he')).toEqual({ value: 'a', fellBack: true });
    expect(hasMissingTranslation({ title: { en: 'x' } }, 'he')).toBe(true);
    expect(hasMissingTranslation({ title: { en: 'x', he: 'y' } }, 'he')).toBe(false);
  });
});

describe('content integrity', () => {
  it('every available module lists lessons that exist, in concept-map order', () => {
    for (const m of modules.filter((m) => m.status === 'available')) {
      for (const id of m.lessonIds) expect(lessons[id], `missing lesson ${id}`).toBeDefined();
      if (m.testId) expect(assessments[m.testId], `missing test ${m.testId}`).toBeDefined();
      for (const pid of m.projectIds ?? []) expect(projects[pid], `missing project ${pid}`).toBeDefined();
    }
    expect(lessonOrder).toEqual(Object.keys(conceptMap));
    expect(lessonOrder.length).toBeGreaterThanOrEqual(20);
  });

  it('lessons only require concepts introduced earlier and have all eight sections in both languages', () => {
    for (const id of lessonOrder) {
      const lesson = lessons[id];
      const known = conceptsKnownAt(id, false);
      for (const c of lesson.requires) expect(known.has(c), `${id} requires ${c} too early`).toBe(true);
      expect(lesson.introduces.sort()).toEqual([...conceptMap[id]].sort());
      for (const key of ['objective', 'prerequisiteCheck', 'explanation', 'simpler', 'workedExample', 'moreExamples', 'predict', 'exercise', 'build', 'check', 'recap', 'next'] as const) {
        expect(lesson[key], `${id} missing ${key}`).toBeTruthy();
      }
      expect(hasMissingTranslation(lesson, 'he'), `${id} has untranslated text`).toBe(false);
      for (const c of [...lesson.exercise.concepts, ...lesson.build.concepts]) expect(conceptToLesson[c], `${id} unknown concept ${c}`).toBeDefined();
    }
  });

  it('module tests have variant pools so retries differ', () => {
    const tests = Object.values(assessments).filter((a) => a.kind === 'module-test');
    expect(tests.length).toBeGreaterThanOrEqual(2);
    for (const a of tests) {
      const first = pickVariants(a, 0).map((q) => q.id);
      const second = pickVariants(a, 1).map((q) => q.id);
      expect(first).not.toEqual(second);
      expect(a.pools.some((p) => p.variants.some((q) => q.type === 'code'))).toBe(true);
    }
  });

  it('has at least three runnable projects with checked steps', () => {
    const list = Object.values(projects);
    expect(list.length).toBeGreaterThanOrEqual(3);
    for (const p of list) expect(p.steps.some((s) => s.check)).toBe(true);
  });
});

describe('answer normalisation', () => {
  it('ignores trailing whitespace and optional case', () => {
    expect(normalizeAnswer('hello  \n\n')).toBe('hello');
    expect(isPredictCorrect('Hello', 'hello', false)).toBe(false);
    expect(isPredictCorrect('Hello', 'hello ', true)).toBe(true);
    expect(isPredictCorrect(['1\n2', '1 2'], '1\n2\n')).toBe(true);
  });
});
