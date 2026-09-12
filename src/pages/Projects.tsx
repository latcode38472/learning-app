import { Link } from 'react-router-dom';
import { allProjects, lessons, moduleById } from '@/content';
import { useI18n } from '@/i18n';
import { useStore } from '@/state/store';
import { availableStepCount, isProjectUnlocked, missingProjectPrerequisites } from '@/state/unlock';
import { Badge, ProgressBar, useDocumentTitle } from '@/components/ui';

export function ProjectsPage() {
  const { t, l } = useI18n();
  const progress = useStore((s) => s.progress);
  useDocumentTitle(t('projects.title'));
  return (
    <div className="stack" data-testid="projects">
      <div>
        <h1>{t('projects.title')}</h1>
        <p className="muted">{t('projects.intro')}</p>
      </div>
      <div className="grid">
        {allProjects.map((p) => {
          const unlocked = isProjectUnlocked(p, progress);
          const pp = progress.projects[p.id];
          const done = pp?.stepsDone.length ?? 0;
          const missing = missingProjectPrerequisites(p, progress).map((id) => lessons[id]).filter(Boolean);
          return (
            <section key={p.id} className="card stack-sm" data-testid={`project-card-${p.id}`}>
              <div className="small muted">{l(moduleById[p.moduleId]?.title ?? { en: p.moduleId })}</div>
              <h2 style={{ margin: 0 }}>{l(p.title)}</h2>
              <p className="muted" style={{ margin: 0 }}>
                {l(p.tagline)}
              </p>
              <div className="pill-row">
                <Badge>{t('projects.steps', { count: p.steps.length })}</Badge>
                <Badge>{t('curriculum.minutes', { count: p.estimatedMinutes })}</Badge>
                {p.growing && <Badge tone="info">{t('projects.growing')}</Badge>}
                {p.growing && unlocked && <Badge>{t('projects.stepsOpen', { open: availableStepCount(p, progress), total: p.steps.length })}</Badge>}
                {pp?.completedAt && <Badge tone="success">{t('projects.completed')}</Badge>}
              </div>
              {p.growing && <p className="small muted" style={{ margin: 0 }}>{t('projects.growingNote')}</p>}
              {pp && (
                <div>
                  <ProgressBar value={done} max={p.steps.length} label={t('projects.progress', { done, total: p.steps.length })} />
                  <div className="small muted">{t('projects.progress', { done, total: p.steps.length })}</div>
                </div>
              )}
              {unlocked ? (
                <Link to={`/project/${p.id}`} className="btn btn-primary">
                  {t('projects.open')}
                </Link>
              ) : (
                <p className="small muted" style={{ margin: 0 }}>
                  🔒 {t('projects.lockedNote', { lessons: missing.map((ls) => l(ls.title)).join(', ') })}
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
