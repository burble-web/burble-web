'use server';

import { createClient, verifyAdminServer } from '@/lib/supabase/server';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

export interface MediaAssetRecord {
  id: string;
  public_id: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
  folder?: string;
  alt_text?: string;
  created_at?: string;
}

export async function uploadMediaAssetAction(formData: FormData) {
  // 1. Verify admin permissions
  const isAdmin = await verifyAdminServer();
  if (!isAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!url.includes('placeholder.supabase.co')) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return { success: false, error: 'No image file provided for upload.' };
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return { success: false, error: 'Cloudinary server credentials missing in environment variables.' };
  }

  try {
    // 2. Read file to buffer & base64 data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/jpeg';
    const base64DataUri = `data:${mimeType};base64,${buffer.toString('base64')}`;

    // 3. Prepare parameters & signature (sorted alphabetically)
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'burble';
    const publicId = `burble_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const paramsToSign: Record<string, string> = {
      folder,
      public_id: publicId,
      timestamp: timestamp.toString(),
    };

    const strToSign = Object.keys(paramsToSign)
      .sort()
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join('&') + apiSecret;

    const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

    // 4. Send POST upload request to Cloudinary API
    const cldFormData = new URLSearchParams();
    cldFormData.append('file', base64DataUri);
    cldFormData.append('api_key', apiKey);
    cldFormData.append('timestamp', timestamp.toString());
    cldFormData.append('signature', signature);
    cldFormData.append('folder', folder);
    cldFormData.append('public_id', publicId);

    const cldRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: cldFormData,
    });

    const cldData = await cldRes.json();
    if (!cldRes.ok) {
      return { success: false, error: cldData?.error?.message || 'Cloudinary upload failed.' };
    }

    // 5. Store metadata in Supabase media_assets table
    const supabase = await createClient();
    const { data: mediaRecord, error: dbError } = await supabase
      .from('media_assets')
      .insert({
        public_id: cldData.public_id,
        url: cldData.secure_url,
        width: cldData.width,
        height: cldData.height,
        format: cldData.format,
        folder: folder,
        alt_text: file.name,
      })
      .select()
      .single();

    if (dbError) {
      console.warn('[Media Action] Inserted to Cloudinary but failed DB sync:', dbError.message);
      // Fallback asset structure
      return {
        success: true,
        asset: {
          id: `med-${Date.now()}`,
          public_id: cldData.public_id,
          url: cldData.secure_url,
          width: cldData.width,
          height: cldData.height,
          format: cldData.format,
          alt_text: file.name,
        },
      };
    }

    revalidatePath('/admin/media');

    return {
      success: true,
      asset: mediaRecord as MediaAssetRecord,
    };
  } catch (err: any) {
    console.error('[Upload Media Error]', err);
    return { success: false, error: err?.message || 'Failed to upload media asset.' };
  }
}

export async function getMediaAssetsAction(): Promise<MediaAssetRecord[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data as MediaAssetRecord[];
    }
  } catch (err) {
    console.error('[Media Action] Error fetching media assets:', err);
  }

  return [];
}
