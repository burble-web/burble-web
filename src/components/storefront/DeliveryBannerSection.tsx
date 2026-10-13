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

  const deliveryImage = (bannerImageUrl && !bannerImageUrl.includes('delivery_banner.jpg'))
    ? bannerImageUrl
    : '/images/delivery-bg.png';

  const headingText = locale === 'ar' ? 'توصيل في نفس اليوم لجميع أنحاء قطر' : 'Same Day Delivery Across Qatar';
  const subtitleText = locale === 'ar' ? 'فاجئ أحبابك بزهور طبيعية نضرة، تصل في موعدها دائماً.' : 'Surprise your loved ones with fresh flowers, delivered on time, every time.';
  const ctaText = locale === 'ar' ? 'تسوق الآن' : 'Shop Now';

  const features = [
    { icon: Flower2, label: t.features?.freshFlowers || 'Fresh Flowers' },
    { icon: Sparkles, label: t.features?.quality || 'Quality' },
    { icon: ShieldCheck, label: t.features?.secure || 'Secure' },
    { icon: MapPin, label: t.features?.tracking || 'Tracking' },
  ];

  return (
    <section className="py-6 sm:py-10 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Banner card: TOP = image + text, BOTTOM = separate features bar (image never goes behind it) */}
        <div className="relative bg-plum-900 text-white rounded-2xl overflow-hidden shadow-lg border border-plum-800">

          {/* ── TOP AREA: background image + heading / text / CTA ── */}
          <div className="relative">
            {/* Image layer — only behind the top area.
                object-contain = whole picture is shown (no zoom/crop); pinned to the right side. */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {/* Whole image is always shown (object-contain = never cropped), pinned to the right.
                  Mobile: sits at the bottom-right; desktop: vertically centered on the right. */}
              <Image
                src={deliveryImage}
                alt="Same Day Delivery bouquet"
                fill
                priority
                className="object-contain object-right-bottom rtl:object-left-bottom sm:object-right sm:rtl:object-left"
              />
              {/* Fade on the text side so the heading/text stay readable over the image.
                  Mobile: wider and stronger; desktop: lighter. */}
              <div className="absolute inset-y-0 start-0 w-[85%] sm:w-1/2 bg-gradient-to-r from-plum-900 via-plum-900/85 sm:via-plum-900/70 to-transparent rtl:bg-gradient-to-l rtl:from-plum-900 rtl:via-plum-900/85 rtl:sm:via-plum-900/70 rtl:to-transparent" />
            </div>

            {/* Text content */}
            <div className="relative z-10 flex flex-col justify-center px-5 sm:px-8 lg:px-10 py-6 sm:py-8 min-h-[170px] sm:min-h-[190px]">
              <div className="flex flex-col items-start gap-2.5 sm:gap-3 max-w-[65%] sm:max-w-sm lg:max-w-md">
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
            </div>
          </div>

          {/* ── BOTTOM BAR: features, desktop only (hidden on mobile), same plum color as the banner ── */}
          <div className="hidden sm:block relative z-10 bg-plum-900 border-t border-white/10 px-8 lg:px-10 py-3">
            <div className="flex items-center justify-end gap-7 lg:gap-9">
              {features.map(({ icon: Icon, label }, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-blush-100 font-medium leading-tight"
                >
                  <Icon className="w-4 h-4 text-blush-200 shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}