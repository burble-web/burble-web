import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const PROMO_CARDS = [
  {
    title: 'Gift Hampers',
    subtitle: 'Flowers with Chocolates, Cakes & More',
    buttonText: 'Shop Gifts',
    link: '/products?category=gift-hampers',
    image: '/demo-media/product_pastel_bouquet.jpg',
    bgColor: 'bg-blush-100/60',
  },
  {
    title: 'Combos',
    subtitle: 'Beautiful combinations for special moments',
    buttonText: 'Shop Combos',
    link: '/products',
    image: '/demo-media/product_sunshine_bouquet.jpg',
    bgColor: 'bg-cream-200',
  },
  {
    title: 'DIY Flowers',
    subtitle: 'Create your own unique bouquet',
    buttonText: 'Shop DIY',
    link: '/products',
    image: '/demo-media/hero_slide_two.jpg',
    bgColor: 'bg-plum-100/50',
  },
];

export function PromoCardsGrid() {
  return (
    <section className="py-12 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROMO_CARDS.map((card, idx) => (
            <div
              key={idx}
              className={`${card.bgColor} rounded-2xl p-6 flex items-center justify-between border border-ink-100/50 shadow-xs hover:shadow-md transition-all duration-300 group`}
            >
              <div className="max-w-[60%]">
                <h3 className="font-serif text-xl font-bold text-plum-900 leading-tight">
                  {card.title}
                </h3>
                <p className="text-xs text-ink-500 font-normal mt-1.5 mb-4 leading-relaxed">
                  {card.subtitle}
                </p>
                <Link
                  href={card.link}
                  className="inline-flex items-center space-x-1.5 bg-plum-900 hover:bg-plum-800 text-white text-[11px] font-semibold px-4 py-2 rounded-full shadow-xs transition-colors"
                >
                  <span>{card.buttonText}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-white shadow-xs shrink-0">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
