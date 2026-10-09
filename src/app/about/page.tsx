import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { getSiteSettings } from '@/lib/data/queries';
import { getServerTranslations } from '@/lib/i18n/server';
import { Flower2, Award, Clock } from 'lucide-react';

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslations();
  return {
    title: t.about.badge,
    description: t.about.description,
  };
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const { t } = await getServerTranslations();

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 font-sans">
      <AnnouncementBar settings={settings} />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-plum-700">
            {t.about.badge}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-plum-900 mt-2 mb-4 leading-tight">
            {t.about.title}
          </h1>
          <p className="text-sm text-ink-600 font-light leading-relaxed">
            {t.about.description}
          </p>
        </div>

        <div className="relative aspect-video max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl mb-16 border border-ink-100">
          <Image
            src="/demo-media/hero_desktop.jpg"
            alt="Burble Floral Studio"
            fill
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          <div className="bg-white p-6 rounded-2xl border border-ink-100 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-plum-100 text-plum-800 flex items-center justify-center mx-auto">
              <Flower2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-plum-900">{t.about.pillar1Title}</h3>
            <p className="text-xs text-ink-500 font-normal">{t.about.pillar1Subtitle}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-ink-100 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-plum-100 text-plum-800 flex items-center justify-center mx-auto">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-plum-900">{t.about.pillar2Title}</h3>
            <p className="text-xs text-ink-500 font-normal">{t.about.pillar2Subtitle}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-ink-100 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-plum-100 text-plum-800 flex items-center justify-center mx-auto">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-plum-900">{t.about.pillar3Title}</h3>
            <p className="text-xs text-ink-500 font-normal">{t.about.pillar3Subtitle}</p>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}

