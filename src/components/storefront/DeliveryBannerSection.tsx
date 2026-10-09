'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flower2, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';

export function DeliveryBannerSection() {
  const { t, isRtl } = useLocale();

  return (
    <section className="py-12 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-plum-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden shadow-xl border border-plum-800">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-plum-800/80 text-blush-200 text-[11px] font-semibold px-3.5 py-1.5 rounded-full border border-plum-700">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.sections.deliveryBannerEyebrow}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight whitespace-pre-line">
                {t.sections.deliveryBannerTitle}
              </h2>

              <p className="text-sm sm:text-base text-plum-200 font-light max-w-lg leading-relaxed">
                {t.sections.deliveryBannerSubtitle}
              </p>

              <div>
                <Link
                  href="/products"
                  className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white text-plum-900 hover:bg-blush-100 text-xs font-bold px-7 py-3.5 rounded-full shadow-lg transition-all hover:scale-105"
                >
                  <span>{t.sections.shopNow}</span>
                  <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </Link>
              </div>

              {/* 4 Features Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-plum-800 text-xs text-plum-200">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Flower2 className="w-4 h-4 text-blush-200 shrink-0" />
                  <span>{t.features.freshFlowers}</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Sparkles className="w-4 h-4 text-blush-200 shrink-0" />
                  <span>{t.features.quality}</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <ShieldCheck className="w-4 h-4 text-blush-200 shrink-0" />
                  <span>{t.features.secure}</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <MapPin className="w-4 h-4 text-blush-200 shrink-0" />
                  <span>{t.features.tracking}</span>
                </div>
              </div>
            </div>

            {/* Right Bouquet Image Graphic */}
            <div className="lg:col-span-5 relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-2xl border border-plum-700/50">
              <Image
                src="/demo-media/delivery_banner.jpg"
                alt={t.sections.deliveryBannerTitle}
                fill
                className="object-cover"
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
