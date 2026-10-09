'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { t } = useLocale();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <section className="py-16 bg-plum-100/50 border-t border-plum-200/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-12 h-12 rounded-full bg-plum-800 text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Mail className="w-6 h-6 stroke-[1.5]" />
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-plum-900 tracking-tight">
          {t.newsletter.title}
        </h2>

        <p className="text-xs sm:text-sm text-ink-500 max-w-md mx-auto mt-2 mb-8 leading-relaxed font-normal">
          {t.newsletter.subtitle}
        </p>

        {subscribed ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 max-w-md mx-auto flex items-center justify-center space-x-2 rtl:space-x-reverse text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.newsletter.successMessage}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex items-center space-x-2 rtl:space-x-reverse">
            <input
              type="email"
              placeholder={t.newsletter.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white border border-ink-100 rounded-full px-5 py-3 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/30 shadow-xs"
            />
            <button
              type="submit"
              className="bg-plum-900 hover:bg-plum-800 text-white font-semibold text-xs px-6 py-3 rounded-full transition-colors shadow-md shrink-0"
            >
              {t.newsletter.subscribeButton}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
