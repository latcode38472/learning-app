/**
 * Application state: settings + learning progress.
 *
 * Everything is stored in the browser (localStorage) under a versioned key.
 * No account, no server, no personal data beyond an optional display name.
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
  tutor: {
    remoteEnabled: boolean;
    endpoint: string;
    costAcknowledged: boolean;
  };
}

export interface LessonProgress {
  status: 'started' | 'completed';
  startedAt: string;
  completedAt?: string;
  predictDone?: boolean;
  checkDone?: boolean;
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
  best: number;
  passed: boolean;
}

export interface ProjectProgress {
  code: string;
  stepsDone: string[];
  updatedAt: string;
  completedAt?: string;
}

export interface Progress {
  version: 1;
  lessons: Record<string, LessonProgress>;
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
  tutor: { remoteEnabled: false, endpoint: '', costAcknowledged: false },
};

export function emptyProgress(): Progress {
  return {
    version: 1,
    lessons: {},
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

export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

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
  markCheckDone: (lessonId: string) => void;

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
          progress: {
            ...s.progress,
            lessons: {
              ...s.progress.lessons,
              [lessonId]: { ...(s.progress.lessons[lessonId] ?? { status: 'started', startedAt: new Date().toISOString() }), predictDone: true },
            },
          },
        })),
      markCheckDone: (lessonId) =>
        set((s) => ({
          progress: {
            ...s.progress,
            lessons: {
              ...s.progress.lessons,
              [lessonId]: { ...(s.progress.lessons[lessonId] ?? { status: 'started', startedAt: new Date().toISOString() }), checkDone: true },
            },
          },
        })),

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
          progress: { ...emptyProgress(), ...data.progress, version: 1 },
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
          progress: { ...emptyProgress(), ...(p.progress ?? {}) },
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

function sanitizeSettings(s: Settings): Settings {
  return {
    ...DEFAULT_SETTINGS,
    ...s,
    language: isLangCode(s.language) ? s.language : DEFAULT_LANGUAGE,
    tutor: { ...DEFAULT_SETTINGS.tutor, ...(s.tutor ?? {}) },
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
