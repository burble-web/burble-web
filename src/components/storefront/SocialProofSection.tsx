import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';

const MOMENTS = [
  { id: 1, image: '/demo-media/hero_desktop.jpg', name: 'Amina K.', comment: 'The roses were breathtakingly fresh!' },
  { id: 2, image: '/demo-media/product_blush_bouquet.jpg', name: 'Sara M.', comment: 'Same-day delivery saved our anniversary.' },
  { id: 3, image: '/demo-media/product_pastel_bouquet.jpg', name: 'Noora H.', comment: 'Elegant wrapping and gorgeous scent.' },
  { id: 4, image: '/demo-media/hero_slide_two.jpg', name: 'Fatima Z.', comment: 'Best florist in Doha by far.' },
  { id: 5, image: '/demo-media/product_red_roses.jpg', name: 'Reem Q.', comment: 'Flawless bouquet and service!' },
];

export function SocialProofSection() {
  return (
    <section className="py-12 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Card */}
          <div className="lg:col-span-4 bg-plum-100/60 rounded-3xl p-8 border border-plum-200/50 flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex items-center space-x-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-xs font-bold text-plum-900 ml-1.5">4.9 / 5.0</span>
              </div>

              <h2 className="font-serif text-3xl font-bold text-plum-900 leading-tight">
                Real Moments<br />Real Happiness
              </h2>
              <p className="text-xs text-plum-800/80 font-normal mt-3 mb-6 leading-relaxed">
                See how Burble flowers make birthdays, proposals and celebrations extra special across Qatar.
              </p>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center space-x-2 bg-plum-900 hover:bg-plum-800 text-white text-xs font-semibold px-5 py-3 rounded-full w-fit shadow-xs transition-colors"
            >
              <span>View Customer Stories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Right Image Strip */}
          <div className="lg:col-span-8 overflow-hidden">
            <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
              {MOMENTS.map((m) => (
                <div
                  key={m.id}
                  className="relative w-44 sm:w-52 h-64 rounded-2xl overflow-hidden shrink-0 group border border-ink-100 shadow-xs"
                >
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-plum-950/80 via-transparent to-transparent opacity-90 p-4 flex flex-col justify-end text-white">
                    <p className="text-xs font-semibold">{m.name}</p>
                    <p className="text-[11px] font-light text-plum-200 line-clamp-2 mt-0.5">"{m.comment}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
