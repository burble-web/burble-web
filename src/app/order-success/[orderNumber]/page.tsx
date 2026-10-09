import React from 'react';
import { Metadata } from 'next';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { getSiteSettings } from '@/lib/data/queries';
import { getServerTranslations } from '@/lib/i18n/server';
import { getOrderConfirmationAction } from '@/app/actions/order';
import { OrderSuccessClient } from './OrderSuccessClient';

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { t } = await getServerTranslations();
  return {
    title: `${t.checkout.orderSuccessTitle} - #${resolvedParams.orderNumber}`,
    description: t.checkout.orderSuccessSubtitle,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ source?: string; waUrl?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedQuery = await searchParams;
  const settings = await getSiteSettings();

  const orderRes = await getOrderConfirmationAction(resolvedParams.orderNumber);
  const order = orderRes.success && orderRes.data ? orderRes.data : null;

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 font-sans">
      <AnnouncementBar settings={settings} />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <OrderSuccessClient
          order={order}
          orderNumber={resolvedParams.orderNumber}
          settings={settings}
          searchSource={resolvedQuery?.source}
          waUrl={resolvedQuery?.waUrl}
        />
      </main>

      <Footer settings={settings} />
    </div>
  );
}
