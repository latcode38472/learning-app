import type { LangCode } from '@/content/schema';

export interface LanguageInfo {
  code: LangCode;
  /** Name of the language in that language. */
  nativeName: string;
  /** Name in English (for the language picker). */
  englishName: string;
  dir: 'ltr' | 'rtl';
  /** Whether the whole learning experience (UI + Stage 1 lessons) is available. */
  complete: boolean;
}

/**
 * To add a language: add it here, add a UI dictionary in src/i18n/<code>.ts,
 * register it in src/i18n/index.ts, and add the `<code>` field on content.
 */
export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', nativeName: 'English', englishName: 'English', dir: 'ltr', complete: true },
  { code: 'he', nativeName: 'עברית', englishName: 'Hebrew', dir: 'rtl', complete: true },
];

export const DEFAULT_LANGUAGE: LangCode = 'en';

export function languageInfo(code: LangCode): LanguageInfo {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

export function isLangCode(value: unknown): value is LangCode {
  return typeof value === 'string' && LANGUAGES.some((l) => l.code === value);
}
