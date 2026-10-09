import type { Metadata } from 'next';
import { Cormorant_Garamond, Poppins, Cairo } from 'next/font/google';
import './globals.css';
import { getServerLocale } from '@/lib/i18n/server';
import { getDirection } from '@/lib/i18n/config';
import { LocaleProvider } from '@/lib/i18n/context';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Burble — Luxury Fresh Flowers & Handcrafted Bouquets in Qatar',
    template: '%s | Burble Flowers Qatar',
  },
  description:
    'Discover handcrafted luxury bouquets, flowers in vase, and gift hampers. Same-day express flower delivery across Doha, Lusail and Qatar.',
  openGraph: {
    title: 'Burble — Luxury Fresh Flowers in Qatar | زهور بيربل قطر',
    description: 'Fresh handcrafted bouquets for your special moments. Express same-day delivery across Qatar.',
    url: 'https://burbleflowers.com',
    siteName: 'Burble Flowers',
    images: [
      {
        url: '/demo-media/hero_desktop.jpg',
        width: 1200,
        height: 630,
        alt: 'Burble Luxury Flower Shop Qatar',
      },
    ],
    locale: 'en_US',
    alternateLocale: ['ar_QA'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Burble Flowers Qatar | زهور بيربل قطر',
    description: 'Handcrafted fresh floral arrangements delivered across Qatar.',
    images: ['/demo-media/hero_desktop.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${cormorant.variable} ${poppins.variable} ${cairo.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=document.cookie.match(/(?:^|;\\s*)burble_locale=([^;]+)/);var l=m?decodeURIComponent(m[1]):'en';if(l==='ar'){document.documentElement.lang='ar';document.documentElement.dir='rtl';document.documentElement.classList.add('rtl');}else{document.documentElement.lang='en';document.documentElement.dir='ltr';document.documentElement.classList.remove('rtl');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-cream-100 text-ink-900 selection:bg-plum-800 selection:text-white">
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
