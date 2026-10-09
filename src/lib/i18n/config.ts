import { Locale, TextDirection } from '@/types';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'ar'];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE_NAME = 'burble_locale';

export function getDirection(locale: Locale): TextDirection {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export const getDirectionForLocale = getDirection;

export function isRTL(locale: Locale): boolean {
  return locale === 'ar';
}

export function isValidLocale(locale: string | undefined | null): locale is Locale {
  return locale === 'en' || locale === 'ar';
}
