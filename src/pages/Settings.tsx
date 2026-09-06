import { useRef, useState } from 'react';
import { useI18n } from '@/i18n';
import { LANGUAGES } from '@/i18n/languages';
import { buildProgressExport, useStore } from '@/state/store';
import { downloadText } from '@/utils/download';
import { Notice, Segmented, useDocumentTitle, useToast } from '@/components/ui';

export function SettingsPage() {
  const { t, lang } = useI18n();
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const setLanguage = useStore((s) => s.setLanguage);
  const importProgress = useStore((s) => s.importProgress);
  const resetProgress = useStore((s) => s.resetProgress);
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  useDocumentTitle(t('settings.title'));

  const onImport = async (file: File) => {
    try {
      const data = JSON.parse(await file.text());
      setMessage(importProgress(data) ? t('settings.importDone') : t('settings.importFailed'));
    } catch {
      setMessage(t('settings.importFailed'));
    }
  };

  return (
    <div className="stack" style={{ maxWidth: 760 }} data-testid="settings">
      <h1>{t('settings.title')}</h1>

      <section className="card stack-sm">
        <h2>{t('settings.language')}</h2>
        <p className="small muted">{t('settings.languageNote')}</p>
        <div className="choice-grid">
          {LANGUAGES.map((l) => (
            <button key={l.code} type="button" className={`choice-card${lang === l.code ? ' selected' : ''}`} onClick={() => setLanguage(l.code)} aria-pressed={lang === l.code} lang={l.code} dir={l.dir} data-testid={`settings-lang-${l.code}`}>
              <span className="title">{l.nativeName}</span>
              <span className="desc">{l.englishName}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="card stack-sm">
        <h2>{t('settings.appearance')}</h2>
        <div className="field">
          <label>{t('settings.theme')}</label>
          <Segmented
            label={t('settings.theme')}
            value={settings.theme}
            onChange={(v) => updateSettings({ theme: v })}
            options={[
              { value: 'system', label: t('settings.themeSystem') },
              { value: 'light', label: t('settings.themeLight') },
              { value: 'dark', label: t('settings.themeDark') },
            ]}
          />
        </div>
        <div className="field">
          <label>{t('settings.style')}</label>
          <Segmented
            label={t('settings.style')}
            value={settings.style}
            onChange={(v) => updateSettings({ style: v })}
            options={[
              { value: 'playful', label: t('onboarding.stylePlayful') },
              { value: 'focused', label: t('onboarding.styleFocused') },
            ]}
          />
        </div>
        <div className="field">
          <label>{t('settings.pace')}</label>
          <Segmented
            label={t('settings.pace')}
            value={settings.pace}
            onChange={(v) => updateSettings({ pace: v })}
            options={[
              { value: 'slow', label: t('onboarding.paceSlow') },
              { value: 'standard', label: t('onboarding.paceStandard') },
              { value: 'fast', label: t('onboarding.paceFast') },
            ]}
          />
        </div>
        <div className="field">
          <label>{t('settings.fontSize')}</label>
          <Segmented
            label={t('settings.fontSize')}
            value={settings.fontSize}
            onChange={(v) => updateSettings({ fontSize: v })}
            options={[
              { value: 'normal', label: t('settings.fontNormal') },
              { value: 'large', label: t('settings.fontLarge') },
              { value: 'xlarge', label: t('settings.fontXLarge') },
            ]}
          />
        </div>
        <h3>{t('settings.accessibility')}</h3>
        <label className="toggle">
          <input type="checkbox" checked={settings.reduceMotion} onChange={(e) => updateSettings({ reduceMotion: e.target.checked })} /> {t('settings.reduceMotion')}
        </label>
        <label className="toggle">
          <input type="checkbox" checked={settings.highContrast} onChange={(e) => updateSettings({ highContrast: e.target.checked })} /> {t('settings.highContrast')}
        </label>
        <div className="field">
          <label htmlFor="settings-name">{t('settings.name')}</label>
          <input id="settings-name" type="text" value={settings.name} onChange={(e) => updateSettings({ name: e.target.value })} maxLength={40} />
        </div>
      </section>

      <section className="card stack-sm">
        <h2>{t('settings.tutor')}</h2>
        <p className="small">✓ {t('settings.tutorBuiltIn')}</p>
        <h3>{t('settings.tutorRemote')}</h3>
        <p className="small muted">{t('settings.tutorRemoteNote')}</p>
        <div className="field">
          <label htmlFor="tutor-endpoint">{t('settings.tutorEndpoint')}</label>
          <input id="tutor-endpoint" type="url" placeholder="http://localhost:8787" value={settings.tutor.endpoint} onChange={(e) => updateSettings({ tutor: { ...settings.tutor, endpoint: e.target.value } })} dir="ltr" />
        </div>
        <label className="toggle">
          <input type="checkbox" checked={settings.tutor.costAcknowledged} onChange={(e) => updateSettings({ tutor: { ...settings.tutor, costAcknowledged: e.target.checked } })} /> {t('settings.tutorCostAck')}
        </label>
        <label className="toggle">
          <input type="checkbox" checked={settings.tutor.remoteEnabled} disabled={!settings.tutor.costAcknowledged || !settings.tutor.endpoint} onChange={(e) => updateSettings({ tutor: { ...settings.tutor, remoteEnabled: e.target.checked } })} /> {t('settings.tutorEnable')}
        </label>
      </section>

      <section className="card stack-sm">
        <h2>{t('settings.data')}</h2>
        <p className="small muted">{t('settings.dataNote')}</p>
        <div className="btn-row">
          <button type="button" className="btn" onClick={() => downloadText('codepath-progress.json', JSON.stringify(buildProgressExport(), null, 2), 'application/json')} data-testid="export-progress">
            {t('settings.export')}
          </button>
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
            {t('settings.import')}
          </button>
          <input ref={fileRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
          <button
            type="button"
            className="btn"
            style={{ color: 'var(--danger)' }}
            onClick={() => {
              if (window.confirm(t('settings.resetConfirm'))) {
                resetProgress();
                toast(t('settings.resetDone'));
              }
            }}
          >
            {t('settings.reset')}
          </button>
        </div>
        {message && <Notice tone="info">{message}</Notice>}
      </section>
    </div>
  );
}
