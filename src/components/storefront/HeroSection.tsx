'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flower, Sparkles } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';
import { HomepageSection } from '@/types';

interface HeroSectionProps {
  section?: HomepageSection;
}

export function HeroSection({ section }: HeroSectionProps) {
  const { t, isRtl, getLocalized, locale } = useLocale();

  const content = section?.content_json || {};

  // Check if section title is CMS administrative metadata vs customer-facing title
  const isInternalMetaTitle = (titleStr?: string | null) => {
    if (!titleStr) return true;
    const lower = titleStr.toLowerCase().trim();
    return lower === 'main hero slider' || lower === 'hero banner' || lower === 'hero section' || titleStr === 'واجهة البانر الرئيسي';
  };

  const isInternalMetaSubtitle = (subStr?: string | null) => {
    if (!subStr) return true;
    const lower = subStr.toLowerCase().trim();
    return lower === 'homepage top visual hero slides' || lower === 'hero subtitle' || subStr === 'شرائح العرض البصري الرئيسية';
  };

  const rawTitleEn = content.heading || (!isInternalMetaTitle(section?.title) ? section?.title : null);
  const rawTitleAr = content.heading_ar || (!isInternalMetaTitle(section?.title_ar) ? section?.title_ar : null);
  const title = getLocalized(rawTitleEn, rawTitleAr) || t.hero.slide1Title;

  const rawSubtitleEn = content.subheading || (!isInternalMetaSubtitle(section?.subtitle) ? section?.subtitle : null);
  const rawSubtitleAr = content.subheading_ar || (!isInternalMetaSubtitle(section?.subtitle_ar) ? section?.subtitle_ar : null);
  const subtitle = getLocalized(rawSubtitleEn, rawSubtitleAr) || t.hero.slide1Subtitle;

  const ctaText = (locale === 'ar' ? content.cta_text_ar : content.cta_text) || content.cta_text || t.hero.slide1Cta;
  const ctaLink = content.cta_link || '/products';
  const desktopImage = content.desktop_image || content.image_url || '';
  const mobileImage = content.mobile_image || desktopImage || '';

  return (
    <section className="relative w-full overflow-hidden bg-plum-950 text-white min-h-[520px] lg:min-h-[600px] flex items-center">
      {/* Background Image (When configured in CMS) */}
      {desktopImage ? (
        <>
          <div className="hidden md:block absolute inset-0 z-0">
            <Image
              src={desktopImage}
              alt={title || 'Burble Flowers'}
              fill
              priority
              className="object-cover object-right lg:object-center brightness-90 transition-opacity duration-700"
            />
            {/* Soft directional gradient overlay for desktop readability */}
            <div className={`absolute inset-0 ${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-plum-950/90 via-plum-950/50 to-transparent w-full md:w-3/4`} />
          </div>

          <div className="md:hidden absolute inset-0 z-0">
            <Image
              src={mobileImage || desktopImage}
              alt={title || 'Burble Flowers'}
              fill
              priority
              className="object-cover object-top transition-opacity duration-700"
            />
            {/* Dark gradient for mobile readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-plum-950/95 via-plum-950/60 to-plum-900/30" />
          </div>
        </>
      ) : (
        /* Neutral Luxury Floral Gradient Background */
        <div className="absolute inset-0 bg-radial-[circle_at_70%_30%] from-plum-800/80 via-plum-950 to-plum-950 z-0">
          <div className="absolute -bottom-24 -end-24 w-96 h-96 rounded-full bg-blush-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -top-24 -start-24 w-96 h-96 rounded-full bg-plum-700/20 blur-3xl pointer-events-none" />
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-24">
        <div className="max-w-xl">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-plum-900/70 border border-plum-700/50 text-blush-200 text-[11px] uppercase tracking-widest font-semibold px-3.5 py-1.5 rounded-full mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blush-300" />
            <span>{t.hero.slide1Eyebrow}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] text-white tracking-tight whitespace-pre-line mb-4 drop-shadow-sm">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-plum-100 font-light leading-relaxed mb-8 max-w-md">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={ctaLink}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-plum-800 hover:bg-plum-700 text-white text-xs font-semibold px-7 py-3.5 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 border border-plum-600/30"
            >
              <span>{ctaText}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center space-x-2 rtl:space-x-reverse text-xs text-white/90 hover:text-white bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-full hover:bg-white/20 transition-all border border-white/10"
            >
              <Flower className="w-4 h-4 text-blush-300" />
              <span className="font-medium">{t.common.aboutUs}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
