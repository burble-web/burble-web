import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { getSiteSettings, getProductBySlug, getProducts } from '@/lib/data/queries';
import { ProductCard } from '@/components/storefront/ProductCard';
import { ProductDetailClient } from './ProductDetailClient';

export const instant = false;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const settings = await getSiteSettings();
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getProducts({ limit: 4 });

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 font-sans">
      <AnnouncementBar settings={settings} />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb */}
        <div className="text-xs text-ink-500 mb-6">
          <Link href="/" className="hover:text-plum-800">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-plum-800">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-plum-900 font-semibold">{product.name}</span>
        </div>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 border border-ink-100 shadow-sm mb-16">
          
          {/* Left Media Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-cream-100 border border-ink-100/50 shadow-xs">
              <Image
                src={product.main_image_url}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
            </div>

            {product.hover_image_url && (
              <div className="flex space-x-3">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-plum-800 cursor-pointer">
                  <Image src={product.main_image_url} alt={product.name} fill className="object-cover" />
                </div>
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-ink-100 opacity-70 hover:opacity-100 cursor-pointer">
                  <Image src={product.hover_image_url} alt={product.name} fill className="object-cover" />
                </div>
              </div>
            )}
          </div>

          {/* Right Product Details Column */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="inline-block bg-plum-100 text-plum-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                {product.category?.name || 'Handcrafted Bouquet'}
              </span>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-plum-900 leading-tight">
                {product.name}
              </h1>

              <div className="mt-3 flex items-baseline space-x-3">
                <span className="font-serif text-3xl font-bold text-plum-900">
                  QAR {product.price.toFixed(2)}
                </span>
                {product.compare_at_price && (
                  <span className="text-sm text-ink-500 line-through font-normal">
                    QAR {product.compare_at_price.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 w-fit px-3 py-1.5 rounded-full border border-emerald-200/60">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>In Stock — Ready for Same-Day Express Delivery in Qatar</span>
              </div>

              <div className="mt-6 pt-6 border-t border-ink-100">
                <h4 className="text-xs font-bold text-plum-900 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-xs sm:text-sm text-ink-700 leading-relaxed font-normal">
                  {product.description || 'Fresh handcrafted arrangement prepared with care by our master florists.'}
                </p>
              </div>
            </div>

            {/* Interactive Client Controls (Add to Cart / WhatsApp order button) */}
            <ProductDetailClient product={product} whatsappNumber={settings.whatsapp_number} />

          </div>

        </div>

        {/* Related Products Rail */}
        <div>
          <h3 className="font-serif text-2xl font-bold text-plum-900 mb-6">You May Also Like</h3>
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
