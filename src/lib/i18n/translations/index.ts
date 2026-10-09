import { Locale } from '@/types';
import { en, Translations } from './en';
import { ar } from './ar';

export const translations: Record<Locale, Translations> = {
  en,
  ar,
};

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations.en;
}

export { en, ar };
export type { Translations };
