import { createPublicClient } from '@/lib/supabase/server';
import { Category, Collection, Product, BlogPost, SiteSettings, HomepageSection } from '@/types';

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 1,
  store_name: 'Burble',
  store_name_ar: 'بيربل',
  tagline: 'Flowers make moments special',
  tagline_ar: 'الزهور تضفي سحراً على أجمل اللحظات',
  whatsapp_number: '97400000000',
  admin_email: 'admin@burbleflowers.com',
  currency_symbol: 'QAR',
  currency_symbol_ar: 'ر.ق',
  announcement_text: 'Fresh Flowers Sourced Daily • Same-Day Delivery • Premium Quality • Beautifully Wrapped',
  announcement_text_ar: 'زهور نضرة يتم استيرادها يومياً • توصيل في نفس اليوم • جودة فاخرة • تغليف راقٍ ومميز',
  announcement_enabled: true,
  free_shipping_threshold: 300,
  flat_shipping_fee: 25,
  updated_at: new Date().toISOString(),
};

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
        .select('id, store_name, store_name_ar, tagline, tagline_ar, whatsapp_number, admin_email, currency_symbol, currency_symbol_ar, announcement_text, announcement_text_ar, announcement_enabled, free_shipping_threshold, flat_shipping_fee, updated_at')
        .eq('id', 1)
        .maybeSingle();

      if (error) {
        console.error('[Queries] Error fetching site_settings from Supabase:', error.message);
      } else if (data) {
        return data as SiteSettings;
      }
    } catch (err) {
      console.error('[Queries] Exception fetching site_settings from Supabase:', err);
    }
  }

  return DEFAULT_SITE_SETTINGS;
}

export async function getCategories(): Promise<Category[]> {
  'use cache';
  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, name_ar, slug, description, description_ar, image_url, sort_order, active, created_at')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('[Queries] Error fetching categories from Supabase:', error.message);
        return [];
      }

      return (data || []) as Category[];
    } catch (err) {
      console.error('[Queries] Exception fetching categories:', err);
      return [];
    }
  }

  return [];
}

export async function getProducts(options?: {
  categorySlug?: string;
  occasionSlug?: string;
  flowerSlug?: string;
  collectionSlug?: string;
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
        .select('id, name, name_ar, slug, description, description_ar, price, compare_at_price, category_id, is_featured, is_new_arrival, stock_status, active, main_image_url, hover_image_url, sort_order, arabic_translation_source, created_at, updated_at')
        .eq('active', true);

      if (options?.categorySlug) {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', options.categorySlug)
          .maybeSingle();

        if (cat?.id) {
          query = query.eq('category_id', cat.id);
        } else {
          return [];
        }
      }

      const collectionSlug = options?.occasionSlug || options?.flowerSlug || options?.collectionSlug;
      if (collectionSlug) {
        const { data: col } = await supabase
          .from('collections')
          .select('id')
          .eq('slug', collectionSlug)
          .maybeSingle();

        if (col?.id) {
          const { data: items } = await supabase
            .from('collection_items')
            .select('product_id')
            .eq('collection_id', col.id);

          const productIds = (items || []).map((it) => it.product_id).filter(Boolean);
          if (productIds.length > 0) {
            query = query.in('id', productIds);
          } else {
            return [];
          }
        } else {
          return [];
        }
      }

      if (options?.isFeatured) query = query.eq('is_featured', true);
      if (options?.isNewArrival) query = query.eq('is_new_arrival', true);
      if (options?.limit) query = query.limit(options.limit);

      const { data, error } = await query.order('sort_order', { ascending: true });

      if (error) {
        console.error('[Queries] Error fetching products from Supabase:', error.message);
        return [];
      }

      return (data || []) as Product[];
    } catch (err) {
      console.error('[Queries] Exception fetching products:', err);
      return [];
    }
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
        .select('id, name, name_ar, slug, description, description_ar, price, compare_at_price, category_id, is_featured, is_new_arrival, stock_status, active, main_image_url, hover_image_url, sort_order, arabic_translation_source, created_at, updated_at')
        .eq('slug', slug)
        .eq('active', true)
        .maybeSingle();

      if (error) {
        console.error('[Queries] Error fetching product by slug from Supabase:', error.message);
        return null;
      }

      if (!data) return null;

      // Attach category if present
      if (data.category_id) {
        const { data: cat } = await supabase
          .from('categories')
          .select('id, name, name_ar, slug, description, description_ar, image_url, sort_order, active, created_at')
          .eq('id', data.category_id)
          .maybeSingle();
        return {
          ...data,
          category: cat || null,
        } as Product;
      }

      return data as Product;
    } catch (err) {
      console.error('[Queries] Exception fetching product by slug:', err);
      return null;
    }
  }

  return null;
}

export async function getCollections(type?: 'occasion' | 'flower' | 'collection'): Promise<Collection[]> {
  'use cache';
  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      let query = supabase
        .from('collections')
        .select('id, title, title_ar, slug, subtitle, subtitle_ar, image_url, type, sort_order, active')
        .eq('active', true);

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query.order('sort_order', { ascending: true });

      if (error) {
        console.error(`[Queries] Error fetching collections from Supabase:`, error.message);
        return [];
      }

      return (data || []) as Collection[];
    } catch (err) {
      console.error(`[Queries] Exception fetching collections:`, err);
      return [];
    }
  }

  return [];
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  'use cache';
  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from('collections')
        .select('id, title, title_ar, slug, subtitle, subtitle_ar, image_url, type, sort_order, active')
        .eq('slug', slug)
        .eq('active', true)
        .maybeSingle();

      if (error) {
        console.error(`[Queries] Error fetching collection by slug from Supabase:`, error.message);
        return null;
      }

      return data as Collection | null;
    } catch (err) {
      console.error(`[Queries] Exception fetching collection by slug:`, err);
      return null;
    }
  }

  return null;
}

export async function getBlogPosts(limit = 20): Promise<BlogPost[]> {
  'use cache';
  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, title_ar, slug, excerpt, excerpt_ar, content, content_ar, cover_image, author, author_ar, is_published, published_at, created_at')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('[Queries] Error fetching blog posts from Supabase:', error.message);
        return [];
      }

      return (data || []) as BlogPost[];
    } catch (err) {
      console.error('[Queries] Exception fetching blog posts:', err);
      return [];
    }
  }

  return [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  'use cache';
  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, title_ar, slug, excerpt, excerpt_ar, content, content_ar, cover_image, author, author_ar, is_published, published_at, created_at')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error) {
        console.error('[Queries] Error fetching blog post by slug from Supabase:', error.message);
        return null;
      }

      return data as BlogPost | null;
    } catch (err) {
      console.error('[Queries] Exception fetching blog post by slug:', err);
      return null;
    }
  }

  return null;
}

export async function getHomepageSections(): Promise<HomepageSection[]> {
  'use cache';
  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const [sectionsRes, mediaRes] = await Promise.all([
        supabase
          .from('homepage_sections')
          .select('id, section_key, title, title_ar, subtitle, subtitle_ar, is_visible, sort_order, content_json, updated_at')
          .eq('is_visible', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('media_assets')
          .select('public_id, url'),
      ]);

      if (sectionsRes.error) {
        console.error('[Queries] Error fetching homepage_sections from Supabase:', sectionsRes.error.message);
        return [];
      }

      const mediaMap: Record<string, string> = {};
      (mediaRes.data || []).forEach((m) => {
        if (m.public_id && m.url) {
          mediaMap[m.public_id] = m.url;
        }
      });

      const sections = (sectionsRes.data || []).map((sec) => {
        const content = sec.content_json || {};
        if (sec.section_key === 'hero_banner') {
          return {
            ...sec,
            content_json: {
              ...content,
              desktop_image: content.desktop_image || mediaMap['burble/hero_desktop'] || '',
              mobile_image: content.mobile_image || mediaMap['burble/hero_mobile'] || content.desktop_image || mediaMap['burble/hero_desktop'] || '',
            },
          };
        }
        if (sec.section_key === 'delivery_banner') {
          return {
            ...sec,
            content_json: {
              ...content,
              banner_image: content.banner_image || mediaMap['burble/delivery_banner'] || '',
            },
          };
        }
        return sec;
      });

      if (!sections.some((s) => s.section_key === 'delivery_banner') && mediaMap['burble/delivery_banner']) {
        sections.push({
          id: 'def-delivery-banner',
          section_key: 'delivery_banner',
          title: 'Same-Day Delivery Banner',
          title_ar: 'بانر التوصيل السريع في نفس اليوم',
          subtitle: null,
          subtitle_ar: null,
          is_visible: true,
          sort_order: 14,
          content_json: {
            banner_image: mediaMap['burble/delivery_banner'],
          },
          updated_at: new Date().toISOString(),
        });
      }

      return sections as HomepageSection[];
    } catch (err) {
      console.error('[Queries] Exception fetching homepage_sections:', err);
      return [];
    }
  }

  return [];
}
