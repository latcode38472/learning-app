import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { glossary, lessons } from '@/content';
import { useI18n } from '@/i18n';
import { Inline } from '@/components/InlineText';
import { useDocumentTitle } from '@/components/ui';

export function GlossaryPage() {
  const { t, l } = useI18n();
  const [query, setQuery] = useState('');
  useDocumentTitle(t('glossary.title'));

  const entries = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = glossary.filter((g) => {
      if (!q) return true;
      return g.term.toLowerCase().includes(q) || (l(g.name) || '').toLowerCase().includes(q) || l(g.definition).toLowerCase().includes(q);
    });
    return list.sort((a, b) => (l(a.name) || a.term).localeCompare(l(b.name) || b.term));
  }, [query, l]);

  return (
    <div className="stack" data-testid="glossary">
      <div>
        <h1>{t('glossary.title')}</h1>
        <p className="muted">{t('glossary.intro')}</p>
        <div className="field" style={{ maxWidth: 420 }}>
          <label htmlFor="glossary-search">{t('glossary.search')}</label>
          <input id="glossary-search" type="text" value={query} onChange={(e) => setQuery(e.target.value)} data-testid="glossary-search" />
        </div>
      </div>
      {entries.length === 0 && <p className="muted">{t('glossary.noResults')}</p>}
      <dl className="grid" style={{ margin: 0 }}>
        {entries.map((g) => {
          const name = l(g.name) || g.term;
          const lesson = g.lessonId ? lessons[g.lessonId] : undefined;
          return (
            <div key={g.id} className="card" data-testid={`glossary-${g.id}`}>
              <dt style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                {name}{' '}
                {name !== g.term && (
                  <span className="small muted">
                    (<span dir="ltr" style={{ fontFamily: 'var(--font-mono)' }}>{g.term}</span>)
                  </span>
                )}
              </dt>
              <dd style={{ margin: '0.3rem 0 0' }}>
                <Inline text={l(g.definition)} noTerms />
                {g.example && (
                  <div className="code-block" style={{ marginTop: '0.5rem' }}>
                    <pre>
                      <code>{g.example}</code>
                    </pre>
                  </div>
                )}
                {lesson && (
                  <div className="small muted" style={{ marginTop: '0.3rem' }}>
                    {t('glossary.introducedIn')}: <Link to={`/lesson/${lesson.id}`}>{l(lesson.title)}</Link>
                  </div>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
