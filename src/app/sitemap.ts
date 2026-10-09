import { MetadataRoute } from 'next';
import { DEMO_PRODUCTS } from '@/lib/data/storefront';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://burbleflowers.com';

  const productUrls: MetadataRoute.Sitemap = DEMO_PRODUCTS.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: {
      languages: {
        en: `${baseUrl}/products/${p.slug}`,
        ar: `${baseUrl}/products/${p.slug}`,
      },
    },
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}`,
          ar: `${baseUrl}`,
        },
      },
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/products`,
          ar: `${baseUrl}/products`,
        },
      },
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
      alternates: {
        languages: {
          en: `${baseUrl}/about`,
          ar: `${baseUrl}/about`,
        },
      },
    },
    ...productUrls,
  ];
}

