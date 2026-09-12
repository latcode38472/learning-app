/**
 * The help drawer with two clearly separated tabs:
 *
 *  Guide      the built-in, rule-based guide. Free, offline, always available.
 *             Its replies are scripted from the lesson, the learner's error and
 *             check results (src/tutor/offline.ts).
 *  AI         a real language model through the site owner's OpenRouter
 *             account (server side, streamed). Only shown as available when
 *             the backend says so; errors are shown as errors, never replaced
 *             by scripted text presented as AI.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { useTutorStore } from '@/tutor/context';
import { offlineReply, type Intent } from '@/tutor/offline';
import { glossaryById, lessons } from '@/content';
import { ApiError, fetchStatus, streamChat, type AssistantStatus, type ChatContext, type ChatRequest } from '@/assistant/client';
import { newId, selectActive, useConversations, type ChatMode, type Conversation } from '@/assistant/conversations';
import { describeAssistantError } from '@/assistant/errors';
import { Inline } from './InlineText';
import { Badge, Notice } from './ui';

interface Msg {
  role: 'user' | 'assistant';
  text: string;
}

export function renderMessage(text: string) {
  // Very small renderer: fenced code blocks and inline markup.
  const parts = text.split(/```(?:\w+)?\n?/);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <pre key={i} className="diff-box" style={{ margin: '0.3rem 0' }} dir="ltr">
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

type Tab = 'guide' | 'ai';

export function Tutor() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('guide');
  const [status, setStatus] = useState<AssistantStatus | null | 'loading'>('loading');

  // The backend status is fetched once the drawer opens (and again when the AI tab is chosen).
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void fetchStatus().then((s) => {
      if (!cancelled) setStatus(s);
    });
    return () => {
      cancelled = true;
    };
  }, [open, tab]);

  const aiAvailable = status !== 'loading' && status !== null && status.canChat;

  return (
    <>
      <button type="button" className="btn btn-primary tutor-fab" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="tutor-panel" data-testid="tutor-fab">
        {open ? t('tutor.close') : t('tutor.open')}
      </button>
      {open && (
        <section id="tutor-panel" className="tutor-panel" aria-label={t('tutor.title')} data-testid="tutor-panel">
          <div className="tutor-head">
            <div className="tutor-tabs" role="tablist" aria-label={t('tutor.tabsLabel')}>
              <button type="button" role="tab" aria-selected={tab === 'guide'} className={`btn btn-sm${tab === 'guide' ? ' btn-primary' : ''}`} onClick={() => setTab('guide')} data-testid="tutor-tab-guide">
                {t('tutor.title')} · {t('tutor.offlineBadge')}
              </button>
              <button type="button" role="tab" aria-selected={tab === 'ai'} className={`btn btn-sm${tab === 'ai' ? ' btn-primary' : ''}`} onClick={() => setTab('ai')} data-testid="tutor-tab-ai">
                {t('tutor.titleAi')} {aiAvailable ? '' : `· ${t('tutor.aiOff')}`}
              </button>
            </div>
            <span style={{ flex: 1 }} />
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)} aria-label={t('tutor.close')}>
              ✕
            </button>
          </div>
          {tab === 'guide' ? <GuideTab onSwitchToAi={() => setTab('ai')} aiAvailable={aiAvailable} /> : <AiTab status={status} onSwitchToGuide={() => setTab('guide')} />}
        </section>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ built-in guide */

function GuideTab({ onSwitchToAi, aiAvailable }: { onSwitchToAi: () => void; aiAvailable: boolean }) {
  const { t, lang } = useI18n();
  const situation = useTutorStore((s) => s.situation);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const ask = (text: string, intent?: Intent) => {
    const userMsg: Msg = { role: 'user', text };
    const history = [...messages, userMsg];
    setInput('');
    if (situation.examMode) {
      setMessages([...history, { role: 'assistant', text: t('tutor.examDisabled') }]);
      return;
    }
    setMessages([...history, { role: 'assistant', text: offlineReply(text, situation, lang, intent) }]);
  };

  const quick: Array<[Intent, string]> = [
    ['error', t('tutor.quickError')],
    ['fail', t('tutor.quickTest')],
    ['hint', t('tutor.quickHint')],
    ['stuck', t('tutor.quickStuck')],
  ];

  return (
    <>
      <div className="tutor-messages" ref={listRef} aria-live="polite" aria-relevant="additions" data-testid="guide-messages">
        <div className="msg msg-tutor">
          <Badge tone="info">{t('tutor.offlineBadge')}</Badge>
          <p style={{ marginTop: '0.3rem' }}>{situation.examMode ? t('tutor.examDisabled') : t('tutor.intro')}</p>
          <p className="tiny muted">{t('tutor.guideScriptedNote')}</p>
          {aiAvailable && (
            <button type="button" className="btn btn-sm" onClick={onSwitchToAi}>
              {t('tutor.switchToAi')}
            </button>
          )}
        </div>
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role === 'user' ? 'msg-user' : 'msg-tutor'}`}>
            {renderMessage(m.text)}
          </div>
        ))}
      </div>
      <div className="tutor-quick">
        {quick.map(([intent, label]) => (
          <button key={intent} type="button" className="btn btn-sm" onClick={() => ask(label, intent)} disabled={situation.examMode}>
            {label}
          </button>
        ))}
      </div>
      <form
        className="tutor-input"
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) ask(input.trim());
        }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('tutor.placeholder')} aria-label={t('tutor.placeholder')} />
        <button type="submit" className="btn btn-primary btn-sm" disabled={!input.trim()}>
          {t('tutor.send')}
        </button>
      </form>
    </>
  );
}

/* ------------------------------------------------------------------ AI assistant */

function buildContext(situation: ReturnType<typeof useTutorStore.getState>['situation'], lang: 'en' | 'he'): ChatContext {
  const lesson = situation.lessonId ? lessons[situation.lessonId] : undefined;
  const failed = situation.lastGrade?.results.filter((r) => !r.passed) ?? [];
  const lastResult = situation.lastGrade
    ? situation.lastGrade.passed
      ? 'all checks passed'
      : failed
          .slice(0, 3)
          .map((r) => {
            if (r.kind !== 'test') return `requirement not met: ${typeof r.message === 'string' ? r.message : r.message?.en ?? ''}`;
            if (r.error) return `error ${r.error.type}: ${r.error.message}`;
            if (r.type === 'output') return `expected output:\n${r.expected ?? ''}\nactual output:\n${r.actual ?? ''}`;
            if (r.type === 'function') return `${r.call} returned ${r.actualValue}, expected ${r.expected}`;
            return typeof r.message === 'string' ? r.message : r.message?.en ?? 'failed';
          })
          .join('\n---\n')
    : undefined;
  return {
    lessonId: situation.lessonId,
    lessonTitle: lesson ? lesson.title.en : situation.lessonTitle,
    objective: lesson ? lesson.objective.en : situation.lessonObjective,
    concepts: situation.learnedConcepts.map((c) => glossaryById[c]?.term ?? c),
    exerciseTitle: situation.exerciseTitle,
    hints: situation.hints,
    code: situation.currentCode,
    lastError: situation.lastError ? `${situation.lastError.type}: ${situation.lastError.message} (line ${situation.lastError.line ?? '?'})` : undefined,
    lastResult,
  };
  void lang;
}

function AiTab({ status, onSwitchToGuide }: { status: AssistantStatus | null | 'loading'; onSwitchToGuide: () => void }) {
  const { t, lang } = useI18n();
  const situation = useTutorStore((s) => s.situation);
  const store = useConversations();
  const active = useConversations(selectActive);
  const [mode, setMode] = useState<ChatMode>(situation.lessonId ? 'lesson' : 'general');
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [active?.messages, busy]);

  useEffect(() => {
    if (!situation.lessonId) setMode('general');
  }, [situation.lessonId]);

  const conversationsForMode = useMemo(() => store.conversations.filter((c) => c.mode === mode && (mode === 'general' || c.lessonId === situation.lessonId)), [store.conversations, mode, situation.lessonId]);

  const ensureConversation = useCallback((): Conversation => {
    if (active && active.mode === mode && (mode === 'general' || active.lessonId === situation.lessonId)) return active;
    const existing = conversationsForMode[0];
    if (existing) {
      store.setActive(existing.id);
      return existing;
    }
    const title = mode === 'lesson' && situation.lessonTitle ? situation.lessonTitle : '';
    return store.create({ mode, lang, lessonId: mode === 'lesson' ? situation.lessonId : undefined, title });
  }, [active, mode, situation.lessonId, situation.lessonTitle, conversationsForMode, store, lang]);

  const send = useCallback(
    async (conv: Conversation, userText: string | null) => {
      const s = useConversations.getState();
      if (userText !== null) {
        s.appendMessage(conv.id, { id: newId(), role: 'user', content: userText, status: 'done', at: new Date().toISOString() });
      }
      const history = useConversations.getState().conversations.find((c) => c.id === conv.id)?.messages ?? [];
      const payloadMessages = history.filter((m) => m.role === 'user' || (m.role === 'assistant' && m.status === 'done' && m.content.trim())).map((m) => ({ role: m.role, content: m.content }));
      const replyId = newId();
      s.appendMessage(conv.id, { id: replyId, role: 'assistant', content: '', status: 'streaming', at: new Date().toISOString() });
      const controller = new AbortController();
      abortRef.current = controller;
      setBusy(true);
      let text = '';
      const body: ChatRequest = { mode, lang, messages: payloadMessages, context: mode === 'lesson' ? buildContext(situation, lang) : { concepts: situation.learnedConcepts.map((c) => glossaryById[c]?.term ?? c) } };
      try {
        await streamChat(
          body,
          {
            onMeta: (meta) => useConversations.getState().updateMessage(conv.id, replyId, { model: meta.model }),
            onDelta: (delta) => {
              text += delta;
              useConversations.getState().updateMessage(conv.id, replyId, { content: text });
            },
            onUsage: (usage) => useConversations.getState().updateMessage(conv.id, replyId, { usage }),
          },
          controller.signal,
        );
        useConversations.getState().updateMessage(conv.id, replyId, { content: text, status: 'done' });
      } catch (e) {
        if (controller.signal.aborted) {
          useConversations.getState().updateMessage(conv.id, replyId, { content: text, status: 'stopped' });
        } else {
          const err = e instanceof ApiError ? { code: e.code, message: e.message } : { code: 'unreachable', message: e instanceof Error ? e.message : String(e) };
          useConversations.getState().updateMessage(conv.id, replyId, { content: text, status: 'error', error: err });
        }
      } finally {
        abortRef.current = null;
        setBusy(false);
      }
    },
    [lang, mode, situation],
  );

  const onSubmit = () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput('');
    void send(ensureConversation(), text);
  };

  const stop = () => abortRef.current?.abort();

  const retry = () => {
    if (!active || busy) return;
    const last = active.messages[active.messages.length - 1];
    if (last && last.role === 'assistant' && last.status !== 'done') store.removeMessage(active.id, last.id);
    void send(active, null);
  };

  const newChat = () => {
    if (busy) stop();
    store.create({ mode, lang, lessonId: mode === 'lesson' ? situation.lessonId : undefined, title: mode === 'lesson' && situation.lessonTitle ? situation.lessonTitle : '' });
  };

  /* ---------- availability states */
  if (status === 'loading') return <div className="tutor-messages muted small">{t('app.loading')}</div>;
  if (situation.examMode) {
    return (
      <div className="tutor-messages">
        <Notice tone="info">{t('tutor.examDisabled')}</Notice>
      </div>
    );
  }
  if (status === null || !status.canChat) {
    const reason = status === null ? 'unreachable' : !status.keyConfigured ? 'not_configured' : 'learners_disabled';
    return (
      <div className="tutor-messages" data-testid="ai-unavailable">
        <Notice tone="info" title={t('tutor.aiUnavailableTitle')}>
          <p>{describeAssistantError(reason, lang)}</p>
          <p className="small muted">{t('tutor.aiUnavailableBody')}</p>
          <div className="btn-row">
            <button type="button" className="btn btn-sm" onClick={onSwitchToGuide}>
              {t('tutor.useGuideInstead')}
            </button>
            {status?.role === 'owner' && (
              <Link to="/owner" className="btn btn-sm">
                {t('owner.openSettings')}
              </Link>
            )}
          </div>
        </Notice>
      </div>
    );
  }

  const last = active?.messages[active.messages.length - 1];
  const canRetry = !!last && last.role === 'assistant' && (last.status === 'error' || last.status === 'stopped') && !busy;

  return (
    <>
      <div className="tutor-ai-bar">
        <div className="seg" role="group" aria-label={t('tutor.modeLabel')}>
          {situation.lessonId && (
            <button type="button" aria-pressed={mode === 'lesson'} onClick={() => setMode('lesson')} data-testid="ai-mode-lesson">
              {t('tutor.modeLesson')}
            </button>
          )}
          <button type="button" aria-pressed={mode === 'general'} onClick={() => setMode('general')} data-testid="ai-mode-general">
            {t('tutor.modeGeneral')}
          </button>
        </div>
        <span className="spacer" style={{ flex: 1 }} />
        {conversationsForMode.length > 1 && (
          <select className="btn btn-sm" value={active?.id ?? ''} onChange={(e) => store.setActive(e.target.value)} aria-label={t('tutor.previousChats')} style={{ maxWidth: 150 }}>
            {conversationsForMode.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title || t('tutor.untitledChat')} · {new Date(c.updatedAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        )}
        <button type="button" className="btn btn-sm" onClick={newChat} data-testid="ai-new-chat">
          {t('tutor.newChat')}
        </button>
      </div>
      <div className="tutor-messages" ref={listRef} aria-live="polite" aria-relevant="additions" data-testid="ai-messages">
        <div className="msg msg-tutor">
          <Badge tone="accent">{t('tutor.aiBadge')}</Badge> <span className="tiny muted">{status.model}</span>
          <p style={{ marginTop: '0.3rem' }}>{mode === 'lesson' ? t('tutor.introAiLesson') : t('tutor.introAiGeneral')}</p>
          <p className="tiny muted">{t('tutor.aiHonesty')}</p>
        </div>
        {active?.messages.map((m) => (
          <div key={m.id} className={`msg ${m.role === 'user' ? 'msg-user' : 'msg-tutor'}`} data-testid={`ai-msg-${m.role}`} data-status={m.status}>
            {m.content ? renderMessage(m.content) : m.status === 'streaming' ? <p className="muted">{t('tutor.thinking')}</p> : null}
            {m.status === 'error' && (
              <p className="small" style={{ color: 'var(--danger)', marginTop: '0.3rem' }} data-testid="ai-error">
                {describeAssistantError(m.error?.code, lang, m.error?.message)}
              </p>
            )}
            {m.status === 'stopped' && <p className="tiny muted">{t('tutor.stopped')}</p>}
          </div>
        ))}
      </div>
      <div className="tutor-quick">
        {busy ? (
          <button type="button" className="btn btn-sm" onClick={stop} data-testid="ai-stop">
            ■ {t('tutor.stop')}
          </button>
        ) : (
          canRetry && (
            <button type="button" className="btn btn-sm" onClick={retry} data-testid="ai-retry">
              ↻ {t('tutor.retry')}
            </button>
          )
        )}
        {last?.status === 'error' && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onSwitchToGuide}>
            {t('tutor.useGuideInstead')}
          </button>
        )}
      </div>
      <form
        className="tutor-input"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('tutor.aiPlaceholder')} aria-label={t('tutor.aiPlaceholder')} disabled={busy} maxLength={status.limits.maxMessageChars} data-testid="ai-input" />
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy || !input.trim()} data-testid="ai-send">
          {t('tutor.send')}
        </button>
      </form>
    </>
  );
}
