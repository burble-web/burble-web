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
    <section className="py-8 sm:py-16 bg-cream-50 border-y border-ink-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-plum-900 tracking-tight mb-6 sm:mb-10">
          {t.sections.occasionsTitle}
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-[repeat(7,minmax(0,1fr))] gap-x-3 gap-y-5 sm:gap-6 lg:gap-4 xl:gap-6 items-start justify-items-center">
          {occasions.map((item) => {
            const title = getLocalized(item.title, item.title_ar);
            // Hide the 'Love You' item on mobile (keep on desktop)
            const isLoveYou = item.slug === 'love-you' || item.title?.toLowerCase() === 'love you';
            return (
              <Link
                key={item.id}
                href={`/products?occasion=${item.slug}`}
                className={`group ${isLoveYou ? 'hidden sm:flex' : 'flex'} flex-col items-center w-full`}
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full overflow-hidden border-2 border-plum-100 p-1 group-hover:border-plum-800 transition-all duration-300 shadow-xs group-hover:scale-105">
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
                <span className="mt-2 sm:mt-3 text-[11px] sm:text-sm font-semibold text-plum-900 group-hover:text-plum-700 transition-colors text-center line-clamp-2 max-w-[100px] sm:max-w-[120px]">
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
