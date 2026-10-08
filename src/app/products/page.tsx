import React from 'react';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ProductCard } from '@/components/storefront/ProductCard';
import { getSiteSettings, getProducts, getCategories } from '@/lib/data/queries';
import Link from 'next/link';

export const instant = false;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const settings = await getSiteSettings();
  const categories = await getCategories();
  let products = await getProducts();

  // Filter by category slug if provided
  if (resolvedParams?.category) {
    const matchedCategory = categories.find((c) => c.slug === resolvedParams.category);
    if (matchedCategory) {
      products = products.filter((p) => p.category_id === matchedCategory.id);
    }
  }

  // Filter by search query if provided
  if (resolvedParams?.q) {
    const q = resolvedParams.q.toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
    );
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
          <div className="text-xs text-ink-500 mb-2">
            <Link href="/" className="hover:text-plum-800">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-plum-900 font-semibold">Catalog</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-plum-900">
            {resolvedParams?.category
              ? categories.find((c) => c.slug === resolvedParams.category)?.name || 'All Flowers'
              : 'All Fresh Flowers'}
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Showing {products.length} handcrafted floral arrangements
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
            All Products
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
                resolvedParams?.category === cat.slug
                  ? 'bg-plum-900 text-white shadow-xs'
                  : 'bg-white text-ink-700 hover:bg-plum-50 border border-ink-100'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-ink-100 my-8">
            <p className="font-serif text-xl font-bold text-plum-900">No flowers match your search</p>
            <p className="text-xs text-ink-500 mt-1 mb-6">Try clearing your filters to explore all handcrafted bouquets.</p>
            <Link
              href="/products"
              className="px-6 py-2.5 bg-plum-800 text-white text-xs font-semibold rounded-lg hover:bg-plum-900"
            >
              Clear Filters
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
