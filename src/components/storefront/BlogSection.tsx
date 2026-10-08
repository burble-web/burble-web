import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types';

interface BlogSectionProps {
  posts: BlogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-12 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-plum-900 tracking-tight">
              From Our Blog
            </h2>
            <p className="text-xs text-ink-500 font-normal mt-1">Floral care guides, meanings and styling tips.</p>
          </div>
          <Link href="/blog" className="text-xs font-semibold text-plum-800 hover:text-plum-700">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden border border-ink-100/70 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 w-full bg-cream-200 overflow-hidden">
                  <Image
                    src={post.cover_image || '/demo-media/hero_slide_two.jpg'}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-base font-bold text-plum-900 group-hover:text-plum-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-ink-500 mt-2 line-clamp-2 font-normal leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-plum-800 group-hover:text-plum-900"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
