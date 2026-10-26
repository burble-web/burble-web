import { cookies, headers } from 'next/headers';
import { Locale, TextDirection } from '@/types';
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, getDirection, isValidLocale } from './config';
import { getTranslations, Translations } from './translations';

/**
 * Server-side helper to get the active locale from incoming HTTP request headers or cookies.
 * Guaranteed to accurately reflect URL language (/en or /ar) as well as cookie preference.
 */
export async function getServerLocale(): Promise<Locale> {
  try {
    const headersList = await headers();
    const headerLocale = headersList.get('x-burble-locale');
    if (isValidLocale(headerLocale)) {
      return headerLocale;
    }
  } catch {
    // In environments where headers() is unavailable
  }

  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
    if (isValidLocale(cookieValue)) {
      return cookieValue;
    }
  } catch {
    // In static rendering or non-request context, default to English
  }
  return DEFAULT_LOCALE;
}

/**
 * Server-side helper to get dictionary translations.
 */
export async function getServerTranslations(): Promise<{
  locale: Locale;
  direction: TextDirection;
  t: Translations;
  isRtl: boolean;
}> {
  const locale = await getServerLocale();
  const direction = getDirection(locale);
  const t = getTranslations(locale);
  return {
    locale,
    direction,
    t,
    isRtl: locale === 'ar',
  };
}
