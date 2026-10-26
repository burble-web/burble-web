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
  getCategoryBySlug,
  getCategories,
  getProducts,
  getCollections,
} from '@/lib/data/queries';
import { getServerTranslations, getServerLocale } from '@/lib/i18n/server';
import { getLocalizedValue } from '@/lib/i18n/utils';
import { buildHreflangAlternates, buildAbsoluteUrl } from '@/lib/seo/helpers';
import { BreadcrumbJsonLd, CollectionPageJsonLd } from '@/components/seo/JsonLd';

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getServerLocale();
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found | Burble Flowers Qatar',
    };
  }

  const catName = getLocalizedValue({
    locale,
    english: category.name,
    arabic: category.name_ar,
  });

  const catDesc =
    getLocalizedValue({
      locale,
      english: category.description,
      arabic: category.description_ar,
    }) ||
    (locale === 'ar'
      ? `تسوق تشكيلة ${catName} الفاخرة والطبيعية من زهور بيربل قطر مع توصيل سريع في نفس اليوم.`
      : `Shop luxury fresh ${catName} in Qatar with express same-day delivery across Doha from Burble Flowers.`);

  const alternates = buildHreflangAlternates({
    pathWithoutLocale: `/categories/${category.slug}`,
    currentLocale: locale,
  });

  const canonicalUrl =
    locale === 'ar'
      ? buildAbsoluteUrl(`/ar/categories/${category.slug}`)
      : buildAbsoluteUrl(`/en/categories/${category.slug}`);

  const title =
    locale === 'ar'
      ? `${catName} في قطر | زهور بيربل قطر`
      : `${catName} in Qatar | Luxury Handcrafted Bouquets | Burble`;

  return {
    title,
    description: catDesc,
    alternates,
    openGraph: {
      title,
      description: catDesc,
      url: canonicalUrl,
      siteName: 'Burble Flowers',
      locale: locale === 'ar' ? 'ar_QA' : 'en_US',
      alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_QA'],
      type: 'website',
      images: category.image_url
        ? [
            {
              url: category.image_url,
              width: 800,
              height: 800,
              alt: catName,
            },
          ]
        : [
            {
              url: buildAbsoluteUrl('/opengraph-image.png'),
              width: 1200,
              height: 630,
              alt: catName,
            },
          ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: catDesc,
      images: category.image_url
        ? [category.image_url]
        : [buildAbsoluteUrl('/opengraph-image.png')],
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; q?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const { t, locale } = await getServerTranslations();
  const settings = await getSiteSettings();
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [allCategories, flowerCollections, rawProducts] = await Promise.all([
    getCategories(),
    getCollections('flower'),
    getProducts({ categorySlug: slug }),
  ]);

  let products = [...rawProducts];

  // Search filter within category
  if (resolvedSearchParams?.q) {
    const q = resolvedSearchParams.q.toLowerCase().trim();
    products = products.filter((p) => {
      const nameEn = (p.name || '').toLowerCase();
      const nameAr = (p.name_ar || '').toLowerCase();
      return nameEn.includes(q) || nameAr.includes(q);
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

  const catDesc =
    getLocalizedValue({
      locale,
      english: category.description,
      arabic: category.description_ar,
    }) ||
    (locale === 'ar'
      ? `استكشف أرقى باقات وتنسيقات ${catName} المجهزة يدوياً بأجود الزهور الطبيعية المستوردة يومياً.`
      : `Explore artisanal handcrafted ${catName} prepared with premium fresh blooms and delivered across Doha.`);

  const currentCanonicalUrl =
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
      url: currentCanonicalUrl,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 font-sans">
      <AnnouncementBar settings={settings} />
      <Header />

      <BreadcrumbJsonLd items={breadcrumbs} />
      <CollectionPageJsonLd
        title={`${catName} — Burble Flowers Qatar`}
        description={catDesc}
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
            <span className="text-plum-900 font-semibold">{catName}</span>
          </nav>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-plum-900 leading-tight">
            {catName}
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 mt-2 max-w-2xl font-light leading-relaxed">
            {catDesc}
          </p>
          <p className="text-xs text-ink-400 mt-2 font-medium">
            {t.product.showingCount.replace('{count}', String(products.length))}
          </p>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-ink-100 pb-4">
          <Link
            href={locale === 'ar' ? '/ar/products' : '/en/products'}
            className="px-4 py-2 text-xs font-semibold rounded-full bg-white text-ink-700 hover:bg-plum-50 border border-ink-100 transition-colors"
          >
            {t.product.allProductsPill}
          </Link>

          {allCategories.map((cat) => {
            const isCurrent = cat.slug === category.slug;
            const cName = getLocalizedValue({
              locale,
              english: cat.name,
              arabic: cat.name_ar,
            });
            const catHref =
              locale === 'ar'
                ? `/ar/categories/${cat.slug}`
                : `/en/categories/${cat.slug}`;

            return (
              <Link
                key={cat.id}
                href={catHref}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
                  isCurrent
                    ? 'bg-plum-900 text-white shadow-xs'
                    : 'bg-white text-ink-700 hover:bg-plum-50 border border-ink-100'
                }`}
              >
                {cName}
              </Link>
            );
          })}
        </div>

        {/* Subcategory / Flower Variety Pills */}
        {flowerCollections.length > 0 && (
          <div className="mb-8">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400 mb-2">
              {locale === 'ar' ? 'تصفح حسب نوع الزهور' : 'Shop by Flower Variety'}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {flowerCollections.map((col) => {
                const colTitle = getLocalizedValue({
                  locale,
                  english: col.title,
                  arabic: col.title_ar,
                });
                const subHref =
                  locale === 'ar'
                    ? `/ar/categories/${category.slug}/${col.slug}`
                    : `/en/categories/${category.slug}/${col.slug}`;

                return (
                  <Link
                    key={col.id}
                    href={subHref}
                    className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-cream-200/80 text-plum-950 hover:bg-plum-100 border border-ink-200/50 transition-colors"
                  >
                    {colTitle}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-ink-100 my-8">
            <p className="font-serif text-xl font-bold text-plum-900">
              {t.product.noProductsFound}
            </p>
            <p className="text-xs text-ink-500 mt-1 mb-6">
              {locale === 'ar'
                ? 'لا توجد منتجات متوفرة حالياً في هذا القسم. تفضل باستكشاف تشكيلاتنا الأخرى.'
                : 'No products are currently available in this category. Explore our other collections.'}
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
