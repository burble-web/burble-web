'use server';

import { createClient, verifyAdminServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { BlogPost } from '@/types';

export interface SaveBlogPostPayload {
  id?: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  author?: string;
  is_published?: boolean;
}

export async function getAdminBlogPostsAction(): Promise<{ success: boolean; data?: BlogPost[]; error?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: (data || []) as BlogPost[] };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to fetch blog posts.' };
  }
}

export async function saveBlogPostAction(payload: SaveBlogPostPayload) {
  const isAdmin = await verifyAdminServer();
  if (!isAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!url.includes('placeholder.supabase.co')) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }
  }

  if (!payload.title || payload.title.trim().length < 2) {
    return { success: false, error: 'Blog post title must be at least 2 characters.' };
  }

  if (!payload.content || payload.content.trim().length < 5) {
    return { success: false, error: 'Blog post content is required.' };
  }

  const generatedSlug = payload.slug && payload.slug.trim()
    ? payload.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    : payload.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    const supabase = await createClient();

    const dbRecord = {
      title: payload.title.trim(),
      slug: generatedSlug,
      excerpt: payload.excerpt ? payload.excerpt.trim() : null,
      content: payload.content.trim(),
      cover_image: payload.cover_image ? payload.cover_image.trim() : null,
      author: payload.author ? payload.author.trim() : 'Burble Florist',
      is_published: payload.is_published ?? true,
      published_at: new Date().toISOString(),
    };

    let result;
    if (payload.id) {
      result = await supabase
        .from('blog_posts')
        .update(dbRecord)
        .eq('id', payload.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('blog_posts')
        .insert(dbRecord)
        .select()
        .single();
    }

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin/blog');

    return { success: true, post: result.data as BlogPost };
  } catch (err: any) {
    console.error('[Save Blog Post Action Error]', err);
    return { success: false, error: err?.message || 'Failed to save blog post.' };
  }
}

export async function deleteBlogPostAction(id: string) {
  const isAdmin = await verifyAdminServer();
  if (!isAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!url.includes('placeholder.supabase.co')) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin/blog');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete blog post.' };
  }
}
