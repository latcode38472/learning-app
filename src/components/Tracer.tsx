/**
 * Step-by-step visualisation of a program: which line runs, what the
 * variables hold (and which just changed), what has been printed so far,
 * function calls/returns, and for if / elif / while lines what the condition
 * evaluated to and which branch was taken.
 *
 * Keyboard: with the tracer focused, ← → move one step, Home/End jump,
 * Space plays/pauses. Respects the "reduce motion" setting (no auto-play
 * animation, no smooth scrolling).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { randomSeed, runtime, type TraceResult, type TraceStep } from '@/runtime/runner';
import { explainError } from '@/runtime/errors';
import { useI18n } from '@/i18n';
import { useStore } from '@/state/store';
import { Notice } from './ui';

interface Props {
  code: string;
  stdin?: string[];
  caption?: string;
  /** Start tracing immediately instead of waiting for a click. */
  autoRun?: boolean;
}

const LABELS = {
  en: {
    run: 'Run step by step',
    rerun: 'Run again',
    step: 'Step {i} of {n}',
    first: 'First step',
    prev: 'Previous step',
    next: 'Next step',
    last: 'Last step',
    play: 'Play',
    pause: 'Pause',
    variables: 'Variables',
    noVars: 'No variables yet',
    changed: 'changed in this step',
    output: 'Output so far',
    inside: 'Inside function {name}()',
    topLevel: 'Main program',
    calling: 'Entering a function',
    returning: 'Returning {value}',
    finished: 'The program finished.',
    limit: 'Stopped after many steps (long loops are cut short here).',
    needInput: 'This example reads input, so it cannot be traced here.',
    loading: 'Tracing…',
    condition: 'Condition',
    condTrue: 'True',
    condFalse: 'False',
    takenBody: 'so the program goes into this block.',
    takenElse: 'so the program jumps to the else part.',
    takenElif: 'so the program tries the next elif.',
    takenSkip: 'so the program skips this block.',
    takenExit: 'so the loop ends.',
    keys: 'Keyboard: ← → one step, Home/End, Space to play',
  },
  he: {
    run: 'הרצה צעד אחר צעד',
    rerun: 'הרצה מחדש',
    step: 'צעד {i} מתוך {n}',
    first: 'הצעד הראשון',
    prev: 'הצעד הקודם',
    next: 'הצעד הבא',
    last: 'הצעד האחרון',
    play: 'הפעלה',
    pause: 'השהיה',
    variables: 'משתנים',
    noVars: 'עדיין אין משתנים',
    changed: 'השתנה בצעד הזה',
    output: 'הפלט עד כה',
    inside: 'בתוך הפונקציה {name}()',
    topLevel: 'התוכנית הראשית',
    calling: 'כניסה לפונקציה',
    returning: 'חזרה עם הערך {value}',
    finished: 'התוכנית הסתיימה.',
    limit: 'נעצר אחרי צעדים רבים (לולאות ארוכות מקוצרות כאן).',
    needInput: 'הדוגמה הזאת קוראת קלט, ולכן אי אפשר לעקוב אחריה כאן.',
    loading: 'עוקב…',
    condition: 'תנאי',
    condTrue: 'True (אמת)',
    condFalse: 'False (שקר)',
    takenBody: 'ולכן התוכנית נכנסת לבלוק הזה.',
    takenElse: 'ולכן התוכנית קופצת לחלק ה-else.',
    takenElif: 'ולכן התוכנית מנסה את ה-elif הבא.',
    takenSkip: 'ולכן התוכנית מדלגת על הבלוק הזה.',
    takenExit: 'ולכן הלולאה מסתיימת.',
    keys: 'מקלדת: ← → צעד אחד, Home/End, רווח להפעלה',
  },
};

function fmt(s: string, params: Record<string, string | number>) {
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m));
}

function takenText(L: (typeof LABELS)['en'], step: TraceStep): string {
  switch (step.cond?.taken) {
    case 'body':
      return L.takenBody;
    case 'else':
      return L.takenElse;
    case 'elif':
      return L.takenElif;
    case 'skip':
      return L.takenSkip;
    case 'exit':
      return L.takenExit;
    default:
      return '';
  }
}

export function Tracer({ code, stdin = [], caption, autoRun = false }: Props) {
  const { lang, dir, t } = useI18n();
  const reduceMotion = useStore((s) => s.settings.reduceMotion);
  const L = LABELS[lang] ?? LABELS.en;
  const [trace, setTrace] = useState<TraceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);
  const codeRef = useRef<HTMLPreElement>(null);
  const lines = useMemo(() => code.split('\n'), [code]);

  const start = async () => {
    setLoading(true);
    setPlaying(false);
    try {
      const res = await runtime.trace(code, { stdin, seed: randomSeed() });
      setTrace(res);
      setIndex(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoRun && !trace && !loading) void start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun]);

  const steps = trace?.steps ?? [];
  const total = steps.length;

  useEffect(() => {
    if (!playing) return;
    if (index >= total - 1) {
      setPlaying(false);
      return;
    }
    timer.current = window.setTimeout(() => setIndex((i) => Math.min(i + 1, total - 1)), reduceMotion ? 1100 : 650);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [playing, index, total, reduceMotion]);

  const step = steps[index];
  const prevStep = index > 0 ? steps[index - 1] : undefined;
  const activeLine = step?.line ?? -1;
  const vars = step ? Object.entries(step.vars) : [];
  const changed = useMemo(() => {
    const set = new Set<string>();
    if (!step) return set;
    for (const [k, v] of Object.entries(step.vars)) if (!prevStep || prevStep.vars[k] !== v) set.add(k);
    return set;
  }, [step, prevStep]);
  const atEnd = total > 0 && index === total - 1;

  // Keep the active line visible inside the code box.
  useEffect(() => {
    const el = codeRef.current?.querySelector<HTMLElement>('.line.active');
    el?.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [activeLine, reduceMotion]);

  const onKey = (e: React.KeyboardEvent) => {
    if (!trace || total === 0) return;
    const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const backward = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === forward) setIndex((i) => Math.min(total - 1, i + 1));
    else if (e.key === backward) setIndex((i) => Math.max(0, i - 1));
    else if (e.key === 'Home') setIndex(0);
    else if (e.key === 'End') setIndex(total - 1);
    else if (e.key === ' ') setPlaying((p) => !p);
    else return;
    e.preventDefault();
  };

  return (
    <div className="tracer" dir="ltr" tabIndex={0} onKeyDown={onKey} aria-label={L.run} data-testid="tracer">
      <div className="workbench-toolbar" dir={dir}>
        {!trace && (
          <button type="button" className="btn btn-primary btn-sm" onClick={start} disabled={loading} data-testid="tracer-start">
            {loading ? L.loading : L.run}
          </button>
        )}
        {trace && total > 0 && (
          <>
            <button type="button" className="btn btn-sm" onClick={() => setIndex(0)} aria-label={L.first} title={L.first} disabled={index === 0}>
              ⏮
            </button>
            <button type="button" className="btn btn-sm" onClick={() => setIndex((i) => Math.max(0, i - 1))} aria-label={L.prev} title={L.prev} disabled={index === 0} data-testid="tracer-prev">
              {dir === 'rtl' ? '▶' : '◀'}
            </button>
            <button type="button" className="btn btn-sm btn-primary" onClick={() => setPlaying((p) => !p)} aria-label={playing ? L.pause : L.play} title={playing ? L.pause : L.play}>
              {playing ? '⏸' : '▶'}
            </button>
            <button type="button" className="btn btn-sm" onClick={() => setIndex((i) => Math.min(total - 1, i + 1))} aria-label={L.next} title={L.next} disabled={atEnd} data-testid="tracer-next">
              {dir === 'rtl' ? '◀' : '▶'}|
            </button>
            <button type="button" className="btn btn-sm" onClick={() => setIndex(total - 1)} aria-label={L.last} title={L.last} disabled={atEnd}>
              ⏭
            </button>
            <span className="small muted" aria-live="polite" data-testid="tracer-step">
              {fmt(L.step, { i: index + 1, n: total })}
            </span>
            <span className="spacer" />
            <button type="button" className="btn btn-ghost btn-sm" onClick={start} disabled={loading}>
              {L.rerun}
            </button>
          </>
        )}
        {caption && <span className="small muted">{caption}</span>}
      </div>
      <div className="tracer-body">
        <pre className="tracer-code" role="region" aria-label={t('editor.codeLabel')} ref={codeRef}>
          {lines.map((ln, i) => (
            <span key={i} className={`line${i + 1 === activeLine ? ' active' : ''}`}>
              <span className="ln">{i + 1}</span>
              {ln || ' '}
            </span>
          ))}
        </pre>
        <div className="tracer-side" dir={dir}>
          {trace && trace.needInput !== null && <Notice tone="warning">{L.needInput}</Notice>}
          {step && (
            <>
              <div className="small muted" style={{ marginBottom: '0.3rem' }}>
                {step.depth > 0 ? fmt(L.inside, { name: step.func }) : L.topLevel}
                {step.event === 'call' && step.depth > 0 ? ` · ${L.calling}` : ''}
                {step.event === 'return' && step.depth > 0 ? ` · ${fmt(L.returning, { value: step.ret ?? 'None' })}` : ''}
              </div>
              {step.cond && (
                <div className={`tracer-cond ${step.cond.result ? 'is-true' : 'is-false'}`} data-testid="tracer-condition">
                  <strong className="small">{L.condition}:</strong> <code dir="ltr">{step.cond.src}</code> → <strong>{step.cond.result ? L.condTrue : L.condFalse}</strong>
                  <div className="small">{takenText(L, step)}</div>
                </div>
              )}
              <strong className="small">{L.variables}</strong>
              {vars.length === 0 ? (
                <p className="small muted">{L.noVars}</p>
              ) : (
                <table>
                  <tbody>
                    {vars.map(([k, v]) => (
                      <tr key={k} className={changed.has(k) ? 'changed' : ''}>
                        <td>
                          <code>{k}</code>
                        </td>
                        <td className="val">
                          {v}
                          {changed.has(k) && <span className="sr-only"> ({L.changed})</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <strong className="small" style={{ display: 'block', marginTop: '0.5rem' }}>
                {L.output}
              </strong>
              <div className="tracer-out">{atEnd ? trace?.stdout : step.stdout}</div>
              {atEnd && trace?.error && (
                <div className="small" style={{ marginTop: '0.4rem', color: 'var(--danger)' }}>
                  {trace.error.type}: {explainError(trace.error, lang).explanation}
                </div>
              )}
              {atEnd && !trace?.error && <div className="small muted" style={{ marginTop: '0.4rem' }}>{trace?.truncated ? L.limit : L.finished}</div>}
              <div className="tiny muted" style={{ marginTop: '0.5rem' }}>
                {L.keys}
              </div>
            </>
          )}
          {trace && total === 0 && (
            <>
              {trace.timedOut && <Notice tone="warning">{t('editor.timeout', { seconds: 8 })}</Notice>}
              {trace.error && (
                <div className="small" style={{ color: 'var(--danger)' }}>
                  {trace.error.type}: {explainError(trace.error, lang).explanation}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
