import { Link, useParams } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { useStore } from '@/state/store';
import { allLessonsDone, canTakeModuleTest, isLessonCompleted, isLessonUnlocked, isProjectUnlocked, isTestedOut, missingPrerequisites, moduleState } from '@/state/unlock';
import { assessments, lessonsOfModule, moduleById, projectsOfModule, stageOfModule } from '@/content';
import { Badge, Notice, ProgressBar, useDocumentTitle } from '@/components/ui';
import { moduleStateLabel } from './Curriculum';
import { NotFoundPage } from './NotFound';

export function ModulePage() {
  const { moduleId = '' } = useParams();
  const { t, l } = useI18n();
  const progress = useStore((s) => s.progress);
  const mod = moduleById[moduleId];
  useDocumentTitle(mod ? l(mod.title) : t('common.notFound'));
  if (!mod || mod.status !== 'available') return <NotFoundPage />;

  const stage = stageOfModule(mod.id);
  const state = moduleState(mod.id, progress);
  const { label, tone } = moduleStateLabel(state, t as never);
  const lessonList = lessonsOfModule(mod.id);
  const done = lessonList.filter((ls) => isLessonCompleted(ls.id, progress)).length;
  const missing = missingPrerequisites(mod.id, progress);
  const test = mod.testId ? assessments[mod.testId] : undefined;
  const testProgress = mod.testId ? progress.assessments[mod.testId] : undefined;
  const projects = projectsOfModule(mod.id);

  return (
    <div className="stack" data-testid={`module-page-${mod.id}`}>
      <div>
        <div className="small muted">
          <Link to="/curriculum">{t('nav.curriculum')}</Link>
          {stage && <> · {t('curriculum.stage', { number: stage.number })}: {l(stage.title)}</>}
        </div>
        <h1>{l(mod.title)}</h1>
        <p className="muted">{l(mod.description)}</p>
        <div className="pill-row">
          <Badge tone={tone}>{label}</Badge>
          <Badge>{t('curriculum.lessons', { count: lessonList.length })}</Badge>
        </div>
        <div style={{ marginTop: '0.6rem', maxWidth: 480 }}>
          <ProgressBar value={done} max={lessonList.length} label={t('home.lessonsDone', { done, total: lessonList.length })} />
          <div className="small muted">{t('home.lessonsDone', { done, total: lessonList.length })}</div>
        </div>
      </div>

      {state === 'locked' && (
        <Notice tone="warning" title={t('curriculum.whyLocked')}>
          {t('curriculum.unlockByCompleting', { modules: missing.map((m) => l(m.title)).join(', ') })}{' '}
          <Link to="/placement">{t('curriculum.testOut')}</Link>
        </Notice>
      )}

      <section className="card stack-sm">
        <h2>{t('curriculum.lessons', { count: lessonList.length })}</h2>
        <ol className="lesson-list">
          {lessonList.map((ls, i) => {
            const unlocked = isLessonUnlocked(ls.id, progress);
            const completed = isLessonCompleted(ls.id, progress);
            const startedLesson = !!progress.lessons[ls.id];
            return (
              <li key={ls.id} className={`lesson-row${unlocked ? '' : ' locked'}`} data-testid={`lesson-row-${ls.id}`}>
                <span className={`module-state${completed ? ' done' : unlocked ? ' active' : ''}`} aria-hidden="true">
                  {completed ? '✓' : unlocked ? i + 1 : '🔒'}
                </span>
                <div className="grow">
                  <div className="title">{l(ls.title)}</div>
                  <div className="small muted">
                    {l(ls.tagline)} · {t('curriculum.minutes', { count: ls.estimatedMinutes })}
                  </div>
                </div>
                {unlocked ? (
                  <Link to={`/lesson/${ls.id}`} className={`btn btn-sm${completed ? '' : ' btn-primary'}`}>
                    {completed ? t('curriculum.reviewLesson') : startedLesson ? t('curriculum.continueLesson') : t('curriculum.startLesson')}
                  </Link>
                ) : (
                  <Badge>{t('curriculum.locked')}</Badge>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {test && (
        <section className="card stack-sm" data-testid="module-test-card">
          <h2>{t('curriculum.moduleTest')}: {l(test.title)}</h2>
          <div className="pill-row">
            <Badge>{t('quiz.timeEstimate', { minutes: test.estimatedMinutes })}</Badge>
            <Badge>{t('quiz.passMark', { score: Math.round(test.passScore * 100) })}</Badge>
            {testProgress?.passed && <Badge tone="success">{t('quiz.passed')}</Badge>}
            {testProgress && !testProgress.passed && testProgress.attempts.length > 0 && <Badge tone="warning">{t('quiz.bestScore', { score: Math.round(testProgress.best * 100) })}</Badge>}
            {isTestedOut(mod.id, progress) && <Badge tone="success">{t('curriculum.testedOut')}</Badge>}
          </div>
          {canTakeModuleTest(mod.id, progress) ? (
            <div className="btn-row">
              <Link to={`/assessment/${test.id}`} className="btn btn-primary" data-testid="take-test">
                {testProgress?.passed ? t('curriculum.retakeTest') : allLessonsDone(mod.id, progress) ? t('curriculum.takeTest') : t('curriculum.testOut')}
              </Link>
            </div>
          ) : (
            <p className="small muted">{t('placement.lockedUntil')}</p>
          )}
        </section>
      )}

      {projects.length > 0 && (
        <section className="card stack-sm">
          <h2>{t('nav.projects')}</h2>
          <ul className="lesson-list">
            {projects.map((p) => {
              const unlocked = isProjectUnlocked(p, progress);
              return (
                <li key={p.id} className={`lesson-row${unlocked ? '' : ' locked'}`}>
                  <div className="grow">
                    <div className="title">{l(p.title)}</div>
                    <div className="small muted">{l(p.tagline)}</div>
                  </div>
                  {unlocked ? (
                    <Link to={`/project/${p.id}`} className="btn btn-sm">
                      {t('projects.open')}
                    </Link>
                  ) : (
                    <Badge>{t('projects.locked')}</Badge>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
