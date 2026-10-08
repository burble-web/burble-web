'use server';

import { createClient, verifyAdminServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface CmsSavePayload {
  announcementEnabled: boolean;
  announcementText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroDesktopImage: string;
  heroMobileImage: string;
  showNewArrivals: boolean;
  showOccasions: boolean;
  showHandBouquets: boolean;
  showFlowersInVase: boolean;
  showBlog: boolean;
}

export async function saveCmsConfigurationAction(payload: CmsSavePayload) {
  // 1. Verify admin permissions on server
  const isAdmin = await verifyAdminServer();
  if (!isAdmin) {
    // In dev / unconfigured DB mode, check if Supabase is placeholder
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!url.includes('placeholder.supabase.co')) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }
  }

  try {
    const supabase = await createClient();

    // 2. Update site_settings singleton
    await supabase
      .from('site_settings')
      .update({
        announcement_enabled: payload.announcementEnabled,
        announcement_text: payload.announcementText,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    // 3. Upsert hero section CMS config in homepage_sections
    await supabase
      .from('homepage_sections')
      .upsert({
        section_key: 'hero_banner',
        title: payload.heroTitle,
        subtitle: payload.heroSubtitle,
        is_visible: true,
        content_json: {
          cta_text: payload.heroCtaText,
          cta_link: payload.heroCtaLink,
          desktop_image: payload.heroDesktopImage,
          mobile_image: payload.heroMobileImage,
        },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'section_key' });

    // 4. Upsert visibility flags for remaining sections
    const sectionVisibilityMap = [
      { key: 'new_arrivals', title: 'New Arrivals', visible: payload.showNewArrivals, sort: 1 },
      { key: 'occasions', title: 'Shop by Occasion', visible: payload.showOccasions, sort: 2 },
      { key: 'hand_bouquets', title: 'Hand Bouquets', visible: payload.showHandBouquets, sort: 3 },
      { key: 'flowers_in_vase', title: 'Flowers in Vase', visible: payload.showFlowersInVase, sort: 4 },
      { key: 'blog', title: 'From Our Blog', visible: payload.showBlog, sort: 5 },
    ];

    for (const item of sectionVisibilityMap) {
      await supabase
        .from('homepage_sections')
        .upsert({
          section_key: item.key,
          title: item.title,
          is_visible: item.visible,
          sort_order: item.sort,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'section_key' });
    }

    // 5. Revalidate storefront homepage cache
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (err: any) {
    console.error('[CMS Action Error]', err);
    return { success: false, error: err?.message || 'Failed to save CMS configuration.' };
  }
}
