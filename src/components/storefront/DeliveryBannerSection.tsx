'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flower2, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';

interface DeliveryBannerSectionProps {
  bannerImageUrl?: string | null;
}

export function DeliveryBannerSection({ bannerImageUrl }: DeliveryBannerSectionProps) {
  const { t, isRtl, locale } = useLocale();

  const deliveryImage = bannerImageUrl || 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455272/burble/delivery_banner.jpg';

  const headingText = locale === 'ar' ? 'توصيل في نفس اليوم لجميع أنحاء قطر' : 'Same Day Delivery Across Qatar';
  const subtitleText = locale === 'ar' ? 'فاجئ أحبابك بزهور طبيعية نضرة، تصل في موعدها دائماً.' : 'Surprise your loved ones with fresh flowers, delivered on time, every time.';
  const ctaText = locale === 'ar' ? 'تسوق الآن' : 'Shop Now';

  return (
    <section className="py-6 sm:py-10 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Wide horizontal banner — deep burgundy background */}
        <div className="relative bg-plum-900 text-white rounded-2xl overflow-hidden shadow-lg border border-plum-800">

          {/* ── Background image layer: right-aligned, blended into burgundy ── */}
          <div className="absolute inset-y-0 end-0 w-1/2 sm:w-1/2 lg:w-5/12 pointer-events-none z-0">
            <Image
              src={deliveryImage}
              alt="Same Day Delivery bouquet"
              fill
              priority
              className="object-cover object-right"
            />
            {/* Left-to-right plum gradient so image melts into the background */}
            <div className="absolute inset-0 bg-gradient-to-r from-plum-900 via-plum-900/80 via-40% to-plum-900/10 rtl:bg-gradient-to-l rtl:from-plum-900 rtl:via-plum-900/80 rtl:via-40% rtl:to-plum-900/10" />
            {/* Bottom fade so the features row stays readable on desktop */}
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-plum-900/70 to-transparent hidden sm:block" />
          </div>

          {/* ── Main content wrapper (above the image layer) ── */}
          <div className="relative z-10 flex flex-col justify-center sm:justify-between gap-4 sm:gap-6 px-5 sm:px-8 lg:px-10 py-6 sm:pt-7 sm:pb-5 min-h-[160px] sm:min-h-[210px]">

            {/* Left side: heading + description + CTA */}
            <div className="flex flex-col items-start gap-2.5 sm:gap-3 max-w-[70%] sm:max-w-sm lg:max-w-md">
              <h2 className="font-serif text-xl sm:text-3xl lg:text-[28px] font-bold text-white leading-tight tracking-tight">
                {headingText}
              </h2>
              <p className="text-xs sm:text-sm text-plum-100 font-light leading-relaxed line-clamp-2 sm:line-clamp-none">
                {subtitleText}
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 rtl:flex-row-reverse bg-white hover:bg-blush-100 text-plum-900 text-xs font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-md transition-all hover:scale-105 active:scale-95 whitespace-nowrap mt-0.5 sm:mt-1"
              >
                <span>{ctaText}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </Link>
            </div>

            {/* ── Feature row: COMPLETELY HIDDEN ON MOBILE (hidden sm:flex), preserved on desktop at bottom-right ── */}
            <div className="w-full hidden sm:flex flex-wrap sm:flex-nowrap items-center justify-end gap-5 sm:gap-7 lg:gap-9 pt-2">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-blush-100 font-medium">
                <Flower2 className="w-4 h-4 text-blush-200 shrink-0" />
                <span>{t.features?.freshFlowers || 'Fresh Flowers'}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-blush-100 font-medium">
                <Sparkles className="w-4 h-4 text-blush-200 shrink-0" />
                <span>{t.features?.quality || 'Quality'}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-blush-100 font-medium">
                <ShieldCheck className="w-4 h-4 text-blush-200 shrink-0" />
                <span>{t.features?.secure || 'Secure'}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-blush-100 font-medium">
                <MapPin className="w-4 h-4 text-blush-200 shrink-0" />
                <span>{t.features?.tracking || 'Tracking'}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
