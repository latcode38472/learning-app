import { useCallback, useMemo } from 'react';
import type { LangCode, Localized } from '@/content/schema';
import { useStore } from '@/state/store';
import { en, type UiStrings } from './en';
import { he } from './he';
import { languageInfo, LANGUAGES } from './languages';

type Dict = { [k: string]: string | Dict };

const dictionaries: Record<LangCode, Dict> = {
  en: en as unknown as Dict,
  he: he as unknown as Dict,
};

/** Dotted key into the UI dictionary, e.g. "nav.home". */
export type UiKey = DottedKeys<UiStrings>;

type DottedKeys<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : DottedKeys<T[K], `${P}${K}.`>;
}[keyof T & string];

function lookup(dict: Dict, key: string): string | undefined {
  let cur: string | Dict | undefined = dict;
  for (const part of key.split('.')) {
    if (cur === undefined || typeof cur === 'string') return undefined;
    cur = cur[part];
  }
  return typeof cur === 'string' ? cur : undefined;
}

export function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (m, name) => (name in params ? String(params[name]) : m));
}

/** Translate a UI key for a given language, falling back to English. */
export function translate(lang: LangCode, key: UiKey, params?: Record<string, string | number>): string {
  const text = lookup(dictionaries[lang], key) ?? lookup(dictionaries.en, key) ?? key;
  return interpolate(text, params);
}

export interface LocalizeResult<T> {
  value: T;
  /** True when the requested language was missing and English was used instead. */
  fellBack: boolean;
}

/** Resolve a localized content value with explicit fallback information. */
export function localizeWithInfo<T>(value: Localized<T> | T, lang: LangCode): LocalizeResult<T> {
  if (value !== null && typeof value === 'object' && 'en' in (value as object)) {
    const loc = value as Localized<T>;
    const chosen = loc[lang];
    const present = typeof chosen === 'string' ? chosen.trim() !== '' : chosen !== undefined && chosen !== null;
    if (present) return { value: chosen as T, fellBack: false };
    return { value: loc.en, fellBack: lang !== 'en' };
  }
  return { value: value as T, fellBack: false };
}

export function localize<T>(value: Localized<T> | T, lang: LangCode): T {
  return localizeWithInfo(value, lang).value;
}

/** React hook: current language, direction, translate function and content localizer. */
export function useI18n() {
  const lang = useStore((s) => s.settings.language);
  const info = languageInfo(lang);
  const t = useCallback((key: UiKey, params?: Record<string, string | number>) => translate(lang, key, params), [lang]);
  const l = useCallback(<T,>(value: Localized<T> | T) => localize(value, lang), [lang]);
  return useMemo(() => ({ lang, dir: info.dir, t, l, languages: LANGUAGES, info }), [lang, info, t, l]);
}

/**
 * Walks a content object and reports whether any Text leaf lacks the language.
 * Used to show the "shown in English" notice on a lesson.
 */
export function hasMissingTranslation(obj: unknown, lang: LangCode): boolean {
  if (lang === 'en') return false;
  if (obj === null || typeof obj !== 'object') return false;
  if (Array.isArray(obj)) return obj.some((v) => hasMissingTranslation(v, lang));
  const rec = obj as Record<string, unknown>;
  if (typeof rec.en === 'string') {
    const v = rec[lang];
    return typeof v !== 'string' || v.trim() === '';
  }
  return Object.values(rec).some((v) => hasMissingTranslation(v, lang));
}

/** Locale tag for number/date formatting. */
export function localeTag(lang: LangCode): string {
  return lang === 'he' ? 'he-IL' : 'en-US';
}
