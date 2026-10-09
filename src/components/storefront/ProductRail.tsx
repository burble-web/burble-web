'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { useLocale } from '@/lib/i18n/context';
import { ProductCard } from './ProductCard';

interface ProductRailProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
}

export function ProductRail({ title, subtitle, products, viewAllLink = '/products' }: ProductRailProps) {
  const { t, isRtl } = useLocale();

  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-plum-900 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-ink-500 font-normal mt-1">
                {subtitle}
              </p>
            )}
          </div>

          <Link
            href={viewAllLink}
            className="group flex items-center space-x-1 rtl:space-x-reverse text-xs font-semibold text-plum-800 hover:text-plum-700 transition-colors"
          >
            <span>{t.common.viewAll}</span>
            <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        {/* Product Grid / Scroll Rail */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
