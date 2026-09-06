import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { useStore } from '@/state/store';
import { missingPrerequisites, moduleLessonsCompleted, moduleState, stageState, type ModuleState } from '@/state/unlock';
import { moduleById, stages } from '@/content';
import type { Module, Stage } from '@/content/schema';
import { Blocks } from '@/components/Blocks';
import { Badge, useDocumentTitle, type Tone } from '@/components/ui';

export function moduleStateLabel(state: ModuleState, t: (k: never) => string): { label: string; tone: Tone } {
  const tt = t as unknown as (k: string) => string;
  switch (state) {
    case 'completed':
      return { label: tt('curriculum.completed'), tone: 'success' };
    case 'tested-out':
      return { label: tt('curriculum.testedOut'), tone: 'success' };
    case 'in-progress':
      return { label: tt('curriculum.inProgress'), tone: 'primary' };
    case 'available':
      return { label: tt('curriculum.unlocked'), tone: 'info' };
    case 'planned':
      return { label: tt('curriculum.planned'), tone: 'neutral' };
    default:
      return { label: tt('curriculum.locked'), tone: 'warning' };
  }
}

export function CurriculumPage() {
  const { t, l } = useI18n();
  const progress = useStore((s) => s.progress);
  useDocumentTitle(t('curriculum.title'));
  const [open, setOpen] = useState<Record<string, boolean>>({ s1: true });

  return (
    <div className="stack" data-testid="curriculum">
      <div>
        <h1>{t('curriculum.title')}</h1>
        <p className="muted">{t('curriculum.intro')}</p>
        <div className="btn-row">
          <Link to="/placement" className="btn">
            {t('nav.placement')}
          </Link>
        </div>
      </div>
      {stages.map((stage) => (
        <StageCard key={stage.id} stage={stage} open={!!open[stage.id]} onToggle={() => setOpen((o) => ({ ...o, [stage.id]: !o[stage.id] }))} />
      ))}
    </div>
  );

  function StageCard({ stage, open, onToggle }: { stage: Stage; open: boolean; onToggle: () => void }) {
    const st = stageState(stage, progress);
    const tone: Tone = st === 'completed' ? 'success' : st === 'available' ? 'info' : st === 'partial' ? 'primary' : st === 'planned' ? 'neutral' : 'warning';
    const label =
      st === 'completed' ? t('curriculum.completed') : st === 'available' ? t('curriculum.available') : st === 'partial' ? t('curriculum.partial') : st === 'planned' ? t('curriculum.planned') : t('curriculum.locked');
    const compute = stage.compute === 'browser' ? t('curriculum.computeBrowser') : stage.compute === 'cloud' ? t('curriculum.computeCloud') : t('curriculum.computeLocal');
    return (
      <section className="stage-card" data-testid={`stage-${stage.id}`}>
        <button type="button" className="stage-head" onClick={onToggle} aria-expanded={open}>
          <span className={`stage-number${stage.status === 'planned' ? ' planned' : ''}`}>{stage.number}</span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontWeight: 700, fontSize: '1.05rem' }}>
              {t('curriculum.stage', { number: stage.number })}: {l(stage.title)}
            </span>
            <span className="small muted">{l(stage.summary)}</span>
          </span>
          <Badge tone={tone}>{label}</Badge>
          <span aria-hidden="true">{open ? '▾' : '▸'}</span>
        </button>
        {open && (
          <div className="stage-body stack-sm">
            <Blocks blocks={stage.description} />
            <div className="pill-row">
              <Badge>{compute}</Badge>
            </div>
            <p className="small">
              <strong>{t('curriculum.howToUnlock')}:</strong> {l(stage.unlockNote)}
            </p>
            <div>
              {stage.moduleIds.map((mid) => (
                <ModuleRow key={mid} mod={moduleById[mid]} />
              ))}
            </div>
          </div>
        )}
      </section>
    );
  }

  function ModuleRow({ mod }: { mod: Module }) {
    const state = moduleState(mod.id, progress);
    const { label, tone } = moduleStateLabel(state, t as never);
    const done = moduleLessonsCompleted(mod, progress);
    const missing = missingPrerequisites(mod.id, progress);
    const [showPlanned, setShowPlanned] = useState(false);
    return (
      <div className="module-row" data-testid={`module-${mod.id}`}>
        <span className={`module-state${state === 'completed' || state === 'tested-out' ? ' done' : state === 'in-progress' || state === 'available' ? ' active' : ''}`} aria-hidden="true">
          {state === 'completed' || state === 'tested-out' ? '✓' : state === 'locked' || state === 'planned' ? '🔒' : '•'}
        </span>
        <div>
          <div style={{ fontWeight: 700 }}>{l(mod.title)}</div>
          <div className="small muted">{l(mod.description)}</div>
          <div className="pill-row" style={{ marginTop: '0.3rem' }}>
            <Badge tone={tone}>{label}</Badge>
            {mod.status === 'available' && <Badge>{t('curriculum.lessons', { count: mod.lessonIds.length })}{done > 0 ? ` · ${done}/${mod.lessonIds.length}` : ''}</Badge>}
            {mod.prerequisites.length > 0 && (
              <Badge>
                {t('curriculum.prerequisites')}: {mod.prerequisites.map((p) => l(moduleById[p]?.title ?? { en: p })).join(', ')}
              </Badge>
            )}
          </div>
          {state === 'locked' && missing.length > 0 && (
            <p className="small" style={{ margin: '0.3rem 0 0' }}>
              <strong>{t('curriculum.whyLocked')}</strong> {t('curriculum.unlockByCompleting', { modules: missing.map((m) => l(m.title)).join(', ') })}
            </p>
          )}
          {state === 'planned' && (
            <div className="small" style={{ marginTop: '0.3rem' }}>
              <p style={{ margin: 0 }}>{t('curriculum.unlockPlanned')}</p>
              {mod.plannedLessons && (
                <>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowPlanned((s) => !s)} aria-expanded={showPlanned}>
                    {t('curriculum.plannedLessons')} ({mod.plannedLessons.length})
                  </button>
                  {showPlanned && (
                    <ul>
                      {mod.plannedLessons.map((pl, i) => (
                        <li key={i}>{l(pl)}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <div>
          {mod.status === 'available' && (
            <Link to={`/module/${mod.id}`} className="btn btn-sm">
              {t('curriculum.viewModule')}
            </Link>
          )}
        </div>
      </div>
    );
  }
}
