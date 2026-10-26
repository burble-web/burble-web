import React from 'react';
import { Product, BlogPost, SiteSettings } from '@/types';

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FloristJsonLd({
  settings,
  siteUrl = 'https://burbleflowers.com',
}: {
  settings?: SiteSettings;
  siteUrl?: string;
}) {
  const phone = settings?.whatsapp_number
    ? `+${settings.whatsapp_number.replace(/[^0-9]/g, '')}`
    : '+97400000000';
  const email = settings?.admin_email || 'hello@burble.qa';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Florist',
    '@id': `${siteUrl}/#florist`,
    name: 'Burble Flowers Qatar',
    alternateName: 'زهور بيربل قطر',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/opengraph-image.png`,
    description:
      'Handcrafted luxury bouquets, fresh flowers in vase, and bespoke floral gifts in Qatar. Same-day express flower delivery across Doha, Lusail, and all Qatar.',
    telephone: phone,
    email: email,
    priceRange: '$$',
    currenciesAccepted: 'QAR',
    paymentAccepted: 'Cash on Delivery, Credit Card',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Doha',
      addressRegion: 'Doha',
      addressCountry: 'QA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.2854,
      longitude: 51.531,
    },
    areaServed: [
      { '@type': 'City', name: 'Doha' },
      { '@type': 'City', name: 'Lusail' },
      { '@type': 'Country', name: 'Qatar' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '08:00',
        closes: '23:00',
      },
    ],
    sameAs: [
      `https://api.whatsapp.com/send?phone=${phone.replace(/[^0-9]/g, '')}`,
    ],
  };

  return <JsonLdScript data={schema} />;
}

export function WebSiteJsonLd({
  siteUrl = 'https://burbleflowers.com',
}: {
  siteUrl?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: 'Burble Flowers Qatar',
    alternateName: 'زهور بيربل قطر',
    description: 'Luxury Fresh Flowers & Handcrafted Bouquets in Qatar',
    inLanguage: ['en', 'ar'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/products?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return <JsonLdScript data={schema} />;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.url,
    })),
  };

  return <JsonLdScript data={schema} />;
}

export function ProductJsonLd({
  product,
  locale = 'en',
  canonicalUrl,
  categoryName,
}: {
  product: Product;
  locale?: string;
  canonicalUrl: string;
  categoryName?: string;
}) {
  const isAr = locale === 'ar';
  const name = isAr && product.name_ar ? product.name_ar : product.name;
  const description =
    (isAr && product.description_ar ? product.description_ar : product.description) ||
    (isAr
      ? 'باقة زهور طبيعية فاخرة منسقة يدوياً من زهور بيربل قطر.'
      : 'Handcrafted luxury fresh floral bouquet from Burble Flowers Qatar.');

  const images = [product.main_image_url, product.hover_image_url].filter(
    (img): img is string => Boolean(img)
  );

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${canonicalUrl}#product`,
    name: name,
    description: description,
    image: images.length > 0 ? images : undefined,
    sku: product.slug,
    category: categoryName,
    brand: {
      '@type': 'Brand',
      name: 'Burble Flowers',
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'QAR',
      price: product.price.toFixed(2),
      priceValidUntil: '2027-12-31',
      availability:
        product.stock_status === 'out_of_stock'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Florist',
        name: 'Burble Flowers Qatar',
      },
    },
  };

  return <JsonLdScript data={schema} />;
}

export function CollectionPageJsonLd({
  title,
  description,
  url,
  products = [],
}: {
  title: string;
  description: string;
  url: string;
  products?: Product[];
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url: url,
    name: title,
    description: description,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 24).map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://burbleflowers.com/products/${p.slug}`,
        name: p.name,
      })),
    },
  };

  return <JsonLdScript data={schema} />;
}

export function ArticleJsonLd({
  post,
  locale = 'en',
  canonicalUrl,
}: {
  post: BlogPost;
  locale?: string;
  canonicalUrl: string;
}) {
  const isAr = locale === 'ar';
  const title = isAr && post.title_ar ? post.title_ar : post.title;
  const description =
    (isAr && post.excerpt_ar ? post.excerpt_ar : post.excerpt) ||
    'Floral care tips and arrangement guide from Burble Flowers Qatar.';
  const authorName =
    (isAr && post.author_ar ? post.author_ar : post.author) || 'Burble Florist';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${canonicalUrl}#article`,
    headline: title,
    description: description,
    image: post.cover_image ? [post.cover_image] : undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.published_at || post.created_at,
    inLanguage: isAr ? 'ar' : 'en',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Burble Flowers Qatar',
      logo: {
        '@type': 'ImageObject',
        url: 'https://burbleflowers.com/logo.png',
      },
    },
  };

  return <JsonLdScript data={schema} />;
}
