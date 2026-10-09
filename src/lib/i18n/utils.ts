import { Locale } from '@/types';

/**
 * Priority resolution for translatable database fields:
 * 1. Manually/explicitly provided Arabic value (when locale === 'ar')
 * 2. English fallback if Arabic value is missing/empty
 * 3. When locale === 'en', always returns English value (or Arabic if English is missing)
 */
export function getLocalizedValue({
  locale,
  english,
  arabic,
  generatedFallback,
}: {
  locale: Locale;
  english?: string | null;
  arabic?: string | null;
  generatedFallback?: string | null;
}): string {
  if (locale === 'ar') {
    if (arabic && arabic.trim().length > 0) {
      return arabic.trim();
    }
    if (generatedFallback && generatedFallback.trim().length > 0) {
      return generatedFallback.trim();
    }
    return english ? english.trim() : '';
  }

  // English locale
  if (english && english.trim().length > 0) {
    return english.trim();
  }
  return arabic ? arabic.trim() : '';
}

/**
 * Format currency in a locale-aware manner (QAR / ر.ق).
 */
export function formatPrice(amount: number, locale: Locale = 'en', currencyOverride?: string): string {
  const formattedNumber = amount.toFixed(2);
  if (locale === 'ar') {
    const symbol = currencyOverride === 'QAR' || !currencyOverride ? 'ر.ق' : currencyOverride;
    return `${formattedNumber} ${symbol}`;
  }
  const symbol = currencyOverride || 'QAR';
  return `${symbol} ${formattedNumber}`;
}

/**
 * Format dates gracefully per locale.
 */
export function formatDate(dateInput: string | Date, locale: Locale = 'en'): string {
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-QA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return String(dateInput);
  }
}
