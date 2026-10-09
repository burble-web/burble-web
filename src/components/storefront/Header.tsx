'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Flower } from 'lucide-react';
import { useCart } from '@/lib/cart/store';
import { useLocale } from '@/lib/i18n/context';
import { CartDrawer } from './CartDrawer';
import { LanguageToggle } from './LanguageToggle';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItemsCount, wishlist } = useCart();
  const { t, isRtl, locale } = useLocale();

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream-100/95 backdrop-blur-md border-b border-ink-100/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Mobile Hamburger & Logo (Mobile View) */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-ink-900 hover:text-plum-800 transition-colors focus:outline-none"
                aria-label={t.nav.openMenu}
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/" className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <Flower className="w-5 h-5 text-plum-800" />
                <span className="font-serif text-2xl font-bold tracking-tight text-plum-900">BURBLE</span>
              </Link>
            </div>

            {/* Desktop Logo */}
            <div className="hidden lg:flex items-center space-x-2 rtl:space-x-reverse">
              <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse group">
                <Flower className="w-6 h-6 text-plum-800 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-serif text-3xl font-bold tracking-tight text-plum-900">BURBLE</span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse text-sm font-medium text-ink-700">
              <div className="relative group py-2">
                <Link href="/products" className="flex items-center space-x-1 rtl:space-x-reverse hover:text-plum-800 transition-colors">
                  <span>{t.common.occasions}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform" />
                </Link>
                <div className="absolute top-full start-0 hidden group-hover:block w-48 bg-white shadow-xl rounded-xl p-2 border border-ink-100 z-50">
                  <Link href="/products?occasion=birthday" className="block px-3 py-2 text-xs rounded-lg hover:bg-plum-50 hover:text-plum-800">
                    {locale === 'ar' ? 'أعياد الميلاد' : 'Birthday'}
                  </Link>
                  <Link href="/products?occasion=anniversary" className="block px-3 py-2 text-xs rounded-lg hover:bg-plum-50 hover:text-plum-800">
                    {locale === 'ar' ? 'الذكرى السنوية' : 'Anniversary'}
                  </Link>
                  <Link href="/products?occasion=graduation" className="block px-3 py-2 text-xs rounded-lg hover:bg-plum-50 hover:text-plum-800">
                    {locale === 'ar' ? 'التخرج والنجاح' : 'Graduation'}
                  </Link>
                  <Link href="/products?occasion=love-romance" className="block px-3 py-2 text-xs rounded-lg hover:bg-plum-50 hover:text-plum-800">
                    {locale === 'ar' ? 'حب ورومانسية' : 'Love & Romance'}
                  </Link>
                </div>
              </div>

              <div className="relative group py-2">
                <Link href="/products" className="flex items-center space-x-1 rtl:space-x-reverse hover:text-plum-800 transition-colors">
                  <span>{t.nav.shopByFlowerDropdown}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform" />
                </Link>
                <div className="absolute top-full start-0 hidden group-hover:block w-48 bg-white shadow-xl rounded-xl p-2 border border-ink-100 z-50">
                  <Link href="/products?flower=roses" className="block px-3 py-2 text-xs rounded-lg hover:bg-plum-50 hover:text-plum-800">
                    {locale === 'ar' ? 'الجوري والورد' : 'Roses'}
                  </Link>
                  <Link href="/products?flower=lilies" className="block px-3 py-2 text-xs rounded-lg hover:bg-plum-50 hover:text-plum-800">
                    {locale === 'ar' ? 'الزنبق (الليلي)' : 'Lilies'}
                  </Link>
                  <Link href="/products?flower=peonies" className="block px-3 py-2 text-xs rounded-lg hover:bg-plum-50 hover:text-plum-800">
                    {locale === 'ar' ? 'الفاونيا (البيوني)' : 'Peonies'}
                  </Link>
                  <Link href="/products?flower=tulips" className="block px-3 py-2 text-xs rounded-lg hover:bg-plum-50 hover:text-plum-800">
                    {locale === 'ar' ? 'التوليب' : 'Tulips'}
                  </Link>
                </div>
              </div>

              <Link href="/products?category=gift-hampers" className="hover:text-plum-800 transition-colors">{t.nav.giftHampers}</Link>
              <Link href="/products?category=combos" className="hover:text-plum-800 transition-colors">{t.nav.combos}</Link>
              <Link href="/about" className="hover:text-plum-800 transition-colors">{t.common.about}</Link>
            </nav>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex items-center flex-1 max-w-xs mx-6">
              <div className="relative w-full">
                <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                <input
                  type="text"
                  placeholder={t.common.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/80 border border-ink-100 rounded-full ps-9 pe-4 py-1.5 text-xs text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-plum-700/30 focus:border-plum-700 transition-all"
                />
              </div>
            </div>

            {/* Right Action Icons & Language Switcher */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse sm:space-x-4">
              <LanguageToggle />

              <Link
                href="/admin/login"
                className="p-2 text-ink-700 hover:text-plum-800 transition-colors"
                title={t.nav.adminPortal}
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                href="/products"
                className="relative p-2 text-ink-700 hover:text-plum-800 transition-colors"
                title={t.nav.wishlist}
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 end-1 bg-plum-800 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2 text-plum-900 hover:text-plum-800 transition-colors focus:outline-none"
                aria-label={t.nav.cart}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute top-1 end-1 bg-plum-800 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="lg:hidden px-4 pb-3">
          <div className="relative w-full">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
            <input
              type="text"
              placeholder={t.common.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-ink-100 rounded-full ps-9 pe-4 py-2 text-xs text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-plum-700/30"
            />
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-plum-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className={`fixed inset-y-0 ${isRtl ? 'right-0' : 'left-0'} max-w-xs w-full bg-cream-100 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto`}>
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-ink-100">
                <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse" onClick={() => setMobileMenuOpen(false)}>
                  <Flower className="w-6 h-6 text-plum-800" />
                  <span className="font-serif text-2xl font-bold text-plum-900">BURBLE</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-ink-700 hover:text-plum-900"
                  aria-label={t.nav.closeMenu}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-4 mb-6">
                <LanguageToggle variant="drawer" />
              </div>

              <nav className="space-y-3">
                <Link
                  href="/products"
                  className="block text-base font-medium text-ink-900 hover:text-plum-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.nav.allProducts}
                </Link>
                <Link
                  href="/products?category=hand-bouquets"
                  className="block text-base font-medium text-ink-900 hover:text-plum-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.nav.handBouquets}
                </Link>
                <Link
                  href="/products?category=flowers-in-vase"
                  className="block text-base font-medium text-ink-900 hover:text-plum-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.nav.flowersInVase}
                </Link>
                <Link
                  href="/products?category=premium-collections"
                  className="block text-base font-medium text-ink-900 hover:text-plum-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.nav.premiumCollections}
                </Link>
                <Link
                  href="/products?category=gift-hampers"
                  className="block text-base font-medium text-ink-900 hover:text-plum-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.nav.giftHampers}
                </Link>
                <Link
                  href="/about"
                  className="block text-base font-medium text-ink-900 hover:text-plum-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.common.aboutUs}
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-ink-100 text-xs text-ink-500">
              <p className="font-semibold text-plum-900">{t.common.deliveringTo}</p>
              <p className="mt-1">{t.common.sameDayDeliveryNotice}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  );
}
