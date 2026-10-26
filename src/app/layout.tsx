import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Poppins, Cairo } from 'next/font/google';
import './globals.css';
import { LocaleProvider } from '@/lib/i18n/context';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://burbleflowers.com'),
  title: {
    default: 'Burble — Luxury Fresh Flowers & Handcrafted Bouquets in Qatar',
    template: '%s | Burble Flowers Qatar',
  },
  description:
    'Discover handcrafted luxury bouquets, flowers in vase, and gift hampers. Same-day express flower delivery across Doha, Lusail and Qatar.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: 'https://burbleflowers.com/en',
    languages: {
      en: 'https://burbleflowers.com/en',
      ar: 'https://burbleflowers.com/ar',
      'x-default': 'https://burbleflowers.com/en',
    },
  },
  openGraph: {
    title: 'Burble — Luxury Fresh Flowers in Qatar | زهور بيربل قطر',
    description: 'Fresh handcrafted bouquets for your special moments. Express same-day delivery across Qatar.',
    url: 'https://burbleflowers.com',
    siteName: 'Burble Flowers',
    locale: 'en_US',
    alternateLocale: ['ar_QA'],
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Burble Flowers Qatar — Luxury Handcrafted Bouquets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Burble Flowers Qatar | زهور بيربل قطر',
    description: 'Handcrafted fresh floral arrangements delivered across Qatar.',
    images: ['/opengraph-image.png'],
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
            __html: `(function(){try{var p=window.location.pathname;var isAr=p.indexOf('/ar')===0;if(!isAr){var m=document.cookie.match(/(?:^|;\\s*)burble_locale=([^;]+)/);if(m&&decodeURIComponent(m[1])==='ar'&&p.indexOf('/en')!==0){isAr=true;}}if(isAr){document.documentElement.lang='ar';document.documentElement.dir='rtl';document.documentElement.classList.add('rtl');}else{document.documentElement.lang='en';document.documentElement.dir='ltr';document.documentElement.classList.remove('rtl');}}catch(e){}})();`,
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

