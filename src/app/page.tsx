import React from 'react';
import type { Metadata } from 'next';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { HeroSection } from '@/components/storefront/HeroSection';
import { FeatureBar } from '@/components/storefront/FeatureBar';
import { ProductRail } from '@/components/storefront/ProductRail';
import { OccasionSection } from '@/components/storefront/OccasionSection';
import { PremiumBannerSection } from '@/components/storefront/PremiumBannerSection';
import { PromoCardsGrid } from '@/components/storefront/PromoCardsGrid';
import { CollectionsSection } from '@/components/storefront/CollectionsSection';
import { SocialProofSection } from '@/components/storefront/SocialProofSection';
import { DeliveryBannerSection } from '@/components/storefront/DeliveryBannerSection';
import { BlogSection } from '@/components/storefront/BlogSection';
import { NewsletterSection } from '@/components/storefront/NewsletterSection';
import { Footer } from '@/components/storefront/Footer';

import {
  getSiteSettings,
  getCategories,
  getProducts,
  getCollections,
  getBlogPosts,
  getHomepageSections,
} from '@/lib/data/queries';
import { getServerTranslations, getServerLocale } from '@/lib/i18n/server';
import { getLocalizedValue } from '@/lib/i18n/utils';
import { buildHreflangAlternates, buildAbsoluteUrl } from '@/lib/seo/helpers';
import { FloristJsonLd, WebSiteJsonLd } from '@/components/seo/JsonLd';

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();

  const title =
    locale === 'ar'
      ? 'زهور بيربل قطر — باقات زهور طبيعية فاخرة وتوصيل سريع في قطر'
      : 'Burble — Luxury Fresh Flowers & Handcrafted Bouquets in Qatar';

  const description =
    locale === 'ar'
      ? 'اكتشف أرقى باقات اليد، زهور الفازات، وتنسيقات الهدايا الفاخرة مع خدمة التوصيل السريع في نفس اليوم في الدوحة، لوسيل، وكافة أنحاء قطر.'
      : 'Discover handcrafted luxury bouquets, flowers in vase, and bespoke gift hampers. Express same-day flower delivery across Doha, Lusail, and Qatar.';

  const alternates = buildHreflangAlternates({
    pathWithoutLocale: '',
    currentLocale: locale,
  });

  const canonicalUrl =
    locale === 'ar' ? buildAbsoluteUrl('/ar') : buildAbsoluteUrl('/en');

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
          alt: 'Burble Flowers Qatar',
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

export default async function StorefrontPage() {
  const { t, locale } = await getServerTranslations();
  const settings = await getSiteSettings();
  const categories = await getCategories();
  const sections = await getHomepageSections();

  const heroSection = sections.find((s) => s.section_key === 'hero_banner');
  const showNewArrivals = sections.find((s) => s.section_key === 'new_arrivals')?.is_visible ?? true;
  const showOccasions = sections.find((s) => s.section_key === 'occasions')?.is_visible ?? true;
  const showHandBouquets = sections.find((s) => s.section_key === 'hand_bouquets')?.is_visible ?? true;
  const showFlowersInVase = sections.find((s) => s.section_key === 'flowers_in_vase')?.is_visible ?? true;
  const showBlog = sections.find((s) => s.section_key === 'blog')?.is_visible ?? true;

  const newArrivals = showNewArrivals ? await getProducts({ isNewArrival: true, limit: 5 }) : [];
  const handBouquets = showHandBouquets ? await getProducts({ categorySlug: 'hand-bouquets', limit: 5 }) : [];
  const vaseFlowers = showFlowersInVase ? await getProducts({ categorySlug: 'flowers-in-vase', limit: 3 }) : [];
  const occasions = showOccasions ? await getCollections('occasion') : [];
  const collections = await getCollections('collection');
  const blogPosts = showBlog ? await getBlogPosts(3) : [];
  const featuredProducts = await getProducts({ isFeatured: true, limit: 3 });

  const newArrivalsTitle = sections.find((s) => s.section_key === 'new_arrivals')
    ? getLocalizedValue({
        locale,
        english: sections.find((s) => s.section_key === 'new_arrivals')?.title,
        arabic: sections.find((s) => s.section_key === 'new_arrivals')?.title_ar,
      })
    : t.sections.newArrivalsTitle;

  const handBouquetsTitle = sections.find((s) => s.section_key === 'hand_bouquets')
    ? getLocalizedValue({
        locale,
        english: sections.find((s) => s.section_key === 'hand_bouquets')?.title,
        arabic: sections.find((s) => s.section_key === 'hand_bouquets')?.title_ar,
      })
    : t.sections.handBouquetsTitle;

  const catalogLink = locale === 'ar' ? '/ar/products' : '/en/products';
  const handBouquetsLink =
    locale === 'ar' ? '/ar/categories/hand-bouquets' : '/en/categories/hand-bouquets';

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 font-sans selection:bg-plum-800 selection:text-white w-full max-w-full overflow-x-hidden">
      <AnnouncementBar settings={settings} />
      <Header />

      <FloristJsonLd settings={settings} />
      <WebSiteJsonLd />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* 3. Hero Section */}
        <HeroSection section={heroSection} />

        {/* 4. Value Proposition / Feature Bar */}
        <FeatureBar />

        {/* 5. New Arrivals Rail */}
        {showNewArrivals && newArrivals.length > 0 && (
          <ProductRail
            title={newArrivalsTitle}
            subtitle={t.sections.newArrivalsSubtitle}
            products={newArrivals}
            viewAllLink={catalogLink}
          />
        )}

        {/* 6. Shop by Occasion Circles */}
        {showOccasions && occasions.length > 0 && (
          <OccasionSection occasions={occasions} />
        )}

        {/* 7. Hand Bouquets Rail */}
        {showHandBouquets && handBouquets.length > 0 && (
          <ProductRail
            title={handBouquetsTitle}
            subtitle={t.sections.handBouquetsSubtitle}
            products={handBouquets}
            viewAllLink={handBouquetsLink}
          />
        )}

        {/* 8 & 9. Premium Collection Split Banner + Flowers in Vase */}
        {showFlowersInVase && vaseFlowers.length > 0 && (
          <PremiumBannerSection
            products={vaseFlowers}
            bannerImageUrl={sections.find((s) => s.section_key === 'flowers_in_vase')?.content_json?.banner_image}
          />
        )}

        {/* 11. Promotional Category Cards Grid */}
        <PromoCardsGrid categories={categories} section={sections.find((s) => s.section_key === 'promo_cards')} />

        {/* 12. Our Collections Circles */}
        {collections.length > 0 && (
          <CollectionsSection collections={collections} />
        )}

        {/* 13. Real Moments / Social Proof */}
        <SocialProofSection products={featuredProducts} />

        {/* 14. Same-Day Delivery Banner */}
        <DeliveryBannerSection bannerImageUrl={sections.find((s) => s.section_key === 'delivery_banner')?.content_json?.banner_image || null} />

        {/* 15. From Our Blog */}
        {showBlog && blogPosts.length > 0 && (
          <BlogSection posts={blogPosts} />
        )}

        {/* 16. Newsletter Section */}
        <NewsletterSection />
      </main>

      {/* 17. Storefront Footer */}
      <Footer settings={settings} />
    </div>
  );
}
