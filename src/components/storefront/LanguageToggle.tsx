'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';

interface LanguageToggleProps {
  className?: string;
  variant?: 'header' | 'footer' | 'drawer' | 'admin' | 'pill' | 'minimal';
}

export function LanguageToggle({ className = '', variant = 'header' }: LanguageToggleProps) {
  const { locale, setLocale } = useLocale();

  if (variant === 'drawer' || variant === 'admin' || variant === 'pill') {
    return (
      <div className={`flex items-center space-x-2 rtl:space-x-reverse bg-plum-900/60 p-1 rounded-xl border border-plum-800 ${className}`}>
        <button
          onClick={() => setLocale('en')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            locale === 'en'
              ? 'bg-plum-800 text-white shadow-xs'
              : 'text-plum-300 hover:text-white'
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLocale('ar')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            locale === 'ar'
              ? 'bg-plum-800 text-white shadow-xs'
              : 'text-plum-300 hover:text-white'
          }`}
        >
          العربية
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-1.5 rtl:space-x-reverse text-xs ${className}`}>
      <Globe className="w-3.5 h-3.5 text-ink-500" />
      <div className="flex items-center bg-white/80 backdrop-blur-xs rounded-full p-0.5 border border-ink-100 shadow-2xs">
        <button
          onClick={() => setLocale('en')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
            locale === 'en'
              ? 'bg-plum-900 text-white shadow-xs'
              : 'text-ink-600 hover:text-plum-900'
          }`}
          aria-label="Switch to English"
        >
          EN
        </button>
        <button
          onClick={() => setLocale('ar')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
            locale === 'ar'
              ? 'bg-plum-900 text-white shadow-xs'
              : 'text-ink-600 hover:text-plum-900'
          }`}
          aria-label="التبديل إلى اللغة العربية"
        >
          العربية
        </button>
      </div>
    </div>
  );
}
