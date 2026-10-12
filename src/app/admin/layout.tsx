'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Sliders,
  ShoppingBag,
  Settings,
  Image as ImageIcon,
  Flower,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Layers,
  BookOpen,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLocale } from '@/lib/i18n/context';
import { LanguageToggle } from '@/components/storefront/LanguageToggle';

const ADMIN_NAV_ITEMS = [
  { key: 'dashboard', name: 'Dashboard', nameAr: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard },
  { key: 'orders', name: 'Orders', nameAr: 'الطلبات', href: '/admin/orders', icon: ShoppingBag },
  { key: 'products', name: 'Products', nameAr: 'المنتجات', href: '/admin/products', icon: Package },
  { key: 'categories', name: 'Categories', nameAr: 'الفئات والتصنيفات', href: '/admin/categories', icon: FolderTree },
  { key: 'collections', name: 'Collections', nameAr: 'المجموعات والمناسبات', href: '/admin/collections', icon: Layers },
  { key: 'blog', name: 'Blog Posts', nameAr: 'المقالات والمدونة', href: '/admin/blog', icon: BookOpen },
  { key: 'cms', name: 'Homepage CMS', nameAr: 'إدارة الواجهة CMS', href: '/admin/cms', icon: Sliders },
  { key: 'media', name: 'Media Library', nameAr: 'مكتبة الوسائط', href: '/admin/media', icon: ImageIcon },
  { key: 'settings', name: 'Store Settings', nameAr: 'إعدادات المتجر', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { locale, direction, t } = useLocale();
  const isAr = locale === 'ar';

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = '/admin/login';
    } catch (e) {
      window.location.href = '/admin/login';
    }
  };

  // If on login page, don't render admin shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col lg:flex-row font-sans text-ink-900" dir={direction}>
      
      {/* Mobile Top App Bar */}
      <header className="lg:hidden bg-white border-b border-ink-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-xl text-ink-800 hover:text-plum-950 hover:bg-cream-100 transition-colors focus:outline-none focus:ring-2 focus:ring-plum-800"
            aria-label={isAr ? 'فتح القائمة الجانبية' : 'Open menu'}
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-plum-900 text-white flex items-center justify-center shadow-xs">
              <Flower className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-plum-950">BURBLE</span>
              <span className="text-[10px] text-ink-500 font-medium block -mt-1">{isAr ? 'لوحة الإدارة' : 'Admin'}</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle variant="minimal" />
          <Link
            href="/"
            target="_blank"
            className="p-2 text-ink-600 hover:text-plum-900 rounded-xl hover:bg-cream-100 transition-colors"
            title={isAr ? 'معاينة المتجر' : 'Visit Storefront'}
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-plum-950/60 backdrop-blur-2xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar (Desktop fixed/sticky, Mobile Slide-in Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 start-0 z-50 w-72 bg-white border-e border-ink-200 flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileSidebarOpen
            ? 'translate-x-0 shadow-2xl'
            : direction === 'rtl'
            ? 'translate-x-full lg:translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label={isAr ? 'القائمة الجانبية للإدارة' : 'Admin Sidebar'}
      >
        <div className="flex-1 overflow-y-auto no-scrollbar -mx-2 px-2">
          {/* Header Logo */}
          <div className="flex items-center justify-between pb-5 border-b border-ink-200">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-plum-900 text-white flex items-center justify-center shadow-xs">
                <Flower className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-plum-950 block leading-tight">BURBLE</span>
                <span className="text-[11px] font-semibold text-plum-800 tracking-wide uppercase block">
                  {isAr ? 'لوحة إدارة المتجر' : 'Store Management'}
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl text-ink-500 hover:text-ink-900 hover:bg-cream-100 transition-colors"
              aria-label={isAr ? 'إغلاق القائمة' : 'Close menu'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5" aria-label="Admin Navigation">
            {ADMIN_NAV_ITEMS.map((item) => {
              const IconComp = item.icon;
              const isActive = item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum-800 ${
                    isActive
                      ? 'bg-plum-900 text-white font-bold shadow-xs'
                      : 'text-ink-800 hover:text-plum-950 hover:bg-cream-200/80 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-plum-800'}`} />
                    <span className="truncate">{isAr ? item.nameAr : item.name}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-5 border-t border-ink-200 space-y-2.5 shrink-0 bg-white">
          <div className="px-1 py-1 flex items-center justify-between">
            <span className="text-xs text-ink-700 font-bold">{isAr ? 'اللغة' : 'Language'}:</span>
            <LanguageToggle variant="minimal" />
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-plum-950 bg-cream-100 hover:bg-cream-200 transition-colors border border-ink-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum-800"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-plum-800" />
              <span>{isAr ? 'زيارة المتجر' : 'Visit Storefront'}</span>
            </div>
            <span className="text-[10px] text-ink-500 font-mono">/</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-700" />
            <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}


