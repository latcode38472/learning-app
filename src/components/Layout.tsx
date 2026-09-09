import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { LANGUAGES } from '@/i18n/languages';
import { useStore } from '@/state/store';
import { newlyEarned, ACHIEVEMENTS } from '@/state/achievements';
import { useApplyDocumentSettings } from './theme';
import { Tutor } from './Tutor';
import { useToast } from './ui';
import { resetTutorContext } from '@/tutor/context';
import { PageAnchor } from './PageAnchor';

export function AppShell() {
  const { t, lang } = useI18n();
  const setLanguage = useStore((s) => s.setLanguage);
  const touchActivity = useStore((s) => s.touchActivity);
  const setLastLocation = useStore((s) => s.setLastLocation);
  const progress = useStore((s) => s.progress);
  const unlockAchievement = useStore((s) => s.unlockAchievement);
  const toast = useToast();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  useApplyDocumentSettings();

  // Remember where the learner is, for "continue where you left off".
  useEffect(() => {
    touchActivity();
    if (/^\/(lesson|project|assessment|module)\//.test(location.pathname)) setLastLocation(location.pathname);
    if (!/^\/(lesson|assessment|project)\//.test(location.pathname)) resetTutorContext();
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname, setLastLocation, touchActivity]);

  // Achievements are evaluated whenever progress changes.
  useEffect(() => {
    for (const id of newlyEarned(progress)) {
      if (unlockAchievement(id)) {
        const def = ACHIEVEMENTS.find((a) => a.id === id);
        if (def) toast(`${def.icon} ${t(`achievements.${def.titleKey}` as never)}`);
      }
    }
  }, [progress, unlockAchievement, toast, t]);

  const links: Array<[string, string]> = [
    ['/', t('nav.home')],
    ['/curriculum', t('nav.curriculum')],
    ['/projects', t('nav.projects')],
    ['/review', t('nav.review')],
    ['/glossary', t('nav.glossary')],
    ['/labs', t('nav.labs')],
    ['/achievements', t('nav.achievements')],
    ['/settings', t('nav.settings')],
  ];

  return (
    <div className="app-shell">
      <PageAnchor target="main" className="skip-link">
        {t('app.skipToContent')}
      </PageAnchor>
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand" aria-label={t('app.name')}>
            <span className="brand-mark" aria-hidden="true">
              {'>_'}
            </span>
            {t('app.name')}
          </NavLink>
          <button type="button" className="btn btn-sm menu-button" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-controls="main-nav">
            ☰ {t('nav.menu')}
          </button>
          <nav id="main-nav" className={`nav${menuOpen ? ' open' : ''}`} aria-label={t('nav.main')}>
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="topbar-actions">
            <label className="sr-only" htmlFor="lang-switch">
              {t('app.languageNotice')}
            </label>
            <select
              id="lang-switch"
              className="btn btn-sm"
              value={lang}
              onChange={(e) => setLanguage(e.target.value as typeof lang)}
              data-testid="lang-switch"
              style={{ paddingInline: '0.5rem' }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>
      <main id="main" className="page" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="footer">
        {t('app.name')} · {t('app.tagline')} · {t('common.ltrCode')}
      </footer>
      <Tutor />
    </div>
  );
}
