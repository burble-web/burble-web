'use client';

import React from 'react';
import Link from 'next/link';
import { Flower, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { SiteSettings } from '@/types';
import { useLocale } from '@/lib/i18n/context';

interface FooterProps {
  settings?: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  const { t, getLocalized, locale } = useLocale();

  const storeName = getLocalized(settings?.store_name, settings?.store_name_ar) || 'BURBLE';
  const phone = settings?.whatsapp_number || '+974 0000 0000';
  const email = settings?.admin_email || 'hello@burble.qa';

  return (
    <footer className="bg-plum-900 text-plum-100 pt-16 pb-12 border-t border-plum-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-plum-800/80">
          
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
              <Flower className="w-6 h-6 text-blush-200" />
              <span className="font-serif text-2xl font-bold tracking-tight text-white">{storeName}</span>
            </Link>
            <p className="text-xs text-plum-200 leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="flex items-center space-x-3 rtl:space-x-reverse text-blush-200 pt-2">
              <a href="#" className="p-2 bg-plum-800/80 rounded-full hover:bg-plum-700 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="p-2 bg-plum-800/80 rounded-full hover:bg-plum-700 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
              </a>
              <a href={`https://api.whatsapp.com/send?phone=${phone.replace(/[^0-9]/g, '')}`} className="p-2 bg-plum-800/80 rounded-full hover:bg-plum-700 hover:text-white transition-colors" aria-label="WhatsApp">
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white tracking-wide mb-4">{t.footer.shopHeading}</h4>
            <ul className="space-y-2.5 text-xs text-plum-200">
              <li><Link href="/products" className="hover:text-white transition-colors">{t.product.allFlowers}</Link></li>
              <li><Link href="/products?category=hand-bouquets" className="hover:text-white transition-colors">{t.nav.handBouquets}</Link></li>
              <li><Link href="/products?category=flowers-in-vase" className="hover:text-white transition-colors">{t.nav.flowersInVase}</Link></li>
              <li><Link href="/products?category=premium-collections" className="hover:text-white transition-colors">{t.nav.premiumCollections}</Link></li>
              <li><Link href="/products?category=gift-hampers" className="hover:text-white transition-colors">{t.nav.giftHampers}</Link></li>
              <li><Link href="/products?category=combos" className="hover:text-white transition-colors">{t.nav.combos}</Link></li>
            </ul>
          </div>

          {/* Occasions Column */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white tracking-wide mb-4">{t.footer.occasionsHeading}</h4>
            <ul className="space-y-2.5 text-xs text-plum-200">
              <li><Link href="/products?occasion=birthday" className="hover:text-white transition-colors">{locale === 'ar' ? 'أعياد الميلاد' : 'Birthday'}</Link></li>
              <li><Link href="/products?occasion=anniversary" className="hover:text-white transition-colors">{locale === 'ar' ? 'الذكرى السنوية' : 'Anniversary'}</Link></li>
              <li><Link href="/products?occasion=love-romance" className="hover:text-white transition-colors">{locale === 'ar' ? 'حب ورومانسية' : 'Love & Romance'}</Link></li>
              <li><Link href="/products?occasion=graduation" className="hover:text-white transition-colors">{locale === 'ar' ? 'التخرج والنجاح' : 'Graduation'}</Link></li>
              <li><Link href="/products?occasion=get-well-soon" className="hover:text-white transition-colors">{locale === 'ar' ? 'سلامتك وشفاء عاجل' : 'Get Well Soon'}</Link></li>
              <li><Link href="/products?occasion=thank-you" className="hover:text-white transition-colors">{locale === 'ar' ? 'شكر وتقدير' : 'Thank You'}</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white tracking-wide mb-4">{t.footer.supportHeading}</h4>
            <ul className="space-y-2.5 text-xs text-plum-200">
              <li><Link href="/about" className="hover:text-white transition-colors">{t.common.aboutUs}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{t.common.deliveryInfo}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{t.common.refundPolicy}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{t.common.faq}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{t.common.contactUs}</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white tracking-wide mb-4">{t.footer.contactHeading}</h4>
            <ul className="space-y-3 text-xs text-plum-200">
              <li className="flex items-start space-x-2 rtl:space-x-reverse">
                <MapPin className="w-4 h-4 text-blush-200 shrink-0 mt-0.5" />
                <span>{locale === 'ar' ? 'الدوحة، دولة قطر' : 'Doha, Qatar'}</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <Phone className="w-4 h-4 text-blush-200 shrink-0" />
                <span dir="ltr">{phone}</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <Mail className="w-4 h-4 text-blush-200 shrink-0" />
                <span>{email}</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <Clock className="w-4 h-4 text-blush-200 shrink-0" />
                <span>{t.footer.operatingHours}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-plum-200 space-y-4 sm:space-y-0">
          <p>© 2026 {storeName}. {t.common.allRightsReserved}</p>
          <div className="flex space-x-6 rtl:space-x-reverse">
            <Link href="/about" className="hover:text-white transition-colors">{t.common.privacyPolicy}</Link>
            <Link href="/about" className="hover:text-white transition-colors">{t.common.termsConditions}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
