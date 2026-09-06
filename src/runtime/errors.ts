/**
 * Turns Python exceptions into plain-language, localized explanations.
 */
import type { LangCode } from '@/content/schema';
import { translate, type UiKey } from '@/i18n';
import type { PythonError } from './runner';

const KNOWN: Record<string, UiKey> = {
  SyntaxError: 'errors.SyntaxError',
  IndentationError: 'errors.IndentationError',
  TabError: 'errors.IndentationError',
  NameError: 'errors.NameError',
  TypeError: 'errors.TypeError',
  ValueError: 'errors.ValueError',
  ZeroDivisionError: 'errors.ZeroDivisionError',
  IndexError: 'errors.IndexError',
  KeyError: 'errors.KeyError',
  AttributeError: 'errors.AttributeError',
  RecursionError: 'errors.RecursionError',
  UnboundLocalError: 'errors.UnboundLocalError',
  EOFError: 'errors.EOFError',
};

/** Extract the most useful fragment of the Python message for the {detail} placeholder. */
function detailOf(err: PythonError): string {
  const m = err.message ?? '';
  switch (err.type) {
    case 'NameError': {
      const match = m.match(/name '([^']+)'/);
      return match ? `'${match[1]}'` : m;
    }
    case 'KeyError':
      return m;
    case 'UnboundLocalError': {
      const match = m.match(/'([^']+)'/);
      return match ? `'${match[1]}'` : m;
    }
    default:
      return m;
  }
}

export interface FriendlyError {
  title: string;
  explanation: string;
  lineHint?: string;
  technical: string;
}

export function explainError(err: PythonError, lang: LangCode): FriendlyError {
  const key = KNOWN[err.type] ?? 'errors.default';
  const explanation = translate(lang, key, { detail: detailOf(err), type: err.type });
  const title = err.line
    ? translate(lang, 'editor.errorTitle', { line: err.line })
    : translate(lang, 'editor.errorTitleNoLine');
  const lineHint = err.line && err.source ? translate(lang, 'errors.lineHint', { line: err.line }) : undefined;
  return { title, explanation, lineHint, technical: err.traceback || `${err.type}: ${err.message}` };
}
