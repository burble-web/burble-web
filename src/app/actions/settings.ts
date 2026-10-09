'use server';

import { createClient, verifyAdminServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { SiteSettings } from '@/types';
import { translateTextServer } from '@/lib/translation/service';

export interface SaveSettingsPayload {
  store_name: string;
  store_name_ar?: string | null;
  tagline?: string;
  tagline_ar?: string | null;
  whatsapp_number: string;
  admin_email: string;
  currency_symbol: string;
  announcement_text?: string;
  announcement_text_ar?: string | null;
  announcement_enabled?: boolean;
  free_shipping_threshold: number;
  flat_shipping_fee: number;
}

export async function getAdminSettingsAction(): Promise<{ success: boolean; data?: SiteSettings; error?: string }> {
  const isAdmin = await verifyAdminServer();
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized: Admin authentication required.' };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as SiteSettings };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to fetch site settings.' };
  }
}

export async function saveSettingsAction(payload: SaveSettingsPayload) {
  const isAdmin = await verifyAdminServer();
  if (!isAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!url.includes('placeholder.supabase.co')) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }
  }

  if (!payload.store_name || payload.store_name.trim().length < 2) {
    return { success: false, error: 'Store name is required.' };
  }

  if (!payload.whatsapp_number || payload.whatsapp_number.trim().length < 6) {
    return { success: false, error: 'Valid WhatsApp contact number is required.' };
  }

  if (!payload.admin_email || !payload.admin_email.includes('@')) {
    return { success: false, error: 'Valid admin notification email address is required.' };
  }

  if (typeof payload.free_shipping_threshold !== 'number' || payload.free_shipping_threshold < 0) {
    return { success: false, error: 'Free shipping threshold must be a non-negative number.' };
  }

  if (typeof payload.flat_shipping_fee !== 'number' || payload.flat_shipping_fee < 0) {
    return { success: false, error: 'Flat shipping fee must be a non-negative number.' };
  }

  try {
    const supabase = await createClient();

    let finalStoreNameAr = payload.store_name_ar && payload.store_name_ar.trim().length > 0 ? payload.store_name_ar.trim() : null;
    let finalTaglineAr = payload.tagline_ar && payload.tagline_ar.trim().length > 0 ? payload.tagline_ar.trim() : null;
    let finalAnnouncementAr = payload.announcement_text_ar && payload.announcement_text_ar.trim().length > 0 ? payload.announcement_text_ar.trim() : null;

    if (!finalStoreNameAr) {
      finalStoreNameAr = 'بربل للزهور';
    }
    if (!finalTaglineAr && payload.tagline && payload.tagline.trim().length > 0) {
      finalTaglineAr = await translateTextServer(payload.tagline.trim(), 'general');
    }
    if (!finalAnnouncementAr && payload.announcement_text && payload.announcement_text.trim().length > 0) {
      finalAnnouncementAr = await translateTextServer(payload.announcement_text.trim(), 'announcement');
    }

    const dbRecord = {
      store_name: payload.store_name.trim(),
      store_name_ar: finalStoreNameAr,
      tagline: payload.tagline ? payload.tagline.trim() : 'Flowers make moments special',
      tagline_ar: finalTaglineAr,
      whatsapp_number: payload.whatsapp_number.trim(),
      admin_email: payload.admin_email.trim(),
      currency_symbol: payload.currency_symbol ? payload.currency_symbol.trim() : 'QAR',
      announcement_text: payload.announcement_text ? payload.announcement_text.trim() : null,
      announcement_text_ar: finalAnnouncementAr,
      announcement_enabled: payload.announcement_enabled ?? true,
      free_shipping_threshold: payload.free_shipping_threshold,
      flat_shipping_fee: payload.flat_shipping_fee,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, ...dbRecord });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin/settings');

    return { success: true };
  } catch (err: any) {
    console.error('[Save Settings Action Error]', err);
    return { success: false, error: err?.message || 'Failed to save store settings.' };
  }
}

