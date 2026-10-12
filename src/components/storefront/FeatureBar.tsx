'use client';

import React from 'react';
import { Flower2, Truck, Award, Gift, ShieldCheck, MapPin } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';

export function FeatureBar() {
  const { t } = useLocale();

  const features = [
    { icon: Flower2, title: t.features.freshFlowers, subtitle: t.features.sourcedDaily },
    { icon: Truck, title: t.features.sameDay, subtitle: t.features.delivery },
    { icon: Award, title: t.features.premium, subtitle: t.features.quality },
    { icon: Gift, title: t.features.beautifully, subtitle: t.features.wrapped },
    { icon: ShieldCheck, title: t.features.secure, subtitle: t.features.payment },
    { icon: MapPin, title: t.features.easy, subtitle: t.features.tracking },
  ];

  return (
    <section className="bg-cream-200/80 border-b border-ink-100/60 py-3.5 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Mobile: 4 columns in a single row. Tablet: 3 cols. Desktop: 6 cols (unchanged). */}
        <div className="grid grid-cols-4 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-6 text-center">
          {features.map((item, idx) => {
            const IconComponent = item.icon;
            // On mobile, hide the last 2 features (Secure Payment & Easy Tracking)
            const isHiddenOnMobile = idx >= 4;
            return (
              <div
                key={idx}
                className={`${
                  isHiddenOnMobile ? 'hidden sm:flex' : 'flex'
                } flex-col items-center justify-start space-y-1 sm:space-y-1.5 group py-1 sm:py-0 min-w-0`}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-plum-800 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-plum-800 group-hover:text-white transition-all duration-300 shrink-0">
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
                </div>
                <div className="text-[10px] sm:text-xs min-w-0">
                  <p className="font-semibold text-plum-900 leading-tight">{item.title}</p>
                  <p className="text-ink-500 font-normal text-[9px] sm:text-[11px] leading-tight mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}