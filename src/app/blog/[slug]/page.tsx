import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Calendar, User } from 'lucide-react';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { getSiteSettings, getBlogPostBySlug, getBlogPosts } from '@/lib/data/queries';
import { getServerTranslations, getServerLocale } from '@/lib/i18n/server';
import { getLocalizedValue, formatDate } from '@/lib/i18n/utils';
import { buildHreflangAlternates, buildAbsoluteUrl } from '@/lib/seo/helpers';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getServerLocale();
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Burble Flowers Qatar',
    };
  }

  const title = getLocalizedValue({
    locale,
    english: post.title,
    arabic: post.title_ar,
  });

  const excerpt =
    getLocalizedValue({
      locale,
      english: post.excerpt,
      arabic: post.excerpt_ar,
    }) ||
    (locale === 'ar'
      ? 'نصائح وأسرار العناية بالزهور وتنسيق الباقات من زهور بيربل قطر.'
      : 'Floral insights and styling guide from Burble Flowers Qatar.');

  const alternates = buildHreflangAlternates({
    pathWithoutLocale: `/blog/${slug}`,
    currentLocale: locale,
  });

  const canonicalUrl =
    locale === 'ar' ? buildAbsoluteUrl(`/ar/blog/${slug}`) : buildAbsoluteUrl(`/en/blog/${slug}`);

  const pageTitle =
    locale === 'ar'
      ? `${title} | مدونة زهور بيربل قطر`
      : `${title} | Burble Flowers Blog`;

  return {
    title: pageTitle,
    description: excerpt,
    alternates,
    openGraph: {
      title: pageTitle,
      description: excerpt,
      url: canonicalUrl,
      siteName: 'Burble Flowers',
      locale: locale === 'ar' ? 'ar_QA' : 'en_US',
      alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_QA'],
      type: 'article',
      images: post.cover_image
        ? [
            {
              url: post.cover_image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [
            {
              url: buildAbsoluteUrl('/opengraph-image.png'),
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: excerpt,
      images: post.cover_image
        ? [post.cover_image]
        : [buildAbsoluteUrl('/opengraph-image.png')],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { t, locale, direction } = await getServerTranslations();
  const settings = await getSiteSettings();
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const title = getLocalizedValue({
    locale,
    english: post.title,
    arabic: post.title_ar,
  });

  const content =
    getLocalizedValue({
      locale,
      english: post.content,
      arabic: post.content_ar,
    }) || post.content;

  const author =
    getLocalizedValue({
      locale,
      english: post.author,
      arabic: post.author_ar,
    }) || 'Burble Florist';

  const recentPosts = (await getBlogPosts(4)).filter((p) => p.slug !== slug).slice(0, 3);

  const currentCanonicalUrl =
    locale === 'ar' ? buildAbsoluteUrl(`/ar/blog/${slug}`) : buildAbsoluteUrl(`/en/blog/${slug}`);

  const breadcrumbs = [
    {
      name: t.common.home,
      url: locale === 'ar' ? buildAbsoluteUrl('/ar') : buildAbsoluteUrl('/en'),
    },
    {
      name: t.sections.fromOurBlogTitle,
      url: locale === 'ar' ? buildAbsoluteUrl('/ar/blog') : buildAbsoluteUrl('/en/blog'),
    },
    {
      name: title,
      url: currentCanonicalUrl,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 font-sans">
      <AnnouncementBar settings={settings} />
      <Header />

      <BreadcrumbJsonLd items={breadcrumbs} />
      <ArticleJsonLd post={post} locale={locale} canonicalUrl={currentCanonicalUrl} />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-ink-500 mb-6 flex items-center space-x-1.5 rtl:space-x-reverse"
        >
          <Link
            href={locale === 'ar' ? '/ar' : '/en'}
            className="hover:text-plum-800 transition-colors"
          >
            {t.common.home}
          </Link>
          <span>/</span>
          <Link
            href={locale === 'ar' ? '/ar/blog' : '/en/blog'}
            className="hover:text-plum-800 transition-colors"
          >
            {t.sections.fromOurBlogTitle}
          </Link>
          <span>/</span>
          <span className="text-plum-900 font-semibold truncate max-w-xs">{title}</span>
        </nav>

        {/* Article Container */}
        <article className="bg-white rounded-3xl p-6 sm:p-12 border border-ink-100 shadow-sm mb-16">
          {/* Post Meta */}
          <div className="flex items-center gap-4 text-xs text-ink-500 mb-4 pb-4 border-b border-ink-100">
            <span className="flex items-center gap-1.5 font-medium text-plum-900">
              <User className="w-4 h-4 text-plum-800" />
              <span>{author}</span>
            </span>
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-ink-400" />
                <span>{formatDate(post.published_at, locale)}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-plum-900 leading-tight mb-8">
            {title}
          </h1>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-8 bg-cream-100 border border-ink-100 shadow-xs">
              <Image
                src={post.cover_image}
                alt={title}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          )}

          {/* Article Body Content */}
          <div className="prose prose-plum max-w-none text-ink-800 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-light">
            {content}
          </div>

          {/* Article Footer & Return to Blog */}
          <div className="mt-12 pt-6 border-t border-ink-100 flex items-center justify-between">
            <Link
              href={locale === 'ar' ? '/ar/blog' : '/en/blog'}
              className="inline-flex items-center gap-2 bg-cream-100 hover:bg-cream-200 text-plum-900 px-5 py-2.5 rounded-full text-xs font-semibold transition-colors border border-ink-200"
            >
              {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{locale === 'ar' ? 'العودة إلى المدونة' : 'Back to Blog'}</span>
            </Link>

            <Link
              href={locale === 'ar' ? '/ar/products' : '/en/products'}
              className="inline-flex items-center gap-2 bg-plum-900 hover:bg-plum-800 text-white px-6 py-2.5 rounded-full text-xs font-semibold transition-colors shadow-sm"
            >
              <span>{t.cart.startShopping}</span>
            </Link>
          </div>
        </article>

        {/* More Articles */}
        {recentPosts.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-plum-900">
              {locale === 'ar' ? 'مقالات أخرى قد تهمك' : 'More From Our Florist Blog'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recentPosts.map((rel) => {
                const relTitle = getLocalizedValue({
                  locale,
                  english: rel.title,
                  arabic: rel.title_ar,
                });
                const relHref =
                  locale === 'ar' ? `/ar/blog/${rel.slug}` : `/en/blog/${rel.slug}`;

                return (
                  <Link
                    key={rel.id}
                    href={relHref}
                    className="bg-white p-4 rounded-2xl border border-ink-100 shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-cream-200 mb-3">
                      {rel.cover_image ? (
                        <Image
                          src={rel.cover_image}
                          alt={relTitle}
                          fill
                          sizes="(max-width: 640px) 100vw, 300px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : null}
                    </div>
                    <h3 className="font-serif text-xs font-bold text-plum-900 group-hover:text-plum-700 line-clamp-2">
                      {relTitle}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer settings={settings} />
    </div>
  );
}
