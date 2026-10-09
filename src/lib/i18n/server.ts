import { cookies } from 'next/headers';
import { Locale, TextDirection } from '@/types';
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, getDirection, isValidLocale } from './config';
import { getTranslations, Translations } from './translations';

/**
 * Server-side helper to get the active locale from incoming HTTP request cookies.
 * Guaranteed to never cause hydration mismatches with client.
 */
export async function getServerLocale(): Promise<Locale> {
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
