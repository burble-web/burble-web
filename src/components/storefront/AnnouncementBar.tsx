import React from 'react';
import { Flower2, Truck, Award, Gift, MapPin } from 'lucide-react';
import { SiteSettings } from '@/types';

interface AnnouncementBarProps {
  settings?: SiteSettings;
}

export function AnnouncementBar({ settings }: AnnouncementBarProps) {
  if (settings && !settings.announcement_enabled) return null;

  return (
    <div className="bg-plum-900 text-plum-100 text-xs py-2 px-4 border-b border-plum-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Desktop items */}
        <div className="hidden lg:flex items-center space-x-6 text-[11px] font-medium tracking-wide">
          <span className="flex items-center space-x-1.5">
            <Flower2 className="w-3.5 h-3.5 text-blush-200" />
            <span>Fresh Flowers Sourced Daily</span>
          </span>
          <span className="text-plum-700">•</span>
          <span className="flex items-center space-x-1.5">
            <Truck className="w-3.5 h-3.5 text-blush-200" />
            <span>Same-Day Delivery</span>
          </span>
          <span className="text-plum-700">•</span>
          <span className="flex items-center space-x-1.5">
            <Award className="w-3.5 h-3.5 text-blush-200" />
            <span>Premium Quality</span>
          </span>
          <span className="text-plum-700">•</span>
          <span className="flex items-center space-x-1.5">
            <Gift className="w-3.5 h-3.5 text-blush-200" />
            <span>Beautifully Wrapped</span>
          </span>
        </div>

        {/* Mobile centered text */}
        <div className="lg:hidden w-full text-center text-[11px] tracking-wide font-medium">
          {settings?.announcement_text || 'Fresh Flowers • Same-Day Delivery • Premium Quality'}
        </div>

        {/* Right side location selector */}
        <div className="hidden lg:flex items-center space-x-1 text-[11px] text-blush-100 font-medium">
          <MapPin className="w-3.5 h-3.5 text-blush-200" />
          <span>Delivering to Qatar</span>
        </div>
      </div>
    </div>
  );
}
