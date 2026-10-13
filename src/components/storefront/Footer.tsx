'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flower, Phone, Mail, MapPin, Clock, ChevronDown } from 'lucide-react';
import { SiteSettings } from '@/types';
import { useLocale } from '@/lib/i18n/context';

interface FooterProps {
  settings?: SiteSettings;
}

/**
 * Collapsible on mobile (tap the heading to open/close),
 * always expanded from the md breakpoint up.
 */
function FooterSection({
  id,
  title,
  openId,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  openId: string | null;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  const open = openId === id;

  return (
    <div className="border-b border-plum-800/80 md:border-0">
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={open}
        aria-controls={`footer-${id}`}
        className="w-full flex items-center justify-between py-4 md:py-0 md:mb-4 md:cursor-default md:pointer-events-none text-start"
      >
        <h4 className="font-serif text-sm font-semibold text-white tracking-wide">{title}</h4>
        <ChevronDown
          className={`w-4 h-4 text-blush-200 transition-transform duration-300 md:hidden ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        id={`footer-${id}`}
        className={`grid transition-all duration-300 ease-in-out md:grid-rows-[1fr] ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-4 md:pb-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Footer({ settings }: FooterProps) {
  const { t, getLocalized, locale } = useLocale();
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  const storeName = getLocalized(settings?.store_name, settings?.store_name_ar) || 'BURBLE';
  const phone = settings?.whatsapp_number || '+974 0000 0000';
  const email = settings?.admin_email || 'hello@burble.qa';

  return (
    <footer className="bg-plum-900 text-plum-100 pt-10 sm:pt-16 pb-8 sm:pb-12 border-t border-plum-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 md:gap-10 pb-6 md:pb-12 md:border-b border-plum-800/80">

          {/* Brand Column (always visible) */}
          <div className="lg:col-span-1 space-y-4 pb-6 md:pb-0 border-b border-plum-800/80 md:border-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt={storeName}
                width={150}
                height={50}
                className="h-9 w-auto object-contain brightness-0 invert opacity-95 hover:opacity-100 transition-opacity"
              />
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

          {/* Shop */}
          <FooterSection id="shop" title={t.footer.shopHeading} openId={openId} onToggle={toggle}>
            <ul className="space-y-3 md:space-y-2.5 text-xs text-plum-200">
              <li><Link href="/products" className="hover:text-white transition-colors">{t.product.allFlowers}</Link></li>
              <li><Link href="/products?category=hand-bouquets" className="hover:text-white transition-colors">{t.nav.handBouquets}</Link></li>
              <li><Link href="/products?category=flowers-in-vase" className="hover:text-white transition-colors">{t.nav.flowersInVase}</Link></li>
              <li><Link href="/products?category=premium-collections" className="hover:text-white transition-colors">{t.nav.premiumCollections}</Link></li>
              <li><Link href="/products?category=gift-hampers" className="hover:text-white transition-colors">{t.nav.giftHampers}</Link></li>
              <li><Link href="/products?category=combos" className="hover:text-white transition-colors">{t.nav.combos}</Link></li>
            </ul>
          </FooterSection>

          {/* Occasions */}
          <FooterSection id="occasions" title={t.footer.occasionsHeading} openId={openId} onToggle={toggle}>
            <ul className="space-y-3 md:space-y-2.5 text-xs text-plum-200">
              <li><Link href="/products?occasion=birthday" className="hover:text-white transition-colors">{locale === 'ar' ? 'أعياد الميلاد' : 'Birthday'}</Link></li>
              <li><Link href="/products?occasion=anniversary" className="hover:text-white transition-colors">{locale === 'ar' ? 'الذكرى السنوية' : 'Anniversary'}</Link></li>
              <li><Link href="/products?occasion=love-romance" className="hover:text-white transition-colors">{locale === 'ar' ? 'حب ورومانسية' : 'Love & Romance'}</Link></li>
              <li><Link href="/products?occasion=graduation" className="hover:text-white transition-colors">{locale === 'ar' ? 'التخرج والنجاح' : 'Graduation'}</Link></li>
              <li><Link href="/products?occasion=get-well-soon" className="hover:text-white transition-colors">{locale === 'ar' ? 'سلامتك وشفاء عاجل' : 'Get Well Soon'}</Link></li>
              <li><Link href="/products?occasion=thank-you" className="hover:text-white transition-colors">{locale === 'ar' ? 'شكر وتقدير' : 'Thank You'}</Link></li>
            </ul>
          </FooterSection>

          {/* Support */}
          <FooterSection id="support" title={t.footer.supportHeading} openId={openId} onToggle={toggle}>
            <ul className="space-y-3 md:space-y-2.5 text-xs text-plum-200">
              <li><Link href="/about" className="hover:text-white transition-colors">{t.common.aboutUs}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{t.common.deliveryInfo}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{t.common.refundPolicy}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{t.common.faq}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{t.common.contactUs}</Link></li>
            </ul>
          </FooterSection>

          {/* Contact */}
          <FooterSection id="contact" title={t.footer.contactHeading} openId={openId} onToggle={toggle}>
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
          </FooterSection>

        </div>

        {/* Legal & Credits Row (In the same line on desktop, center-aligned Ekodrix) */}
        <div className="pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-plum-200 gap-3 md:gap-0 text-center">
          {/* Left: Copyright */}
          <p className="order-1 md:order-1 text-center md:text-start md:flex-1">
            © 2026 {storeName}. {t.common.allRightsReserved}
          </p>

          {/* Center: Crafted by Ekodrix */}
          <div className="order-3 md:order-2 flex items-center justify-center text-[10px] md:text-[11px] tracking-widest uppercase md:flex-1 text-center" dir="ltr">
            <span className="text-plum-300 font-medium">CRAFTED BY&nbsp;</span>
            <a
              href="https://www.ekodrix.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white hover:text-blush-200 transition-colors underline underline-offset-4 decoration-white/40 hover:decoration-blush-200"
            >
              EKODRIX
            </a>
          </div>

          {/* Right: Policy Links */}
          <div className="order-2 md:order-3 flex gap-6 justify-center md:justify-end md:flex-1 rtl:flex-row-reverse">
            <Link href="/about" className="hover:text-white transition-colors">{t.common.privacyPolicy}</Link>
            <Link href="/about" className="hover:text-white transition-colors">{t.common.termsConditions}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}