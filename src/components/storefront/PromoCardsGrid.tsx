'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Gift, Sparkles, Scissors } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';
import { Category } from '@/types';

interface PromoCardsGridProps {
  categories?: Category[];
}

export function PromoCardsGrid({ categories = [] }: PromoCardsGridProps) {
  const { t, isRtl } = useLocale();

  const giftCategory = categories.find((c) => c.slug === 'gift-hampers');
  const combosCategory = categories.find((c) => c.slug === 'combos');
  const diyCategory = categories.find((c) => c.slug === 'diy-flowers');

  const cards = [
    {
      title: t.sections.giftHampersTitle,
      subtitle: t.sections.giftHampersSubtitle,
      buttonText: t.sections.shopGiftsCta,
      link: '/products?category=gift-hampers',
      imageUrl: giftCategory?.image_url,
      icon: Gift,
      bgColor: 'bg-blush-100/60',
    },
    {
      title: t.sections.combosTitle,
      subtitle: t.sections.combosSubtitle,
      buttonText: t.sections.shopCombosCta,
      link: '/products?category=combos',
      imageUrl: combosCategory?.image_url,
      icon: Sparkles,
      bgColor: 'bg-cream-200',
    },
    {
      title: t.sections.diyFlowersTitle,
      subtitle: t.sections.diyFlowersSubtitle,
      buttonText: t.sections.shopDiyCta,
      link: '/products?category=diy-flowers',
      imageUrl: diyCategory?.image_url,
      icon: Scissors,
      bgColor: 'bg-plum-100/50',
    },
  ];

  return (
    <section className="py-12 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <div
                key={idx}
                className={`${card.bgColor} rounded-2xl p-6 flex items-center justify-between border border-ink-100/50 shadow-xs hover:shadow-md transition-all duration-300 group`}
              >
                <div className="max-w-[65%]">
                  <h3 className="font-serif text-xl font-bold text-plum-900 leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs text-ink-500 font-normal mt-1.5 mb-4 leading-relaxed">
                    {card.subtitle}
                  </p>
                  <Link
                    href={card.link}
                    className="inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-plum-900 hover:bg-plum-800 text-white text-[11px] font-semibold px-4 py-2 rounded-full shadow-xs transition-colors"
                  >
                    <span>{card.buttonText}</span>
                    <ArrowRight className={`w-3 h-3 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
                  </Link>
                </div>

                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white/80 shadow-xs shrink-0 flex items-center justify-center border border-ink-100/40">
                  {card.imageUrl ? (
                    <Image
                      src={card.imageUrl}
                      alt={card.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-plum-100/80 text-plum-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
