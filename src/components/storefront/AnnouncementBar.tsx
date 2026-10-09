'use client';

import React from 'react';
import { Flower2, Truck, Award, Gift, MapPin } from 'lucide-react';
import { SiteSettings } from '@/types';
import { useLocale } from '@/lib/i18n/context';

interface AnnouncementBarProps {
  settings?: SiteSettings;
}

export function AnnouncementBar({ settings }: AnnouncementBarProps) {
  const { t, getLocalized } = useLocale();

  if (settings && !settings.announcement_enabled) return null;

  const announcementText = getLocalized(
    settings?.announcement_text,
    settings?.announcement_text_ar
  ) || t.announcement.defaultText;

  return (
    <div className="bg-plum-900 text-plum-100 text-xs py-2 px-4 border-b border-plum-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Desktop items */}
        <div className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse text-[11px] font-medium tracking-wide">
          <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <Flower2 className="w-3.5 h-3.5 text-blush-200 shrink-0" />
            <span>{t.announcement.freshDaily}</span>
          </span>
          <span className="text-plum-700">•</span>
          <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <Truck className="w-3.5 h-3.5 text-blush-200 shrink-0" />
            <span>{t.announcement.sameDay}</span>
          </span>
          <span className="text-plum-700">•</span>
          <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <Award className="w-3.5 h-3.5 text-blush-200 shrink-0" />
            <span>{t.announcement.premiumQuality}</span>
          </span>
          <span className="text-plum-700">•</span>
          <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <Gift className="w-3.5 h-3.5 text-blush-200 shrink-0" />
            <span>{t.announcement.beautifullyWrapped}</span>
          </span>
        </div>

        {/* Mobile centered text */}
        <div className="lg:hidden w-full text-center text-[11px] tracking-wide font-medium">
          {announcementText}
        </div>

        {/* Right side location tag */}
        <div className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse text-[11px] text-blush-100 font-medium">
          <MapPin className="w-3.5 h-3.5 text-blush-200 shrink-0" />
          <span>{t.common.deliveringTo}</span>
        </div>
      </div>
    </div>
  );
}
