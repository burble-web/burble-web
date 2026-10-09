'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { Collection } from '@/types';
import { useLocale } from '@/lib/i18n/context';

interface OccasionSectionProps {
  occasions: Collection[];
}

export function OccasionSection({ occasions }: OccasionSectionProps) {
  const { t, getLocalized } = useLocale();

  if (!occasions || occasions.length === 0) return null;

  return (
    <section className="py-12 bg-cream-50 border-y border-ink-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-plum-900 tracking-tight mb-8">
          {t.sections.occasionsTitle}
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-6 sm:gap-8">
          {occasions.map((item) => {
            const title = getLocalized(item.title, item.title_ar);
            return (
              <Link
                key={item.id}
                href={`/products?occasion=${item.slug}`}
                className="group flex flex-col items-center space-y-3"
              >
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-plum-100 p-1 group-hover:border-plum-800 transition-all duration-300 shadow-sm group-hover:scale-105">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-cream-200 flex items-center justify-center">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <Sparkles className="w-6 h-6 text-plum-400 group-hover:scale-110 transition-transform" />
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
