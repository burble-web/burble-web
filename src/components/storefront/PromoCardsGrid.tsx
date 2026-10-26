'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';
import { Category, HomepageSection } from '@/types';
import { useCarousel } from './carousel-helper';

interface PromoCardsGridProps {
  categories?: Category[];
  section?: HomepageSection;
}

export function PromoCardsGrid({ categories = [], section }: PromoCardsGridProps) {
  const { t, isRtl, locale } = useLocale();
  const {
    containerRef,
    canScrollPrev,
    canScrollNext,
    activeIndex,
    scrollPrev,
    scrollNext,
    scrollToIndex,
  } = useCarousel({ stepByItem: true });

  const giftCategory = categories.find((c) => c.slug === 'gift-hampers');
  const combosCategory = categories.find((c) => c.slug === 'combos');
  const diyCategory = categories.find((c) => c.slug === 'diy-flowers');

  const giftImage = section?.content_json?.gift_hampers_image || giftCategory?.image_url || '';
  const combosImage = section?.content_json?.combos_image || combosCategory?.image_url || '';
  const diyImage = section?.content_json?.diy_flowers_image || diyCategory?.image_url || '';

  const cards = [
    {
      title: t.sections.giftHampersTitle,
      subtitle: t.sections.giftHampersSubtitle,
      buttonText: t.sections.shopGiftsCta,
      link: locale === 'ar' ? '/ar/categories/gift-hampers' : '/en/categories/gift-hampers',
      imageUrl: giftImage,
    },
    {
      title: t.sections.combosTitle,
      subtitle: t.sections.combosSubtitle,
      buttonText: t.sections.shopCombosCta,
      link: locale === 'ar' ? '/ar/categories/combos' : '/en/categories/combos',
      imageUrl: combosImage,
    },
    {
      title: t.sections.diyFlowersTitle,
      subtitle: t.sections.diyFlowersSubtitle,
      buttonText: t.sections.shopDiyCta,
      link: locale === 'ar' ? '/ar/categories/diy-flowers' : '/en/categories/diy-flowers',
      imageUrl: diyImage,
    },
  ];

  const renderCardContent = (card: typeof cards[0]) => (
    <>
      {/* Integrated Floral Background Image */}
      {card.imageUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={card.imageUrl}
            alt={card.title}
            fill
            className="object-cover object-right group-hover:scale-105 transition-transform duration-700"
          />
          {/* Soft luxury cream gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-cream-100 via-cream-100/40 to-cream-100/20 rtl:bg-gradient-to-l rtl:from-cream-100 rtl:via-cream-100/90 rtl:to-cream-100/20 pointer-events-none" />
        </div>
      )}

      {/* Text & CTA on Left Side */}
      <div className="relative z-10 max-w-[70%] sm:max-w-[60%]">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-plum-900 leading-tight">
          {card.title}
        </h3>
        <p className="text-xs text-ink-600 font-normal mt-2 mb-4 leading-relaxed line-clamp-2">
          {card.subtitle}
        </p>
        <Link
          href={card.link}
          className="inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-plum-900 hover:bg-plum-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xs transition-all hover:scale-105"
        >
          <span>{card.buttonText}</span>
          <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
        </Link>
      </div>
    </>
  );

  return (
    <section className="py-8 sm:py-12 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile: Single-card horizontal carousel with touch swiping & left/right centered arrows (lg:hidden) */}
        <div className="block lg:hidden">
          <div className="relative">
            {/* Previous Arrow (Left Side) */}
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="absolute start-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full border border-plum-200/90 bg-white/95 text-plum-900 flex items-center justify-center shadow-md disabled:opacity-30 disabled:pointer-events-none hover:bg-plum-50 active:scale-95 transition-all"
              aria-label="Previous promotional card"
            >
              <ChevronLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>

            {/* Carousel Track */}
            <div
              ref={containerRef}
              className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className="w-full min-w-full max-w-full shrink-0 snap-center relative rounded-3xl overflow-hidden p-6 sm:p-8 min-h-[220px] flex flex-col justify-center border border-ink-100/60 shadow-xs group bg-cream-100"
                >
                  {renderCardContent(card)}
                </div>
              ))}
            </div>

            {/* Next Arrow (Right Side) */}
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="absolute end-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full border border-plum-200/90 bg-white/95 text-plum-900 flex items-center justify-center shadow-md disabled:opacity-30 disabled:pointer-events-none hover:bg-plum-50 active:scale-95 transition-all"
              aria-label="Next promotional card"
            >
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Mobile Carousel Indicators (Dots only, no bottom arrows) */}
          <div className="flex items-center justify-center gap-1.5 mt-3.5">
            {cards.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? 'w-5 bg-plum-800' : 'w-1.5 bg-plum-200 hover:bg-plum-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop & Large Tablet: 3-Column Grid (hidden on mobile) */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="relative rounded-3xl overflow-hidden p-6 sm:p-8 min-h-[220px] sm:min-h-[240px] flex flex-col justify-center border border-ink-100/60 shadow-xs hover:shadow-md transition-all duration-300 group bg-cream-100"
            >
              {renderCardContent(card)}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
