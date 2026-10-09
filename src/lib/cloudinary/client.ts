/**
 * Cloudinary Helper & Responsive Image Loader
 * Free tier optimization: Uses width-aware auto-format and auto-quality
 * to minimize bandwidth without Vercel image re-encoding fees.
 */

export function getCloudinaryUrl(
  src?: string | null,
  options?: { width?: number; height?: number; quality?: string | number; crop?: string }
): string {
  if (!src) return '';

  // If it's already a full HTTP URL or local static asset, process or return
  if (!src.includes('res.cloudinary.com')) {
    return src;
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
  if (!cloudName) return src;

  const width = options?.width ? `w_${options.width}` : '';
  const height = options?.height ? `h_${options.height}` : '';
  const crop = options?.crop ? `c_${options.crop}` : 'c_limit';
  const quality = options?.quality ? `q_${options.quality}` : 'q_auto';

  const transformParams = [crop, quality, 'f_auto', width, height].filter(Boolean).join(',');

  return src.replace('/upload/', `/upload/${transformParams}/`);
}

/**
 * Custom loader for Next.js <Image /> component
 */
export function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!src || !src.includes('res.cloudinary.com')) {
    return src || '';
  }
  return getCloudinaryUrl(src, { width, quality: quality || 'auto' });
}
