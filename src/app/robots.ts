import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/helpers';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/cart',
          '/checkout',
          '/order-success',
          '/api/',
          '/*?*sort=',
          '/*?*q=',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
