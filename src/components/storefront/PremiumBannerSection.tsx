'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Flower2 } from 'lucide-react';
import { Product } from '@/types';
import { useLocale } from '@/lib/i18n/context';
import { ProductCard } from './ProductCard';

interface PremiumBannerSectionProps {
  products: Product[];
}

export function PremiumBannerSection({ products }: PremiumBannerSectionProps) {
  const { t, isRtl } = useLocale();

  if (!products || products.length === 0) return null;

  const featuredProductImage = products[0]?.main_image_url;

  return (
    <section className="py-12 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Promotional Split Banner */}
          <div className="lg:col-span-5 relative bg-plum-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden border border-plum-800 shadow-md min-h-[380px]">
            {/* Background luxury gradient & decoration */}
            <div className="absolute -top-16 -end-16 w-56 h-56 bg-blush-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -start-16 w-56 h-56 bg-plum-700/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-sm">
              <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-plum-800/80 border border-plum-700 text-blush-200 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3 h-3 text-blush-300" />
                <span>{t.sections.premiumBannerEyebrow}</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1 mb-3 leading-tight">
                {t.sections.premiumBannerTitle}
              </h3>
              <p className="text-xs sm:text-sm text-plum-100 font-light leading-relaxed mb-6">
                {t.sections.premiumBannerSubtitle}
              </p>
              <Link
                href="/products?category=premium-collections"
                className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white text-plum-900 hover:bg-blush-100 text-xs font-semibold px-6 py-3 rounded-full shadow-md transition-all hover:scale-105"
              >
                <span>{t.sections.explorePremiumCta}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </Link>
            </div>

            {/* Banner Media Image from real DB product if available */}
            {featuredProductImage ? (
              <div className="relative w-full h-48 sm:h-52 mt-6 rounded-2xl overflow-hidden shadow-inner border border-plum-800/60 bg-plum-950">
                <Image
                  src={featuredProductImage}
                  alt={t.sections.premiumBannerTitle}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative w-full h-36 mt-6 rounded-2xl flex items-center justify-center bg-plum-800/50 border border-plum-700/40">
                <Flower2 className="w-12 h-12 text-blush-300/40" />
              </div>
            )}
          </div>

          {/* Right Product Grid: Flowers in Vase */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-plum-900">
                  {t.sections.flowersInVaseTitle}
                </h3>
                <p className="text-xs text-ink-500">{t.sections.flowersInVaseSubtitle}</p>
              </div>
              <Link
                href="/products?category=flowers-in-vase"
                className="group flex items-center space-x-1 rtl:space-x-reverse text-xs font-semibold text-plum-800 hover:text-plum-700"
              >
                <span>{t.common.viewAll}</span>
                <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {products.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
