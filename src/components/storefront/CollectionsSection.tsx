'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Layers } from 'lucide-react';
import { Collection } from '@/types';
import { useLocale } from '@/lib/i18n/context';

interface CollectionsSectionProps {
  collections: Collection[];
}

export function CollectionsSection({ collections }: CollectionsSectionProps) {
  const { t, getLocalized } = useLocale();

  if (!collections || collections.length === 0) return null;

  return (
    <section className="py-12 bg-cream-50 border-t border-ink-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-plum-900 tracking-tight">
            {t.sections.ourCollectionsTitle}
          </h2>
          <Link href="/products" className="text-xs font-semibold text-plum-800 hover:text-plum-700">
            {t.common.viewAll} →
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {collections.map((item) => {
            const title = getLocalized(item.title, item.title_ar);
            return (
              <Link
                key={item.id}
                href={`/products?collection=${item.slug}`}
                className="group flex flex-col items-center space-y-3"
              >
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-blush-200 bg-white p-1 group-hover:border-plum-800 transition-all duration-300 shadow-xs group-hover:scale-105">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-cream-200 flex items-center justify-center">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <Layers className="w-6 h-6 text-plum-400 group-hover:scale-110 transition-transform" />
                    )}
                  </div>
                </div>
                <span className="text-xs font-semibold text-plum-900 group-hover:text-plum-700 transition-colors">
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
