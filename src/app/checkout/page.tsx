import React from 'react';
import { Metadata } from 'next';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { getSiteSettings } from '@/lib/data/queries';
import { getServerTranslations } from '@/lib/i18n/server';
import { CheckoutClient } from './CheckoutClient';

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslations();
  return {
    title: t.checkout.pageTitle,
    description: t.checkout.pageSubtitle,
  };
}

export default async function CheckoutPage() {
  const settings = await getSiteSettings();
  const { t } = await getServerTranslations();

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 font-sans">
      <AnnouncementBar settings={settings} />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-plum-900 mb-2">
          {t.checkout.pageTitle}
        </h1>
        <p className="text-xs text-ink-500 mb-8">
          {t.checkout.pageSubtitle}
        </p>

        <CheckoutClient settings={settings} />
      </main>

      <Footer settings={settings} />
    </div>
  );
}

