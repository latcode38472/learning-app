/**
 * The tutor drawer. Uses the built-in guide by default; when the learner has
 * enabled and configured a connected tutor server, messages go there instead
 * (with a clear cost notice). Disabled during tests.
 */
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n';
import { useStore } from '@/state/store';
import { useTutorStore } from '@/tutor/context';
import { offlineReply, tutorSystemPrompt, type Intent } from '@/tutor/offline';
import { askRemoteTutor, type TutorMessage } from '@/tutor/remote';
import { Inline } from './InlineText';
import { Badge } from './ui';

interface Msg {
  role: 'user' | 'assistant';
  text: string;
}

function renderMessage(text: string) {
  // Very small renderer: fenced code blocks and inline markup.
  const parts = text.split(/```(?:\w+)?\n?/);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <pre key={i} className="diff-box" style={{ margin: '0.3rem 0' }}>
        {part.replace(/\n$/, '')}
      </pre>
    ) : (
      part
        .split(/\n\n+/)
        .filter((p) => p.trim())
        .map((p, j) => (
          <p key={`${i}-${j}`}>
            <Inline text={p.trim()} noTerms />
          </p>
        ))
    ),
  );
}

export function Tutor() {
  const { t, lang } = useI18n();
  const situation = useTutorStore((s) => s.situation);
  const tutorSettings = useStore((s) => s.settings.tutor);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const remote = tutorSettings.remoteEnabled && tutorSettings.costAcknowledged && tutorSettings.endpoint.trim() !== '';

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  const ask = async (text: string, intent?: Intent) => {
    const userMsg: Msg = { role: 'user', text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    if (situation.examMode) {
      setMessages([...history, { role: 'assistant', text: t('tutor.examDisabled') }]);
      return;
    }
    if (remote && !intent) {
      setBusy(true);
      try {
        const payload: TutorMessage[] = history.map((m) => ({ role: m.role, content: m.text }));
        const reply = await askRemoteTutor(tutorSettings.endpoint, payload, tutorSystemPrompt(situation, lang));
        setMessages([...history, { role: 'assistant', text: reply }]);
      } catch {
        const fallback = offlineReply(text, situation, lang);
        setMessages([...history, { role: 'assistant', text: `${t('tutor.sendFailed')}\n\n${fallback}` }]);
      } finally {
        setBusy(false);
      }
      return;
    }
    const reply = offlineReply(text, situation, lang, intent);
    setMessages([...history, { role: 'assistant', text: reply }]);
  };

  const quick: Array<[Intent, string]> = [
    ['error', t('tutor.quickError')],
    ['fail', t('tutor.quickTest')],
    ['hint', t('tutor.quickHint')],
    ['stuck', t('tutor.quickStuck')],
  ];

  return (
    <>
      <button
        type="button"
        className="btn btn-primary tutor-fab"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="tutor-panel"
        data-testid="tutor-fab"
      >
        {open ? t('tutor.close') : t('tutor.open')}
      </button>
      {open && (
        <section id="tutor-panel" className="tutor-panel" aria-label={remote ? t('tutor.titleAi') : t('tutor.title')} data-testid="tutor-panel">
          <div className="tutor-head">
            <strong>{remote ? t('tutor.titleAi') : t('tutor.title')}</strong>
            <Badge tone={remote ? 'accent' : 'info'}>{remote ? t('tutor.aiBadge') : t('tutor.offlineBadge')}</Badge>
            <span style={{ flex: 1 }} />
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)} aria-label={t('tutor.close')}>
              ✕
            </button>
          </div>
          <div className="tutor-messages" ref={listRef}>
            <div className="msg msg-tutor">
              <p>{situation.examMode ? t('tutor.examDisabled') : remote ? t('tutor.introAi') : t('tutor.intro')}</p>
              {remote && <p className="tiny muted">{t('tutor.costNotice')}</p>}
            </div>
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role === 'user' ? 'msg-user' : 'msg-tutor'}`}>
                {renderMessage(m.text)}
              </div>
            ))}
            {busy && <div className="msg msg-tutor muted">{t('tutor.thinking')}</div>}
          </div>
          <div className="tutor-quick">
            {quick.map(([intent, label]) => (
              <button key={intent} type="button" className="btn btn-sm" onClick={() => ask(label, intent)} disabled={busy || situation.examMode}>
                {label}
              </button>
            ))}
          </div>
          <form
            className="tutor-input"
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) void ask(input.trim());
            }}
          >
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('tutor.placeholder')} aria-label={t('tutor.placeholder')} disabled={busy} />
            <button type="submit" className="btn btn-primary btn-sm" disabled={busy || !input.trim()}>
              {t('tutor.send')}
            </button>
          </form>
        </section>
      )}
    </>
  );
}
