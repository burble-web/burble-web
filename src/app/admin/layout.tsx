'use client';

import React, { useState } from 'react';
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

const ADMIN_NAV_KEYS = [
  { key: 'dashboard', name: 'Dashboard', nameAr: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard },
  { key: 'products', name: 'Products', nameAr: 'المنتجات', href: '/admin/products', icon: Package },
  { key: 'categories', name: 'Categories', nameAr: 'الفئات', href: '/admin/categories', icon: FolderTree },
  { key: 'collections', name: 'Collections', nameAr: 'المجموعات والمناسبات', href: '/admin/collections', icon: Layers },
  { key: 'blog', name: 'Blog Posts', nameAr: 'المقالات والمدونة', href: '/admin/blog', icon: BookOpen },
  { key: 'cms', name: 'Homepage CMS', nameAr: 'إدارة الواجهة CMS', href: '/admin/cms', icon: Sliders },
  { key: 'orders', name: 'Orders', nameAr: 'الطلبات', href: '/admin/orders', icon: ShoppingBag },
  { key: 'media', name: 'Media Library', nameAr: 'مكتبة الوسائط', href: '/admin/media', icon: ImageIcon },
  { key: 'settings', name: 'Store Settings', nameAr: 'إعدادات المتجر', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { locale, direction, t } = useLocale();

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = '/admin/login';
    } catch (e) {
      window.location.href = '/admin/login';
    }
  };

  const isAr = locale === 'ar';

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col lg:flex-row font-sans text-ink-900" dir={direction}>
      
      {/* Mobile Top Navbar */}
      <div className="lg:hidden bg-plum-950 text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1 text-plum-200 hover:text-white"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Flower className="w-5 h-5 text-blush-200" />
          <span className="font-serif text-xl font-bold">Burble Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle variant="minimal" />
          <Link href="/" target="_blank" className="text-xs text-blush-200 flex items-center gap-1">
            <span>{isAr ? 'الموقع' : 'Site'}</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Desktop Sidebar / Mobile Overlay Drawer */}
      <aside
        className={`fixed inset-y-0 start-0 z-50 w-64 bg-plum-950 text-plum-100 flex flex-col justify-between p-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : direction === 'rtl' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header Logo */}
          <div className="flex items-center justify-between pb-6 border-b border-plum-800">
            <Link href="/admin" className="flex items-center gap-2">
              <Flower className="w-6 h-6 text-blush-200" />
              <span className="font-serif text-2xl font-bold tracking-tight text-white">BURBLE</span>
            </Link>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-plum-300 hover:text-white"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5" aria-label="Admin Navigation">
            {ADMIN_NAV_KEYS.map((item) => {
              const IconComp = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300 ${
                    isActive
                      ? 'bg-plum-800 text-white font-bold shadow-xs border border-plum-700/60'
                      : 'text-plum-100/90 hover:text-white hover:bg-plum-900/90 font-medium'
                  }`}
                >
                  <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blush-200'}`} />
                  <span>{isAr ? item.nameAr : item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-plum-800 space-y-3">
          <div className="px-2 py-1 flex items-center justify-between">
            <span className="text-xs text-plum-200 font-semibold">{isAr ? 'اللغة' : 'Language'}:</span>
            <LanguageToggle variant="pill" />
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-plum-900/80 hover:bg-plum-900 text-blush-200 hover:text-white transition-colors border border-plum-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300"
          >
            <span>{isAr ? 'زيارة المتجر' : 'Visit Storefront'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-200 hover:bg-rose-950/60 hover:text-rose-100 transition-colors border border-rose-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <LogOut className="w-4 h-4" />
            <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Body */}
      <div className="flex-1 min-w-0 p-4 sm:p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

