import { Metadata } from 'next';
import { Locale } from '@/types';

export const SITE_URL = 'https://burbleflowers.com';
export const DEFAULT_PRODUCTION_ORIGIN = 'https://burbleflowers.com';

/**
 * Normalizes a path:
 * - Ensures single leading slash
 * - Removes trailing slash (except root '/')
 * - Trims whitespace
 */
export function normalizePath(path: string): string {
  if (!path || path === '/') return '';
  const cleaned = path.trim().replace(/^\/+/, '/').replace(/\/+$/, '');
  return cleaned;
}

/**
 * Builds an absolute canonical URL using production domain.
 */
export function buildAbsoluteUrl(path: string): string {
  const normalized = normalizePath(path);
  return `${SITE_URL}${normalized ? normalized : ''}` || SITE_URL;
}

/**
 * Constructs reciprocal hreflang alternate objects for Next.js metadata.
 * pathWithoutLocale: e.g. '/categories/hand-bouquets' or '/products' or '' (homepage)
 */
export function buildHreflangAlternates({
  pathWithoutLocale,
  currentLocale,
}: {
  pathWithoutLocale: string;
  currentLocale: Locale;
}): Metadata['alternates'] {
  const normPath = normalizePath(pathWithoutLocale);

  const enUrl = `${SITE_URL}/en${normPath}`;
  const arUrl = `${SITE_URL}/ar${normPath}`;
  const currentCanonical = currentLocale === 'ar' ? arUrl : enUrl;

  return {
    canonical: currentCanonical,
    languages: {
      en: enUrl,
      ar: arUrl,
      'x-default': enUrl,
    },
  };
}
