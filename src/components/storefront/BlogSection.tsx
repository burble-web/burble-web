'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen } from 'lucide-react';
import { BlogPost } from '@/types';
import { useLocale } from '@/lib/i18n/context';

interface BlogSectionProps {
  posts: BlogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  const { t, isRtl, getLocalized } = useLocale();

  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-12 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-plum-900 tracking-tight">
              {t.sections.fromOurBlogTitle}
            </h2>
            <p className="text-xs text-ink-500 font-normal mt-1">{t.sections.fromOurBlogSubtitle}</p>
          </div>
          <Link href="/blog" className="text-xs font-semibold text-plum-800 hover:text-plum-700">
            {t.common.viewAll} →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => {
            const title = getLocalized(post.title, post.title_ar);
            const excerpt = getLocalized(post.excerpt, post.excerpt_ar);
            return (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden border border-ink-100/70 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 w-full bg-cream-200 overflow-hidden flex items-center justify-center">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <BookOpen className="w-8 h-8 text-plum-400" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-base font-bold text-plum-900 group-hover:text-plum-700 transition-colors line-clamp-2">
                      {title}
                    </h3>
                    <p className="text-xs text-ink-500 mt-2 line-clamp-2 font-normal leading-relaxed">
                      {excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center space-x-1 rtl:space-x-reverse text-xs font-semibold text-plum-800 group-hover:text-plum-900"
                  >
                    <span>{t.common.readMore}</span>
                    <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
