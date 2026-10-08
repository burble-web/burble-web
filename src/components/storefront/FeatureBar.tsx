import React from 'react';
import { Flower2, Truck, Award, Gift, ShieldCheck, MapPin } from 'lucide-react';

const FEATURES = [
  { icon: Flower2, title: 'Fresh Flowers', subtitle: 'Sourced Daily' },
  { icon: Truck, title: 'Same-Day', subtitle: 'Delivery' },
  { icon: Award, title: 'Premium', subtitle: 'Quality' },
  { icon: Gift, title: 'Beautifully', subtitle: 'Wrapped' },
  { icon: ShieldCheck, title: 'Secure', subtitle: 'Payment' },
  { icon: MapPin, title: 'Easy', subtitle: 'Tracking' },
];

export function FeatureBar() {
  return (
    <section className="bg-cream-200/80 border-b border-ink-100/60 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {FEATURES.map((item, idx) => {
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
