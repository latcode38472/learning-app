import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { useStore, currentStreak } from '@/state/store';
import { availableStepCount, dueConceptIds, isLessonCompleted, isLessonUnlocked, isProjectUnlocked, nextRecommendedLesson, stage1Summary } from '@/state/unlock';
import { ACHIEVEMENTS } from '@/state/achievements';
import { allProjects, lessons, moduleById, projects } from '@/content';
import { Badge, ProgressBar, useDocumentTitle } from '@/components/ui';

export function HomePage() {
  const { t, l } = useI18n();
  const settings = useStore((s) => s.settings);
  const progress = useStore((s) => s.progress);
  useDocumentTitle(t('nav.home'));

  const nextId = nextRecommendedLesson(progress);
  const next = nextId ? lessons[nextId] : undefined;
  const last = progress.lastLocation;
  const lastLesson = last?.path.startsWith('/lesson/') ? lessons[last.path.slice('/lesson/'.length)] : undefined;
  const lastProject = last?.path.startsWith('/project/') ? projects[last.path.slice('/project/'.length)] : undefined;
  const resumeLesson = lastLesson && !isLessonCompleted(lastLesson.id, progress) && isLessonUnlocked(lastLesson.id, progress) ? lastLesson : undefined;
  const resumeProject = !resumeLesson && lastProject && isProjectUnlocked(lastProject, progress) && !progress.projects[lastProject.id]?.completedAt ? lastProject : undefined;
  const resumeTarget = resumeLesson ? `/lesson/${resumeLesson.id}` : resumeProject ? `/project/${resumeProject.id}` : next ? `/lesson/${next.id}` : '/curriculum';
  const resumeLabel = resumeLesson ? l(resumeLesson.title) : resumeProject ? l(resumeProject.title) : next ? l(next.title) : t('nav.curriculum');
  const summary = stage1Summary(progress);
  const started = Object.keys(progress.lessons).length > 0 || progress.testedOut.length > 0;
  const due = dueConceptIds(progress).length;
  const streak = currentStreak(progress.activeDays);
  const recent = Object.entries(progress.achievements)
    .sort((a, b) => b[1].localeCompare(a[1]))
    .slice(0, 4)
    .map(([id]) => ACHIEVEMENTS.find((a) => a.id === id))
    .filter(Boolean);

  return (
    <div className="stack" data-testid="home">
      <div>
        <h1>{settings.name ? t('home.greeting', { name: settings.name }) : t('home.greetingAnonymous')}</h1>
        <p className="muted">{t('app.tagline')}</p>
      </div>

      <div className="grid-2">
        <section className="card stack-sm" aria-labelledby="home-continue">
          <h2 id="home-continue">{started ? t('home.continueTitle') : t('home.startTitle')}</h2>
          <p>
            <strong>{resumeLabel}</strong>
            {resumeLesson && (
              <span className="muted small">
                {' '}
                · {l(moduleById[resumeLesson.moduleId]?.title ?? { en: '' })}
              </span>
            )}
          </p>
          <div className="btn-row">
            <Link to={resumeTarget} className="btn btn-primary btn-lg" data-testid="home-resume">
              {started ? t('home.resume') : t('curriculum.startLesson')}
            </Link>
            <Link to="/curriculum" className="btn">
              {t('nav.curriculum')}
            </Link>
          </div>
        </section>

        <section className="card stack-sm" aria-labelledby="home-progress">
          <h2 id="home-progress">{t('home.yourProgress')}</h2>
          <div>
            <div className="small muted">{t('home.stage1Progress')}</div>
            <ProgressBar value={summary.done} max={summary.total} label={t('home.stage1Progress')} />
            <div className="small">{t('home.lessonsDone', { done: summary.done, total: summary.total })}</div>
          </div>
          <div className="pill-row">
            <Badge tone="info">{t('home.activeDays', { count: progress.activeDays.length })}</Badge>
            <Badge tone={streak > 0 ? 'success' : 'neutral'}>{t('home.streak', { count: streak })}</Badge>
          </div>
          <p className="small muted" style={{ margin: 0 }}>
            {t('home.streakNote')}
          </p>
          <div>
            {due > 0 ? (
              <p style={{ margin: 0 }}>
                {t('home.dueReview', { count: due })}{' '}
                <Link to="/review" className="btn btn-sm">
                  {t('home.goReview')}
                </Link>
              </p>
            ) : (
              <p className="small muted" style={{ margin: 0 }}>
                {t('home.noReview')}
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="card stack-sm" aria-labelledby="home-how">
        <h2 id="home-how">{t('home.howItWorks')}</h2>
        <ol className="grid" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[t('home.stepLearn'), t('home.stepBuild'), t('home.stepProve'), t('home.stepGrow')].map((s, i) => (
            <li key={i} className="card-soft" style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <span className="section-num">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="card stack-sm" aria-labelledby="home-projects">
        <h2 id="home-projects">{t('home.projectsTitle')}</h2>
        <ul className="lesson-list">
          {allProjects.map((p) => {
            const unlocked = isProjectUnlocked(p, progress);
            const pp = progress.projects[p.id];
            return (
              <li key={p.id} className={`lesson-row${unlocked ? '' : ' locked'}`}>
                <div className="grow">
                  <div className="title">{l(p.title)}</div>
                  <div className="small muted">{l(p.tagline)}</div>
                </div>
                {p.growing && unlocked && !pp?.completedAt && <Badge tone="info">{t('projects.stepsOpen', { open: availableStepCount(p, progress), total: p.steps.length })}</Badge>}
                {pp?.completedAt ? <Badge tone="success">{t('projects.completed')}</Badge> : unlocked ? null : <Badge>{t('projects.locked')}</Badge>}
                {unlocked && (
                  <Link to={`/project/${p.id}`} className="btn btn-sm">
                    {t('projects.open')}
                  </Link>
                )}
              </li>
            );
          })}
          {allProjects.length === 0 && <li className="muted small">—</li>}
        </ul>
      </section>

      {recent.length > 0 && (
        <section className="card stack-sm" aria-labelledby="home-ach">
          <h2 id="home-ach">{t('home.recentAchievements')}</h2>
          <div className="pill-row">
            {recent.map((a) => (
              <Badge key={a!.id} tone="accent">
                {a!.icon} {t(`achievements.${a!.titleKey}` as never)}
              </Badge>
            ))}
            <Link to="/achievements" className="btn btn-sm btn-ghost">
              {t('nav.achievements')}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
