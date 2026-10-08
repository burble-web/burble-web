import { createPublicClient } from '@/lib/supabase/server';
import {
  DEMO_SITE_SETTINGS,
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  DEMO_OCCASIONS,
  DEMO_FLOWERS,
  DEMO_COLLECTIONS,
  DEMO_BLOG_POSTS,
} from './storefront';
import { Category, Collection, Product, BlogPost, SiteSettings } from '@/types';

const isDev = process.env.NODE_ENV !== 'production';

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes('placeholder.supabase.co'));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  'use cache';
  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from('site_settings')
        .select('id, store_name, tagline, whatsapp_number, admin_email, currency_symbol, announcement_text, announcement_enabled, free_shipping_threshold, flat_shipping_fee, updated_at')
        .eq('id', 1)
        .single();

      if (!error && data) {
        return data as SiteSettings;
      }
    } catch (err) {
      console.error('[Queries] Error fetching site_settings from Supabase:', err);
    }
  }

  if (isDev) return DEMO_SITE_SETTINGS;
  return DEMO_SITE_SETTINGS; // Always provide essential site settings fallback to prevent SSR crash
}

export async function getCategories(): Promise<Category[]> {
  'use cache';
  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, description, image_url, sort_order, active, created_at')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (!error && data) {
        return data as Category[];
      }
    } catch (err) {
      console.error('[Queries] Error fetching categories:', err);
    }
  }

  if (isDev) return DEMO_CATEGORIES;
  return [];
}

export async function getProducts(options?: {
  categorySlug?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  limit?: number;
}): Promise<Product[]> {
  'use cache';
  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      let query = supabase
        .from('products')
        .select('id, name, slug, description, price, compare_at_price, category_id, is_featured, is_new_arrival, stock_status, active, main_image_url, hover_image_url, sort_order, created_at, updated_at')
        .eq('active', true);

      if (options?.isFeatured) query = query.eq('is_featured', true);
      if (options?.isNewArrival) query = query.eq('is_new_arrival', true);
      if (options?.limit) query = query.limit(options.limit);

      const { data, error } = await query.order('sort_order', { ascending: true });

      if (!error && data) {
        return data as Product[];
      }
    } catch (err) {
      console.error('[Queries] Error fetching products:', err);
    }
  }

  if (isDev) {
    let filtered = [...DEMO_PRODUCTS];
    if (options?.isFeatured) filtered = filtered.filter((p) => p.is_featured);
    if (options?.isNewArrival) filtered = filtered.filter((p) => p.is_new_arrival);
    if (options?.limit) filtered = filtered.slice(0, options.limit);
    return filtered;
  }

  return [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  'use cache';
  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from('products')
        .select('id, name, slug, description, price, compare_at_price, category_id, is_featured, is_new_arrival, stock_status, active, main_image_url, hover_image_url, sort_order, created_at, updated_at')
        .eq('slug', slug)
        .eq('active', true)
        .single();

      if (!error && data) {
        return data as Product;
      }
    } catch (err) {
      console.error('[Queries] Error fetching product by slug:', err);
    }
  }

  if (isDev) {
    return DEMO_PRODUCTS.find((p) => p.slug === slug) || null;
  }

  return null;
}

export async function getCollections(type: 'occasion' | 'flower' | 'collection'): Promise<Collection[]> {
  'use cache';
  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from('collections')
        .select('id, title, slug, subtitle, image_url, type, sort_order, active, created_at')
        .eq('type', type)
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (!error && data) {
        return data as Collection[];
      }
    } catch (err) {
      console.error('[Queries] Error fetching collections:', err);
    }
  }

  if (isDev) {
    if (type === 'occasion') return DEMO_OCCASIONS;
    if (type === 'flower') return DEMO_FLOWERS;
    return DEMO_COLLECTIONS;
  }

  return [];
}

export async function getBlogPosts(limit = 3): Promise<BlogPost[]> {
  'use cache';
  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, content, cover_image, author, is_published, published_at, created_at')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (!error && data) {
        return data as BlogPost[];
      }
    } catch (err) {
      console.error('[Queries] Error fetching blog posts:', err);
    }
  }

  if (isDev) {
    return DEMO_BLOG_POSTS.slice(0, limit);
  }

  return [];
}

