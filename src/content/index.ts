/**
 * Content registry.
 *
 * Lessons, module tests, glossaries, projects and assessments are discovered
 * automatically from the file system, so adding a lesson means adding one file
 * under src/content/lessons/<module>/ and listing its id in curriculum.ts.
 */
import type { Assessment, Concept, GlossaryEntry, Lesson, Module, Project, Stage } from './schema';
import { stages, modules } from './curriculum';
import { conceptMap, conceptLessonOrder, conceptToLesson, conceptsKnownAt } from './concepts';

const lessonFiles = import.meta.glob<{ lesson: Lesson }>('./lessons/m*/l*.ts', { eager: true });
const testFiles = import.meta.glob<{ test: Assessment }>('./lessons/m*/test.ts', { eager: true });
const glossaryFiles = import.meta.glob<{ glossary: GlossaryEntry[] }>('./lessons/m*/glossary.ts', { eager: true });
const projectFiles = import.meta.glob<{ project: Project }>('./projects/*.ts', { eager: true });
const assessmentFiles = import.meta.glob<{ assessment: Assessment }>('./assessments/*.ts', { eager: true });

export const lessons: Record<string, Lesson> = {};
for (const mod of Object.values(lessonFiles)) {
  if (mod.lesson) lessons[mod.lesson.id] = mod.lesson;
}

export const assessments: Record<string, Assessment> = {};
for (const mod of Object.values(testFiles)) {
  if (mod.test) assessments[mod.test.id] = mod.test;
}
for (const mod of Object.values(assessmentFiles)) {
  if (mod.assessment) assessments[mod.assessment.id] = mod.assessment;
}

export const projects: Record<string, Project> = {};
for (const mod of Object.values(projectFiles)) {
  if (mod.project) projects[mod.project.id] = mod.project;
}

export const glossary: GlossaryEntry[] = Object.values(glossaryFiles)
  .flatMap((mod) => mod.glossary ?? [])
  .sort((a, b) => a.term.localeCompare(b.term));

export const glossaryById: Record<string, GlossaryEntry> = Object.fromEntries(glossary.map((g) => [g.id, g]));

export { stages, modules };

export const moduleById: Record<string, Module> = Object.fromEntries(modules.map((m) => [m.id, m]));
export const stageById: Record<string, Stage> = Object.fromEntries(stages.map((s) => [s.id, s]));

/** All lesson ids in curriculum order (available modules only). */
export const lessonOrder: string[] = modules
  .filter((m) => m.status === 'available')
  .flatMap((m) => m.lessonIds)
  .filter((id) => id in lessons);

export function lessonsOfModule(moduleId: string): Lesson[] {
  const mod = moduleById[moduleId];
  if (!mod) return [];
  return mod.lessonIds.map((id) => lessons[id]).filter(Boolean);
}

export function projectsOfModule(moduleId: string): Project[] {
  const mod = moduleById[moduleId];
  if (!mod?.projectIds) return [];
  return mod.projectIds.map((id) => projects[id]).filter(Boolean);
}

export function stageOfModule(moduleId: string): Stage | undefined {
  const mod = moduleById[moduleId];
  return mod ? stageById[mod.stageId] : undefined;
}

export function nextLessonId(lessonId: string): string | undefined {
  const i = lessonOrder.indexOf(lessonId);
  return i >= 0 ? lessonOrder[i + 1] : undefined;
}

export function previousLessonId(lessonId: string): string | undefined {
  const i = lessonOrder.indexOf(lessonId);
  return i > 0 ? lessonOrder[i - 1] : undefined;
}

/** Concept ids with the lesson that introduces them, in curriculum order. */
export const concepts: Concept[] = conceptLessonOrder.flatMap((id) =>
  (conceptMap[id] ?? []).map((c) => ({ id: c, name: lessons[id]?.title ?? { en: id }, lessonId: id })),
);

export { conceptToLesson, conceptMap, conceptLessonOrder, conceptsKnownAt };

export const allProjects: Project[] = modules
  .flatMap((m) => m.projectIds ?? [])
  .map((id) => projects[id])
  .filter(Boolean);
