import { modules, stageById } from '@/content';
import type { Progress } from './store';
import { isModuleCompleted } from './unlock';

export interface AchievementDef {
  id: string;
  icon: string;
  /** i18n keys under `achievements` */
  titleKey: string;
  descKey: string;
  earned: (p: Progress) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first-run', icon: '▶', titleKey: 'firstRun', descKey: 'firstRunDesc', earned: (p) => p.runCount >= 1 },
  { id: 'first-fix', icon: '🐞', titleKey: 'firstFix', descKey: 'firstFixDesc', earned: (p) => p.fixedErrors >= 1 },
  { id: 'first-lesson', icon: '✓', titleKey: 'firstLesson', descKey: 'firstLessonDesc', earned: (p) => countCompleted(p) >= 1 },
  { id: 'five-lessons', icon: '5', titleKey: 'fiveLessons', descKey: 'fiveLessonsDesc', earned: (p) => countCompleted(p) >= 5 },
  {
    id: 'first-module',
    icon: '★',
    titleKey: 'firstModule',
    descKey: 'firstModuleDesc',
    earned: (p) => Object.values(p.assessments).some((a) => a.passed),
  },
  {
    id: 'first-project',
    icon: '🏗',
    titleKey: 'firstProject',
    descKey: 'firstProjectDesc',
    earned: (p) => Object.values(p.projects).some((pr) => !!pr.completedAt),
  },
  { id: 'twenty-five-runs', icon: '⚗', titleKey: 'tenRuns', descKey: 'tenRunsDesc', earned: (p) => p.runCount >= 25 },
  { id: 'three-days', icon: '📅', titleKey: 'threeDays', descKey: 'threeDaysDesc', earned: (p) => p.activeDays.length >= 3 },
  { id: 'tested-out', icon: '⤴', titleKey: 'testedOut', descKey: 'testedOutDesc', earned: (p) => p.testedOut.length >= 1 },
  { id: 'reviewer', icon: '↻', titleKey: 'reviewer', descKey: 'reviewerDesc', earned: (p) => p.reviewSessions >= 1 },
  {
    id: 'stage-1',
    icon: '🎓',
    titleKey: 'stage1',
    descKey: 'stage1Desc',
    earned: (p) => stageById['s1'].moduleIds.every((m) => isModuleCompleted(m, p)),
  },
];

function countCompleted(p: Progress): number {
  const available = new Set(modules.filter((m) => m.status === 'available').flatMap((m) => m.lessonIds));
  return Object.entries(p.lessons).filter(([id, l]) => available.has(id) && l.status === 'completed').length;
}

/** Returns ids of achievements that are earned but not yet recorded. */
export function newlyEarned(progress: Progress): string[] {
  return ACHIEVEMENTS.filter((a) => !progress.achievements[a.id] && a.earned(progress)).map((a) => a.id);
}
