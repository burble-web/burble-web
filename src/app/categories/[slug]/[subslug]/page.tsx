import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ProductCard } from '@/components/storefront/ProductCard';
import {
  getSiteSettings,
  getSubcategoryBySlug,
  getProducts,
} from '@/lib/data/queries';
import { getServerTranslations, getServerLocale } from '@/lib/i18n/server';
import { getLocalizedValue } from '@/lib/i18n/utils';
import { buildHreflangAlternates, buildAbsoluteUrl } from '@/lib/seo/helpers';
import { BreadcrumbJsonLd, CollectionPageJsonLd } from '@/components/seo/JsonLd';

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subslug: string }>;
}): Promise<Metadata> {
  const { slug, subslug } = await params;
  const locale = await getServerLocale();
  const result = await getSubcategoryBySlug(slug, subslug);

  if (!result) {
    return {
      title: 'Subcategory Not Found | Burble Flowers Qatar',
    };
  }

  const { category, subcategory } = result;

  const catName = getLocalizedValue({
    locale,
    english: category.name,
    arabic: category.name_ar,
  });

  const subName = getLocalizedValue({
    locale,
    english: subcategory.title,
    arabic: subcategory.title_ar,
  });

  const title =
    locale === 'ar'
      ? `${subName} — ${catName} في قطر | زهور بيربل قطر`
      : `${subName} ${catName} in Qatar | Burble Flowers Qatar`;

  const description =
    locale === 'ar'
      ? `تسوق أجمل باقات ${catName} المنسقة بزهور ${subName} الفاخرة والطبيعية مع خدمة التوصيل السريع في نفس اليوم في قطر.`
      : `Discover handcrafted ${catName} featuring fresh ${subName} blooms in Qatar. Express same-day delivery across Doha and Lusail.`;

  const alternates = buildHreflangAlternates({
    pathWithoutLocale: `/categories/${category.slug}/${subcategory.slug}`,
    currentLocale: locale,
  });

  const canonicalUrl =
    locale === 'ar'
      ? buildAbsoluteUrl(`/ar/categories/${category.slug}/${subcategory.slug}`)
      : buildAbsoluteUrl(`/en/categories/${category.slug}/${subcategory.slug}`);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Burble Flowers',
      locale: locale === 'ar' ? 'ar_QA' : 'en_US',
      alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_QA'],
      type: 'website',
      images: subcategory.image_url
        ? [
            {
              url: subcategory.image_url,
              width: 800,
              height: 800,
              alt: `${subName} ${catName}`,
            },
          ]
        : [
            {
              url: buildAbsoluteUrl('/opengraph-image.png'),
              width: 1200,
              height: 630,
              alt: `${subName} ${catName}`,
            },
          ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: subcategory.image_url
        ? [subcategory.image_url]
        : [buildAbsoluteUrl('/opengraph-image.png')],
    },
  };
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; subslug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { slug, subslug } = await params;
  const resolvedSearchParams = await searchParams;
  const { t, locale } = await getServerTranslations();
  const settings = await getSiteSettings();

  const result = await getSubcategoryBySlug(slug, subslug);
  if (!result) {
    notFound();
  }

  const { category, subcategory } = result;

  let products = await getProducts({
    categorySlug: slug,
    flowerSlug: subslug,
  });

  if (products.length === 0) {
    products = await getProducts({
      categorySlug: slug,
      occasionSlug: subslug,
    });
  }

  if (products.length === 0) {
    products = await getProducts({
      categorySlug: slug,
      collectionSlug: subslug,
    });
  }

  // Sorting
  if (resolvedSearchParams?.sort === 'price-asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (resolvedSearchParams?.sort === 'price-desc') {
    products.sort((a, b) => b.price - a.price);
  }

  const catName = getLocalizedValue({
    locale,
    english: category.name,
    arabic: category.name_ar,
  });

  const subName = getLocalizedValue({
    locale,
    english: subcategory.title,
    arabic: subcategory.title_ar,
  });

  const pageTitle =
    locale === 'ar'
      ? `${subName} — ${catName}`
      : `${subName} ${catName}`;

  const pageDesc =
    locale === 'ar'
      ? `تشكيلة استثنائية من ${catName} المنسقة بزهور ${subName} النضرة المستوردة يومياً.`
      : `Handcrafted artisanal ${catName} featuring fresh ${subName} blooms delivered same-day in Qatar.`;

  const currentCanonicalUrl =
    locale === 'ar'
      ? buildAbsoluteUrl(`/ar/categories/${category.slug}/${subcategory.slug}`)
      : buildAbsoluteUrl(`/en/categories/${category.slug}/${subcategory.slug}`);

  const categoryUrl =
    locale === 'ar'
      ? buildAbsoluteUrl(`/ar/categories/${category.slug}`)
      : buildAbsoluteUrl(`/en/categories/${category.slug}`);

  const breadcrumbs = [
    {
      name: t.common.home,
      url: locale === 'ar' ? buildAbsoluteUrl('/ar') : buildAbsoluteUrl('/en'),
    },
    {
      name: t.common.catalog,
      url: locale === 'ar' ? buildAbsoluteUrl('/ar/products') : buildAbsoluteUrl('/en/products'),
    },
    {
      name: catName,
      url: categoryUrl,
    },
    {
      name: subName,
      url: currentCanonicalUrl,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 font-sans">
      <AnnouncementBar settings={settings} />
      <Header />

      <BreadcrumbJsonLd items={breadcrumbs} />
      <CollectionPageJsonLd
        title={`${pageTitle} — Burble Flowers Qatar`}
        description={pageDesc}
        url={currentCanonicalUrl}
        products={products}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb Hierarchy */}
        <div className="mb-8">
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-ink-500 mb-3 flex items-center space-x-1.5 rtl:space-x-reverse"
          >
            <Link
              href={locale === 'ar' ? '/ar' : '/en'}
              className="hover:text-plum-800 transition-colors"
            >
              {t.common.home}
            </Link>
            <span>/</span>
            <Link
              href={locale === 'ar' ? '/ar/products' : '/en/products'}
              className="hover:text-plum-800 transition-colors"
            >
              {t.common.catalog}
            </Link>
            <span>/</span>
            <Link
              href={locale === 'ar' ? `/ar/categories/${category.slug}` : `/en/categories/${category.slug}`}
              className="hover:text-plum-800 transition-colors"
            >
              {catName}
            </Link>
            <span>/</span>
            <span className="text-plum-900 font-semibold">{subName}</span>
          </nav>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-plum-900 leading-tight">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 mt-2 max-w-2xl font-light leading-relaxed">
            {pageDesc}
          </p>
          <p className="text-xs text-ink-400 mt-2 font-medium">
            {t.product.showingCount.replace('{count}', String(products.length))}
          </p>
        </div>

        {/* Return to Main Category Pill */}
        <div className="mb-8">
          <Link
            href={locale === 'ar' ? `/ar/categories/${category.slug}` : `/en/categories/${category.slug}`}
            className="inline-flex items-center text-xs font-semibold text-plum-800 hover:text-plum-900 bg-white border border-ink-200 px-4 py-2 rounded-full shadow-2xs hover:bg-plum-50 transition-colors"
          >
            <span>← {locale === 'ar' ? `العودة إلى كافة ${catName}` : `View all ${catName}`}</span>
          </Link>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-ink-100 my-8">
            <p className="font-serif text-xl font-bold text-plum-900">
              {t.product.noProductsFound}
            </p>
            <p className="text-xs text-ink-500 mt-1 mb-6">
              {locale === 'ar'
                ? 'لا توجد منتجات مطابقة لهذا القسم حالياً.'
                : 'No products currently found in this subcategory.'}
            </p>
            <Link
              href={locale === 'ar' ? `/ar/categories/${category.slug}` : `/en/categories/${category.slug}`}
              className="px-6 py-2.5 bg-plum-800 text-white text-xs font-semibold rounded-lg hover:bg-plum-900"
            >
              {locale === 'ar' ? `استعراض ${catName}` : `Browse all ${catName}`}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer settings={settings} />
    </div>
  );
}
