'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';
import { Category } from '@/types';
import { useCarousel } from './carousel-helper';

interface PromoCardsGridProps {
  categories?: Category[];
}

export function PromoCardsGrid({ categories = [] }: PromoCardsGridProps) {
  const { t, isRtl } = useLocale();
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

  const cards = [
    {
      title: t.sections.giftHampersTitle,
      subtitle: t.sections.giftHampersSubtitle,
      buttonText: t.sections.shopGiftsCta,
      link: '/products?category=gift-hampers',
      imageUrl: giftCategory?.image_url || 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455264/burble/product_pastel_bouquet.jpg',
    },
    {
      title: t.sections.combosTitle,
      subtitle: t.sections.combosSubtitle,
      buttonText: t.sections.shopCombosCta,
      link: '/products?category=combos',
      imageUrl: combosCategory?.image_url || 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455263/burble/product_red_roses.jpg',
    },
    {
      title: t.sections.diyFlowersTitle,
      subtitle: t.sections.diyFlowersSubtitle,
      buttonText: t.sections.shopDiyCta,
      link: '/products?category=diy-flowers',
      imageUrl: diyCategory?.image_url || 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455266/burble/product_sunshine_bouquet.jpg',
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
          <div className="absolute inset-0 bg-gradient-to-r from-cream-100 via-cream-100/90 to-cream-100/20 rtl:bg-gradient-to-l rtl:from-cream-100 rtl:via-cream-100/90 rtl:to-cream-100/20 pointer-events-none" />
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
        
        {/* Mobile: Single-card horizontal carousel with touch swiping & controls (lg:hidden) */}
        <div className="block lg:hidden">
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

          {/* Mobile Carousel Navigation Arrows & Indicators */}
          <div className="flex items-center justify-between mt-4 px-1">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
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

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="w-7 h-7 rounded-full border border-plum-200 bg-white text-plum-900 flex items-center justify-center shadow-xs disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
                aria-label="Previous promotional card"
              >
                <ChevronLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="w-7 h-7 rounded-full border border-plum-200 bg-white text-plum-900 flex items-center justify-center shadow-xs disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
                aria-label="Next promotional card"
              >
                <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
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
