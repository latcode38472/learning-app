import { allProjects } from '@/content';
import { useI18n } from '@/i18n';
import { useStore } from '@/state/store';
import { downloadText, safeFileName } from '@/utils/download';
import { useDocumentTitle } from '@/components/ui';

export function LocalPage() {
  const { t, l } = useI18n();
  const progress = useStore((s) => s.progress);
  useDocumentTitle(t('local.title'));

  const exportAll = () => {
    const parts: string[] = [];
    for (const p of allProjects) {
      const code = progress.projects[p.id]?.code;
      if (code) parts.push(`# ===== ${p.id}.py — ${l(p.title)} =====\n${code}\n`);
    }
    for (const [id, code] of Object.entries(progress.drafts)) {
      if (code && code.trim()) parts.push(`# ===== ${id}.py =====\n${code}\n`);
    }
    downloadText('codepath-my-code.py', parts.join('\n') || '# No saved code yet\n');
  };

  return (
    <div className="stack" style={{ maxWidth: 760 }} data-testid="local">
      <h1>{t('local.title')}</h1>
      <p className="muted">{t('local.intro')}</p>
      <ol className="stack" style={{ listStyle: 'none', padding: 0 }}>
        <li className="card">
          <h2>1. {t('local.step1')}</h2>
          <p>{t('local.step1Body')}</p>
        </li>
        <li className="card">
          <h2>2. {t('local.step2')}</h2>
          <p>{t('local.step2Body')}</p>
        </li>
        <li className="card">
          <h2>3. {t('local.step3')}</h2>
          <p>{t('local.step3Body')}</p>
          <div className="code-block">
            <pre>
              <code>{'python3 hello.py'}</code>
            </pre>
          </div>
          <p className="small muted">{t('local.terminalNote')}</p>
        </li>
        <li className="card">
          <h2>4. {t('local.step4')}</h2>
          <p>{t('local.step4Body')}</p>
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={exportAll}>
              {t('local.exportAll')}
            </button>
            {allProjects
              .filter((p) => progress.projects[p.id]?.code)
              .map((p) => (
                <button key={p.id} type="button" className="btn btn-sm" onClick={() => downloadText(safeFileName(p.id), progress.projects[p.id]!.code)}>
                  {l(p.title)} (.py)
                </button>
              ))}
          </div>
        </li>
      </ol>
      <p className="muted">{t('local.next')}</p>
    </div>
  );
}
