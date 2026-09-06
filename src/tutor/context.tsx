/**
 * What the tutor knows about the learner's current situation.
 * Pages and exercise panels publish into this store; the tutor reads it.
 */
import { create } from 'zustand';
import type { GradeResult, PythonError } from '@/runtime/runner';

export interface TutorSituation {
  lessonId?: string;
  lessonTitle?: string;
  lessonObjective?: string;
  /** Concept ids introduced by this lesson and earlier ones. */
  learnedConcepts: string[];
  exerciseTitle?: string;
  currentCode?: string;
  lastError?: PythonError | null;
  lastGrade?: GradeResult | null;
  hints?: string[];
  hintsUsed?: number;
  examMode: boolean;
}

interface TutorStore {
  situation: TutorSituation;
  set: (patch: Partial<TutorSituation>) => void;
  reset: () => void;
}

const empty: TutorSituation = { learnedConcepts: [], examMode: false };

export const useTutorStore = create<TutorStore>((set) => ({
  situation: empty,
  set: (patch) => set((s) => ({ situation: { ...s.situation, ...patch } })),
  reset: () => set({ situation: empty }),
}));

export function setTutorContext(patch: Partial<TutorSituation>) {
  useTutorStore.getState().set(patch);
}

export function resetTutorContext() {
  useTutorStore.getState().reset();
}
