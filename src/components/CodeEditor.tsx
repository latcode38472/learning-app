import { useMemo, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { EditorView, keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { Prec } from '@codemirror/state';
import { useI18n } from '@/i18n';
import { useResolvedTheme } from '@/components/theme';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  readOnly?: boolean;
  minHeight?: string;
  ariaLabel?: string;
}

/**
 * Python editor. Always left-to-right, regardless of UI language.
 *
 * Tab indents (beginners need it for Python blocks). To keep keyboard users
 * out of a trap, Escape switches the editor to "tab focus mode" for a few
 * seconds, during which Tab moves focus instead of indenting; the hint below
 * the editor explains this.
 */
export function CodeEditor({ value, onChange, onRun, readOnly = false, minHeight = '160px', ariaLabel }: Props) {
  const { t } = useI18n();
  const theme = useResolvedTheme();
  // Keep the latest onRun in a ref so the keymap extension stays stable across renders.
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;
  const extensions = useMemo(
    () => [
      python(),
      EditorView.lineWrapping,
      keymap.of([indentWithTab]),
      Prec.highest(
        keymap.of([
          {
            key: 'Mod-Enter',
            run: () => {
              onRunRef.current?.();
              return true;
            },
          },
          {
            key: 'Escape',
            run: (view) => {
              view.setTabFocusMode(3000);
              return false;
            },
          },
        ]),
      ),
      EditorView.contentAttributes.of({ 'aria-label': ariaLabel ?? t('editor.editorLabel'), dir: 'ltr' }),
    ],
    [ariaLabel, t],
  );
  return (
    <div className="workbench-editor" dir="ltr">
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={extensions}
        theme={theme === 'dark' ? 'dark' : 'light'}
        readOnly={readOnly}
        minHeight={minHeight}
        basicSetup={{ foldGutter: false, autocompletion: false, closeBrackets: false, highlightActiveLine: true, tabSize: 4 }}
        indentWithTab={false}
      />
    </div>
  );
}
