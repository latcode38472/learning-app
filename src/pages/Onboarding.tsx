/**
 * First-use flow. Two short screens:
 *  1. language
 *  2. starting point (new to programming / programmed before), a small example
 *     of what learners will build, and an optional, collapsed "look, pace and
 *     nickname" section. Everything in it can be changed later in Settings.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { LANGUAGES } from '@/i18n/languages';
import { useStore, type ExperienceSetting, type PaceSetting, type StyleSetting } from '@/state/store';
import { useDocumentTitle, Badge, Segmented } from '@/components/ui';

const SAMPLE = `print("You stand at the gate of an old castle.")
choice = input("Go in, or walk away? ")
if choice == "in":
    print("The door creaks open...")
else:
    print("You walk back into the forest.")`;

const SAMPLE_HE = `print("אתם עומדים בשער של טירה עתיקה.")
choice = input("להיכנס או ללכת? ")
if choice == "להיכנס":
    print("הדלת נפתחת בחריקה...")
else:
    print("אתם חוזרים אל היער.")`;

export function OnboardingPage() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const settings = useStore((s) => s.settings);
  const setLanguage = useStore((s) => s.setLanguage);
  const updateSettings = useStore((s) => s.updateSettings);
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [screen, setScreen] = useState<1 | 2>(1);
  const [path, setPath] = useState<ExperienceSetting>('beginner');
  const [name, setName] = useState(settings.name);
  useDocumentTitle(t('onboarding.welcome'));

  const finish = (placement: boolean) => {
    completeOnboarding({ name: name.trim(), experience: path });
    navigate(placement ? '/placement' : '/', { replace: true });
  };

  return (
    <div className="stack" style={{ maxWidth: 760, margin: '0 auto' }} data-testid="onboarding">
      <div>
        <div className="small muted">{t('onboarding.stepOf', { i: screen, n: 2 })}</div>
        <h1>{t('onboarding.welcome')}</h1>
        <p className="muted" style={{ maxWidth: 620 }}>
          {t('onboarding.intro')}
        </p>
      </div>

      {screen === 1 && (
        <section className="card stack-sm" aria-labelledby="ob-lang">
          <h2 id="ob-lang">{t('onboarding.chooseLanguage')}</h2>
          <div className="choice-grid">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                className={`choice-card choice-card-lg${lang === l.code ? ' selected' : ''}`}
                onClick={() => setLanguage(l.code)}
                aria-pressed={lang === l.code}
                data-testid={`lang-${l.code}`}
                lang={l.code}
                dir={l.dir}
              >
                <span className="title">{l.nativeName}</span>
                <span className="desc">{l.englishName}</span>{' '}
                {l.complete && <Badge tone="success">{t('onboarding.availableFully')}</Badge>}
              </button>
            ))}
          </div>
          <p className="small muted">{t('onboarding.languageNote')}</p>
          <div className="btn-row">
            <button type="button" className="btn btn-primary btn-lg" onClick={() => setScreen(2)} data-testid="onboarding-next">
              {t('onboarding.continue')}
            </button>
          </div>
        </section>
      )}

      {screen === 2 && (
        <>
          <section className="card stack-sm" aria-labelledby="ob-path">
            <h2 id="ob-path">{t('onboarding.whoTitle')}</h2>
            <div className="choice-grid">
              <button type="button" className={`choice-card choice-card-lg${path === 'beginner' ? ' selected' : ''}`} onClick={() => setPath('beginner')} aria-pressed={path === 'beginner'} data-testid="path-beginner">
                <span className="title">{t('onboarding.pathBeginner')}</span>
                <span className="desc">{t('onboarding.pathBeginnerDesc')}</span>
              </button>
              <button type="button" className={`choice-card choice-card-lg${path === 'experienced' ? ' selected' : ''}`} onClick={() => setPath('experienced')} aria-pressed={path === 'experienced'} data-testid="path-experienced">
                <span className="title">{t('onboarding.pathExperienced')}</span>
                <span className="desc">{t('onboarding.pathExperiencedDesc')}</span>
              </button>
            </div>
          </section>

          <section className="card stack-sm" aria-labelledby="ob-sample">
            <h2 id="ob-sample">{t('onboarding.sampleTitle')}</h2>
            <p className="small">{t('onboarding.sampleIntro')}</p>
            <div className="code-block">
              <pre>
                <code>{lang === 'he' ? SAMPLE_HE : SAMPLE}</code>
              </pre>
            </div>
            <p className="small muted">{t('onboarding.sampleCaption')}</p>
            <p className="small muted" style={{ margin: 0 }}>
              {t('onboarding.honest')}
            </p>
          </section>

          <details className="card" data-testid="onboarding-preferences">
            <summary>{t('onboarding.preferencesToggle')}</summary>
            <div className="stack-sm" style={{ marginTop: '0.8rem' }}>
              <p className="small muted">{t('onboarding.preferencesNote')}</p>
              <div className="field">
                <label>{t('onboarding.chooseStyle')}</label>
                <Segmented<StyleSetting>
                  label={t('onboarding.chooseStyle')}
                  value={settings.style}
                  onChange={(v) => updateSettings({ style: v })}
                  options={[
                    { value: 'focused', label: t('onboarding.styleFocused') },
                    { value: 'playful', label: t('onboarding.stylePlayful') },
                  ]}
                />
                <span className="help">{settings.style === 'playful' ? t('onboarding.stylePlayfulDesc') : t('onboarding.styleFocusedDesc')}</span>
              </div>
              <div className="field">
                <label>{t('onboarding.choosePace')}</label>
                <Segmented<PaceSetting>
                  label={t('onboarding.choosePace')}
                  value={settings.pace}
                  onChange={(v) => updateSettings({ pace: v })}
                  options={[
                    { value: 'slow', label: t('onboarding.paceSlow') },
                    { value: 'standard', label: t('onboarding.paceStandard') },
                    { value: 'fast', label: t('onboarding.paceFast') },
                  ]}
                />
                <span className="help">{settings.pace === 'slow' ? t('onboarding.paceSlowDesc') : settings.pace === 'fast' ? t('onboarding.paceFastDesc') : t('onboarding.paceStandardDesc')}</span>
              </div>
              <div className="field">
                <label htmlFor="ob-name">{t('onboarding.nameLabel')}</label>
                <input id="ob-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('onboarding.namePlaceholder')} maxLength={40} />
              </div>
            </div>
          </details>

          <section className="card stack-sm">
            <p className="small muted" style={{ margin: 0 }}>
              {t('onboarding.privacy')}
            </p>
            <div className="btn-row">
              <button type="button" className="btn" onClick={() => setScreen(1)}>
                {t('onboarding.back')}
              </button>
              {path === 'experienced' ? (
                <>
                  <button type="button" className="btn btn-primary btn-lg" onClick={() => finish(true)} data-testid="onboarding-start">
                    {t('onboarding.startPlacement')}
                  </button>
                  <button type="button" className="btn btn-lg" onClick={() => finish(false)} data-testid="onboarding-start-anyway">
                    {t('onboarding.startAnyway')}
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-primary btn-lg" onClick={() => finish(false)} data-testid="onboarding-start">
                  {t('onboarding.start')}
                </button>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
