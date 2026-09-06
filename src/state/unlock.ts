/**
 * Prerequisite and unlock logic.
 *
 * Rules (also explained to learners in the curriculum map):
 *  - The first module of Stage 1 is always open.
 *  - A module opens when every prerequisite module is completed or tested out.
 *  - A module is completed when all its lessons are completed and its module
 *    test (if it has one) is passed.
 *  - Inside a module, a lesson opens when the previous lesson is completed.
 *    Testing out of a module opens every lesson in it.
 *  - Planned modules (no lessons written yet) never open; the UI says why.
 *  - A project opens when its prerequisite lessons are completed (or the
 *    module is tested out).
 */
import type { Module, Project, Stage } from '@/content/schema';
import { lessons, moduleById, modules, stageById, lessonOrder } from '@/content';
import type { Progress } from './store';

export type ModuleState = 'planned' | 'locked' | 'available' | 'in-progress' | 'completed' | 'tested-out';

export function isTestedOut(moduleId: string, progress: Progress): boolean {
  return progress.testedOut.includes(moduleId);
}

export function isLessonCompleted(lessonId: string, progress: Progress): boolean {
  return progress.lessons[lessonId]?.status === 'completed';
}

export function moduleLessonsCompleted(mod: Module, progress: Progress): number {
  return mod.lessonIds.filter((id) => isLessonCompleted(id, progress)).length;
}

export function isModuleTestPassed(mod: Module, progress: Progress): boolean {
  if (!mod.testId) return true;
  return progress.assessments[mod.testId]?.passed === true;
}

export function isModuleCompleted(moduleId: string, progress: Progress): boolean {
  const mod = moduleById[moduleId];
  if (!mod) return false;
  if (isTestedOut(moduleId, progress)) return true;
  if (mod.status !== 'available' || mod.lessonIds.length === 0) return false;
  const allLessons = mod.lessonIds.every((id) => isLessonCompleted(id, progress));
  return allLessons && isModuleTestPassed(mod, progress);
}

export function isModuleUnlocked(moduleId: string, progress: Progress): boolean {
  const mod = moduleById[moduleId];
  if (!mod) return false;
  if (mod.status !== 'available') return false;
  return mod.prerequisites.every((p) => isModuleCompleted(p, progress));
}

/** Modules that still block this module. */
export function missingPrerequisites(moduleId: string, progress: Progress): Module[] {
  const mod = moduleById[moduleId];
  if (!mod) return [];
  return mod.prerequisites.filter((p) => !isModuleCompleted(p, progress)).map((p) => moduleById[p]).filter(Boolean);
}

export function moduleState(moduleId: string, progress: Progress): ModuleState {
  const mod = moduleById[moduleId];
  if (!mod) return 'locked';
  if (mod.status !== 'available') return 'planned';
  if (isTestedOut(moduleId, progress)) return 'tested-out';
  if (isModuleCompleted(moduleId, progress)) return 'completed';
  if (!isModuleUnlocked(moduleId, progress)) return 'locked';
  const started = mod.lessonIds.some((id) => progress.lessons[id]);
  return started ? 'in-progress' : 'available';
}

export function isLessonUnlocked(lessonId: string, progress: Progress): boolean {
  const lesson = lessons[lessonId];
  if (!lesson) return false;
  const mod = moduleById[lesson.moduleId];
  if (!mod) return false;
  if (!isModuleUnlocked(mod.id, progress) && !isTestedOut(mod.id, progress)) return false;
  if (isTestedOut(mod.id, progress)) return true;
  const idx = mod.lessonIds.indexOf(lessonId);
  if (idx <= 0) return true;
  return isLessonCompleted(mod.lessonIds[idx - 1], progress);
}

/** The lesson that must be completed before this one opens (if any). */
export function lessonBlockedBy(lessonId: string, progress: Progress): string | undefined {
  const lesson = lessons[lessonId];
  if (!lesson) return undefined;
  const mod = moduleById[lesson.moduleId];
  if (!mod) return undefined;
  const idx = mod.lessonIds.indexOf(lessonId);
  for (let i = idx - 1; i >= 0; i -= 1) {
    if (!isLessonCompleted(mod.lessonIds[i], progress)) return mod.lessonIds[i];
  }
  return undefined;
}

/** Whether the module test can be taken now (all lessons done, or as a test-out of an unlocked module). */
export function canTakeModuleTest(moduleId: string, progress: Progress): boolean {
  const mod = moduleById[moduleId];
  if (!mod?.testId) return false;
  return isModuleUnlocked(moduleId, progress) || isTestedOut(moduleId, progress);
}

export function allLessonsDone(moduleId: string, progress: Progress): boolean {
  const mod = moduleById[moduleId];
  return !!mod && mod.lessonIds.length > 0 && mod.lessonIds.every((id) => isLessonCompleted(id, progress));
}

export function isProjectUnlocked(project: Project, progress: Progress): boolean {
  if (isTestedOut(project.moduleId, progress)) return true;
  return project.prerequisites.every((id) => isLessonCompleted(id, progress));
}

export type StageState = 'available' | 'partial' | 'planned' | 'locked' | 'completed';

export function stageState(stage: Stage, progress: Progress): StageState {
  const mods = stage.moduleIds.map((id) => moduleById[id]).filter(Boolean);
  if (mods.every((m) => isModuleCompleted(m.id, progress))) return 'completed';
  if (stage.status === 'planned') return 'planned';
  if (mods.some((m) => isModuleUnlocked(m.id, progress))) return stage.status === 'partial' ? 'partial' : 'available';
  return 'locked';
}

/** The lesson the learner should do next: first unlocked, not-completed lesson in order. */
export function nextRecommendedLesson(progress: Progress): string | undefined {
  for (const id of lessonOrder) {
    if (!isLessonCompleted(id, progress) && isLessonUnlocked(id, progress)) return id;
  }
  return undefined;
}

export function stage1Summary(progress: Progress): { done: number; total: number } {
  const s1 = stageById['s1'];
  const total = s1.moduleIds.flatMap((m) => moduleById[m]?.lessonIds ?? []).length;
  const done = s1.moduleIds.flatMap((m) => moduleById[m]?.lessonIds ?? []).filter((id) => isLessonCompleted(id, progress)).length;
  return { done, total };
}

export function completedModuleCount(progress: Progress): number {
  return modules.filter((m) => m.status === 'available' && isModuleCompleted(m.id, progress)).length;
}
