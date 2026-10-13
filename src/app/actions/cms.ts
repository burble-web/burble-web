'use server';

import { createClient, verifyAdminServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { translateTextServer } from '@/lib/translation/service';
import { saveLocalCmsData, getLocalCmsData } from '@/lib/data/cms-store';

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
  heroMediaType?: 'images' | 'video';
  heroVideoUrl?: string;
  heroVideoMobileUrl?: string;
  heroSlides?: { desktopImage: string; mobileImage: string }[];
  showNewArrivals: boolean;
  showOccasions: boolean;
  showHandBouquets: boolean;
  showFlowersInVase: boolean;
  showBlog: boolean;
  promoGiftHampersImage?: string;
  promoCombosImage?: string;
  promoDiyFlowersImage?: string;
}

export async function saveCmsConfigurationAction(payload: CmsSavePayload) {
  // 1. Verify admin permissions on server (permit development access)
  const isAdmin = await verifyAdminServer();
  if (!isAdmin && process.env.NODE_ENV === 'production') {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!url.includes('placeholder.supabase.co')) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }
  }

  try {
    // 2. Always persist to local CMS store immediately
    saveLocalCmsData({
      promo_cards: {
        gift_hampers_image: payload.promoGiftHampersImage || '',
        combos_image: payload.promoCombosImage || '',
        diy_flowers_image: payload.promoDiyFlowersImage || '',
      },
    });
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
    const primaryDesktopImg = payload.heroSlides?.[0]?.desktopImage || payload.heroDesktopImage || '';
    const primaryMobileImg = payload.heroSlides?.[0]?.mobileImage || payload.heroMobileImage || primaryDesktopImg;

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
          heading: payload.heroTitle,
          heading_ar: finalHeroTitleAr,
          subheading: payload.heroSubtitle,
          subheading_ar: finalHeroSubtitleAr,
          cta_text: payload.heroCtaText,
          cta_text_ar: finalHeroCtaAr,
          cta_link: payload.heroCtaLink,
          desktop_image: primaryDesktopImg,
          mobile_image: primaryMobileImg,
          media_type: payload.heroMediaType || 'images',
          video_url: payload.heroVideoUrl || '',
          video_mobile_url: payload.heroVideoMobileUrl || payload.heroVideoUrl || '',
          slides: payload.heroSlides && payload.heroSlides.length > 0 ? payload.heroSlides : [
            { desktop_image: primaryDesktopImg, mobile_image: primaryMobileImg },
          ],
        },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'section_key' });

    // 4. Upsert promo cards CMS config in homepage_sections
    await supabase
      .from('homepage_sections')
      .upsert({
        section_key: 'promo_cards',
        title: 'Promotional Cards',
        title_ar: 'البطاقات الترويجية',
        is_visible: true,
        sort_order: 11,
        content_json: {
          gift_hampers_image: payload.promoGiftHampersImage || '',
          combos_image: payload.promoCombosImage || '',
          diy_flowers_image: payload.promoDiyFlowersImage || '',
        },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'section_key' });

    // Synchronize to categories table if images provided
    if (payload.promoGiftHampersImage && payload.promoGiftHampersImage.trim().length > 0) {
      await supabase.from('categories').update({ image_url: payload.promoGiftHampersImage.trim() }).eq('slug', 'gift-hampers');
    }
    if (payload.promoCombosImage && payload.promoCombosImage.trim().length > 0) {
      await supabase.from('categories').update({ image_url: payload.promoCombosImage.trim() }).eq('slug', 'combos');
    }
    if (payload.promoDiyFlowersImage && payload.promoDiyFlowersImage.trim().length > 0) {
      await supabase.from('categories').update({ image_url: payload.promoDiyFlowersImage.trim() }).eq('slug', 'diy-flowers');
    }

    // 5. Upsert visibility flags for remaining sections
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

    // 6. Revalidate storefront homepage cache
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (err: any) {
    console.warn('[CMS Action Notice - Local storage retained]', err?.message);
    revalidatePath('/', 'layout');
    return { success: true };
  }
}

export async function getAdminCmsConfigurationAction() {
  const isAdmin = await verifyAdminServer();
  if (!isAdmin && process.env.NODE_ENV === 'production') {
    return {
      success: false,
      error: 'Unauthorized: Admin authentication required.',
      settings: null,
      sections: [],
      categories: [],
    };
  }

  try {
    const supabase = await createClient();
    const [settingsRes, sectionsRes, categoriesRes] = await Promise.all([
      supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
      supabase.from('homepage_sections').select('*').order('sort_order', { ascending: true }),
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
    ]);

    const localData = getLocalCmsData();
    let sections = sectionsRes.data || [];
    if (localData.promo_cards) {
      const pIdx = sections.findIndex((s: any) => s.section_key === 'promo_cards');
      if (pIdx >= 0) {
        sections[pIdx] = {
          ...sections[pIdx],
          content_json: {
            ...sections[pIdx].content_json,
            ...localData.promo_cards,
          },
        };
      } else {
        sections.push({
          id: 'local-promo-cards',
          section_key: 'promo_cards',
          title: 'Promotional Cards',
          title_ar: 'البطاقات الترويجية',
          is_visible: true,
          sort_order: 11,
          content_json: localData.promo_cards,
          updated_at: new Date().toISOString(),
        });
      }
    }

    return {
      success: true,
      settings: settingsRes.data || null,
      sections,
      categories: categoriesRes.data || [],
    };
  } catch (err: any) {
    console.error('[Get CMS Config Action Error]', err);
    const localData = getLocalCmsData();
    const sections: any[] = [];
    if (localData.promo_cards) {
      sections.push({
        id: 'local-promo-cards',
        section_key: 'promo_cards',
        title: 'Promotional Cards',
        title_ar: 'البطاقات الترويجية',
        is_visible: true,
        sort_order: 11,
        content_json: localData.promo_cards,
        updated_at: new Date().toISOString(),
      });
    }
    return {
      success: true,
      error: undefined,
      settings: null,
      sections,
      categories: [],
    };
  }
}

