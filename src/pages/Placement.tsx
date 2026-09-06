import { Link } from 'react-router-dom';
import { modules } from '@/content';
import { useI18n } from '@/i18n';
import { useStore } from '@/state/store';
import { canTakeModuleTest, isModuleCompleted, isTestedOut, moduleState } from '@/state/unlock';
import { Badge, Notice, useDocumentTitle } from '@/components/ui';

export function PlacementPage() {
  const { t, l } = useI18n();
  const progress = useStore((s) => s.progress);
  useDocumentTitle(t('placement.title'));
  const available = modules.filter((m) => m.status === 'available');
  const recommended = available.find((m) => !isModuleCompleted(m.id, progress));

  return (
    <div className="stack" data-testid="placement">
      <div>
        <h1>{t('placement.title')}</h1>
        <p className="muted">{t('placement.intro')}</p>
      </div>
      {recommended && (
        <Notice tone="info">
          {t('placement.recommend', { module: l(recommended.title) })}{' '}
          <Link to={`/module/${recommended.id}`} className="btn btn-sm btn-primary">
            {t('placement.startHere')}
          </Link>
        </Notice>
      )}
      <ol className="lesson-list">
        {available.map((m, i) => {
          const state = moduleState(m.id, progress);
          const testedOut = isTestedOut(m.id, progress);
          const done = isModuleCompleted(m.id, progress);
          const can = canTakeModuleTest(m.id, progress) && !done;
          return (
            <li key={m.id} className="lesson-row" data-testid={`placement-${m.id}`}>
              <span className={`module-state${done ? ' done' : can ? ' active' : ''}`} aria-hidden="true">
                {done ? '✓' : i + 1}
              </span>
              <div className="grow">
                <div className="title">{t('placement.moduleStatus', { n: i + 1, title: l(m.title) })}</div>
                <div className="small muted">{l(m.description)}</div>
              </div>
              {testedOut ? (
                <Badge tone="success">{t('placement.done')}</Badge>
              ) : done ? (
                <Badge tone="success">{t('placement.completed')}</Badge>
              ) : can && m.testId ? (
                <Link to={`/assessment/${m.testId}?from=placement`} className="btn btn-sm btn-primary">
                  {t('placement.testOut')}
                </Link>
              ) : (
                <Badge>{state === 'locked' ? t('placement.lockedUntil') : t('curriculum.locked')}</Badge>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
