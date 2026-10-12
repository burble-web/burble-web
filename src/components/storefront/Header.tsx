'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Flower } from 'lucide-react';
import { useCart } from '@/lib/cart/store';
import { useLocale } from '@/lib/i18n/context';
import { CartDrawer } from './CartDrawer';
import { LanguageToggle } from './LanguageToggle';

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { totalItemsCount, wishlist } = useCart();
  const { t, isRtl, locale } = useLocale();

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream-100/95 backdrop-blur-md border-b border-ink-100/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">

            {/* Mobile Hamburger & Logo (Mobile View) */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-ink-900 hover:text-plum-800 transition-colors focus:outline-none"
                aria-label={t.nav.openMenu}
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="BURBLE"
                  width={130}
                  height={43}
                  priority
                  className="h-8 sm:h-9 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Desktop Logo */}
            <div className="hidden lg:flex items-center shrink-0">
              <Link href="/" className="flex items-center group">
                <Image
                  src="/logo.png"
                  alt="BURBLE"
                  width={160}
                  height={53}
                  priority
                  className="h-10 xl:h-11 w-auto object-contain group-hover:opacity-90 transition-opacity"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-ink-700 whitespace-nowrap">
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

            {/* Right Action Icons, Search & Language Switcher */}
            <div className="flex items-center gap-1 sm:gap-3 lg:gap-4 shrink-0">

              {/* Search Icon & Popover */}
              <div className="relative" ref={searchContainerRef}>
                <button
                  type="button"
                  onClick={() => setSearchOpen((prev) => !prev)}
                  className={`p-2 rounded-full transition-colors ${
                    searchOpen
                      ? 'text-plum-800 bg-plum-100/70'
                      : 'text-ink-700 hover:text-plum-800 hover:bg-plum-50'
                  }`}
                  aria-label={t.common.searchPlaceholder}
                  aria-expanded={searchOpen}
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Compact Search Popover */}
                {searchOpen && (
                  <div className="absolute top-full end-0 mt-3 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-ink-100 p-2.5 z-50">
                    <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                      <Search className="absolute start-3 w-4 h-4 text-ink-400 pointer-events-none" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder={t.common.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-cream-50 border border-ink-100 rounded-full ps-9 pe-8 py-2 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-700/30 focus:border-plum-700 transition-all"
                      />
                      {searchQuery ? (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute end-2.5 p-1 text-ink-400 hover:text-ink-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSearchOpen(false)}
                          className="absolute end-2.5 p-1 text-ink-400 hover:text-ink-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </form>
                  </div>
                )}
              </div>

              {/* Language toggle: desktop only (on mobile it lives in the drawer menu) */}
              <div className="hidden lg:block">
                <LanguageToggle />
              </div>

              {/* User icon: desktop only (on mobile it lives in the drawer menu) */}
              <Link
                href="/admin/login"
                className="hidden lg:block p-2 text-ink-700 hover:text-plum-800 transition-colors rounded-full hover:bg-plum-50"
                title={t.nav.adminPortal}
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                href="/products"
                className="relative p-2 text-ink-700 hover:text-plum-800 transition-colors rounded-full hover:bg-plum-50"
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
                className="relative p-2 text-plum-900 hover:text-plum-800 transition-colors rounded-full hover:bg-plum-50 focus:outline-none"
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
                <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                  <Image
                    src="/logo.png"
                    alt="BURBLE"
                    width={130}
                    height={43}
                    className="h-8 w-auto object-contain"
                  />
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