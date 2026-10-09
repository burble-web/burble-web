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
    <section className="bg-cream-200/80 border-b border-ink-100/60 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {features.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center justify-center space-y-1.5 group">
                <div className="w-10 h-10 rounded-full bg-white text-plum-800 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-plum-800 group-hover:text-white transition-all duration-300">
                  <IconComponent className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-plum-900 leading-tight">{item.title}</p>
                  <p className="text-ink-500 font-normal text-[11px] leading-tight">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
