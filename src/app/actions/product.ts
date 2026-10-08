'use server';

import { createClient, verifyAdminServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Product } from '@/types';

export interface SaveProductPayload {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  compare_at_price?: number | null;
  category_id?: string | null;
  is_featured: boolean;
  is_new_arrival: boolean;
  stock_status: 'in_stock' | 'out_of_stock';
  active: boolean;
  main_image_url: string;
  hover_image_url?: string | null;
  sort_order?: number;
}

export async function getAdminProductsAction(): Promise<{ success: boolean; data?: Product[]; error?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: (data || []) as Product[] };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to fetch products.' };
  }
}

export async function saveProductAction(payload: SaveProductPayload) {
  // 1. Verify admin permissions
  const isAdmin = await verifyAdminServer();
  if (!isAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!url.includes('placeholder.supabase.co')) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }
  }

  // 2. Server-side validation
  if (!payload.name || payload.name.trim().length < 2) {
    return { success: false, error: 'Product name must be at least 2 characters.' };
  }

  if (typeof payload.price !== 'number' || isNaN(payload.price) || payload.price < 0) {
    return { success: false, error: 'Price must be a valid non-negative number.' };
  }

  if (payload.compare_at_price !== undefined && payload.compare_at_price !== null) {
    if (typeof payload.compare_at_price !== 'number' || payload.compare_at_price < payload.price) {
      return { success: false, error: 'Compare price must be greater than or equal to product price.' };
    }
  }

  if (!payload.main_image_url || payload.main_image_url.trim().length === 0) {
    return { success: false, error: 'Main image URL is required.' };
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
      price: payload.price,
      compare_at_price: payload.compare_at_price ?? null,
      category_id: payload.category_id || null,
      is_featured: Boolean(payload.is_featured),
      is_new_arrival: Boolean(payload.is_new_arrival),
      stock_status: payload.stock_status || 'in_stock',
      active: payload.active ?? true,
      main_image_url: payload.main_image_url.trim(),
      hover_image_url: payload.hover_image_url ? payload.hover_image_url.trim() : null,
      sort_order: payload.sort_order ?? 0,
      updated_at: new Date().toISOString(),
    };

    let result;
    if (payload.id) {
      result = await supabase
        .from('products')
        .update(dbRecord)
        .eq('id', payload.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('products')
        .insert(dbRecord)
        .select()
        .single();
    }

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/products');
    revalidatePath('/admin/products');

    return { success: true, product: result.data as Product };
  } catch (err: any) {
    console.error('[Save Product Action Error]', err);
    return { success: false, error: err?.message || 'Failed to save product record.' };
  }
}

export async function deleteProductAction(id: string) {
  const isAdmin = await verifyAdminServer();
  if (!isAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!url.includes('placeholder.supabase.co')) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/products');
    revalidatePath('/admin/products');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete product.' };
  }
}

export async function toggleProductActiveAction(id: string, active: boolean) {
  const isAdmin = await verifyAdminServer();
  if (!isAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!url.includes('placeholder.supabase.co')) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('products')
      .update({ active, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/products');
    revalidatePath('/admin/products');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update status.' };
  }
}
