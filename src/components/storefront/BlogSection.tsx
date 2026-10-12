'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { BlogPost } from '@/types';
import { useLocale } from '@/lib/i18n/context';
import { useCarousel } from './carousel-helper';

interface BlogSectionProps {
  posts: BlogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  const { t, isRtl, getLocalized } = useLocale();
  const {
    containerRef,
    canScrollPrev,
    canScrollNext,
    activeIndex,
    scrollPrev,
    scrollNext,
    scrollToIndex,
  } = useCarousel({ stepByItem: true });

  if (!posts || posts.length === 0) return null;

  const renderBlogCard = (post: BlogPost) => {
    const title = getLocalized(post.title, post.title_ar);
    const excerpt = getLocalized(post.excerpt, post.excerpt_ar);
    return (
      <article
        key={post.id}
        className="bg-white rounded-2xl overflow-hidden border border-ink-100/70 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group h-full"
      >
        <div>
          <div className="relative h-48 sm:h-44 w-full bg-cream-200 overflow-hidden flex items-center justify-center">
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
  };

  return (
    <section className="py-8 sm:py-12 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-5 sm:mb-8">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-plum-900 tracking-tight">
              {t.sections.fromOurBlogTitle}
            </h2>
            <p className="text-xs text-ink-500 font-normal mt-0.5 sm:mt-1">{t.sections.fromOurBlogSubtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Carousel Arrows */}
            {posts.length > 1 && (
              <div className="flex md:hidden items-center gap-1.5 me-1">
                <button
                  type="button"
                  onClick={scrollPrev}
                  disabled={!canScrollPrev}
                  className="w-7 h-7 rounded-full border border-plum-200 bg-white text-plum-900 flex items-center justify-center shadow-xs disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
                  aria-label="Previous article"
                >
                  <ChevronLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  disabled={!canScrollNext}
                  className="w-7 h-7 rounded-full border border-plum-200 bg-white text-plum-900 flex items-center justify-center shadow-xs disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
                  aria-label="Next article"
                >
                  <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}

            <Link href="/blog" className="text-xs font-semibold text-plum-800 hover:text-plum-700 whitespace-nowrap">
              {t.common.viewAll} →
            </Link>
          </div>
        </div>

        {/* Mobile: 1 Article Carousel (md:hidden) */}
        <div className="block md:hidden">
          <div
            ref={containerRef}
            className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {posts.map((post) => (
              <div
                key={post.id}
                className="w-full min-w-full max-w-full shrink-0 snap-center"
              >
                {renderBlogCard(post)}
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {posts.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-3.5">
              {posts.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToIndex(idx)}
                  aria-label={`Go to post ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === idx ? 'w-5 bg-plum-800' : 'w-1.5 bg-plum-200 hover:bg-plum-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop & Tablet: 3-Column Grid (hidden on mobile) */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {posts.map((post) => renderBlogCard(post))}
        </div>

      </div>
    </section>
  );
}
