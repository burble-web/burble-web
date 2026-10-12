import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { getSiteSettings, getProductBySlug, getProducts } from '@/lib/data/queries';
import { getServerTranslations, getServerLocale } from '@/lib/i18n/server';
import { getLocalizedValue } from '@/lib/i18n/utils';
import { ProductCard } from '@/components/storefront/ProductCard';
import { ProductDetailClient } from './ProductDetailClient';

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getServerLocale();
  const product = await getProductBySlug(slug);

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://burbleflowers.com').replace(/\/+$/, '');

  if (!product) {
    return {
      title: 'Product Not Found | Burble',
    };
  }

  const productName = getLocalizedValue({
    locale,
    english: product.name,
    arabic: product.name_ar,
  });

  const productDescription = getLocalizedValue({
    locale,
    english: product.description,
    arabic: product.description_ar,
  }) || (locale === 'ar' ? 'باقة زهور طبيعية فاخرة منسقة يدوياً من زهور بيربل قطر.' : 'Handcrafted luxury fresh floral bouquet from Burble Flowers Qatar.');

  const productCanonicalUrl = `${siteUrl}/products/${product.slug}`;
  const absoluteImageUrl = product.main_image_url.startsWith('http')
    ? product.main_image_url
    : `${siteUrl}${product.main_image_url.startsWith('/') ? '' : '/'}${product.main_image_url}`;

  return {
    title: `${productName} | Burble Flowers Qatar`,
    description: productDescription,
    alternates: {
      canonical: productCanonicalUrl,
    },
    openGraph: {
      title: `${productName} | Burble Flowers Qatar`,
      description: productDescription,
      url: productCanonicalUrl,
      siteName: 'Burble Flowers',
      locale: locale === 'ar' ? 'ar_QA' : 'en_US',
      alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_QA'],
      type: 'website',
      images: [
        {
          url: absoluteImageUrl,
          width: 800,
          height: 800,
          alt: productName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${productName} | Burble Flowers Qatar`,
      description: productDescription,
      images: [absoluteImageUrl],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { t, locale } = await getServerTranslations();
  const settings = await getSiteSettings();
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getProducts({ limit: 4 });

  const productName = getLocalizedValue({
    locale,
    english: product.name,
    arabic: product.name_ar,
  });

  const categoryName = getLocalizedValue({
    locale,
    english: product.category?.name,
    arabic: product.category?.name_ar,
  }) || (locale === 'ar' ? 'باقة يد فاخرة' : 'Handcrafted Bouquet');

  const productDescription = getLocalizedValue({
    locale,
    english: product.description,
    arabic: product.description_ar,
  }) || t.product.defaultDescription;

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 font-sans">
      <AnnouncementBar settings={settings} />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb */}
        <div className="text-xs text-ink-500 mb-6 flex items-center space-x-1.5 rtl:space-x-reverse">
          <Link href="/" className="hover:text-plum-800">{t.common.home}</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-plum-800">{t.common.products}</Link>
          <span>/</span>
          <span className="text-plum-900 font-semibold">{productName}</span>
        </div>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 border border-ink-100 shadow-sm mb-16">
          
          {/* Left Media Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-cream-100 border border-ink-100/50 shadow-xs">
              <Image
                src={product.main_image_url}
                alt={productName}
                fill
                priority
                className="object-cover"
              />
            </div>

            {product.hover_image_url && (
              <div className="flex space-x-3 rtl:space-x-reverse">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-plum-800 cursor-pointer">
                  <Image src={product.main_image_url} alt={productName} fill className="object-cover" />
                </div>
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-ink-100 opacity-70 hover:opacity-100 cursor-pointer">
                  <Image src={product.hover_image_url} alt={productName} fill className="object-cover" />
                </div>
              </div>
            )}
          </div>

          {/* Right Product Details Column */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="inline-block bg-plum-100 text-plum-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                {categoryName}
              </span>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-plum-900 leading-tight">
                {productName}
              </h1>

              <div className="mt-3 flex items-baseline space-x-3 rtl:space-x-reverse">
                <span className="font-serif text-3xl font-bold text-plum-900">
                  {locale === 'ar' ? `${product.price.toFixed(2)} ر.ق` : `QAR ${product.price.toFixed(2)}`}
                </span>
                {product.compare_at_price && (
                  <span className="text-sm text-ink-500 line-through font-normal">
                    {locale === 'ar' ? `${product.compare_at_price.toFixed(2)} ر.ق` : `QAR ${product.compare_at_price.toFixed(2)}`}
                  </span>
                )}
              </div>

              {product.stock_status === 'out_of_stock' ? (
                <div className="mt-4 flex items-center space-x-2 rtl:space-x-reverse text-xs font-semibold text-rose-700 bg-rose-50 w-fit px-3 py-1.5 rounded-full border border-rose-200/60">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>{t.product.outOfStock}</span>
                </div>
              ) : (
                <div className="mt-4 flex items-center space-x-2 rtl:space-x-reverse text-xs font-semibold text-emerald-700 bg-emerald-50 w-fit px-3 py-1.5 rounded-full border border-emerald-200/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>{t.product.inStockReadyExpress}</span>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-ink-100">
                <h4 className="text-xs font-bold text-plum-900 uppercase tracking-wider mb-2">
                  {t.product.descriptionHeading}
                </h4>
                <p className="text-xs sm:text-sm text-ink-700 leading-relaxed font-normal">
                  {productDescription}
                </p>
              </div>
            </div>

            {/* Interactive Client Controls (Add to Cart / WhatsApp order button) */}
            <ProductDetailClient
              product={product}
              whatsappNumber={settings.whatsapp_number}
              freeShippingThreshold={settings.free_shipping_threshold}
              flatShippingFee={settings.flat_shipping_fee}
            />

          </div>

        </div>

        {/* Related Products Rail */}
        <div>
          <h3 className="font-serif text-2xl font-bold text-plum-900 mb-6">{t.product.youMayAlsoLike}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>

      </main>

      <Footer settings={settings} />
    </div>
  );
}
