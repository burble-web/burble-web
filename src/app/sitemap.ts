import { MetadataRoute } from 'next';
import { getProducts, getBlogPosts } from '@/lib/data/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://burbleflowers.com';

  const [products, blogPosts] = await Promise.all([
    getProducts(),
    getBlogPosts(100),
  ]);

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(p.updated_at || p.created_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: {
      languages: {
        en: `${baseUrl}/products/${p.slug}`,
        ar: `${baseUrl}/products/${p.slug}`,
      },
    },
  }));

  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: new Date(b.published_at || b.created_at || new Date()),
    changeFrequency: 'monthly',
    priority: 0.6,
    alternates: {
      languages: {
        en: `${baseUrl}/blog/${b.slug}`,
        ar: `${baseUrl}/blog/${b.slug}`,
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
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/blog`,
          ar: `${baseUrl}/blog`,
        },
      },
    },
    ...productUrls,
    ...blogUrls,
  ];
}
