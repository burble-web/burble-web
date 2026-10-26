'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Flower, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';
import { HomepageSection } from '@/types';

interface HeroSectionProps {
  section?: HomepageSection;
}

const DEFAULT_SLIDES = [
  {
    desktop_image: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455269/burble/hero_desktop.jpg',
    mobile_image: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455274/burble/hero_mobile.jpg',
  },
  {
    desktop_image: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455271/burble/hero_slide_two.jpg',
    mobile_image: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455275/burble/hero_mobile_v2.jpg',
  },
  {
    desktop_image: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455268/burble/premium_banner.jpg',
    mobile_image: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455274/burble/hero_mobile.jpg',
  },
];

export function HeroSection({ section }: HeroSectionProps) {
  const { t, isRtl, getLocalized, locale } = useLocale();

  const content = section?.content_json || {};

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

  // Video or Image mode
  const mediaType = content.media_type || (content.video_url ? 'video' : 'images');
  const configuredDesktopVideo = content.video_url || '';
  const configuredMobileVideo = content.video_mobile_url || configuredDesktopVideo;

  const [mobileVideoError, setMobileVideoError] = useState(false);
  const [desktopVideoError, setDesktopVideoError] = useState(false);
  const [isMobileVideoPlaying, setIsMobileVideoPlaying] = useState(false);
  const [isDesktopVideoPlaying, setIsDesktopVideoPlaying] = useState(false);

  // If mobile video fails to load, gracefully fallback to desktop video
  const effectiveMobileVideo = !mobileVideoError && configuredMobileVideo
    ? configuredMobileVideo
    : (!desktopVideoError && configuredDesktopVideo ? configuredDesktopVideo : '');

  const effectiveDesktopVideo = !desktopVideoError && configuredDesktopVideo
    ? configuredDesktopVideo
    : (!mobileVideoError && configuredMobileVideo ? configuredMobileVideo : '');

  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);

  const setupVideoElement = (el: HTMLVideoElement | null) => {
    if (!el) return;
    try {
      el.muted = true;
      el.defaultMuted = true;
      el.playsInline = true;
      el.setAttribute('muted', '');
      el.setAttribute('playsinline', '');
      el.setAttribute('webkit-playsinline', 'true');
      el.setAttribute('x5-playsinline', 'true');
      const p = el.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    } catch {
      // Ignore autoplay policy rejections
    }
  };

  // Autoplay reliability for iOS Safari (including Low Power Mode) & mobile browsers:
  // When Low Power Mode or strict browser policy pauses autoplay,
  // listening to touch, scroll, click, or tab visibility triggers playback seamlessly without user friction.
  useEffect(() => {
    if (mediaType !== 'video') return;

    const attemptPlay = () => {
      const mob = mobileVideoRef.current;
      const desk = desktopVideoRef.current;
      if (mob && mob.paused) {
        mob.muted = true;
        mob.play().catch(() => {});
      }
      if (desk && desk.paused) {
        desk.muted = true;
        desk.play().catch(() => {});
      }
    };

    // Try immediately on mount / URL change
    attemptPlay();

    // Trigger on user interactions (unlocks iOS Safari Low Power Mode restriction)
    const onUserInteraction = () => {
      attemptPlay();
    };

    // Auto resume if user switches between apps (e.g. returning from WhatsApp)
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        attemptPlay();
      }
    };

    window.addEventListener('touchstart', onUserInteraction, { passive: true });
    window.addEventListener('scroll', onUserInteraction, { passive: true });
    window.addEventListener('click', onUserInteraction, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('touchstart', onUserInteraction);
      window.removeEventListener('scroll', onUserInteraction);
      window.removeEventListener('click', onUserInteraction);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [mediaType, effectiveMobileVideo, effectiveDesktopVideo]);

  // Determine Slides (Up to 3 images moving one by one)
  const configuredSlides = Array.isArray(content.slides) && content.slides.length > 0
    ? content.slides
    : (content.desktop_image
        ? [{ desktop_image: content.desktop_image, mobile_image: content.mobile_image || content.desktop_image }]
        : DEFAULT_SLIDES);

  const slides = configuredSlides.slice(0, 3);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto rotate slides every 5 seconds when in image mode
  useEffect(() => {
    if (mediaType === 'video' || slides.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [mediaType, slides.length, isHovered]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const fallbackDesktopPoster = slides[0]?.desktop_image || slides[0]?.desktopImage || DEFAULT_SLIDES[0].desktop_image;
  const fallbackMobilePoster = slides[0]?.mobile_image || slides[0]?.mobileImage || fallbackDesktopPoster;

  const handleBannerTap = () => {
    if (mediaType !== 'video') return;
    const mob = mobileVideoRef.current;
    const desk = desktopVideoRef.current;
    if (mob && mob.paused) mob.play().catch(() => {});
    if (desk && desk.paused) desk.play().catch(() => {});
  };

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleBannerTap}
      className="relative w-full overflow-hidden bg-plum-950 text-white min-h-[600px] md:min-h-[540px] lg:min-h-[620px] flex items-end md:items-center select-none"
    >
      {/* 1. MEDIA LAYER: Video Mode vs Rotating 3 Images */}
      {mediaType === 'video' && (effectiveDesktopVideo || effectiveMobileVideo) ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Static High-Res Poster Layer: always rendered underneath so there is never a black frame or play overlay */}
          <picture className="absolute inset-0 w-full h-full block">
            <source media="(min-width: 768px)" srcSet={fallbackDesktopPoster} />
            <source media="(max-width: 767px)" srcSet={fallbackMobilePoster} />
            <img
              src={fallbackDesktopPoster}
              alt={title ? `${title} — Burble Flowers Qatar` : "Burble Luxury Fresh Flowers Qatar"}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="w-full h-full object-cover object-top md:object-right lg:object-center brightness-90"
            />
          </picture>

          {/* Desktop Screen Video */}
          {effectiveDesktopVideo && (
            <video
              ref={(el) => {
                desktopVideoRef.current = el;
                setupVideoElement(el);
              }}
              key={effectiveDesktopVideo}
              autoPlay
              loop
              muted
              playsInline
              {...({ 'webkit-playsinline': 'true', 'x5-playsinline': 'true' } as Record<string, string>)}
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              aria-hidden="true"
              tabIndex={-1}
              onPlaying={() => setIsDesktopVideoPlaying(true)}
              onTimeUpdate={(e) => {
                if (e.currentTarget.currentTime > 0) setIsDesktopVideoPlaying(true);
              }}
              onError={() => setDesktopVideoError(true)}
              className={`hidden md:block w-full h-full object-cover brightness-90 transition-opacity duration-700 pointer-events-none ${
                isDesktopVideoPlaying ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <source src={effectiveDesktopVideo} type="video/mp4" />
            </video>
          )}

          {/* Mobile Screen Video */}
          {effectiveMobileVideo && (
            <video
              ref={(el) => {
                mobileVideoRef.current = el;
                setupVideoElement(el);
              }}
              key={effectiveMobileVideo}
              autoPlay
              loop
              muted
              playsInline
              {...({ 'webkit-playsinline': 'true', 'x5-playsinline': 'true' } as Record<string, string>)}
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              aria-hidden="true"
              tabIndex={-1}
              onPlaying={() => setIsMobileVideoPlaying(true)}
              onTimeUpdate={(e) => {
                if (e.currentTarget.currentTime > 0) setIsMobileVideoPlaying(true);
              }}
              onError={() => setMobileVideoError(true)}
              className={`md:hidden w-full h-full object-cover brightness-90 transition-opacity duration-700 pointer-events-none ${
                isMobileVideoPlaying ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <source src={effectiveMobileVideo} type="video/mp4" />
            </video>
          )}

          {/* Readability Gradient Overlays */}
          <div className={`hidden md:block absolute inset-0 pointer-events-none ${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-plum-950/95 via-plum-950/60 to-transparent w-full md:w-3/4`} />
          <div className="md:hidden absolute inset-0 pointer-events-none bg-gradient-to-t from-plum-950/95 via-plum-950/70 to-transparent" />
        </div>
      ) : (
        /* Rotating Images Carousel (3 images moving one by one) */
        <div className="absolute inset-0 z-0 overflow-hidden">
          {slides.map(
            (
              slide: {
                desktop_image?: string;
                desktopImage?: string;
                url?: string;
                mobile_image?: string;
                mobileImage?: string;
              },
              idx: number
            ) => {
            const isActive = idx === currentSlide;
            const desktopSrc = slide.desktop_image || slide.desktopImage || slide.url || DEFAULT_SLIDES[idx]?.desktop_image;
            const mobileSrc = slide.mobile_image || slide.mobileImage || desktopSrc || DEFAULT_SLIDES[idx]?.mobile_image;
            const isLcp = idx === 0;

            return (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-1 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Responsive picture element: browser only requests matching viewport image */}
                <picture className="absolute inset-0 w-full h-full block">
                  <source media="(min-width: 768px)" srcSet={desktopSrc} />
                  <source media="(max-width: 767px)" srcSet={mobileSrc} />
                  <img
                    src={desktopSrc}
                    alt={title ? `${title} — Burble Flowers Qatar` : `Burble Luxury Fresh Flowers Hero ${idx + 1}`}
                    loading={isLcp ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={isLcp ? 'high' : 'low'}
                    className="w-full h-full object-cover object-top md:object-right lg:object-center brightness-90"
                  />
                </picture>

                {/* Readability Gradient Overlays */}
                <div className={`hidden md:block absolute inset-0 ${isRtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-plum-950/95 via-plum-950/60 to-transparent w-full md:w-3/4 pointer-events-none`} />
                <div className="md:hidden absolute inset-0 bg-gradient-to-t from-plum-950/95 via-plum-950/70 to-transparent pointer-events-none" />
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Hero Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 pb-10 md:py-24">
        <div className="max-w-xl">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-plum-900/70 border border-plum-700/50 text-blush-200 text-[11px] uppercase tracking-widest font-semibold px-3.5 py-1.5 rounded-full mb-4 backdrop-blur-md">
           
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

          {/* 3. Slide Counter (Matching Reference: '01 — 03') */}
          {mediaType === 'images' && slides.length > 1 && (
            <div className="mt-10 flex items-center space-x-4 rtl:space-x-reverse text-xs text-plum-200">
              <span className="font-mono font-medium tracking-wider text-white">
                0{currentSlide + 1}
              </span>
              <div className="w-10 h-[2px] bg-white/20 relative overflow-hidden rounded-full">
                <div
                  className="absolute inset-y-0 start-0 bg-white transition-all duration-500 rounded-full"
                  style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                />
              </div>
              <span className="font-mono font-medium tracking-wider text-plum-300">
                0{slides.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Left & Right Slide Navigation Arrows */}
      {mediaType === 'images' && slides.length > 1 && (
        <div className="hidden sm:flex absolute inset-y-0 inset-x-4 items-center justify-between pointer-events-none z-20">
          <button
            onClick={handlePrevSlide}
            aria-label="Previous Slide"
            className="pointer-events-auto p-2.5 rounded-full bg-plum-950/40 hover:bg-plum-900/80 text-white border border-white/10 backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextSlide}
            aria-label="Next Slide"
            className="pointer-events-auto p-2.5 rounded-full bg-plum-950/40 hover:bg-plum-900/80 text-white border border-white/10 backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
}