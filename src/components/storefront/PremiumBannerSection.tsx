'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { useLocale } from '@/lib/i18n/context';
import { ProductCard } from './ProductCard';

interface PremiumBannerSectionProps {
  products: Product[];
}

const DEFAULT_VASE_PRODUCTS: Product[] = [
  {
    id: 'd1000000-0000-0000-0000-000000000006',
    name: 'Classic Red Roses Vase',
    name_ar: 'فازة الجوري الأحمر الكلاسيكية',
    slug: 'classic-red-roses-vase',
    description: 'Long-stemmed red roses arranged in an artisan clear crystal vase.',
    description_ar: 'أفخم ورود الجوري الأحمر طويل الساق منسقة بحرفية في فازة كريستال نقية وفاخرة.',
    price: 350.00,
    category_id: 'c1000000-0000-0000-0000-000000000002',
    is_featured: true,
    is_new_arrival: false,
    stock_status: 'in_stock',
    active: true,
    main_image_url: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455263/burble/product_red_roses.jpg',
    sort_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'd1000000-0000-0000-0000-000000000007',
    name: 'Mixed Floral Vase',
    name_ar: 'فازة الحديقة الزهرية المشكلة',
    slug: 'mixed-floral-vase',
    description: 'A vibrant garden arrangement of seasonal blooms presented in a handcrafted ceramic vase.',
    description_ar: 'تنسيق زهور موسمية غني بألوان الطبيعة المبهجة، مقدم في فازة سيراميك مصنوعة ومزخرفة يدوياً.',
    price: 280.00,
    category_id: 'c1000000-0000-0000-0000-000000000002',
    is_featured: true,
    is_new_arrival: false,
    stock_status: 'in_stock',
    active: true,
    main_image_url: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455266/burble/product_sunshine_bouquet.jpg',
    sort_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'd1000000-0000-0000-0000-000000000008',
    name: 'Elegant White Vase',
    name_ar: 'فازة الزنبق الأبيض الفاخرة',
    slug: 'elegant-white-vase',
    description: 'Royal white lilies and pristine white roses in a sleek ceramic vase.',
    description_ar: 'زهور الزنبق الأبيض الملكي مع ورود الجوري البيضاء النقية في فازة سيراميك راقية.',
    price: 380.00,
    category_id: 'c1000000-0000-0000-0000-000000000002',
    is_featured: true,
    is_new_arrival: false,
    stock_status: 'in_stock',
    active: true,
    main_image_url: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455265/burble/product_white_lily.jpg',
    sort_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function PremiumBannerSection({ products }: PremiumBannerSectionProps) {
  const { t, isRtl, locale } = useLocale();

  const displayProducts = products && products.length >= 3 ? products.slice(0, 3) : DEFAULT_VASE_PRODUCTS;

  // Dedicated reference image: purple BURBLE flower box, pink & cream roses, soft lavender backdrop
  const bannerImage = 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455268/burble/premium_banner.jpg';

  return (
    <section className="py-12 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* items-stretch: both columns get the same height as the left image card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">

          {/* Left Side: Premium Collections Wide Background Image Card */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-plum-200/70 shadow-xs min-h-[340px] sm:min-h-[380px] lg:min-h-[400px] flex items-center p-6 sm:p-10 group">

            <div className="absolute inset-0 z-0">
              <Image
                src={bannerImage}
                alt="Premium Collections"
                fill
                priority
                className="object-cover object-right sm:object-center group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#EDE2F2] via-[#EDE2F2]/90 via-45% to-transparent rtl:bg-gradient-to-l rtl:from-[#EDE2F2] rtl:via-[#EDE2F2]/90 rtl:via-45% rtl:to-transparent pointer-events-none" />
            </div>

            <div className="relative z-10 max-w-xs sm:max-w-sm">
              <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-plum-900/10 border border-plum-900/20 text-plum-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 backdrop-blur-xs">
               
                <span>{locale === 'ar' ? 'تشكيلة فاخرة' : 'LUXE FLORALS'}</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-plum-950 mb-3 leading-[1.1] tracking-tight">
                {locale === 'ar' ? 'التشكيلة الفاخرة' : 'Premium Collections'}
              </h3>
              <p className="text-xs sm:text-sm text-plum-900/80 font-normal leading-relaxed mb-6">
                {locale === 'ar' ? 'تنسيقات زهور حصرية واستثنائية لأجمل اللحظات.' : 'Exclusive floral arrangements for extraordinary moments.'}
              </p>
              <Link
                href="/products?category=premium-collections"
                className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-plum-900 hover:bg-plum-800 text-white text-xs font-semibold px-6 py-3 rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <span>{locale === 'ar' ? 'استكشف التشكيلة' : 'Explore Premium'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </div>

          {/* Right Side: vertically centered against the left image card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-plum-900 leading-tight">
                  {t.sections.flowersInVaseTitle}
                </h3>
                <p className="text-xs text-ink-500 mt-0.5">{t.sections.flowersInVaseSubtitle}</p>
              </div>
              <Link
                href="/products?category=flowers-in-vase"
                className="group flex items-center space-x-1 rtl:space-x-reverse text-xs font-semibold text-plum-800 hover:text-plum-700 shrink-0"
              >
                <span>{t.common.viewAll}</span>
                <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
              </Link>
            </div>

            {/* Exactly 3 Product Cards in One Horizontal Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 items-stretch">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}