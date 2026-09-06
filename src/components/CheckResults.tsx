import type { CheckResult, GradeResult } from '@/runtime/runner';
import { explainError } from '@/runtime/errors';
import { useI18n } from '@/i18n';
import { Inline } from './InlineText';

function normalizeLines(s: string): string[] {
  const lines = s.replace(/\r\n/g, '\n').split('\n').map((l) => l.trimEnd());
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  while (lines.length && lines[0] === '') lines.shift();
  return lines;
}

/** A short hint about how expected and actual output differ. */
function diffHint(expected: string, actual: string, t: (k: never, p?: Record<string, string | number>) => string): string | null {
  const e = normalizeLines(expected);
  const a = normalizeLines(actual);
  const tt = t as unknown as (k: string, p?: Record<string, string | number>) => string;
  if (e.join('\n').toLowerCase() === a.join('\n').toLowerCase()) return tt('exercise.diffCase');
  const squash = (x: string[]) => x.map((l) => l.replace(/\s+/g, '')).filter(Boolean).join('');
  if (squash(e) === squash(a)) return tt('exercise.diffWhitespace');
  if (e.length !== a.length) return tt('exercise.diffLines', { expected: e.length, actual: a.length });
  return tt('exercise.diffHint');
}

export function CheckResults({ result }: { result: GradeResult }) {
  const { t, lang, l } = useI18n();
  const total = result.results.length;
  const failed = result.results.filter((r) => !r.passed).length;
  if (result.timedOut) {
    return (
      <div className="notice notice-danger" role="alert">
        <div>{t('editor.timeout', { seconds: 20 })}</div>
      </div>
    );
  }
  return (
    <div>
      <div className={`notice ${result.passed ? 'notice-success' : 'notice-warning'}`} role="status">
        <div>
          <strong>{result.passed ? t('exercise.passed') : t('exercise.failed', { failed, total })}</strong>
        </div>
      </div>
      <ul className="check-list">
        {result.results.map((r, i) => (
          <li key={i} className={`check-item ${r.passed ? 'pass' : 'fail'}`}>
            <div className="check-item-title">
              <span aria-hidden="true">{r.passed ? '✓' : '✗'}</span>
              <span className="sr-only">{r.passed ? t('quiz.correct') : t('quiz.incorrect')}</span>
              {r.kind !== 'test'
                ? t('exercise.requirement')
                : r.name
                  ? l(r.name)
                  : t('exercise.testName', { n: (r.index ?? i) + 1 })}
            </div>
            {!r.passed && <FailureDetails r={r} lang={lang} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FailureDetails({ r, lang }: { r: CheckResult; lang: 'en' | 'he' }) {
  const { t, l } = useI18n();
  if (r.kind !== 'test') {
    const msg = typeof r.message === 'string' ? r.message : r.message ? l(r.message) : '';
    return (
      <p className="small" style={{ margin: '0.3rem 0 0' }}>
        <Inline text={msg} />
      </p>
    );
  }
  if (r.error) {
    const fe = explainError(r.error, lang);
    return (
      <div className="small" style={{ marginTop: '0.3rem' }}>
        <strong>{fe.title}</strong> — {fe.explanation}
        {r.error.source && <div className="error-source">{r.error.source}</div>}
        {r.stdin && r.stdin.length > 0 && <div className="muted">{t('exercise.withInput', { input: r.stdin.join(' ⏎ ') })}</div>}
      </div>
    );
  }
  if (r.reason === 'need-input') return <p className="small" style={{ margin: '0.3rem 0 0' }}>{t('exercise.needInput')}</p>;
  if (r.reason === 'too-much-output') return <p className="small" style={{ margin: '0.3rem 0 0' }}>{t('exercise.tooMuchOutput')}</p>;
  if (r.type === 'output') {
    const hint = diffHint(r.expected ?? '', r.actual ?? '', t as never);
    return (
      <div className="small" style={{ marginTop: '0.3rem' }}>
        {r.stdin && r.stdin.length > 0 && <div className="muted">{t('exercise.withInput', { input: r.stdin.join(' ⏎ ') })}</div>}
        <div className="diff-grid">
          <div className="diff-box">
            <span className="label">{t('exercise.expected')}</span>
            {r.expected}
          </div>
          <div className="diff-box">
            <span className="label">{t('exercise.actual')}</span>
            {r.actual || ' '}
          </div>
        </div>
        {hint && <div style={{ marginTop: '0.3rem' }}>{hint}</div>}
      </div>
    );
  }
  if (r.type === 'function') {
    return (
      <div className="small" style={{ marginTop: '0.3rem' }}>
        {r.reason === 'printed-not-returned' && <div>{t('exercise.printedNotReturned')}</div>}
        <div className="diff-grid">
          <div className="diff-box">
            <span className="label">{t('exercise.functionCall')}</span>
            {r.call}
            {'\n'}
            <span className="label">{t('exercise.expected')}</span>
            {r.expected}
          </div>
          <div className="diff-box">
            <span className="label">{t('exercise.returned')}</span>
            {r.actualValue}
            {r.printed ? `\n(printed: ${r.printed.trim()})` : ''}
          </div>
        </div>
        {r.message && <div>{typeof r.message === 'string' ? r.message : l(r.message)}</div>}
      </div>
    );
  }
  const msg = typeof r.message === 'string' ? r.message : r.message ? l(r.message) : '';
  return (
    <p className="small" style={{ margin: '0.3rem 0 0' }}>
      <Inline text={msg} />
    </p>
  );
}
