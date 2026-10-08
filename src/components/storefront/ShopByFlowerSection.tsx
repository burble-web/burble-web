import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Collection } from '@/types';

interface ShopByFlowerSectionProps {
  flowers: Collection[];
}

export function ShopByFlowerSection({ flowers }: ShopByFlowerSectionProps) {
  if (!flowers || flowers.length === 0) return null;

  return (
    <section className="py-12 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-plum-900 tracking-tight">
            Shop By Flower
          </h2>
          <Link href="/products" className="text-xs font-semibold text-plum-800 hover:text-plum-700">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 text-center">
          {flowers.map((item) => (
            <Link
              key={item.id}
              href={`/products?flower=${item.slug}`}
              className="group flex flex-col items-center space-y-2.5"
            >
              <div className="relative w-16 h-16 sm:w-22 sm:h-22 rounded-full overflow-hidden border border-ink-100 bg-white p-1 group-hover:border-plum-800 transition-all duration-300 shadow-xs group-hover:scale-105">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-cream-200">
                  <Image
                    src={item.image_url || '/demo-media/product_blush_bouquet.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className="text-[11px] font-semibold text-plum-900 group-hover:text-plum-700 transition-colors">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
