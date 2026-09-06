import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';

export function NotFoundPage() {
  const { t } = useI18n();
  return (
    <div className="card" style={{ maxWidth: 520, margin: '2rem auto' }}>
      <h1>{t('common.notFound')}</h1>
      <p className="muted">{t('common.notFoundBody')}</p>
      <Link to="/" className="btn btn-primary">
        {t('common.goHome')}
      </Link>
    </div>
  );
}
