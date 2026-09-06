import { useEffect, useState } from 'react';
import { useStore } from '@/state/store';
import { languageInfo } from '@/i18n/languages';

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
}

/** Returns 'light' | 'dark' after applying the user's theme setting. */
export function useResolvedTheme(): 'light' | 'dark' {
  const theme = useStore((s) => s.settings.theme);
  const [system, setSystem] = useState(systemPrefersDark());
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const handler = (e: MediaQueryListEvent) => setSystem(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  if (theme === 'system') return system ? 'dark' : 'light';
  return theme;
}

/** Applies language direction, theme, style, font size and accessibility flags to <html>. */
export function useApplyDocumentSettings() {
  const settings = useStore((s) => s.settings);
  const resolved = useResolvedTheme();
  useEffect(() => {
    const root = document.documentElement;
    const info = languageInfo(settings.language);
    root.lang = settings.language;
    root.dir = info.dir;
    root.dataset.theme = resolved;
    root.dataset.style = settings.style;
    root.dataset.font = settings.fontSize;
    root.dataset.contrast = settings.highContrast ? 'high' : 'normal';
    root.dataset.motion = settings.reduceMotion ? 'reduce' : 'normal';
    root.style.colorScheme = resolved;
  }, [settings, resolved]);
}
