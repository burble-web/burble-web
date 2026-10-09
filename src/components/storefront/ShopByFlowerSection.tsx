'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flower2 } from 'lucide-react';
import { Collection } from '@/types';
import { useLocale } from '@/lib/i18n/context';

interface ShopByFlowerSectionProps {
  flowers: Collection[];
}

export function ShopByFlowerSection({ flowers }: ShopByFlowerSectionProps) {
  const { t, getLocalized } = useLocale();

  if (!flowers || flowers.length === 0) return null;

  return (
    <section className="py-12 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-plum-900 tracking-tight">
            {t.sections.shopByFlowerTitle}
          </h2>
          <Link href="/products" className="text-xs font-semibold text-plum-800 hover:text-plum-700">
            {t.common.viewAll} →
          </Link>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 text-center">
          {flowers.map((item) => {
            const title = getLocalized(item.title, item.title_ar);
            return (
              <Link
                key={item.id}
                href={`/products?flower=${item.slug}`}
                className="group flex flex-col items-center space-y-2.5"
              >
                <div className="relative w-16 h-16 sm:w-22 sm:h-22 rounded-full overflow-hidden border border-ink-100 bg-white p-1 group-hover:border-plum-800 transition-all duration-300 shadow-xs group-hover:scale-105">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-cream-200 flex items-center justify-center">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <Flower2 className="w-5 h-5 text-plum-400 group-hover:scale-110 transition-transform" />
                    )}
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-plum-900 group-hover:text-plum-700 transition-colors">
                  {title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
