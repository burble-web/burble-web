import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, BookOpen, Calendar, User } from 'lucide-react';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { getSiteSettings, getBlogPosts } from '@/lib/data/queries';
import { getServerTranslations } from '@/lib/i18n/server';
import { getLocalizedValue, formatDate } from '@/lib/i18n/utils';

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getServerTranslations();
  return {
    title: `${t.sections.fromOurBlogTitle} | Burble Flowers Qatar`,
    description: t.sections.fromOurBlogSubtitle,
    openGraph: {
      title: `${t.sections.fromOurBlogTitle} | Burble Flowers`,
      description: t.sections.fromOurBlogSubtitle,
    },
    alternates: {
      languages: {
        en: '/blog',
        ar: '/blog',
      },
    },
  };
}

export default async function BlogIndexPage() {
  const settings = await getSiteSettings();
  const { t, locale, direction } = await getServerTranslations();
  const posts = await getBlogPosts(50);

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 font-sans">
      <AnnouncementBar settings={settings} />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Breadcrumb */}
        <div className="text-xs text-ink-500 mb-4 flex items-center space-x-1.5 rtl:space-x-reverse">
          <Link href="/" className="hover:text-plum-800">{t.common.home}</Link>
          <span>/</span>
          <span className="text-plum-900 font-semibold">{t.sections.fromOurBlogTitle}</span>
        </div>

        {/* Page Heading */}
        <div className="max-w-3xl mb-12">
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-plum-900 leading-tight">
            {t.sections.fromOurBlogTitle}
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 font-light mt-2 leading-relaxed">
            {t.sections.fromOurBlogSubtitle}
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-ink-100 my-8">
            <BookOpen className="w-12 h-12 text-ink-300 mx-auto mb-3 stroke-[1.5]" />
            <p className="font-serif text-xl font-bold text-plum-900">
              {locale === 'ar' ? 'لا توجد مقالات منشورة حالياً' : 'No Blog Posts Published Yet'}
            </p>
            <p className="text-xs text-ink-500 mt-1 mb-6">
              {locale === 'ar'
                ? 'تابعنا قريباً لاستكشاف نصائح العناية بالزهور وتنسيقات المناسبات.'
                : 'Check back soon for flower care guides and floral arrangement tips.'}
            </p>
            <Link
              href="/products"
              className="px-6 py-2.5 bg-plum-900 text-white text-xs font-semibold rounded-full hover:bg-plum-800"
            >
              {t.cart.startShopping}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const title = getLocalizedValue({
                locale,
                english: post.title,
                arabic: post.title_ar,
              });
              const excerpt = getLocalizedValue({
                locale,
                english: post.excerpt,
                arabic: post.excerpt_ar,
              });
              const author = getLocalizedValue({
                locale,
                english: post.author,
                arabic: post.author_ar,
              }) || 'Burble Florist';

              return (
                <article
                  key={post.id}
                  className="bg-white rounded-3xl overflow-hidden border border-ink-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-52 w-full bg-cream-200 overflow-hidden flex items-center justify-center">
                      {post.cover_image ? (
                        <Image
                          src={post.cover_image}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <BookOpen className="w-10 h-10 text-plum-300" />
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-3 text-[11px] text-ink-400 mb-3">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          <span>{author}</span>
                        </span>
                        {post.published_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(post.published_at, locale)}</span>
                          </span>
                        )}
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="font-serif text-lg font-bold text-plum-900 group-hover:text-plum-700 transition-colors line-clamp-2 leading-snug">
                          {title}
                        </h2>
                      </Link>

                      <p className="text-xs text-ink-500 mt-2.5 line-clamp-3 font-normal leading-relaxed">
                        {excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-semibold text-plum-800 hover:text-plum-900 group-hover:underline"
                    >
                      <span>{t.common.readMore}</span>
                      {direction === 'rtl' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer settings={settings} />
    </div>
  );
}
