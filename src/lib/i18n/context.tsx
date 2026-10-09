'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Locale, TextDirection } from '@/types';
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, getDirection, isRTL, isValidLocale } from './config';
import { getTranslations, Translations } from './translations';
import { formatPrice as formatPriceUtil, getLocalizedValue as getLocalizedUtil } from './utils';

interface LocaleContextValue {
  locale: Locale;
  direction: TextDirection;
  isRtl: boolean;
  t: Translations;
  setLocale: (newLocale: Locale) => void;
  toggleLocale: () => void;
  formatPrice: (amount: number, currencyOverride?: string) => string;
  getLocalized: (english?: string | null, arabic?: string | null) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  // Read saved locale cookie on initial mount
  useEffect(() => {
    try {
      const match = document.cookie.match(/(?:^|;\s*)burble_locale=([^;]+)/);
      const saved = match ? decodeURIComponent(match[1]) : null;
      if (saved && isValidLocale(saved) && saved !== locale) {
        setLocaleState(saved);
      }
    } catch {}
  }, []);

  // Sync client state with document attributes
  useEffect(() => {
    const dir = getDirection(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    if (locale === 'ar') {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [locale]);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      if (!isValidLocale(newLocale) || newLocale === locale) return;
      
      // 1. Set cookie for SSR persistence
      setCookie(LOCALE_COOKIE_NAME, newLocale);
      
      // 2. Update local state
      setLocaleState(newLocale);
      
      // 3. Update DOM immediately
      document.documentElement.lang = newLocale;
      document.documentElement.dir = getDirection(newLocale);
      if (newLocale === 'ar') {
        document.documentElement.classList.add('rtl');
      } else {
        document.documentElement.classList.remove('rtl');
      }

      // 4. Refresh router so server components re-render with the new cookie
      router.refresh();
    },
    [locale, router]
  );

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  }, [locale, setLocale]);

  const t = useMemo(() => getTranslations(locale), [locale]);
  const direction = useMemo(() => getDirection(locale), [locale]);
  const isRtlVal = useMemo(() => isRTL(locale), [locale]);

  const formatPrice = useCallback(
    (amount: number, currencyOverride?: string) => {
      return formatPriceUtil(amount, locale, currencyOverride);
    },
    [locale]
  );

  const getLocalized = useCallback(
    (english?: string | null, arabic?: string | null) => {
      return getLocalizedUtil({ locale, english, arabic });
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      direction,
      isRtl: isRtlVal,
      t,
      setLocale,
      toggleLocale,
      formatPrice,
      getLocalized,
    }),
    [locale, direction, isRtlVal, t, setLocale, toggleLocale, formatPrice, getLocalized]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    // Fallback if rendered outside provider
    const fallbackLocale = DEFAULT_LOCALE;
    return {
      locale: fallbackLocale,
      direction: getDirection(fallbackLocale),
      isRtl: isRTL(fallbackLocale),
      t: getTranslations(fallbackLocale),
      setLocale: () => {},
      toggleLocale: () => {},
      formatPrice: (amount: number, curr?: string) => formatPriceUtil(amount, fallbackLocale, curr),
      getLocalized: (en?: string | null, ar?: string | null) => getLocalizedUtil({ locale: fallbackLocale, english: en, arabic: ar }),
    };
  }
  return context;
}
