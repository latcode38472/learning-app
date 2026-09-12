/**
 * "Continue on your own computer": download the project as a folder and run
 * it in PyCharm, step by step, without assuming any terminal knowledge.
 */
import { allProjects } from '@/content';
import { useI18n } from '@/i18n';
import { useStore } from '@/state/store';
import { downloadText, safeFileName } from '@/utils/download';
import { downloadZip, type ZipEntry } from '@/utils/zip';
import { Notice, useDocumentTitle } from '@/components/ui';

function readme(lang: 'en' | 'he', title: string): string {
  if (lang === 'he') {
    return [
      `# ${title}`,
      '',
      'הקובץ main.py הוא התוכנית שכתבתם ב-CodePath.',
      '',
      '## איך מריצים',
      '',
      '1. התקינו פייתון מ-https://www.python.org/downloads/ (ב-Windows סמנו "Add python.exe to PATH").',
      '2. התקינו את PyCharm מ-https://www.jetbrains.com/pycharm/ (המהדורה החינמית מספיקה).',
      '3. ב-PyCharm: File → Open → בחרו את התיקייה הזאת → Trust Project.',
      '4. פתחו את main.py, לחצו על החץ הירוק ליד השורה הראשונה (או לחצו לחיצה ימנית → Run).',
      '5. הפלט מופיע בחלון Run למטה. כשהתוכנית מבקשת קלט, הקלידו שם ולחצו Enter.',
      '',
      'מהטרמינל (לא חובה): `python main.py` ב-Windows, `python3 main.py` ב-macOS/Linux.',
      '',
    ].join('\n');
  }
  return [
    `# ${title}`,
    '',
    'main.py is the program you wrote in CodePath.',
    '',
    '## How to run it',
    '',
    '1. Install Python from https://www.python.org/downloads/ (on Windows tick "Add python.exe to PATH").',
    '2. Install PyCharm from https://www.jetbrains.com/pycharm/ (the free edition is enough).',
    '3. In PyCharm: File → Open → choose this folder → Trust Project.',
    '4. Open main.py and press the green arrow next to the first line (or right-click → Run).',
    '5. The output appears in the Run window at the bottom. When the program asks for input, type there and press Enter.',
    '',
    'From a terminal (optional): `python main.py` on Windows, `python3 main.py` on macOS/Linux.',
    '',
  ].join('\n');
}

export function LocalPage() {
  const { t, l, lang } = useI18n();
  const progress = useStore((s) => s.progress);
  useDocumentTitle(t('local.title'));

  const withCode = allProjects.filter((p) => progress.projects[p.id]?.code?.trim());
  const draftEntries = Object.entries(progress.drafts).filter(([, code]) => code && code.trim());

  const exportProject = (projectId: string) => {
    const p = allProjects.find((x) => x.id === projectId);
    if (!p) return;
    const folder = safeFileName(p.id, '');
    const entries: ZipEntry[] = [
      { name: `${folder}/main.py`, data: progress.projects[p.id]!.code.replace(/\r\n/g, '\n') + '\n' },
      { name: `${folder}/README.md`, data: readme(lang, l(p.title)) },
    ];
    downloadZip(`${folder}.zip`, entries);
  };

  const exportAll = () => {
    const entries: ZipEntry[] = [];
    for (const p of withCode) entries.push({ name: `codepath/projects/${safeFileName(p.id, '')}/main.py`, data: progress.projects[p.id]!.code + '\n' });
    for (const [id, code] of draftEntries) entries.push({ name: `codepath/exercises/${safeFileName(id)}`, data: code + '\n' });
    entries.push({ name: 'codepath/README.md', data: readme(lang, 'CodePath') });
    downloadZip('codepath-my-code.zip', entries);
  };

  const steps: Array<{ title: string; body: string; extra?: React.ReactNode }> = [
    { title: t('local.s1'), body: t('local.s1Body') },
    { title: t('local.s2'), body: t('local.s2Body') },
    { title: t('local.s3'), body: t('local.s3Body') },
    { title: t('local.s4'), body: t('local.s4Body') },
    { title: t('local.s5'), body: t('local.s5Body') },
    { title: t('local.s6'), body: t('local.s6Body') },
    {
      title: t('local.s7'),
      body: t('local.s7Body'),
      extra: (
        <div className="code-block">
          <pre>
            <code>{'python main.py      # Windows\npython3 main.py     # macOS and Linux'}</code>
          </pre>
        </div>
      ),
    },
  ];

  return (
    <div className="stack" style={{ maxWidth: 760 }} data-testid="local">
      <h1>{t('local.title')}</h1>
      <p className="muted">{t('local.intro')}</p>

      <section className="card stack-sm">
        <h2>{t('local.downloadTitle')}</h2>
        <p className="small muted">{t('local.downloadBody')}</p>
        <div className="btn-row">
          {withCode.map((p) => (
            <button key={p.id} type="button" className="btn btn-primary" onClick={() => exportProject(p.id)} data-testid={`export-zip-${p.id}`}>
              {t('local.downloadProject', { name: l(p.title) })}
            </button>
          ))}
          {withCode.length === 0 && <span className="small muted">{t('local.noProjects')}</span>}
          {(withCode.length > 0 || draftEntries.length > 0) && (
            <button type="button" className="btn" onClick={exportAll} data-testid="export-all-zip">
              {t('local.exportAll')}
            </button>
          )}
          {withCode.map((p) => (
            <button key={`py-${p.id}`} type="button" className="btn btn-sm btn-ghost" onClick={() => downloadText(safeFileName(p.id), progress.projects[p.id]!.code)}>
              {l(p.title)} (.py)
            </button>
          ))}
        </div>
      </section>

      <ol className="stack" style={{ listStyle: 'none', padding: 0 }}>
        {steps.map((s, i) => (
          <li key={i} className="card">
            <h2>
              {i + 1}. {s.title}
            </h2>
            <p>{s.body}</p>
            {s.extra}
          </li>
        ))}
      </ol>
      <Notice tone="info">{t('local.verified')}</Notice>
      <p className="muted">{t('local.next')}</p>
    </div>
  );
}
