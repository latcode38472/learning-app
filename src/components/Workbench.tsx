/**
 * The edit–run–feedback loop: a code editor, a Run button, a console with
 * interactive input, friendly error messages, and an optional step-through
 * visualiser. Learner code runs in the browser sandbox only.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useI18n } from '@/i18n';
import { runtime, RUN_TIMEOUT_SECONDS, type RunResult, type RuntimeStatus } from '@/runtime/runner';
import { explainError } from '@/runtime/errors';
import { useStore } from '@/state/store';
import { copyText, downloadText, safeFileName } from '@/utils/download';
import { CodeEditor } from './CodeEditor';
import { Tracer } from './Tracer';
import { useToast } from './ui';

export interface WorkbenchProps {
  code: string;
  onCodeChange: (code: string) => void;
  /** Starter code used by the Reset button. */
  starterCode?: string;
  sampleStdin?: string[];
  fileName?: string;
  enableTrace?: boolean;
  readOnly?: boolean;
  minHeight?: string;
  /** Extra toolbar buttons (e.g. "Check my answer"). */
  extraToolbar?: ReactNode;
  onRunComplete?: (result: RunResult) => void;
  /** Called when the learner explicitly presses Run (before executing). */
  onRun?: () => void;
  testIdPrefix?: string;
}

export function useRuntimeStatus(): RuntimeStatus {
  const [status, setStatus] = useState<RuntimeStatus>(runtime.status);
  useEffect(() => runtime.subscribe(setStatus), []);
  return status;
}

function splitStdin(text: string): string[] {
  if (text === '') return [];
  return text.replace(/\r\n/g, '\n').split('\n');
}

export function Workbench({
  code,
  onCodeChange,
  starterCode,
  sampleStdin,
  fileName = 'program',
  enableTrace = true,
  readOnly = false,
  minHeight,
  extraToolbar,
  onRunComplete,
  onRun,
  testIdPrefix = 'wb',
}: WorkbenchProps) {
  const { t, lang } = useI18n();
  const toast = useToast();
  const recordRun = useStore((s) => s.recordRun);
  const status = useRuntimeStatus();
  const [stdinText, setStdinText] = useState((sampleStdin ?? []).join('\n'));
  const [showStdin, setShowStdin] = useState((sampleStdin?.length ?? 0) > 0 || /\binput\s*\(/.test(code));
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [pendingInput, setPendingInput] = useState('');
  const [showTrace, setShowTrace] = useState(false);
  const seed = useRef(1);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (/\binput\s*\(/.test(code)) setShowStdin(true);
  }, [code]);

  useEffect(() => {
    void runtime.warmUp();
  }, []);

  const execute = useCallback(
    async (lines: string[]) => {
      setRunning(true);
      setShowTrace(false);
      try {
        const res = await runtime.run(code, { stdin: lines, seed: seed.current });
        setResult(res);
        recordRun(!!res.error);
        onRunComplete?.(res);
        consoleRef.current?.scrollTo({ top: consoleRef.current.scrollHeight });
      } finally {
        setRunning(false);
      }
    },
    [code, onRunComplete, recordRun],
  );

  const run = useCallback(() => {
    if (running) return;
    onRun?.();
    seed.current = Math.floor(Math.random() * 100000) + 1;
    void execute(splitStdin(stdinText));
  }, [execute, onRun, running, stdinText]);

  const sendInput = () => {
    // Build the line list as an array so an empty first answer is still delivered.
    const lines = [...splitStdin(stdinText), pendingInput];
    setStdinText(lines.join('\n'));
    setPendingInput('');
    setShowStdin(true);
    void execute(lines);
  };

  const reset = () => {
    if (starterCode === undefined) return;
    if (code !== starterCode && !window.confirm(t('editor.resetConfirm'))) return;
    onCodeChange(starterCode);
    setResult(null);
  };

  const friendly = result?.error ? explainError(result.error, lang) : null;

  return (
    <div className="workbench">
      <div className="workbench-toolbar">
        <button
          type="button"
          className="btn btn-primary"
          onClick={run}
          disabled={running || status === 'loading'}
          data-testid={`${testIdPrefix}-run`}
          title={t('editor.shortcut')}
        >
          ▶ {running ? t('editor.running') : t('editor.run')}
        </button>
        {extraToolbar}
        {enableTrace && (
          <button type="button" className="btn btn-sm" onClick={() => setShowTrace((s) => !s)} aria-pressed={showTrace}>
            {t('editor.visualize')}
          </button>
        )}
        <span className="spacer" />
        {status === 'loading' && <span className="small muted">{t('editor.loadingRuntime')}</span>}
        {status === 'error' && <span className="small" style={{ color: 'var(--danger)' }}>{t('editor.runtimeFailed')}</span>}
        {starterCode !== undefined && !readOnly && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
            {t('editor.reset')}
          </button>
        )}
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={async () => {
            if (await copyText(code)) toast(t('editor.copied'));
          }}
        >
          {t('editor.copy')}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => downloadText(safeFileName(fileName), code)}>
          {t('editor.download')}
        </button>
      </div>

      <CodeEditor value={code} onChange={onCodeChange} onRun={run} readOnly={readOnly} minHeight={minHeight} />

      {showTrace && <Tracer code={code} stdin={splitStdin(stdinText)} autoRun />}

      {showStdin && (
        <div className="stdin-box">
          <label htmlFor={`${testIdPrefix}-stdin`}>{t('editor.stdinLabel')}</label>
          <textarea
            id={`${testIdPrefix}-stdin`}
            data-testid={`${testIdPrefix}-stdin`}
            value={stdinText}
            onChange={(e) => setStdinText(e.target.value)}
            placeholder={t('editor.stdinPlaceholder')}
            spellCheck={false}
          />
        </div>
      )}

      <div className="console-toolbar">
        <span>{t('editor.console')}</span>
        <span className="spacer" style={{ flex: 1 }} />
        <span className="tiny">{t('editor.shortcut')}</span>
      </div>
      <div className="console" ref={consoleRef} data-testid={`${testIdPrefix}-console`} aria-live="polite">
        {!result && <span className="console-empty">{t('editor.consoleEmpty')}</span>}
        {result?.timedOut && <span className="console-empty">{t('editor.timeout', { seconds: RUN_TIMEOUT_SECONDS })}</span>}
        {result && !result.timedOut && result.stdout}
        {result?.truncated && <div className="console-empty">{t('editor.truncated')}</div>}
      </div>

      {result?.needInput !== null && result?.needInput !== undefined && !running && (
        <form
          className="need-input"
          onSubmit={(e) => {
            e.preventDefault();
            sendInput();
          }}
        >
          <label htmlFor={`${testIdPrefix}-need-input`} className="small">
            {t('editor.needInput')} <code>{result.needInput || 'input()'}</code>
          </label>
          <input
            id={`${testIdPrefix}-need-input`}
            data-testid={`${testIdPrefix}-need-input`}
            value={pendingInput}
            onChange={(e) => setPendingInput(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn btn-sm btn-primary">
            {t('editor.needInputSend')}
          </button>
        </form>
      )}

      {friendly && result?.error && (
        <div className="error-panel" data-testid={`${testIdPrefix}-error`} role="alert">
          <h4>
            {friendly.title}: {result.error.type}
          </h4>
          <div>
            <strong>{t('editor.errorFriendly')}:</strong> {friendly.explanation}
          </div>
          {result.error.source && (
            <div>
              {friendly.lineHint} <span className="error-source">{result.error.source}</span>
            </div>
          )}
          <details>
            <summary>{t('editor.errorTechnical')}</summary>
            <pre dir="ltr">{friendly.technical}</pre>
          </details>
        </div>
      )}
    </div>
  );
}
