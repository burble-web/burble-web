'use server';

import { createClient, verifyAdminServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { translateTextServer } from '@/lib/translation/service';

export interface CmsSavePayload {
  announcementEnabled: boolean;
  announcementText: string;
  announcementText_ar?: string | null;
  heroTitle: string;
  heroTitle_ar?: string | null;
  heroSubtitle: string;
  heroSubtitle_ar?: string | null;
  heroCtaText: string;
  heroCtaText_ar?: string | null;
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

    let finalAnnouncementAr = payload.announcementText_ar && payload.announcementText_ar.trim().length > 0 ? payload.announcementText_ar.trim() : null;
    let finalHeroTitleAr = payload.heroTitle_ar && payload.heroTitle_ar.trim().length > 0 ? payload.heroTitle_ar.trim() : null;
    let finalHeroSubtitleAr = payload.heroSubtitle_ar && payload.heroSubtitle_ar.trim().length > 0 ? payload.heroSubtitle_ar.trim() : null;
    let finalHeroCtaAr = payload.heroCtaText_ar && payload.heroCtaText_ar.trim().length > 0 ? payload.heroCtaText_ar.trim() : null;

    if (!finalAnnouncementAr && payload.announcementText && payload.announcementText.trim().length > 0) {
      finalAnnouncementAr = await translateTextServer(payload.announcementText.trim(), 'announcement');
    }
    if (!finalHeroTitleAr && payload.heroTitle && payload.heroTitle.trim().length > 0) {
      finalHeroTitleAr = await translateTextServer(payload.heroTitle.trim(), 'homepage_heading');
    }
    if (!finalHeroSubtitleAr && payload.heroSubtitle && payload.heroSubtitle.trim().length > 0) {
      finalHeroSubtitleAr = await translateTextServer(payload.heroSubtitle.trim(), 'general');
    }
    if (!finalHeroCtaAr && payload.heroCtaText && payload.heroCtaText.trim().length > 0) {
      finalHeroCtaAr = await translateTextServer(payload.heroCtaText.trim(), 'homepage_cta');
    }

    // 2. Update site_settings singleton
    await supabase
      .from('site_settings')
      .update({
        announcement_enabled: payload.announcementEnabled,
        announcement_text: payload.announcementText,
        announcement_text_ar: finalAnnouncementAr,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    // 3. Upsert hero section CMS config in homepage_sections
    await supabase
      .from('homepage_sections')
      .upsert({
        section_key: 'hero_banner',
        title: payload.heroTitle,
        title_ar: finalHeroTitleAr,
        subtitle: payload.heroSubtitle,
        subtitle_ar: finalHeroSubtitleAr,
        is_visible: true,
        content_json: {
          cta_text: payload.heroCtaText,
          cta_text_ar: finalHeroCtaAr,
          cta_link: payload.heroCtaLink,
          desktop_image: payload.heroDesktopImage,
          mobile_image: payload.heroMobileImage,
        },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'section_key' });

    // 4. Upsert visibility flags for remaining sections
    const sectionVisibilityMap = [
      { key: 'new_arrivals', title: 'New Arrivals', title_ar: 'وصل حديثاً', visible: payload.showNewArrivals, sort: 1 },
      { key: 'occasions', title: 'Shop by Occasion', title_ar: 'تسوق حسب المناسبة', visible: payload.showOccasions, sort: 2 },
      { key: 'hand_bouquets', title: 'Hand Bouquets', title_ar: 'باقات اليد الأنيقة', visible: payload.showHandBouquets, sort: 3 },
      { key: 'flowers_in_vase', title: 'Flowers in Vase', title_ar: 'زهور في فازة', visible: payload.showFlowersInVase, sort: 4 },
      { key: 'blog', title: 'From Our Blog', title_ar: 'من مدونتنا', visible: payload.showBlog, sort: 5 },
    ];

    for (const item of sectionVisibilityMap) {
      await supabase
        .from('homepage_sections')
        .upsert({
          section_key: item.key,
          title: item.title,
          title_ar: item.title_ar,
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

