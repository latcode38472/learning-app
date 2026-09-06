import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { LANGUAGES } from '@/i18n/languages';
import { useStore, type PaceSetting, type StyleSetting } from '@/state/store';
import { useDocumentTitle, Badge } from '@/components/ui';

type Experience = 'none' | 'some' | 'yes';

export function OnboardingPage() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const settings = useStore((s) => s.settings);
  const setLanguage = useStore((s) => s.setLanguage);
  const updateSettings = useStore((s) => s.updateSettings);
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [experience, setExperience] = useState<Experience>('none');
  const [name, setName] = useState(settings.name);
  useDocumentTitle(t('onboarding.welcome'));

  const finish = (placement: boolean) => {
    completeOnboarding({ name: name.trim() });
    navigate(placement ? '/placement' : '/', { replace: true });
  };

  const styles: Array<{ value: StyleSetting; title: string; desc: string }> = [
    { value: 'playful', title: t('onboarding.stylePlayful'), desc: t('onboarding.stylePlayfulDesc') },
    { value: 'focused', title: t('onboarding.styleFocused'), desc: t('onboarding.styleFocusedDesc') },
  ];
  const paces: Array<{ value: PaceSetting; title: string; desc: string }> = [
    { value: 'slow', title: t('onboarding.paceSlow'), desc: t('onboarding.paceSlowDesc') },
    { value: 'standard', title: t('onboarding.paceStandard'), desc: t('onboarding.paceStandardDesc') },
    { value: 'fast', title: t('onboarding.paceFast'), desc: t('onboarding.paceFastDesc') },
  ];
  const experiences: Array<{ value: Experience; title: string; desc: string }> = [
    { value: 'none', title: t('onboarding.experienceNo'), desc: t('onboarding.experienceNoDesc') },
    { value: 'some', title: t('onboarding.experienceSome'), desc: t('onboarding.experienceSomeDesc') },
    { value: 'yes', title: t('onboarding.experienceYes'), desc: t('onboarding.experienceYesDesc') },
  ];

  return (
    <div className="stack" style={{ maxWidth: 820, margin: '0 auto' }} data-testid="onboarding">
      <div>
        <h1>{t('onboarding.welcome')}</h1>
        <p className="muted">{t('onboarding.intro')}</p>
      </div>

      <section className="card stack-sm" aria-labelledby="ob-lang">
        <h2 id="ob-lang">{t('onboarding.chooseLanguage')}</h2>
        <p className="small muted">{t('onboarding.languageNote')}</p>
        <div className="choice-grid">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              className={`choice-card${lang === l.code ? ' selected' : ''}`}
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
      </section>

      <section className="card stack-sm" aria-labelledby="ob-style">
        <h2 id="ob-style">{t('onboarding.chooseStyle')}</h2>
        <div className="choice-grid">
          {styles.map((s) => (
            <button
              key={s.value}
              type="button"
              className={`choice-card${settings.style === s.value ? ' selected' : ''}`}
              onClick={() => updateSettings({ style: s.value })}
              aria-pressed={settings.style === s.value}
            >
              <span className="title">{s.title}</span>
              <span className="desc">{s.desc}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="card stack-sm" aria-labelledby="ob-pace">
        <h2 id="ob-pace">{t('onboarding.choosePace')}</h2>
        <div className="choice-grid">
          {paces.map((p) => (
            <button
              key={p.value}
              type="button"
              className={`choice-card${settings.pace === p.value ? ' selected' : ''}`}
              onClick={() => updateSettings({ pace: p.value })}
              aria-pressed={settings.pace === p.value}
            >
              <span className="title">{p.title}</span>
              <span className="desc">{p.desc}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="card stack-sm" aria-labelledby="ob-exp">
        <h2 id="ob-exp">{t('onboarding.experience')}</h2>
        <div className="choice-grid">
          {experiences.map((e) => (
            <button
              key={e.value}
              type="button"
              className={`choice-card${experience === e.value ? ' selected' : ''}`}
              onClick={() => setExperience(e.value)}
              aria-pressed={experience === e.value}
            >
              <span className="title">{e.title}</span>
              <span className="desc">{e.desc}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="card stack-sm">
        <div className="field">
          <label htmlFor="ob-name">{t('onboarding.nameLabel')}</label>
          <input id="ob-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('onboarding.namePlaceholder')} maxLength={40} />
          <span className="help">{t('onboarding.privacy')}</span>
        </div>
        <div className="btn-row">
          <button type="button" className="btn btn-primary btn-lg" onClick={() => finish(experience === 'yes')} data-testid="onboarding-start">
            {experience === 'yes' ? t('onboarding.startPlacement') : t('onboarding.start')}
          </button>
          {experience === 'yes' && (
            <button type="button" className="btn btn-lg" onClick={() => finish(false)}>
              {t('onboarding.start')}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
