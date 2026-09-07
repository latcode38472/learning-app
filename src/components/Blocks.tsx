/**
 * Renders content blocks (paragraphs, code, lists, callouts, term cards,
 * tables and step-through visualisations).
 */
import { useState } from 'react';
import type { Block } from '@/content/schema';
import { useI18n } from '@/i18n';
import { runtime, type RunResult } from '@/runtime/runner';
import { explainError } from '@/runtime/errors';
import { Inline } from './InlineText';
import { Tracer } from './Tracer';

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </>
  );
}

const CALLOUT_ICON: Record<string, string> = { tip: '💡', why: '❓', warning: '⚠️', note: '📝', story: '📖' };

export function BlockView({ block }: { block: Block }) {
  const { l } = useI18n();
  switch (block.kind) {
    case 'p':
      return (
        <p>
          <Inline text={l(block.text)} />
        </p>
      );
    case 'h':
      return (
        <h4>
          <Inline text={l(block.text)} />
        </h4>
      );
    case 'list': {
      const items = block.items.map((it, i) => (
        <li key={i}>
          <Inline text={l(it)} />
        </li>
      ));
      return block.ordered ? <ol>{items}</ol> : <ul>{items}</ul>;
    }
    case 'callout':
      return (
        <div className={`callout callout-${block.tone}`}>
          {(block.title || block.tone !== 'note') && (
            <div className="callout-title">
              <span aria-hidden="true">{CALLOUT_ICON[block.tone]}</span>
              {block.title && <Inline text={l(block.title)} />}
            </div>
          )}
          <p>
            <Inline text={l(block.text)} />
          </p>
        </div>
      );
    case 'term':
      return (
        <div className="term-card">
          <span className="term-name">{block.term}</span>
          <p>
            <Inline text={l(block.text)} />
          </p>
        </div>
      );
    case 'table':
      return (
        <div className="table-wrap">
          <table className="lesson-table">
            <thead>
              <tr>
                {block.header.map((h, i) => (
                  <th key={i}>
                    <Inline text={l(h)} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}>
                      <Inline text={l(cell)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'viz':
      return <Tracer code={block.code} caption={block.caption ? l(block.caption) : undefined} />;
    case 'code':
      return <CodeBlock block={block} />;
    default:
      return null;
  }
}

function CodeBlock({ block }: { block: Extract<Block, { kind: 'code' }> }) {
  const { l, t, lang } = useI18n();
  const source = l(block.code);
  const output = block.output !== undefined ? l(block.output) : undefined;
  const isPython = block.lang !== 'text';
  const runnable = isPython && block.runnable !== false && !/\binput\s*\(/.test(source);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    try {
      setResult(await runtime.run(source));
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <div className="code-block">
        <div className="code-block-header">
          <span>{isPython ? 'Python' : t('editor.plainText')}</span>
          <span className="spacer" />
          {runnable && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={run} disabled={running}>
              ▶ {running ? t('editor.running') : t('lesson.runSnippet')}
            </button>
          )}
        </div>
        <pre>
          <code>{source}</code>
        </pre>
        {output !== undefined && (
          <div className="output">
            <div className="output-label">{t('lesson.outputLabel')}</div>
            {output}
          </div>
        )}
        {result && (
          <div className="output" aria-live="polite">
            <div className="output-label">{t('editor.console')}</div>
            {result.stdout}
            {result.error && (
              <div className="ui-text" style={{ color: 'var(--danger)', marginTop: '0.3rem' }}>
                {result.error.type}: {explainError(result.error, lang).explanation}
              </div>
            )}
          </div>
        )}
      </div>
      {block.caption && (
        <p className="code-caption">
          <Inline text={l(block.caption)} />
        </p>
      )}
    </>
  );
}
