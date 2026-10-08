'use client';

import React, { useState } from 'react';
import { Sliders, Eye, EyeOff, Save, Check, Loader2 } from 'lucide-react';
import { saveCmsConfigurationAction } from '@/app/actions/cms';

export default function AdminCMSPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cmsData, setCmsData] = useState({
    announcementText: 'Fresh Flowers Sourced Daily • Same-Day Delivery • Premium Quality • Beautifully Wrapped',
    announcementEnabled: true,
    heroTitle: 'A Little Thought\nA Big Happiness',
    heroSubtitle: 'Fresh, handcrafted bouquets to make your special moments unforgettable.',
    heroCtaText: 'Shop Flowers',
    heroCtaLink: '/products',
    heroDesktopImage: '/demo-media/hero_desktop.jpg',
    heroMobileImage: '/demo-media/hero_mobile_v2.jpg',
    showNewArrivals: true,
    showOccasions: true,
    showHandBouquets: true,
    showFlowersInVase: true,
    showBlog: true,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await saveCmsConfigurationAction(cmsData);
    setSaving(false);

    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setError(res.error || 'Failed to save CMS settings.');
    }
  };


  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-plum-900">Homepage CMS Manager</h1>
          <p className="text-xs text-ink-500 mt-1">Customize storefront sections, banners, hero content and section visibility.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center space-x-2 bg-plum-900 hover:bg-plum-800 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-md disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Saving Changes...' : saved ? 'Changes Saved!' : 'Save CMS Configuration'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Announcement Bar CMS */}
        <div className="bg-white p-6 rounded-3xl border border-ink-100 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-plum-900 border-b border-ink-100 pb-2">
            1. Announcement Bar Settings
          </h3>
          <div className="space-y-3 text-xs">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={cmsData.announcementEnabled}
                onChange={(e) => setCmsData({ ...cmsData, announcementEnabled: e.target.checked })}
                className="text-plum-800 rounded focus:ring-plum-800"
              />
              <span className="font-semibold text-plum-900">Enable Announcement Bar</span>
            </label>

            <div>
              <label className="block font-semibold text-plum-900 mb-1">Announcement Text</label>
              <input
                type="text"
                value={cmsData.announcementText}
                onChange={(e) => setCmsData({ ...cmsData, announcementText: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>
          </div>
        </div>

        {/* Hero Section CMS */}
        <div className="bg-white p-6 rounded-3xl border border-ink-100 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-plum-900 border-b border-ink-100 pb-2">
            2. Hero Section Media & Content
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-plum-900 mb-1">Main Headline</label>
              <textarea
                rows={2}
                value={cmsData.heroTitle}
                onChange={(e) => setCmsData({ ...cmsData, heroTitle: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-plum-900 mb-1">Subtitle / Body</label>
              <textarea
                rows={2}
                value={cmsData.heroSubtitle}
                onChange={(e) => setCmsData({ ...cmsData, heroSubtitle: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-plum-900 mb-1">CTA Button Text</label>
              <input
                type="text"
                value={cmsData.heroCtaText}
                onChange={(e) => setCmsData({ ...cmsData, heroCtaText: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-plum-900 mb-1">CTA Destination Link</label>
              <input
                type="text"
                value={cmsData.heroCtaLink}
                onChange={(e) => setCmsData({ ...cmsData, heroCtaLink: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-plum-900 mb-1">Desktop Background Image (Cloudinary / URL)</label>
              <input
                type="text"
                value={cmsData.heroDesktopImage}
                onChange={(e) => setCmsData({ ...cmsData, heroDesktopImage: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-plum-900 mb-1">Mobile Background Image (Portrait 9:16)</label>
              <input
                type="text"
                value={cmsData.heroMobileImage}
                onChange={(e) => setCmsData({ ...cmsData, heroMobileImage: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>
          </div>
        </div>

        {/* Section Visibility Controls */}
        <div className="bg-white p-6 rounded-3xl border border-ink-100 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-plum-900 border-b border-ink-100 pb-2">
            3. Homepage Section Visibility
          </h3>
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-ink-100 cursor-pointer">
              <span className="font-semibold text-plum-900">New Arrivals Rail</span>
              <input
                type="checkbox"
                checked={cmsData.showNewArrivals}
                onChange={(e) => setCmsData({ ...cmsData, showNewArrivals: e.target.checked })}
                className="text-plum-800 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-ink-100 cursor-pointer">
              <span className="font-semibold text-plum-900">Choose Blooms For Your Moments (Occasions)</span>
              <input
                type="checkbox"
                checked={cmsData.showOccasions}
                onChange={(e) => setCmsData({ ...cmsData, showOccasions: e.target.checked })}
                className="text-plum-800 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-ink-100 cursor-pointer">
              <span className="font-semibold text-plum-900">Hand Bouquets Rail</span>
              <input
                type="checkbox"
                checked={cmsData.showHandBouquets}
                onChange={(e) => setCmsData({ ...cmsData, showHandBouquets: e.target.checked })}
                className="text-plum-800 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-ink-100 cursor-pointer">
              <span className="font-semibold text-plum-900">Flowers in Vase Section</span>
              <input
                type="checkbox"
                checked={cmsData.showFlowersInVase}
                onChange={(e) => setCmsData({ ...cmsData, showFlowersInVase: e.target.checked })}
                className="text-plum-800 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-ink-100 cursor-pointer">
              <span className="font-semibold text-plum-900">From Our Blog Section</span>
              <input
                type="checkbox"
                checked={cmsData.showBlog}
                onChange={(e) => setCmsData({ ...cmsData, showBlog: e.target.checked })}
                className="text-plum-800 rounded"
              />
            </label>
          </div>
        </div>

      </form>
    </div>
  );
}
