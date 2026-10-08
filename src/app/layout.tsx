import type { Metadata } from 'next';
import { Cormorant_Garamond, Poppins } from 'next/font/google';
import './globals.css';

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Burble — Luxury Fresh Flowers & Handcrafted Bouquets in Qatar',
    template: '%s | Burble Flowers',
  },
  description:
    'Discover handcrafted luxury bouquets, flowers in vase, and gift hampers. Same-day delivery across Doha, Lusail and Qatar.',
  openGraph: {
    title: 'Burble — Luxury Fresh Flowers in Qatar',
    description: 'Fresh handcrafted bouquets for your special moments. Express same-day delivery.',
    url: 'https://burbleflowers.com',
    siteName: 'Burble Flowers',
    images: [
      {
        url: '/demo-media/hero_desktop.jpg',
        width: 1200,
        height: 630,
        alt: 'Burble Luxury Flower Shop',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Burble Flowers Qatar',
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
    <html lang="en" className={`${cormorant.variable} ${poppins.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-cream-100 text-ink-900 selection:bg-plum-800 selection:text-white">
        {children}
      </body>
    </html>
  );
}
