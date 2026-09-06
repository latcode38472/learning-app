/**
 * Renders the tiny inline markup used in content text:
 *   **bold**   `code`   {{glossary-id}}   [[lesson-id|label]]
 */
import { Fragment, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { glossaryById, lessons } from '@/content';
import { useI18n } from '@/i18n';

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\{\{[a-z0-9-]+\}\}|\[\[[^\]]+\]\])/g;

export function Inline({ text, noTerms = false }: { text: string; noTerms?: boolean }) {
  const parts = text.split(TOKEN);
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('`') && part.endsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
        if (part.startsWith('{{') && part.endsWith('}}')) {
          const id = part.slice(2, -2);
          return noTerms ? <code key={i}>{id}</code> : <TermRef key={i} id={id} />;
        }
        if (part.startsWith('[[') && part.endsWith(']]')) {
          const inner = part.slice(2, -2);
          const [target, label] = inner.split('|');
          const lesson = lessons[target];
          return (
            <Link key={i} to={`/lesson/${target}`}>
              {label ?? (lesson ? lesson.title.en : target)}
            </Link>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

/** A glossary reference with a click/keyboard tooltip. */
export function TermRef({ id }: { id: string }) {
  const { l, t } = useI18n();
  const entry = glossaryById[id];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const tipId = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!entry) return <code>{id}</code>;
  const name = l(entry.name) || entry.term;
  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button type="button" className="term-ref" aria-expanded={open} aria-controls={tipId} onClick={() => setOpen((o) => !o)}>
        {name}
      </button>
      {open && (
        <span id={tipId} role="tooltip" className="term-tooltip">
          <strong>{name}</strong>{' '}
          {name !== entry.term && (
            <span className="term-original">
              ({t('glossary.original')}: {entry.term})
            </span>
          )}
          <span style={{ display: 'block', marginTop: '0.3rem' }}>
            <Inline text={l(entry.definition)} noTerms />
          </span>
        </span>
      )}
    </span>
  );
}

/** Convenience: localized inline text. */
export function LText({ text, noTerms }: { text: { en: string; he?: string }; noTerms?: boolean }): ReactNode {
  const { l } = useI18n();
  return <Inline text={l(text)} noTerms={noTerms} />;
}
