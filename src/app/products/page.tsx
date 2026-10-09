import React from 'react';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ProductCard } from '@/components/storefront/ProductCard';
import { getSiteSettings, getProducts, getCategories } from '@/lib/data/queries';
import { getServerTranslations } from '@/lib/i18n/server';
import { getLocalizedValue } from '@/lib/i18n/utils';
import Link from 'next/link';

export const instant = false;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const { t, locale } = await getServerTranslations();
  const settings = await getSiteSettings();
  const categories = await getCategories();
  let products = await getProducts();

  // Filter by category slug if provided
  let currentCategoryName = t.product.allFlowers;
  if (resolvedParams?.category) {
    const matchedCategory = categories.find((c) => c.slug === resolvedParams.category);
    if (matchedCategory) {
      products = products.filter((p) => p.category_id === matchedCategory.id);
      currentCategoryName = getLocalizedValue({
        locale,
        english: matchedCategory.name,
        arabic: matchedCategory.name_ar,
      });
    }
  }

  // Filter by search query if provided (supporting both English and Arabic query matching)
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

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 font-sans">
      <AnnouncementBar settings={settings} />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="text-xs text-ink-500 mb-2 flex items-center space-x-1.5 rtl:space-x-reverse">
            <Link href="/" className="hover:text-plum-800">{t.common.home}</Link>
            <span>/</span>
            <span className="text-plum-900 font-semibold">{t.common.catalog}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-plum-900">
            {currentCategoryName}
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            {t.product.showingCount.replace('{count}', String(products.length))}
          </p>
        </div>

        {/* Category Pills & Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-ink-100 pb-4">
          <Link
            href="/products"
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
              !resolvedParams?.category
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
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
                  resolvedParams?.category === cat.slug
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
              href="/products"
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
