'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Quote, CheckCircle2 } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';
import { Product } from '@/types';

interface SocialProofSectionProps {
  products?: Product[];
}

export function SocialProofSection({ products = [] }: SocialProofSectionProps) {
  const { t, isRtl, locale } = useLocale();

  const reviews = [
    {
      id: 1,
      name: locale === 'ar' ? 'أمينة الكواري' : 'Amina K.',
      location: locale === 'ar' ? 'الخليج الغربي، الدوحة' : 'West Bay, Doha',
      comment: locale === 'ar' ? 'الورد كان في قمة النضارة والتنسيق خيالي! وصل في نفس اليوم في الموعد المحدد.' : 'The roses were breathtakingly fresh! Delivered same-day right on schedule.',
      rating: 5,
    },
    {
      id: 2,
      name: locale === 'ar' ? 'سارة المري' : 'Sara M.',
      location: locale === 'ar' ? 'اللؤلؤة، قطر' : 'The Pearl, Qatar',
      comment: locale === 'ar' ? 'التوصيل السريع والاهتمام بأدق التفاصيل جعل ذكرى زواجنا استثنائية.' : 'Express delivery and unmatched attention to detail made our anniversary so special.',
      rating: 5,
    },
    {
      id: 3,
      name: locale === 'ar' ? 'نورة الهاجري' : 'Noora H.',
      location: locale === 'ar' ? 'لوسيل' : 'Lusail',
      comment: locale === 'ar' ? 'تغليف راقٍ جداً ورائحة الزهور فواحة وطبيعية. متجري المفضل دائماً.' : 'Exquisite luxury packaging and long-lasting fresh scent. My go-to florist in Qatar.',
      rating: 5,
    },
  ];

  return (
    <section className="py-12 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Text Card */}
          <div className="lg:col-span-4 bg-plum-900 text-white rounded-3xl p-8 border border-plum-800 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center space-x-1 rtl:space-x-reverse text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-xs font-bold text-white ms-1.5">{t.sections.socialProofRating}</span>
              </div>

              <h2 className="font-serif text-3xl font-bold text-white leading-tight whitespace-pre-line">
                {t.sections.socialProofTitle}
              </h2>
              <p className="text-xs text-plum-100 font-light mt-3 mb-6 leading-relaxed">
                {t.sections.socialProofSubtitle}
              </p>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white text-plum-900 hover:bg-blush-100 text-xs font-semibold px-5 py-3 rounded-full w-fit shadow-xs transition-colors"
            >
              <span>{t.sections.viewCustomerStories}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          {/* Right Customer Testimonial Cards Strip */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {reviews.map((m, idx) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl p-6 border border-ink-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <Quote className="w-8 h-8 text-plum-100 absolute top-4 end-4 pointer-events-none" />

                <div>
                  <div className="flex items-center space-x-1 rtl:space-x-reverse text-amber-500 mb-3">
                    {[...Array(m.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-ink-700 font-normal leading-relaxed italic">
                    "{m.comment}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-ink-100/60 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold text-plum-900">{m.name}</p>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <p className="text-[10px] text-ink-400 font-medium">{m.location}</p>
                  </div>

                  {products[idx]?.main_image_url && (
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-cream-100 border border-ink-100 shrink-0">
                      <Image
                        src={products[idx].main_image_url}
                        alt="Bouquet"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
