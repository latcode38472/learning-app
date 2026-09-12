/**
 * Application state: settings + learning progress.
 *
 * Everything is stored in the browser (localStorage) under a versioned key.
 * No account, no server, no personal data beyond an optional display name.
 *
 * Progress format history
 *  v1  lessons completed automatically once the exercise and the building task
 *      passed; the understanding check was optional.
 *  v2  practice (exercise + build) and demonstrated understanding (the check)
 *      are tracked separately and a lesson is complete only when both are
 *      done. Lessons completed under v1 stay completed (`completedUnderV1`).
 *      Adds `lessonPositions` so a learner returns to the step they were on.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LangCode } from '@/content/schema';
import { DEFAULT_LANGUAGE, isLangCode } from '@/i18n/languages';
import { scheduleAfterAnswer, initialConceptStats, type ConceptStats } from './review';

export type ThemeSetting = 'system' | 'light' | 'dark';
export type StyleSetting = 'playful' | 'focused';
export type PaceSetting = 'slow' | 'standard' | 'fast';
export type FontSizeSetting = 'normal' | 'large' | 'xlarge';
export type LessonViewSetting = 'guided' | 'full';
export type ExperienceSetting = 'beginner' | 'experienced' | 'unknown';

export interface Settings {
  language: LangCode;
  theme: ThemeSetting;
  style: StyleSetting;
  pace: PaceSetting;
  fontSize: FontSizeSetting;
  reduceMotion: boolean;
  highContrast: boolean;
  name: string;
  onboarded: boolean;
  /** Guided (one step at a time) or the whole lesson on one page. */
  lessonView: LessonViewSetting;
  /** What the learner told us at the start; only used to suggest a starting point. */
  experience: ExperienceSetting;
}

export interface LessonProgress {
  status: 'started' | 'completed';
  startedAt: string;
  completedAt?: string;
  predictDone?: boolean;
  /** The learner finished at least one attempt of the understanding check. */
  checkDone?: boolean;
  /** Demonstrated understanding: every question of the check answered correctly. */
  checkPassed?: boolean;
  checkAttempts?: number;
  /** Best score in the understanding check (0..1). */
  checkBest?: number;
  understoodAt?: string;
  /** Completed before v2, when the understanding check was not required. Kept complete. */
  completedUnderV1?: boolean;
}

export interface LessonPosition {
  /** Index of the guided step the learner was on. */
  step: number;
  /** Number of steps the lesson had at the time (steps depend on pace). */
  total: number;
  pace: PaceSetting;
  /** Stable id of the step (e.g. "exercise", "explain-2") so a pace change resumes in the same section. */
  stepId?: string;
  updatedAt: string;
}

export interface ExerciseProgress {
  passed: boolean;
  attempts: number;
  hintsUsed: number;
  passedAt?: string;
}

export interface AssessmentAttempt {
  at: string;
  score: number; // 0..1
  passed: boolean;
  wrongConcepts: string[];
  correctConcepts: string[];
}

export interface AssessmentProgress {
  attempts: AssessmentAttempt[];
  /** Total attempts ever made (attempts[] keeps only the last 20). */
  attemptCount?: number;
  best: number;
  passed: boolean;
}

export interface ProjectProgress {
  code: string;
  stepsDone: string[];
  updatedAt: string;
  completedAt?: string;
}

export const PROGRESS_VERSION = 2;

export interface Progress {
  version: typeof PROGRESS_VERSION;
  lessons: Record<string, LessonProgress>;
  lessonPositions: Record<string, LessonPosition>;
  exercises: Record<string, ExerciseProgress>;
  drafts: Record<string, string>;
  assessments: Record<string, AssessmentProgress>;
  projects: Record<string, ProjectProgress>;
  concepts: Record<string, ConceptStats>;
  testedOut: string[];
  achievements: Record<string, string>;
  activeDays: string[];
  runCount: number;
  errorRuns: number;
  fixedErrors: number;
  reviewSessions: number;
  lastLocation?: { path: string; at: string };
}

export const DEFAULT_SETTINGS: Settings = {
  language: DEFAULT_LANGUAGE,
  theme: 'system',
  style: 'focused',
  pace: 'standard',
  fontSize: 'normal',
  reduceMotion: false,
  highContrast: false,
  name: '',
  onboarded: false,
  lessonView: 'guided',
  experience: 'unknown',
};

// These lists are used by sanitizeSettings() during store hydration, which
// runs while this module is being evaluated, so they must be defined before
// the store below (a later `const` would be in its temporal dead zone and the
// hydration error would be swallowed, silently resetting every setting).
const PACES: PaceSetting[] = ['slow', 'standard', 'fast'];
const VIEWS: LessonViewSetting[] = ['guided', 'full'];
const EXPERIENCES: ExperienceSetting[] = ['beginner', 'experienced', 'unknown'];

export function emptyProgress(): Progress {
  return {
    version: PROGRESS_VERSION,
    lessons: {},
    lessonPositions: {},
    exercises: {},
    drafts: {},
    assessments: {},
    projects: {},
    concepts: {},
    testedOut: [],
    achievements: {},
    activeDays: [],
    runCount: 0,
    errorRuns: 0,
    fixedErrors: 0,
    reviewSessions: 0,
  };
}

/**
 * Bring any stored progress object up to the current version. Never drops
 * data: unknown fields are kept, missing ones get defaults, and a lesson that
 * was completed under an older rule stays completed.
 */
export function migrateProgress(raw: unknown): Progress {
  const base = emptyProgress();
  if (!raw || typeof raw !== 'object') return base;
  const src = raw as Partial<Progress> & { version?: number };
  const version = typeof src.version === 'number' ? src.version : 1;
  const lessons: Record<string, LessonProgress> = {};
  for (const [id, lp] of Object.entries(src.lessons ?? {})) {
    if (!lp || typeof lp !== 'object') continue;
    const next: LessonProgress = { ...(lp as LessonProgress) };
    if (version < 2 && next.status === 'completed' && !next.checkPassed) {
      // v1 completed lessons without the understanding check: honour the completion.
      next.completedUnderV1 = true;
    }
    lessons[id] = next;
  }
  return {
    ...base,
    ...src,
    version: PROGRESS_VERSION,
    lessons,
    lessonPositions: src.lessonPositions && typeof src.lessonPositions === 'object' ? src.lessonPositions : {},
    exercises: src.exercises ?? {},
    drafts: src.drafts ?? {},
    assessments: src.assessments ?? {},
    projects: src.projects ?? {},
    concepts: src.concepts ?? {},
    testedOut: Array.isArray(src.testedOut) ? src.testedOut : [],
    achievements: src.achievements ?? {},
    activeDays: Array.isArray(src.activeDays) ? src.activeDays : [],
    runCount: src.runCount ?? 0,
    errorRuns: src.errorRuns ?? 0,
    fixedErrors: src.fixedErrors ?? 0,
    reviewSessions: src.reviewSessions ?? 0,
  };
}

export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/* ---------------------------------------------------------------- completion rule */

export interface LessonCompletionState {
  exercisePassed: boolean;
  buildPassed: boolean;
  /** Both coding tasks passed. */
  practiceDone: boolean;
  /** The understanding check was passed (or the lesson was completed under v1). */
  understood: boolean;
  /** Everything required is done. */
  complete: boolean;
}

/**
 * The single definition of "lesson complete": the exercise passed, the
 * building task passed, and the understanding check was passed. Lessons
 * completed before this rule existed are honoured.
 */
export function lessonCompletionState(lessonId: string, exerciseId: string, buildId: string, progress: Progress): LessonCompletionState {
  const lp = progress.lessons[lessonId];
  const exercisePassed = progress.exercises[exerciseId]?.passed ?? false;
  const buildPassed = progress.exercises[buildId]?.passed ?? false;
  const practiceDone = exercisePassed && buildPassed;
  const understood = !!lp?.checkPassed || !!lp?.completedUnderV1;
  const complete = lp?.status === 'completed' || (practiceDone && understood);
  return { exercisePassed, buildPassed, practiceDone, understood, complete };
}

/* ---------------------------------------------------------------- store */

interface AppState {
  settings: Settings;
  progress: Progress;
  /** Whether the last run ended in an error (used for the "bug squasher" achievement). */
  lastRunHadError: boolean;

  updateSettings: (patch: Partial<Settings>) => void;
  setLanguage: (language: LangCode) => void;
  completeOnboarding: (patch: Partial<Settings>) => void;

  touchActivity: () => void;
  setLastLocation: (path: string) => void;

  startLesson: (lessonId: string) => void;
  completeLesson: (lessonId: string) => void;
  markPredictDone: (lessonId: string) => void;
  /** Record one finished attempt of the understanding check. */
  recordCheckAttempt: (lessonId: string, score: number, passed: boolean) => void;
  saveLessonPosition: (lessonId: string, position: Omit<LessonPosition, 'updatedAt'>) => void;

  saveDraft: (id: string, code: string) => void;
  recordExerciseAttempt: (id: string, passed: boolean, hintsUsed: number) => void;
  recordRun: (hadError: boolean) => void;

  recordConceptResult: (conceptId: string, correct: boolean) => void;
  recordAssessmentAttempt: (assessmentId: string, attempt: AssessmentAttempt) => void;
  markTestedOut: (moduleId: string) => void;

  saveProjectCode: (projectId: string, code: string) => void;
  markProjectStep: (projectId: string, stepId: string, totalSteps: number) => void;
  resetProject: (projectId: string) => void;

  recordReviewSession: () => void;
  unlockAchievement: (id: string) => boolean;

  importProgress: (data: unknown) => boolean;
  resetProgress: () => void;
}

const STORAGE_KEY = 'codepath.v1';

function lessonEntry(s: AppState, lessonId: string): LessonProgress {
  return s.progress.lessons[lessonId] ?? { status: 'started', startedAt: new Date().toISOString() };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      progress: emptyProgress(),
      lastRunHadError: false,

      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      setLanguage: (language) => set((s) => ({ settings: { ...s.settings, language } })),
      completeOnboarding: (patch) => set((s) => ({ settings: { ...s.settings, ...patch, onboarded: true } })),

      touchActivity: () =>
        set((s) => {
          const key = todayKey();
          if (s.progress.activeDays.includes(key)) return s;
          return { progress: { ...s.progress, activeDays: [...s.progress.activeDays, key] } };
        }),
      setLastLocation: (path) =>
        set((s) => ({ progress: { ...s.progress, lastLocation: { path, at: new Date().toISOString() } } })),

      startLesson: (lessonId) =>
        set((s) => {
          if (s.progress.lessons[lessonId]) return s;
          return {
            progress: {
              ...s.progress,
              lessons: { ...s.progress.lessons, [lessonId]: { status: 'started', startedAt: new Date().toISOString() } },
            },
          };
        }),
      completeLesson: (lessonId) =>
        set((s) => {
          const existing = s.progress.lessons[lessonId];
          if (existing?.status === 'completed') return s;
          return {
            progress: {
              ...s.progress,
              lessons: {
                ...s.progress.lessons,
                [lessonId]: {
                  ...(existing ?? { startedAt: new Date().toISOString() }),
                  status: 'completed',
                  completedAt: new Date().toISOString(),
                },
              },
            },
          };
        }),
      markPredictDone: (lessonId) =>
        set((s) => ({
          progress: { ...s.progress, lessons: { ...s.progress.lessons, [lessonId]: { ...lessonEntry(s, lessonId), predictDone: true } } },
        })),
      recordCheckAttempt: (lessonId, score, passed) =>
        set((s) => {
          const prev = lessonEntry(s, lessonId);
          const next: LessonProgress = {
            ...prev,
            checkDone: true,
            checkAttempts: (prev.checkAttempts ?? 0) + 1,
            checkBest: Math.max(prev.checkBest ?? 0, score),
            checkPassed: prev.checkPassed || passed,
            understoodAt: prev.understoodAt ?? (passed ? new Date().toISOString() : undefined),
          };
          return { progress: { ...s.progress, lessons: { ...s.progress.lessons, [lessonId]: next } } };
        }),
      saveLessonPosition: (lessonId, position) =>
        set((s) => {
          const prev = s.progress.lessonPositions[lessonId];
          if (prev && prev.step === position.step && prev.total === position.total && prev.pace === position.pace && prev.stepId === position.stepId) return s;
          return {
            progress: {
              ...s.progress,
              lessonPositions: { ...s.progress.lessonPositions, [lessonId]: { ...position, updatedAt: new Date().toISOString() } },
            },
          };
        }),

      saveDraft: (id, code) =>
        set((s) => {
          if (s.progress.drafts[id] === code) return s;
          return { progress: { ...s.progress, drafts: { ...s.progress.drafts, [id]: code } } };
        }),
      recordExerciseAttempt: (id, passed, hintsUsed) =>
        set((s) => {
          const prev = s.progress.exercises[id] ?? { passed: false, attempts: 0, hintsUsed: 0 };
          const next: ExerciseProgress = {
            passed: prev.passed || passed,
            attempts: prev.attempts + 1,
            hintsUsed: Math.max(prev.hintsUsed, hintsUsed),
            passedAt: prev.passedAt ?? (passed ? new Date().toISOString() : undefined),
          };
          return { progress: { ...s.progress, exercises: { ...s.progress.exercises, [id]: next } } };
        }),
      recordRun: (hadError) =>
        set((s) => {
          const fixed = s.lastRunHadError && !hadError ? 1 : 0;
          return {
            lastRunHadError: hadError,
            progress: {
              ...s.progress,
              runCount: s.progress.runCount + 1,
              errorRuns: s.progress.errorRuns + (hadError ? 1 : 0),
              fixedErrors: s.progress.fixedErrors + fixed,
            },
          };
        }),

      recordConceptResult: (conceptId, correct) =>
        set((s) => {
          const prev = s.progress.concepts[conceptId] ?? initialConceptStats();
          const next = scheduleAfterAnswer(prev, correct);
          return { progress: { ...s.progress, concepts: { ...s.progress.concepts, [conceptId]: next } } };
        }),
      recordAssessmentAttempt: (assessmentId, attempt) =>
        set((s) => {
          const prev = s.progress.assessments[assessmentId] ?? { attempts: [], best: 0, passed: false };
          const next: AssessmentProgress = {
            attempts: [...prev.attempts, attempt].slice(-20),
            attemptCount: (prev.attemptCount ?? prev.attempts.length) + 1,
            best: Math.max(prev.best, attempt.score),
            passed: prev.passed || attempt.passed,
          };
          return { progress: { ...s.progress, assessments: { ...s.progress.assessments, [assessmentId]: next } } };
        }),
      markTestedOut: (moduleId) =>
        set((s) => {
          if (s.progress.testedOut.includes(moduleId)) return s;
          return { progress: { ...s.progress, testedOut: [...s.progress.testedOut, moduleId] } };
        }),

      saveProjectCode: (projectId, code) =>
        set((s) => {
          const prev = s.progress.projects[projectId] ?? { code: '', stepsDone: [], updatedAt: '' };
          if (prev.code === code) return s;
          return {
            progress: {
              ...s.progress,
              projects: { ...s.progress.projects, [projectId]: { ...prev, code, updatedAt: new Date().toISOString() } },
            },
          };
        }),
      markProjectStep: (projectId, stepId, totalSteps) =>
        set((s) => {
          const prev = s.progress.projects[projectId] ?? { code: '', stepsDone: [], updatedAt: '' };
          if (prev.stepsDone.includes(stepId)) return s;
          const stepsDone = [...prev.stepsDone, stepId];
          const completedAt = stepsDone.length >= totalSteps ? new Date().toISOString() : prev.completedAt;
          return {
            progress: {
              ...s.progress,
              projects: {
                ...s.progress.projects,
                [projectId]: { ...prev, stepsDone, completedAt, updatedAt: new Date().toISOString() },
              },
            },
          };
        }),
      resetProject: (projectId) =>
        set((s) => {
          const projects = { ...s.progress.projects };
          delete projects[projectId];
          return { progress: { ...s.progress, projects } };
        }),

      recordReviewSession: () => set((s) => ({ progress: { ...s.progress, reviewSessions: s.progress.reviewSessions + 1 } })),
      unlockAchievement: (id) => {
        const s = get();
        if (s.progress.achievements[id]) return false;
        set({ progress: { ...s.progress, achievements: { ...s.progress.achievements, [id]: new Date().toISOString() } } });
        return true;
      },

      importProgress: (data) => {
        if (!isProgressExport(data)) return false;
        set((s) => ({
          progress: migrateProgress(data.progress),
          settings: data.settings ? sanitizeSettings({ ...s.settings, ...data.settings }) : s.settings,
        }));
        return true;
      },
      resetProgress: () => set({ progress: emptyProgress(), lastRunHadError: false }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => safeStorage()),
      partialize: (s) => ({ settings: s.settings, progress: s.progress }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState>;
        return {
          ...current,
          settings: sanitizeSettings({ ...current.settings, ...(p.settings ?? {}) }),
          progress: migrateProgress(p.progress),
        };
      },
    },
  ),
);

/** localStorage can throw (private mode, disabled storage). Fall back to memory. */
function safeStorage(): Storage {
  try {
    const test = '__codepath_test__';
    window.localStorage.setItem(test, '1');
    window.localStorage.removeItem(test);
    return window.localStorage;
  } catch {
    const mem = new Map<string, string>();
    return {
      getItem: (k) => mem.get(k) ?? null,
      setItem: (k, v) => void mem.set(k, v),
      removeItem: (k) => void mem.delete(k),
      clear: () => mem.clear(),
      key: (i) => Array.from(mem.keys())[i] ?? null,
      get length() {
        return mem.size;
      },
    } as Storage;
  }
}

export function sanitizeSettings(s: Partial<Settings>): Settings {
  const merged = { ...DEFAULT_SETTINGS, ...s } as Settings & Record<string, unknown>;
  // Settings from older versions (e.g. the removed tutor-server fields) are dropped.
  delete merged.tutor;
  return {
    ...merged,
    language: isLangCode(merged.language) ? merged.language : DEFAULT_LANGUAGE,
    pace: PACES.includes(merged.pace) ? merged.pace : DEFAULT_SETTINGS.pace,
    lessonView: VIEWS.includes(merged.lessonView) ? merged.lessonView : DEFAULT_SETTINGS.lessonView,
    experience: EXPERIENCES.includes(merged.experience) ? merged.experience : DEFAULT_SETTINGS.experience,
    name: typeof merged.name === 'string' ? merged.name.slice(0, 40) : '',
  };
}

export interface ProgressExport {
  app: 'codepath';
  exportedAt: string;
  settings?: Partial<Settings>;
  progress: Progress;
}

export function isProgressExport(data: unknown): data is ProgressExport {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return d.app === 'codepath' && typeof d.progress === 'object' && d.progress !== null && 'lessons' in (d.progress as object);
}

export function buildProgressExport(): ProgressExport {
  const s = useStore.getState();
  return { app: 'codepath', exportedAt: new Date().toISOString(), settings: s.settings, progress: s.progress };
}

/* ---------------------------------------------------------------- selectors */

export function currentStreak(activeDays: string[], now = new Date()): number {
  const set = new Set(activeDays);
  let streak = 0;
  const cursor = new Date(now);
  // A streak counts today if active today, otherwise it counts back from yesterday.
  if (!set.has(todayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (set.has(todayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
