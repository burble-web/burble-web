'use client';

import React, { useState } from 'react';
import { Sliders, Eye, EyeOff, Save, Check, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { saveCmsConfigurationAction } from '@/app/actions/cms';
import { translateTextAction } from '@/app/actions/translate';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';

export default function AdminCMSPage() {
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [pickerTargetField, setPickerTargetField] = useState<'desktop' | 'mobile'>('desktop');

  const [cmsData, setCmsData] = useState({
    announcementText: 'Fresh Flowers Sourced Daily • Same-Day Delivery • Premium Quality • Beautifully Wrapped',
    announcementText_ar: 'زهور طازجة يومياً • توصيل في نفس اليوم • جودة فاخرة • تغليف راقي',
    announcementEnabled: true,
    heroTitle: 'A Little Thought\nA Big Happiness',
    heroTitle_ar: 'لمسة لطيفة\nلسعادة تدوم',
    heroSubtitle: 'Fresh, handcrafted bouquets to make your special moments unforgettable.',
    heroSubtitle_ar: 'باقات زهور طبيعية منسقة يدوياً بحب لتجعل لحظاتك الخاصة في قطر لا تُنسى.',
    heroCtaText: 'Shop Flowers',
    heroCtaText_ar: 'تسوق الزهور',
    heroCtaLink: '/products',
    heroDesktopImage: '/demo-media/hero_desktop.jpg',
    heroMobileImage: '/demo-media/hero_mobile_v2.jpg',
    showNewArrivals: true,
    showOccasions: true,
    showHandBouquets: true,
    showFlowersInVase: true,
    showBlog: true,
  });

  const handleAutoTranslate = async () => {
    setTranslating(true);
    try {
      let arAnnouncement = cmsData.announcementText_ar;
      if (cmsData.announcementText) {
        const res = await translateTextAction(cmsData.announcementText, 'announcement');
        if (res.success && res.translation) arAnnouncement = res.translation;
      }

      let arTitle = cmsData.heroTitle_ar;
      if (cmsData.heroTitle) {
        const res = await translateTextAction(cmsData.heroTitle, 'homepage_heading');
        if (res.success && res.translation) arTitle = res.translation;
      }

      let arSubtitle = cmsData.heroSubtitle_ar;
      if (cmsData.heroSubtitle) {
        const res = await translateTextAction(cmsData.heroSubtitle, 'homepage_subheading');
        if (res.success && res.translation) arSubtitle = res.translation;
      }

      let arCta = cmsData.heroCtaText_ar;
      if (cmsData.heroCtaText) {
        const res = await translateTextAction(cmsData.heroCtaText, 'homepage_cta');
        if (res.success && res.translation) arCta = res.translation;
      }

      setCmsData({
        ...cmsData,
        announcementText_ar: arAnnouncement,
        heroTitle_ar: arTitle,
        heroSubtitle_ar: arSubtitle,
        heroCtaText_ar: arCta,
      });

      setFeedback('✨ Arabic CMS text automatically generated!');
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setError('Failed to translate CMS fields automatically.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setTranslating(false);
    }
  };

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

  const handleOpenPicker = (field: 'desktop' | 'mobile') => {
    setPickerTargetField(field);
    setMediaPickerOpen(true);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-plum-900">Homepage CMS Manager</h1>
          <p className="text-xs text-ink-500 mt-1">Customize bilingual storefront sections, banners, hero content and section visibility.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAutoTranslate}
            disabled={translating}
            className="inline-flex items-center gap-1.5 bg-blush-100 hover:bg-blush-200 text-plum-900 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
          >
            {translating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-gold-600" />}
            <span>{translating ? 'Translating...' : '✨ Translate CMS to Arabic'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-plum-900 hover:bg-plum-800 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-md disabled:opacity-50"
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
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">
          {feedback}
        </div>
      )}

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
          <div className="space-y-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={cmsData.announcementEnabled}
                onChange={(e) => setCmsData({ ...cmsData, announcementEnabled: e.target.checked })}
                className="text-plum-800 rounded focus:ring-plum-800"
              />
              <span className="font-semibold text-plum-900">Enable Announcement Bar</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-plum-900 mb-1">Announcement Text (English)</label>
                <input
                  type="text"
                  value={cmsData.announcementText}
                  onChange={(e) => setCmsData({ ...cmsData, announcementText: e.target.value })}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-plum-900 mb-1 font-arabic">نص الإعلان (العربية)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={cmsData.announcementText_ar || ''}
                  onChange={(e) => setCmsData({ ...cmsData, announcementText_ar: e.target.value })}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30 font-arabic"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section CMS */}
        <div className="bg-white p-6 rounded-3xl border border-ink-100 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-plum-900 border-b border-ink-100 pb-2">
            2. Hero Section Media & Content
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-plum-900 mb-1">Main Headline (English)</label>
              <textarea
                rows={2}
                value={cmsData.heroTitle}
                onChange={(e) => setCmsData({ ...cmsData, heroTitle: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-plum-900 mb-1 font-arabic">العنوان الرئيسي (العربية)</label>
              <textarea
                rows={2}
                dir="rtl"
                value={cmsData.heroTitle_ar || ''}
                onChange={(e) => setCmsData({ ...cmsData, heroTitle_ar: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30 font-arabic"
              />
            </div>

            <div>
              <label className="block font-semibold text-plum-900 mb-1">Subtitle / Body (English)</label>
              <textarea
                rows={2}
                value={cmsData.heroSubtitle}
                onChange={(e) => setCmsData({ ...cmsData, heroSubtitle: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-plum-900 mb-1 font-arabic">العنوان الفرعي (العربية)</label>
              <textarea
                rows={2}
                dir="rtl"
                value={cmsData.heroSubtitle_ar || ''}
                onChange={(e) => setCmsData({ ...cmsData, heroSubtitle_ar: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30 font-arabic"
              />
            </div>

            <div>
              <label className="block font-semibold text-plum-900 mb-1">CTA Button Text (English)</label>
              <input
                type="text"
                value={cmsData.heroCtaText}
                onChange={(e) => setCmsData({ ...cmsData, heroCtaText: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-plum-900 mb-1 font-arabic">نص زر الإجراء (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={cmsData.heroCtaText_ar || ''}
                onChange={(e) => setCmsData({ ...cmsData, heroCtaText_ar: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30 font-arabic"
              />
            </div>

            <div className="sm:col-span-2">
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
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cmsData.heroDesktopImage}
                  onChange={(e) => setCmsData({ ...cmsData, heroDesktopImage: e.target.value })}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
                />
                <button
                  type="button"
                  onClick={() => handleOpenPicker('desktop')}
                  className="bg-plum-100 hover:bg-plum-200 text-plum-900 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Choose</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-plum-900 mb-1">Mobile Background Image (Portrait 9:16)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cmsData.heroMobileImage}
                  onChange={(e) => setCmsData({ ...cmsData, heroMobileImage: e.target.value })}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
                />
                <button
                  type="button"
                  onClick={() => handleOpenPicker('mobile')}
                  className="bg-plum-100 hover:bg-plum-200 text-plum-900 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Choose</span>
                </button>
              </div>
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
              <span className="font-semibold text-plum-900">New Arrivals Rail (وصل حديثاً)</span>
              <input
                type="checkbox"
                checked={cmsData.showNewArrivals}
                onChange={(e) => setCmsData({ ...cmsData, showNewArrivals: e.target.checked })}
                className="text-plum-800 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-ink-100 cursor-pointer">
              <span className="font-semibold text-plum-900">Choose Blooms For Your Moments / Occasions (تسوق حسب المناسبة)</span>
              <input
                type="checkbox"
                checked={cmsData.showOccasions}
                onChange={(e) => setCmsData({ ...cmsData, showOccasions: e.target.checked })}
                className="text-plum-800 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-ink-100 cursor-pointer">
              <span className="font-semibold text-plum-900">Hand Bouquets Rail (باقات اليد)</span>
              <input
                type="checkbox"
                checked={cmsData.showHandBouquets}
                onChange={(e) => setCmsData({ ...cmsData, showHandBouquets: e.target.checked })}
                className="text-plum-800 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-ink-100 cursor-pointer">
              <span className="font-semibold text-plum-900">Flowers in Vase Section (زهور في فازة)</span>
              <input
                type="checkbox"
                checked={cmsData.showFlowersInVase}
                onChange={(e) => setCmsData({ ...cmsData, showFlowersInVase: e.target.checked })}
                className="text-plum-800 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-ink-100 cursor-pointer">
              <span className="font-semibold text-plum-900">From Our Blog Section (من مدونتنا)</span>
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

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          if (pickerTargetField === 'desktop') {
            setCmsData({ ...cmsData, heroDesktopImage: url });
          } else {
            setCmsData({ ...cmsData, heroMobileImage: url });
          }
        }}
        title={`Select ${pickerTargetField === 'desktop' ? 'Desktop' : 'Mobile'} Hero Image`}
      />
    </div>
  );
}

