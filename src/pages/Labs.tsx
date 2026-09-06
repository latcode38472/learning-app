import { Link, useParams } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { Badge, useDocumentTitle } from '@/components/ui';
import { GradientDescentLab } from '@/labs/GradientDescentLab';
import { NeuronLab } from '@/labs/NeuronLab';
import { GridWorldLab } from '@/labs/GridWorldLab';

const LABS = [
  { id: 'gradient', stage: 5, titleKey: 'labs.gradient', descKey: 'labs.gradientDesc', Component: GradientDescentLab },
  { id: 'neuron', stage: 6, titleKey: 'labs.neuron', descKey: 'labs.neuronDesc', Component: NeuronLab },
  { id: 'agent', stage: 8, titleKey: 'labs.agent', descKey: 'labs.agentDesc', Component: GridWorldLab },
] as const;

export function LabsPage() {
  const { labId } = useParams();
  const { t } = useI18n();
  useDocumentTitle(t('labs.title'));
  const active = LABS.find((l) => l.id === labId) ?? LABS[0];
  return (
    <div className="stack" data-testid="labs">
      <div>
        <h1>{t('labs.title')}</h1>
        <p className="muted">{t('labs.intro')}</p>
      </div>
      <nav className="btn-row" aria-label={t('labs.title')}>
        {LABS.map((lab) => (
          <Link key={lab.id} to={`/labs/${lab.id}`} className={`btn btn-sm${lab.id === active.id ? ' btn-primary' : ''}`} aria-current={lab.id === active.id ? 'page' : undefined}>
            {t(lab.titleKey)}
          </Link>
        ))}
      </nav>
      <section className="card stack-sm" key={active.id}>
        <div className="section-head" style={{ marginBottom: 0 }}>
          <h2 style={{ margin: 0 }}>{t(active.titleKey)}</h2>
          <Badge tone="warning">{t('labs.plannedBadge', { n: active.stage })}</Badge>
        </div>
        <p className="muted">{t(active.descKey)}</p>
        <active.Component />
      </section>
    </div>
  );
}
