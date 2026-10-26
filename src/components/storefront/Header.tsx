'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, ChevronDown, Flower, Loader2, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart/store';
import { useLocale } from '@/lib/i18n/context';
import { searchProductsAction } from '@/app/actions/product';
import { CartDrawer } from './CartDrawer';
import { LanguageToggle } from './LanguageToggle';

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { totalItemsCount } = useCart();
  const { t, isRtl, locale, formatPrice, getLocalized } = useLocale();

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    } else {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [searchOpen]);

  // Debounced live instant search
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchProductsAction(trimmed);
        if (res.success && res.products) {
          setSearchResults(res.products);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleSelectProduct = (slug: string) => {
    setSearchOpen(false);
    router.push(`/products/${slug}`);
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
              <Link href={locale === 'ar' ? '/ar' : '/en'} className="flex items-center">
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
              <Link href={locale === 'ar' ? '/ar' : '/en'} className="flex items-center group">
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
                <Link
                  href={locale === 'ar' ? '/ar/products' : '/en/products'}
                  className="flex items-center space-x-1 rtl:space-x-reverse hover:text-plum-800 transition-colors"
                >
                  <span>{t.common.occasions}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform" />
                </Link>
                <div className="absolute top-full start-0 hidden group-hover:block w-48 bg-white shadow-xl rounded-xl p-2 border border-ink-100 z-50">
                  <Link
                    href={locale === 'ar' ? '/ar/products?occasion=birthday' : '/en/products?occasion=birthday'}
                    className="block px-3 py-2 text-xs rounded-lg hover:bg-plum-50 hover:text-plum-800"
                  >
                    {locale === 'ar' ? 'أعياد الميلاد' : 'Birthday'}
                  </Link>
                  <Link
                    href={locale === 'ar' ? '/ar/products?occasion=anniversary' : '/en/products?occasion=anniversary'}
                    className="block px-3 py-2 text-xs rounded-lg hover:bg-plum-50 hover:text-plum-800"
                  >
                    {locale === 'ar' ? 'الذكرى السنوية' : 'Anniversary'}
                  </Link>
                  <Link
                    href={locale === 'ar' ? '/ar/products?occasion=graduation' : '/en/products?occasion=graduation'}
                    className="block px-3 py-2 text-xs rounded-lg hover:bg-plum-50 hover:text-plum-800"
                  >
                    {locale === 'ar' ? 'التخرج والنجاح' : 'Graduation'}
                  </Link>
                  <Link
                    href={locale === 'ar' ? '/ar/products?occasion=love-romance' : '/en/products?occasion=love-romance'}
                    className="block px-3 py-2 text-xs rounded-lg hover:bg-plum-50 hover:text-plum-800"
                  >
                    {locale === 'ar' ? 'حب ورومانسية' : 'Love & Romance'}
                  </Link>
                </div>
              </div>

              <div className="relative group py-2">
                <Link
                  href={locale === 'ar' ? '/ar/products' : '/en/products'}
                  className="flex items-center space-x-1 rtl:space-x-reverse hover:text-plum-800 transition-colors"
                >
                  <span>{t.nav.shopByFlowerDropdown}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform" />
                </Link>
                <div className="absolute top-full start-0 hidden group-hover:block w-48 bg-white shadow-xl rounded-xl p-2 border border-ink-100 z-50">
                  <Link
                    href={locale === 'ar' ? '/ar/products?flower=roses' : '/en/products?flower=roses'}
                    className="block px-3 py-2 text-xs rounded-lg hover:bg-plum-50 hover:text-plum-800"
                  >
                    {locale === 'ar' ? 'الجوري والورد' : 'Roses'}
                  </Link>
                  <Link
                    href={locale === 'ar' ? '/ar/products?flower=lilies' : '/en/products?flower=lilies'}
                    className="block px-3 py-2 text-xs rounded-lg hover:bg-plum-50 hover:text-plum-800"
                  >
                    {locale === 'ar' ? 'الزنبق (الليلي)' : 'Lilies'}
                  </Link>
                  <Link
                    href={locale === 'ar' ? '/ar/products?flower=peonies' : '/en/products?flower=peonies'}
                    className="block px-3 py-2 text-xs rounded-lg hover:bg-plum-50 hover:text-plum-800"
                  >
                    {locale === 'ar' ? 'الفاونيا (البيوني)' : 'Peonies'}
                  </Link>
                  <Link
                    href={locale === 'ar' ? '/ar/products?flower=tulips' : '/en/products?flower=tulips'}
                    className="block px-3 py-2 text-xs rounded-lg hover:bg-plum-50 hover:text-plum-800"
                  >
                    {locale === 'ar' ? 'التوليب' : 'Tulips'}
                  </Link>
                </div>
              </div>

              <Link
                href={locale === 'ar' ? '/ar/categories/gift-hampers' : '/en/categories/gift-hampers'}
                className="hover:text-plum-800 transition-colors"
              >
                {t.nav.giftHampers}
              </Link>
              <Link
                href={locale === 'ar' ? '/ar/categories/combos' : '/en/categories/combos'}
                className="hover:text-plum-800 transition-colors"
              >
                {t.nav.combos}
              </Link>
              <Link
                href={locale === 'ar' ? '/ar/about' : '/en/about'}
                className="hover:text-plum-800 transition-colors"
              >
                {t.common.about}
              </Link>
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

                {/* Search Popover with Live Instant Suggestions */}
                {searchOpen && (
                  <div className="absolute top-full end-0 mt-3 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-ink-100 p-3 z-50 overflow-hidden">
                    <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                      <button
                        type="submit"
                        className="absolute start-2.5 p-1 text-ink-500 hover:text-plum-800 transition-colors"
                        aria-label="Search"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder={t.common.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-cream-50 border border-ink-200 rounded-full ps-9 pe-9 py-2 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-700/30 focus:border-plum-700 transition-all"
                      />
                      {isSearching ? (
                        <div className="absolute end-2.5 p-1 text-ink-400">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-plum-800" />
                        </div>
                      ) : searchQuery ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setSearchResults([]);
                          }}
                          className="absolute end-2.5 p-1 text-ink-400 hover:text-ink-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      ) : null}
                    </form>

                    {/* Live Results Dropdown */}
                    {searchQuery.trim().length >= 2 && (
                      <div className="mt-3 pt-3 border-t border-ink-100 space-y-1">
                        {searchResults.length > 0 ? (
                          <>
                            <div className="text-[10px] font-bold text-ink-400 uppercase tracking-wider px-2 mb-1">
                              {locale === 'ar' ? 'المنتجات المقترحة' : 'Suggested Products'}
                            </div>
                            <div className="max-h-64 overflow-y-auto space-y-1">
                              {searchResults.map((product) => {
                                const pName = getLocalized(product.name, product.name_ar);
                                return (
                                  <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => handleSelectProduct(product.slug)}
                                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-plum-50/80 transition-colors text-start group"
                                  >
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-cream-100 shrink-0 border border-ink-100">
                                      {product.main_image_url ? (
                                        <Image
                                          src={product.main_image_url}
                                          alt={pName}
                                          fill
                                          className="object-cover group-hover:scale-105 transition-transform"
                                        />
                                      ) : null}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-semibold text-plum-950 truncate group-hover:text-plum-800">
                                        {pName}
                                      </p>
                                      <p className="text-[11px] font-bold text-plum-800">
                                        {formatPrice(product.price)}
                                      </p>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 text-ink-400 group-hover:text-plum-800 rtl:rotate-180 transition-transform shrink-0" />
                                  </button>
                                );
                              })}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSearchSubmit()}
                              className="w-full mt-2 pt-2 border-t border-ink-100 text-center text-xs font-semibold text-plum-800 hover:text-plum-950 py-1.5 hover:bg-plum-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                            >
                              <span>
                                {locale === 'ar'
                                  ? `عرض كافة النتائج لـ "${searchQuery}"`
                                  : `View all results for "${searchQuery}"`}
                              </span>
                              <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                            </button>
                          </>
                        ) : !isSearching ? (
                          <div className="py-4 text-center">
                            <p className="text-xs text-ink-600 font-medium">
                              {locale === 'ar'
                                ? `لم يتم العثور على زهور مطابقة لـ "${searchQuery}"`
                                : `No flowers found for "${searchQuery}"`}
                            </p>
                            <button
                              type="button"
                              onClick={() => handleSearchSubmit()}
                              className="mt-2 text-xs text-plum-800 hover:underline font-semibold"
                            >
                              {locale === 'ar' ? 'البحث في المتجر بالكامل' : 'Search full catalog'}
                            </button>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Language toggle: desktop only (on mobile it lives in the drawer menu) */}
              <div className="hidden lg:block">
                <LanguageToggle />
              </div>

              {/* Shopping Cart Button */}
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
                <Link href={locale === 'ar' ? '/ar' : '/en'} className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
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
                  href={locale === 'ar' ? '/ar/products' : '/en/products'}
                  className="block text-base font-medium text-ink-900 hover:text-plum-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.nav.allProducts}
                </Link>
                <Link
                  href={locale === 'ar' ? '/ar/categories/hand-bouquets' : '/en/categories/hand-bouquets'}
                  className="block text-base font-medium text-ink-900 hover:text-plum-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.nav.handBouquets}
                </Link>
                <Link
                  href={locale === 'ar' ? '/ar/categories/flowers-in-vase' : '/en/categories/flowers-in-vase'}
                  className="block text-base font-medium text-ink-900 hover:text-plum-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.nav.flowersInVase}
                </Link>
                <Link
                  href={locale === 'ar' ? '/ar/categories/premium-collections' : '/en/categories/premium-collections'}
                  className="block text-base font-medium text-ink-900 hover:text-plum-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.nav.premiumCollections}
                </Link>
                <Link
                  href={locale === 'ar' ? '/ar/categories/gift-hampers' : '/en/categories/gift-hampers'}
                  className="block text-base font-medium text-ink-900 hover:text-plum-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.nav.giftHampers}
                </Link>
                <Link
                  href={locale === 'ar' ? '/ar/about' : '/en/about'}
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