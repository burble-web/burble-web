import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ProductCard } from '@/components/storefront/ProductCard';
import {
  getSiteSettings,
  getProducts,
  getCategories,
  getCollectionBySlug,
} from '@/lib/data/queries';
import { getServerTranslations, getServerLocale } from '@/lib/i18n/server';
import { getLocalizedValue } from '@/lib/i18n/utils';
import { buildHreflangAlternates, buildAbsoluteUrl } from '@/lib/seo/helpers';
import { BreadcrumbJsonLd, CollectionPageJsonLd } from '@/components/seo/JsonLd';

export const instant = false;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    occasion?: string;
    flower?: string;
    collection?: string;
    q?: string;
    sort?: string;
  }>;
}): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const locale = await getServerLocale();

  let title =
    locale === 'ar'
      ? 'كتالوج الزهور الطبيعية والباقات الفاخرة | زهور بيربل قطر'
      : 'Fresh Flowers & Luxury Bouquets Catalog | Burble Flowers Qatar';

  let description =
    locale === 'ar'
      ? 'تصفح تشكيلة زهور بيربل الكاملة من باقات اليد الفاخرة، زهور الفازات، وصناديق الهدايا مع توصيل سريع في نفس اليوم في قطر.'
      : 'Browse Burble Flowers complete luxury collection of fresh bouquets, vase arrangements, and floral gift sets with express same-day delivery across Doha.';

  if (resolvedParams?.occasion || resolvedParams?.flower || resolvedParams?.collection) {
    const slug = resolvedParams.occasion || resolvedParams.flower || resolvedParams.collection;
    if (slug) {
      const col = await getCollectionBySlug(slug);
      if (col) {
        const colTitle = getLocalizedValue({
          locale,
          english: col.title,
          arabic: col.title_ar,
        });
        title =
          locale === 'ar'
            ? `${colTitle} — تشكيلة الزهور الطبيعية | زهور بيربل قطر`
            : `${colTitle} Floral Collection in Qatar | Burble Flowers`;
      }
    }
  } else if (resolvedParams?.q) {
    title =
      locale === 'ar'
        ? `نتائج البحث عن "${resolvedParams.q}" | زهور بيربل قطر`
        : `Search Results for "${resolvedParams.q}" | Burble Flowers Qatar`;
  }

  // Canonical always points to clean canonical without search/sort query pollution
  const alternates = buildHreflangAlternates({
    pathWithoutLocale: '/products',
    currentLocale: locale,
  });

  const canonicalUrl =
    locale === 'ar' ? buildAbsoluteUrl('/ar/products') : buildAbsoluteUrl('/en/products');

  // If there are search or filter parameters, apply noindex, follow to avoid duplicate search result indexation
  const isFilteredOrSearch = Boolean(resolvedParams?.q || resolvedParams?.sort);

  return {
    title,
    description,
    alternates,
    robots: isFilteredOrSearch
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Burble Flowers',
      locale: locale === 'ar' ? 'ar_QA' : 'en_US',
      alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_QA'],
      type: 'website',
      images: [
        {
          url: buildAbsoluteUrl('/opengraph-image.png'),
          width: 1200,
          height: 630,
          alt: 'Burble Flowers Catalog',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [buildAbsoluteUrl('/opengraph-image.png')],
    },
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    occasion?: string;
    flower?: string;
    collection?: string;
    sort?: string;
    q?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const { t, locale } = await getServerTranslations();
  const settings = await getSiteSettings();
  const categories = await getCategories();

  let currentTitle = t.product.allFlowers;
  let products = await getProducts({
    categorySlug: resolvedParams?.category,
    occasionSlug: resolvedParams?.occasion,
    flowerSlug: resolvedParams?.flower,
    collectionSlug: resolvedParams?.collection,
  });

  // Determine page title based on filter
  if (resolvedParams?.category) {
    const matchedCategory = categories.find((c) => c.slug === resolvedParams.category);
    if (matchedCategory) {
      currentTitle = getLocalizedValue({
        locale,
        english: matchedCategory.name,
        arabic: matchedCategory.name_ar,
      });
    }
  } else if (resolvedParams?.occasion || resolvedParams?.flower || resolvedParams?.collection) {
    const colSlug = resolvedParams?.occasion || resolvedParams?.flower || resolvedParams?.collection;
    if (colSlug) {
      const col = await getCollectionBySlug(colSlug);
      if (col) {
        currentTitle = getLocalizedValue({
          locale,
          english: col.title,
          arabic: col.title_ar,
        });
      }
    }
  } else if (resolvedParams?.q) {
    currentTitle = locale === 'ar' ? `نتائج البحث: "${resolvedParams.q}"` : `Search: "${resolvedParams.q}"`;
  }

  // Filter by search query if provided
  if (resolvedParams?.q) {
    const q = resolvedParams.q.toLowerCase().trim();
    products = products.filter((p) => {
      const nameEn = (p.name || '').toLowerCase();
      const nameAr = (p.name_ar || '').toLowerCase();
      const descEn = (p.description || '').toLowerCase();
      const descAr = (p.description_ar || '').toLowerCase();
      return (
        nameEn.includes(q) ||
        nameAr.includes(q) ||
        descEn.includes(q) ||
        descAr.includes(q)
      );
    });
  }

  // Sorting
  if (resolvedParams?.sort === 'price-asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (resolvedParams?.sort === 'price-desc') {
    products.sort((a, b) => b.price - a.price);
  }

  const hasActiveFilter = Boolean(
    resolvedParams?.category ||
    resolvedParams?.occasion ||
    resolvedParams?.flower ||
    resolvedParams?.collection ||
    resolvedParams?.q
  );

  const canonicalUrl =
    locale === 'ar' ? buildAbsoluteUrl('/ar/products') : buildAbsoluteUrl('/en/products');

  const breadcrumbs = [
    {
      name: t.common.home,
      url: locale === 'ar' ? buildAbsoluteUrl('/ar') : buildAbsoluteUrl('/en'),
    },
    {
      name: t.common.catalog,
      url: canonicalUrl,
    },
  ];

  if (hasActiveFilter && currentTitle !== t.product.allFlowers) {
    breadcrumbs.push({
      name: currentTitle,
      url: canonicalUrl,
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 font-sans">
      <AnnouncementBar settings={settings} />
      <Header />

      <BreadcrumbJsonLd items={breadcrumbs} />
      <CollectionPageJsonLd
        title={`${t.common.catalog} — Burble Flowers Qatar`}
        description="Fresh luxury floral collection delivered across Doha."
        url={canonicalUrl}
        products={products}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-ink-500 mb-2 flex items-center space-x-1.5 rtl:space-x-reverse"
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
            {hasActiveFilter && (
              <>
                <span>/</span>
                <span className="text-plum-900 font-semibold">{currentTitle}</span>
              </>
            )}
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-plum-900">
            {currentTitle}
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            {t.product.showingCount.replace('{count}', String(products.length))}
          </p>
        </div>

        {/* Category Pills & Filters: Pointing to clean category URLs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-ink-100 pb-4">
          <Link
            href={locale === 'ar' ? '/ar/products' : '/en/products'}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
              !hasActiveFilter
                ? 'bg-plum-900 text-white shadow-xs'
                : 'bg-white text-ink-700 hover:bg-plum-50 border border-ink-100'
            }`}
          >
            {t.product.allProductsPill}
          </Link>

          {categories.map((cat) => {
            const catName = getLocalizedValue({
              locale,
              english: cat.name,
              arabic: cat.name_ar,
            });
            const isSelected = resolvedParams?.category === cat.slug;
            const catHref =
              locale === 'ar'
                ? `/ar/categories/${cat.slug}`
                : `/en/categories/${cat.slug}`;

            return (
              <Link
                key={cat.id}
                href={catHref}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
                  isSelected
                    ? 'bg-plum-900 text-white shadow-xs'
                    : 'bg-white text-ink-700 hover:bg-plum-50 border border-ink-100'
                }`}
              >
                {catName}
              </Link>
            );
          })}
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-ink-100 my-8">
            <p className="font-serif text-xl font-bold text-plum-900">{t.product.noProductsFound}</p>
            <p className="text-xs text-ink-500 mt-1 mb-6">
              {locale === 'ar'
                ? 'جرب إعادة ضبط خيارات التصفية لاستكشاف كافة الباقات المتاحة.'
                : 'Try clearing your filters to explore all handcrafted bouquets.'}
            </p>
            <Link
              href={locale === 'ar' ? '/ar/products' : '/en/products'}
              className="px-6 py-2.5 bg-plum-800 text-white text-xs font-semibold rounded-lg hover:bg-plum-900"
            >
              {t.product.clearFilters}
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
