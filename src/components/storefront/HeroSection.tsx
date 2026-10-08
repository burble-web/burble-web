'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface HeroSlide {
  title: string;
  subtitle: string;
  eyebrow?: string;
  desktopImage: string;
  mobileImage: string;
  ctaText: string;
  ctaLink: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    eyebrow: 'FLOWERS MAKE MOMENTS SPECIAL',
    title: 'A Little Thought\nA Big Happiness',
    subtitle: 'Fresh, handcrafted bouquets to make your special moments unforgettable.',
    desktopImage: '/demo-media/hero_desktop.jpg',
    mobileImage: '/demo-media/hero_mobile_v2.jpg',
    ctaText: 'Shop Flowers',
    ctaLink: '/products',
  },
  {
    eyebrow: 'EXCLUSIVE FLORAL DESIGNS',
    title: 'More Than Flowers\nIt\'s a Feeling',
    subtitle: 'Curated blooms delivered with care to bring beauty to every occasion.',
    desktopImage: '/demo-media/hero_slide_two.jpg',
    mobileImage: '/demo-media/hero_slide_two.jpg',
    ctaText: 'Explore Collections',
    ctaLink: '/products',
  }
];

export function HeroSection() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const currentSlide = HERO_SLIDES[currentSlideIndex];

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-plum-900 text-white min-h-[560px] lg:min-h-[640px] flex items-center">
      {/* Background Image: Desktop */}
      <div className="hidden md:block absolute inset-0 z-0">
        <Image
          src={currentSlide.desktopImage}
          alt={currentSlide.title}
          fill
          priority
          className="object-cover object-right lg:object-center transition-opacity duration-700 brightness-95"
        />
        {/* Soft gradient overlay for desktop readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-plum-950/85 via-plum-950/40 to-transparent w-full md:w-3/4" />
      </div>

      {/* Background Image: Mobile */}
      <div className="md:hidden absolute inset-0 z-0">
        <Image
          src={currentSlide.mobileImage}
          alt={currentSlide.title}
          fill
          priority
          className="object-cover object-top transition-opacity duration-700"
        />
        {/* Dark gradient from bottom for mobile portrait overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-plum-950/90 via-plum-950/50 to-plum-900/30" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-24">
        <div className="max-w-xl">
          {currentSlide.eyebrow && (
            <p className="text-[11px] uppercase tracking-widest text-blush-200 font-semibold mb-3">
              {currentSlide.eyebrow}
            </p>
          )}

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] text-white tracking-tight whitespace-pre-line mb-4 drop-shadow-sm">
            {currentSlide.title}
          </h1>

          <p className="text-sm sm:text-base text-plum-100 font-light leading-relaxed mb-8 max-w-md">
            {currentSlide.subtitle}
          </p>

          <div className="flex items-center space-x-4">
            <Link
              href={currentSlide.ctaLink}
              className="inline-flex items-center space-x-2 bg-plum-800 hover:bg-plum-700 text-white text-xs font-semibold px-6 py-3.5 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <span>{currentSlide.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => alert('Video preview coming soon!')}
              className="inline-flex items-center space-x-2 text-xs text-white/90 hover:text-white bg-white/15 backdrop-blur-md px-4 py-3 rounded-full hover:bg-white/25 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-white text-plum-900 flex items-center justify-center">
                <Play className="w-3 h-3 fill-current translate-x-0.5" />
              </div>
              <span className="font-medium">Watch Video</span>
            </button>
          </div>

          {/* Slider Controls & Counter */}
          <div className="mt-12 flex items-center space-x-4 text-xs text-plum-200">
            <span className="font-mono font-semibold">
              0{currentSlideIndex + 1} <span className="opacity-40">/ 0{HERO_SLIDES.length}</span>
            </span>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
