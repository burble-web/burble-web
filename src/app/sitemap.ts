import { MetadataRoute } from 'next';
import {
  getProducts,
  getCategories,
  getCollections,
  getBlogPosts,
} from '@/lib/data/queries';
import { SITE_URL } from '@/lib/seo/helpers';


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, flowerCollections, blogPosts] = await Promise.all([
    getProducts(),
    getCategories(),
    getCollections('flower'),
    getBlogPosts(100),
  ]);

  const sitemapEntries: MetadataRoute.Sitemap = [];
  const addedUrls = new Set<string>();

  function addLocalizedEntry(
    pathWithoutLocale: string,
    options: {
      lastModified?: Date;
      changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
      priority?: number;
    }
  ) {
    const cleanPath = pathWithoutLocale.replace(/^\/+/, '').replace(/\/+$/, '');
    const enUrl = cleanPath ? `${SITE_URL}/en/${cleanPath}` : `${SITE_URL}/en`;
    const arUrl = cleanPath ? `${SITE_URL}/ar/${cleanPath}` : `${SITE_URL}/ar`;

    const alternates = {
      languages: {
        en: enUrl,
        ar: arUrl,
        'x-default': enUrl,
      },
    };

    if (!addedUrls.has(enUrl)) {
      addedUrls.add(enUrl);
      sitemapEntries.push({
        url: enUrl,
        lastModified: options.lastModified || new Date(),
        changeFrequency: options.changeFrequency || 'weekly',
        priority: options.priority ?? 0.7,
        alternates,
      });
    }

    if (!addedUrls.has(arUrl)) {
      addedUrls.add(arUrl);
      sitemapEntries.push({
        url: arUrl,
        lastModified: options.lastModified || new Date(),
        changeFrequency: options.changeFrequency || 'weekly',
        priority: options.priority ?? 0.7,
        alternates,
      });
    }
  }

  // 1. Root & Localized Homepages
  addLocalizedEntry('', {
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  });

  // 2. Product Catalog Pages
  addLocalizedEntry('products', {
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  });

  // 3. Category Landing Pages
  categories.forEach((cat) => {
    addLocalizedEntry(`categories/${cat.slug}`, {
      lastModified: new Date(cat.created_at || new Date()),
      changeFrequency: 'daily',
      priority: 0.85,
    });
  });

  // 4. Subcategory Pages (e.g. hand-bouquets/roses, flowers-in-vase/lilies)
  // Only include combinations supported by the catalog
  const primaryCategories = ['hand-bouquets', 'flowers-in-vase'];
  for (const catSlug of primaryCategories) {
    for (const col of flowerCollections) {
      addLocalizedEntry(`categories/${catSlug}/${col.slug}`, {
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.75,
      });
    }
  }

  // 5. Product Detail Pages
  products.forEach((p) => {
    const modDate = p.updated_at || p.created_at ? new Date(p.updated_at || p.created_at) : new Date();
    addLocalizedEntry(`products/${p.slug}`, {
      lastModified: modDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 6. About Page
  addLocalizedEntry('about', {
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  });

  // 7. Blog Listing Page
  addLocalizedEntry('blog', {
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  });

  // 8. Blog Detail Pages
  blogPosts.forEach((b) => {
    const pubDate = b.published_at || b.created_at ? new Date(b.published_at || b.created_at) : new Date();
    addLocalizedEntry(`blog/${b.slug}`, {
      lastModified: pubDate,
      changeFrequency: 'monthly',
      priority: 0.65,
    });
  });

  return sitemapEntries;
}
