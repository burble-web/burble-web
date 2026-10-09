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
  getProducts,
  getCollections,
  getBlogPosts,
} from '@/lib/data/queries';
import { getServerTranslations } from '@/lib/i18n/server';

export const instant = false;

export default async function StorefrontPage() {
  const { t } = await getServerTranslations();
  const settings = await getSiteSettings();
  const newArrivals = await getProducts({ isNewArrival: true, limit: 5 });
  const handBouquets = await getProducts({ categorySlug: 'hand-bouquets', limit: 5 });
  const vaseFlowers = await getProducts({ categorySlug: 'flowers-in-vase', limit: 3 });
  const occasions = await getCollections('occasion');
  const flowers = await getCollections('flower');
  const collections = await getCollections('collection');
  const blogPosts = await getBlogPosts(3);

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 font-sans selection:bg-plum-800 selection:text-white">
      {/* 1. Announcement Bar */}
      <AnnouncementBar settings={settings} />

      {/* 2. Main Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 3. Hero Section */}
        <HeroSection />

        {/* 4. Value Proposition / Feature Bar */}
        <FeatureBar />

        {/* 5. New Arrivals Rail */}
        <ProductRail
          title={t.sections.newArrivalsTitle}
          subtitle={t.sections.newArrivalsSubtitle}
          products={newArrivals}
          viewAllLink="/products"
        />

        {/* 6. Shop by Occasion / Moments Circles */}
        <OccasionSection occasions={occasions} />

        {/* 7. Hand Bouquets Rail */}
        <ProductRail
          title={t.sections.handBouquetsTitle}
          subtitle={t.sections.handBouquetsSubtitle}
          products={handBouquets}
          viewAllLink="/products?category=hand-bouquets"
        />

        {/* 8 & 9. Premium Collection Banner + Flowers in Vase */}
        <PremiumBannerSection products={vaseFlowers} />

        {/* 10. Shop by Flower Circles */}
        <ShopByFlowerSection flowers={flowers} />

        {/* 11. Promotional Category Cards Grid (Hampers, Combos, DIY) */}
        <PromoCardsGrid />

        {/* 12. Our Collections Circles */}
        <CollectionsSection collections={collections} />

        {/* 13. Real Moments / Social Proof */}
        <SocialProofSection />

        {/* 14. Same-Day Delivery Banner */}
        <DeliveryBannerSection />

        {/* 15. From Our Blog */}
        <BlogSection posts={blogPosts} />

        {/* 16. Newsletter Section */}
        <NewsletterSection />
      </main>

      {/* 17. Storefront Footer */}
      <Footer settings={settings} />
    </div>
  );
}
