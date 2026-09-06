import { useI18n } from '@/i18n';
import { useStore, currentStreak } from '@/state/store';
import { ACHIEVEMENTS } from '@/state/achievements';
import { Badge, useDocumentTitle } from '@/components/ui';

export function AchievementsPage() {
  const { t } = useI18n();
  const progress = useStore((s) => s.progress);
  useDocumentTitle(t('achievements.title'));
  const streak = currentStreak(progress.activeDays);
  return (
    <div className="stack" data-testid="achievements">
      <div>
        <h1>{t('achievements.title')}</h1>
        <p className="muted">{t('achievements.intro')}</p>
        <div className="pill-row">
          <Badge tone="info">{t('home.activeDays', { count: progress.activeDays.length })}</Badge>
          <Badge tone={streak > 0 ? 'success' : 'neutral'}>{t('home.streak', { count: streak })}</Badge>
        </div>
        <p className="small muted">{t('home.streakNote')}</p>
      </div>
      <ul className="grid" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {ACHIEVEMENTS.map((a) => {
          const at = progress.achievements[a.id];
          return (
            <li key={a.id} className="card" style={{ opacity: at ? 1 : 0.7 }} data-testid={`achievement-${a.id}`}>
              <div style={{ fontSize: '1.6rem' }} aria-hidden="true">
                {a.icon}
              </div>
              <strong>{t(`achievements.${a.titleKey}` as never)}</strong>
              <p className="small muted" style={{ margin: '0.2rem 0 0.4rem' }}>
                {t(`achievements.${a.descKey}` as never)}
              </p>
              <Badge tone={at ? 'success' : 'neutral'}>{at ? `${t('achievements.earned')} · ${new Date(at).toLocaleDateString()}` : t('achievements.locked')}</Badge>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
