'use server';

import { createClient, verifyAdminServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Collection } from '@/types';
import { translateTextServer } from '@/lib/translation/service';

export interface SaveCollectionPayload {
  id?: string;
  title: string;
  title_ar?: string | null;
  slug?: string;
  subtitle?: string;
  subtitle_ar?: string | null;
  image_url?: string;
  type: 'occasion' | 'flower' | 'collection';
  sort_order?: number;
  active?: boolean;
  product_ids?: string[];
}

export async function getAdminCollectionsAction(): Promise<{ success: boolean; data?: (Collection & { product_ids?: string[] })[]; error?: string }> {
  const isAdmin = await verifyAdminServer();
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized: Admin authentication required.' };
  }

  try {
    const supabase = await createClient();
    const { data: collections, error } = await supabase
      .from('collections')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!collections || collections.length === 0) {
      return { success: true, data: [] };
    }

    const { data: items } = await supabase.from('collection_items').select('collection_id, product_id');

    const mapped = collections.map((col) => {
      const colItems = (items || []).filter((it) => it.collection_id === col.id);
      return {
        ...col,
        product_ids: colItems.map((it) => it.product_id),
      };
    });

    return { success: true, data: mapped };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to fetch collections.' };
  }
}

export async function saveCollectionAction(payload: SaveCollectionPayload) {
  const isAdmin = await verifyAdminServer();
  if (!isAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!url.includes('placeholder.supabase.co')) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }
  }

  if (!payload.title || payload.title.trim().length < 2) {
    return { success: false, error: 'Collection title must be at least 2 characters.' };
  }

  const generatedSlug = payload.slug && payload.slug.trim()
    ? payload.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    : payload.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    const supabase = await createClient();

    let finalTitleAr = payload.title_ar && payload.title_ar.trim().length > 0 ? payload.title_ar.trim() : null;
    let finalSubtitleAr = payload.subtitle_ar && payload.subtitle_ar.trim().length > 0 ? payload.subtitle_ar.trim() : null;

    if (!finalTitleAr) {
      finalTitleAr = await translateTextServer(payload.title.trim(), 'collection_name');
    }
    if (!finalSubtitleAr && payload.subtitle && payload.subtitle.trim().length > 0) {
      finalSubtitleAr = await translateTextServer(payload.subtitle.trim(), 'general');
    }

    const dbRecord = {
      title: payload.title.trim(),
      title_ar: finalTitleAr,
      slug: generatedSlug,
      subtitle: payload.subtitle ? payload.subtitle.trim() : null,
      subtitle_ar: finalSubtitleAr,
      image_url: payload.image_url ? payload.image_url.trim() : null,
      type: payload.type || 'collection',
      sort_order: payload.sort_order ?? 0,
      active: payload.active ?? true,
    };

    let collectionId = payload.id;
    if (collectionId) {
      const { error: updateError } = await supabase
        .from('collections')
        .update(dbRecord)
        .eq('id', collectionId);

      if (updateError) return { success: false, error: updateError.message };
    } else {
      const { data: newCol, error: insertError } = await supabase
        .from('collections')
        .insert(dbRecord)
        .select()
        .single();

      if (insertError) return { success: false, error: insertError.message };
      collectionId = newCol.id;
    }

    // Sync collection_items junction
    if (collectionId && Array.isArray(payload.product_ids)) {
      await supabase.from('collection_items').delete().eq('collection_id', collectionId);

      if (payload.product_ids.length > 0) {
        const rowsToInsert = payload.product_ids.map((prodId, idx) => ({
          collection_id: collectionId,
          product_id: prodId,
          sort_order: idx + 1,
        }));
        await supabase.from('collection_items').insert(rowsToInsert);
      }
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin/collections');

    return { success: true };
  } catch (err: any) {
    console.error('[Save Collection Action Error]', err);
    return { success: false, error: err?.message || 'Failed to save collection.' };
  }
}

export async function deleteCollectionAction(id: string) {
  const isAdmin = await verifyAdminServer();
  if (!isAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!url.includes('placeholder.supabase.co')) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin/collections');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete collection.' };
  }
}
