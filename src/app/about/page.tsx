import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { getSiteSettings, getProducts } from '@/lib/data/queries';
import { getServerTranslations, getServerLocale } from '@/lib/i18n/server';
import { buildHreflangAlternates, buildAbsoluteUrl } from '@/lib/seo/helpers';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { Flower2, Award, Clock, Sparkles } from 'lucide-react';

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const { t } = await getServerTranslations();

  const title =
    locale === 'ar'
      ? 'من نحن | أرقى متجر لتنسيق الزهور الطبيعية في قطر | زهور بيربل'
      : 'About Us | Luxury Florist Atelier in Doha | Burble Flowers Qatar';

  const description =
    locale === 'ar'
      ? 'تعرف على قصة زهور بيربل قطر، شغفنا بتنسيق الزهور الطبيعية الفاخرة، والتزامنا بتقديم أرقى الباقات وتوصيلها في نفس اليوم في الدوحة ولوسيل.'
      : 'Learn about Burble Flowers Qatar, our artisanal floral atelier in Doha, and our dedication to handcrafted luxury fresh blooms with same-day express delivery across Qatar.';

  const alternates = buildHreflangAlternates({
    pathWithoutLocale: '/about',
    currentLocale: locale,
  });

  const canonicalUrl =
    locale === 'ar' ? buildAbsoluteUrl('/ar/about') : buildAbsoluteUrl('/en/about');

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Burble Flowers',
      locale: locale === 'ar' ? 'ar_QA' : 'en_US',
      alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_QA'],
      type: 'website',
      images: [
        {
          url: buildAbsoluteUrl('/opengraph-image.png'),
          width: 1200,
          height: 630,
          alt: 'About Burble Flowers Qatar',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [buildAbsoluteUrl('/opengraph-image.png')],
    },
  };
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const { t, locale } = await getServerTranslations();
  const featured = await getProducts({ isFeatured: true, limit: 1 });
  const bannerImage = featured[0]?.main_image_url;

  const breadcrumbs = [
    {
      name: t.common.home,
      url: locale === 'ar' ? buildAbsoluteUrl('/ar') : buildAbsoluteUrl('/en'),
    },
    {
      name: t.common.aboutUs,
      url: locale === 'ar' ? buildAbsoluteUrl('/ar/about') : buildAbsoluteUrl('/en/about'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 font-sans">
      <AnnouncementBar settings={settings} />
      <Header />

      <BreadcrumbJsonLd items={breadcrumbs} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Breadcrumb Hierarchy */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-ink-500 mb-6 flex items-center space-x-1.5 rtl:space-x-reverse"
        >
          <Link
            href={locale === 'ar' ? '/ar' : '/en'}
            className="hover:text-plum-800 transition-colors"
          >
            {t.common.home}
          </Link>
          <span>/</span>
          <span className="text-plum-900 font-semibold">{t.common.aboutUs}</span>
        </nav>

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

        {/* Feature Hero Card */}
        <div className="relative aspect-video max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl mb-16 border border-ink-100 bg-plum-950 flex items-center justify-center text-center p-8">
          {bannerImage ? (
            <Image
              src={bannerImage}
              alt="Burble Floral Studio Qatar"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover opacity-80"
            />
          ) : (
            <div className="space-y-4 max-w-md relative z-10 text-white">
              <div className="w-16 h-16 rounded-full bg-plum-800/80 border border-plum-700 flex items-center justify-center mx-auto text-blush-200 shadow-lg">
                <Sparkles className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Artisanal Flower Atelier in Qatar
              </h2>
              <p className="text-xs sm:text-sm text-plum-200 font-light leading-relaxed">
                Handcrafted daily with fresh blooms imported directly from premium growers across Ecuador and Holland.
              </p>
            </div>
          )}
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
