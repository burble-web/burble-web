'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { useLocale } from '@/lib/i18n/context';
import { ProductCard } from './ProductCard';

interface PremiumBannerSectionProps {
  products: Product[];
}

export function PremiumBannerSection({ products }: PremiumBannerSectionProps) {
  const { t, isRtl } = useLocale();

  return (
    <section className="py-12 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Promotional Split Banner */}
          <div className="lg:col-span-5 relative bg-plum-100/70 rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden border border-plum-200/60 shadow-sm min-h-[380px]">
            <div className="relative z-10 max-w-sm">
              <span className="text-[11px] font-bold uppercase tracking-widest text-plum-700">
                {t.sections.premiumBannerEyebrow}
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-plum-900 mt-2 mb-3 leading-tight">
                {t.sections.premiumBannerTitle}
              </h3>
              <p className="text-xs sm:text-sm text-plum-800/80 font-normal leading-relaxed mb-6">
                {t.sections.premiumBannerSubtitle}
              </p>
              <Link
                href="/products?category=premium-collections"
                className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-plum-900 hover:bg-plum-800 text-white text-xs font-semibold px-5 py-3 rounded-full shadow-md transition-all hover:scale-105"
              >
                <span>{t.sections.explorePremiumCta}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </Link>
            </div>

            {/* Banner Media Image */}
            <div className="relative w-full h-48 sm:h-56 mt-6 rounded-2xl overflow-hidden shadow-md">
              <Image
                src="/demo-media/premium_banner.jpg"
                alt={t.sections.premiumBannerTitle}
                fill
                className="object-cover"
              />
            </div>
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
