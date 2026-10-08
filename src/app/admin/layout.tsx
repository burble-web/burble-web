'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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

const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Collections', href: '/admin/collections', icon: Layers },
  { name: 'Blog Posts', href: '/admin/blog', icon: BookOpen },
  { name: 'Homepage CMS', href: '/admin/cms', icon: Sliders },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { name: 'Store Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const router = useRouter ? useRouter() : null;

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = '/admin/login';
    } catch (e) {
      window.location.href = '/admin/login';
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col lg:flex-row font-sans text-ink-900">
      
      {/* Mobile Top Navbar */}
      <div className="lg:hidden bg-plum-950 text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1 text-plum-200 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Flower className="w-5 h-5 text-blush-200" />
          <span className="font-serif text-xl font-bold">Burble Admin</span>
        </div>
        <Link href="/" target="_blank" className="text-xs text-blush-200 flex items-center space-x-1">
          <span>View Site</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Desktop Sidebar / Mobile Overlay Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-plum-950 text-plum-100 flex flex-col justify-between p-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Logo */}
          <div className="flex items-center justify-between pb-6 border-b border-plum-800">
            <Link href="/admin" className="flex items-center space-x-2">
              <Flower className="w-6 h-6 text-blush-200" />
              <span className="font-serif text-2xl font-bold tracking-tight text-white">BURBLE</span>
            </Link>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-plum-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {ADMIN_NAV.map((item) => {
              const IconComp = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-plum-800 text-plum-200 hover:text-white transition-colors"
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-plum-800 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium bg-plum-900/60 hover:bg-plum-900 text-blush-200 transition-colors"
          >
            <span>Visit Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
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
