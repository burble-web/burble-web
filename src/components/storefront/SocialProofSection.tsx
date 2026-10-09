'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';

export function SocialProofSection() {
  const { t, isRtl, locale } = useLocale();

  const moments = [
    {
      id: 1,
      image: '/demo-media/hero_desktop.jpg',
      name: locale === 'ar' ? 'أمينة الكواري' : 'Amina K.',
      comment: locale === 'ar' ? 'الورد كان في قمة النضارة والتنسيق خيالي!' : 'The roses were breathtakingly fresh!',
    },
    {
      id: 2,
      image: '/demo-media/product_blush_bouquet.jpg',
      name: locale === 'ar' ? 'سارة المري' : 'Sara M.',
      comment: locale === 'ar' ? 'التوصيل في نفس اليوم كان منقذاً لذكرى زواجنا.' : 'Same-day delivery saved our anniversary.',
    },
    {
      id: 3,
      image: '/demo-media/product_pastel_bouquet.jpg',
      name: locale === 'ar' ? 'نورة الهاجري' : 'Noora H.',
      comment: locale === 'ar' ? 'تغليف راقٍ جداً ورائحة الزهور فواحة.' : 'Elegant wrapping and gorgeous scent.',
    },
    {
      id: 4,
      image: '/demo-media/hero_slide_two.jpg',
      name: locale === 'ar' ? 'فاطمة الزهراء' : 'Fatima Z.',
      comment: locale === 'ar' ? 'أفضل متجر زهور في الدوحة بلا منازع.' : 'Best florist in Doha by far.',
    },
    {
      id: 5,
      image: '/demo-media/product_red_roses.jpg',
      name: locale === 'ar' ? 'ريم القحطاني' : 'Reem Q.',
      comment: locale === 'ar' ? 'باقة مذهلة وخدمة ممتازة وتوصيل سريع!' : 'Flawless bouquet and service!',
    },
  ];

  return (
    <section className="py-12 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Card */}
          <div className="lg:col-span-4 bg-plum-100/60 rounded-3xl p-8 border border-plum-200/50 flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex items-center space-x-1 rtl:space-x-reverse text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-xs font-bold text-plum-900 ms-1.5">{t.sections.socialProofRating}</span>
              </div>

              <h2 className="font-serif text-3xl font-bold text-plum-900 leading-tight whitespace-pre-line">
                {t.sections.socialProofTitle}
              </h2>
              <p className="text-xs text-plum-800/80 font-normal mt-3 mb-6 leading-relaxed">
                {t.sections.socialProofSubtitle}
              </p>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-plum-900 hover:bg-plum-800 text-white text-xs font-semibold px-5 py-3 rounded-full w-fit shadow-xs transition-colors"
            >
              <span>{t.sections.viewCustomerStories}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          {/* Right Image Strip */}
          <div className="lg:col-span-8 overflow-hidden">
            <div className="flex space-x-4 rtl:space-x-reverse overflow-x-auto no-scrollbar pb-2">
              {moments.map((m) => (
                <div
                  key={m.id}
                  className="relative w-44 sm:w-52 h-64 rounded-2xl overflow-hidden shrink-0 group border border-ink-100 shadow-xs"
                >
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-plum-950/80 via-transparent to-transparent opacity-90 p-4 flex flex-col justify-end text-white">
                    <p className="text-xs font-semibold">{m.name}</p>
                    <p className="text-[11px] font-light text-plum-200 line-clamp-2 mt-0.5">"{m.comment}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
