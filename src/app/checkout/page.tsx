import React from 'react';
import { Metadata } from 'next';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { getSiteSettings, getProductBySlug } from '@/lib/data/queries';
import { getServerTranslations } from '@/lib/i18n/server';
import { CartItem } from '@/types';
import { CheckoutClient } from './CheckoutClient';

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslations();
  return {
    title: t.checkout.pageTitle,
    description: t.checkout.pageSubtitle,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ buyNow?: string; qty?: string; method?: string }>;
}) {
  const resolvedParams = await searchParams;
  const settings = await getSiteSettings();
  const { t, locale } = await getServerTranslations();

  let initialBuyNowItem: CartItem | null = null;
  let buyNowError: string | null = null;

  if (resolvedParams?.buyNow) {
    const product = await getProductBySlug(resolvedParams.buyNow);
    if (!product) {
      buyNowError = locale === 'ar' ? 'المنتج المطلوب غير موجود.' : 'Selected product could not be found.';
    } else if (!product.active) {
      buyNowError = locale === 'ar' ? 'المنتج المطلوب غير متاح حالياً.' : 'Selected product is currently inactive.';
    } else if (product.stock_status !== 'in_stock') {
      buyNowError = locale === 'ar' ? 'المنتج المطلوب غير متوفر بالمخزون.' : 'Selected product is currently out of stock.';
    } else {
      const quantity = Math.max(1, parseInt(resolvedParams.qty || '1', 10) || 1);
      initialBuyNowItem = { product, quantity };
    }
  }

  const initialMethod = resolvedParams?.method === 'whatsapp' ? 'whatsapp' : 'cod';

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

        <CheckoutClient
          settings={settings}
          buyNowItem={initialBuyNowItem}
          buyNowError={buyNowError}
          initialMethod={initialMethod}
        />
      </main>

      <Footer settings={settings} />
    </div>
  );
}

