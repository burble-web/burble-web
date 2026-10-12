'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { useLocale } from '@/lib/i18n/context';
import { ProductCard } from './ProductCard';
import { useCarousel } from './carousel-helper';

interface ProductRailProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
}

export function ProductRail({ title, subtitle, products, viewAllLink = '/products' }: ProductRailProps) {
  const { t, isRtl } = useLocale();
  const {
    containerRef,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
  } = useCarousel({ stepByItem: true });

  if (!products || products.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Left-aligned Title/Subtitle, Right-aligned Carousel Arrows + View All */}
        <div className="flex items-center justify-between mb-4 sm:mb-8 gap-2">
          {/* Left: Heading & Subtitle */}
          <div className="min-w-0 pr-1 sm:pr-4">
            <h2 className="font-serif text-lg sm:text-2xl md:text-3xl font-bold text-plum-900 tracking-tight leading-tight truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[11px] sm:text-sm text-ink-500 font-normal mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right: Circular Navigation Arrows + View All */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Circular Carousel Controls (visible on mobile) */}
            <div className="flex items-center gap-1 sm:hidden">
              <button
                type="button"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="w-7 h-7 rounded-full border border-plum-200/90 bg-white text-plum-900 flex items-center justify-center shadow-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-plum-50 active:scale-95 transition-all"
                aria-label="Previous product"
              >
                <ChevronLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="w-7 h-7 rounded-full border border-plum-200/90 bg-white text-plum-900 flex items-center justify-center shadow-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-plum-50 active:scale-95 transition-all"
                aria-label="Next product"
              >
                <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <Link
              href={viewAllLink}
              className="group flex items-center space-x-1 rtl:space-x-reverse text-xs font-semibold text-plum-800 hover:text-plum-700 transition-colors whitespace-nowrap ps-0.5 sm:ps-1"
            >
              <span>{t.common.viewAll}</span>
              <ArrowRight className={`w-3 h-3 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>

        {/* Mobile: 2 Equal-Sized Product Cards Side-by-Side Horizontal Carousel (sm:hidden) */}
        <div
          ref={containerRef}
          className="flex sm:hidden overflow-x-auto scroll-smooth snap-x snap-mandatory gap-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden items-stretch"
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{ width: 'calc(50% - 6px)', flex: '0 0 calc(50% - 6px)' }}
              className="min-w-0 max-w-[calc(50%-6px)] shrink-0 snap-start flex flex-col"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Desktop & Tablet: Standard Responsive Grid (hidden on mobile) */}
        <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
