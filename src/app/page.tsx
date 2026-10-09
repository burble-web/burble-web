import React from 'react';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { HeroSection } from '@/components/storefront/HeroSection';
import { FeatureBar } from '@/components/storefront/FeatureBar';
import { ProductRail } from '@/components/storefront/ProductRail';
import { OccasionSection } from '@/components/storefront/OccasionSection';
import { PremiumBannerSection } from '@/components/storefront/PremiumBannerSection';
import { ShopByFlowerSection } from '@/components/storefront/ShopByFlowerSection';
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
import { getServerTranslations } from '@/lib/i18n/server';
import { getLocalizedValue } from '@/lib/i18n/utils';

export const instant = false;

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
  const flowers = await getCollections('flower');
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

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 font-sans selection:bg-plum-800 selection:text-white">
      {/* 1. Announcement Bar */}
      <AnnouncementBar settings={settings} />

      {/* 2. Main Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 3. Hero Section (Controlled via CMS) */}
        <HeroSection section={heroSection} />

        {/* 4. Value Proposition / Feature Bar */}
        <FeatureBar />

        {/* 5. New Arrivals Rail */}
        {showNewArrivals && newArrivals.length > 0 && (
          <ProductRail
            title={newArrivalsTitle}
            subtitle={t.sections.newArrivalsSubtitle}
            products={newArrivals}
            viewAllLink="/products"
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
            viewAllLink="/products?category=hand-bouquets"
          />
        )}

        {/* 8 & 9. Premium Collection Split Banner + Flowers in Vase */}
        {showFlowersInVase && vaseFlowers.length > 0 && (
          <PremiumBannerSection products={vaseFlowers} />
        )}

        {/* 10. Shop by Flower Circles */}
        {flowers.length > 0 && (
          <ShopByFlowerSection flowers={flowers} />
        )}

        {/* 11. Promotional Category Cards Grid (Hampers, Combos, DIY) */}
        <PromoCardsGrid categories={categories} />

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
