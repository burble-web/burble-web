'use server';

import { createClient, verifyAdminServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Category } from '@/types';

export interface SaveCategoryPayload {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
  sort_order?: number;
  active?: boolean;
}

export async function getAdminCategoriesAction(): Promise<{ success: boolean; data?: Category[]; error?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: (data || []) as Category[] };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to fetch categories.' };
  }
}

export async function saveCategoryAction(payload: SaveCategoryPayload) {
  const isAdmin = await verifyAdminServer();
  if (!isAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!url.includes('placeholder.supabase.co')) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }
  }

  if (!payload.name || payload.name.trim().length < 2) {
    return { success: false, error: 'Category name must be at least 2 characters.' };
  }

  const generatedSlug = payload.slug && payload.slug.trim()
    ? payload.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    : payload.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    const supabase = await createClient();

    const dbRecord = {
      name: payload.name.trim(),
      slug: generatedSlug,
      description: payload.description ? payload.description.trim() : null,
      image_url: payload.image_url ? payload.image_url.trim() : null,
      sort_order: payload.sort_order ?? 0,
      active: payload.active ?? true,
    };

    let result;
    if (payload.id) {
      result = await supabase
        .from('categories')
        .update(dbRecord)
        .eq('id', payload.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('categories')
        .insert(dbRecord)
        .select()
        .single();
    }

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/products');
    revalidatePath('/admin/categories');

    return { success: true, category: result.data as Category };
  } catch (err: any) {
    console.error('[Save Category Action Error]', err);
    return { success: false, error: err?.message || 'Failed to save category record.' };
  }
}

export async function deleteCategoryAction(id: string) {
  const isAdmin = await verifyAdminServer();
  if (!isAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!url.includes('placeholder.supabase.co')) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/products');
    revalidatePath('/admin/categories');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete category.' };
  }
}
