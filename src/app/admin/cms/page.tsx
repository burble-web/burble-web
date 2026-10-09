'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Save, Check, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { saveCmsConfigurationAction, getAdminCmsConfigurationAction } from '@/app/actions/cms';
import { translateTextAction } from '@/app/actions/translate';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';

export default function AdminCMSPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [pickerTargetField, setPickerTargetField] = useState<'desktop' | 'mobile'>('desktop');

  const [cmsData, setCmsData] = useState({
    announcementText: '',
    announcementText_ar: '',
    announcementEnabled: true,
    heroTitle: '',
    heroTitle_ar: '',
    heroSubtitle: '',
    heroSubtitle_ar: '',
    heroCtaText: 'Shop Flowers',
    heroCtaText_ar: 'تسوق الزهور',
    heroCtaLink: '/products',
    heroDesktopImage: '',
    heroMobileImage: '',
    showNewArrivals: true,
    showOccasions: true,
    showHandBouquets: true,
    showFlowersInVase: true,
    showBlog: true,
  });

  useEffect(() => {
    async function loadCmsContent() {
      setLoading(true);
      try {
        const res = await getAdminCmsConfigurationAction();
        const settings = res.settings;
        const sections = res.sections || [];

        const hero = sections.find((s: any) => s.section_key === 'hero_banner');
        const heroContent = hero?.content_json || {};

        const isMetaTitle = (str?: string | null) => !str || ['Main Hero Slider', 'Hero Section', 'Hero Banner', 'واجهة البانر الرئيسي'].includes(str);
        const isMetaSubtitle = (str?: string | null) => !str || ['Homepage top visual hero slides', 'Hero Subtitle', 'شرائح العرض البصري الرئيسية'].includes(str);

        const loadedHeroTitle = heroContent.heading || (!isMetaTitle(hero?.title) ? hero?.title : 'Handcrafted Floral Arrangements');
        const loadedHeroTitleAr = heroContent.heading_ar || (!isMetaTitle(hero?.title_ar) ? hero?.title_ar : 'تنسيقات زهور طبيعية منسقة يدوياً');
        const loadedHeroSubtitle = heroContent.subheading || (!isMetaSubtitle(hero?.subtitle) ? hero?.subtitle : "Sourced daily for life's most memorable moments");
        const loadedHeroSubtitleAr = heroContent.subheading_ar || (!isMetaSubtitle(hero?.subtitle_ar) ? hero?.subtitle_ar : 'مستوردة يومياً لتخليد أجمل لحظات العمر');

        setCmsData({
          announcementText: settings?.announcement_text || 'Fresh Flowers Sourced Daily • Same-Day Delivery • Premium Quality • Beautifully Wrapped',
          announcementText_ar: settings?.announcement_text_ar || 'زهور نضرة يتم استيرادها يومياً • توصيل في نفس اليوم • جودة فاخرة • تغليف راقٍ ومميز',
          announcementEnabled: settings?.announcement_enabled ?? true,
          heroTitle: loadedHeroTitle,
          heroTitle_ar: loadedHeroTitleAr,
          heroSubtitle: loadedHeroSubtitle,
          heroSubtitle_ar: loadedHeroSubtitleAr,
          heroCtaText: heroContent.cta_text || 'Shop Flowers',
          heroCtaText_ar: heroContent.cta_text_ar || 'تسوق الزهور',
          heroCtaLink: heroContent.cta_link || '/products',
          heroDesktopImage: heroContent.desktop_image || '',
          heroMobileImage: heroContent.mobile_image || '',
          showNewArrivals: sections.find((s: any) => s.section_key === 'new_arrivals')?.is_visible ?? true,
          showOccasions: sections.find((s: any) => s.section_key === 'occasions')?.is_visible ?? true,
          showHandBouquets: sections.find((s: any) => s.section_key === 'hand_bouquets')?.is_visible ?? true,
          showFlowersInVase: sections.find((s: any) => s.section_key === 'flowers_in_vase')?.is_visible ?? true,
          showBlog: sections.find((s: any) => s.section_key === 'blog')?.is_visible ?? true,
        });
      } catch (err) {
        console.error('Failed to load CMS content from database', err);
      } finally {
        setLoading(false);
      }
    }

    loadCmsContent();
  }, []);

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

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-plum-800 mb-2" />
        <span className="text-xs text-ink-500">Loading CMS configuration from database...</span>
      </div>
    );
  }

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

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* 1. Announcement Bar Settings */}
        <div className="bg-white p-6 rounded-3xl border border-ink-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ink-100">
            <div>
              <h3 className="font-serif text-lg font-bold text-plum-900">Announcement Bar</h3>
              <p className="text-xs text-ink-500">Top sticky promotional ribbon</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={cmsData.announcementEnabled}
                onChange={(e) => setCmsData({ ...cmsData, announcementEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-ink-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-ink-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-plum-900"></div>
              <span className="ms-3 text-xs font-semibold text-ink-700">
                {cmsData.announcementEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-plum-900 mb-1">
                Announcement Text (English)
              </label>
              <input
                type="text"
                value={cmsData.announcementText}
                onChange={(e) => setCmsData({ ...cmsData, announcementText: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-plum-900 mb-1">
                Announcement Text (العربية)
              </label>
              <input
                type="text"
                dir="rtl"
                value={cmsData.announcementText_ar}
                onChange={(e) => setCmsData({ ...cmsData, announcementText_ar: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>
          </div>
        </div>

        {/* 2. Hero Section Settings */}
        <div className="bg-white p-6 rounded-3xl border border-ink-100 shadow-xs space-y-4">
          <div className="pb-3 border-b border-ink-100">
            <h3 className="font-serif text-lg font-bold text-plum-900">Hero Main Banner</h3>
            <p className="text-xs text-ink-500">Above-the-fold full-width storefront hero</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-plum-900 mb-1">Hero Title (English)</label>
              <textarea
                rows={2}
                value={cmsData.heroTitle}
                onChange={(e) => setCmsData({ ...cmsData, heroTitle: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-plum-900 mb-1">Hero Title (العربية)</label>
              <textarea
                rows={2}
                dir="rtl"
                value={cmsData.heroTitle_ar}
                onChange={(e) => setCmsData({ ...cmsData, heroTitle_ar: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-plum-900 mb-1">Hero Subtitle (English)</label>
              <textarea
                rows={2}
                value={cmsData.heroSubtitle}
                onChange={(e) => setCmsData({ ...cmsData, heroSubtitle: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-plum-900 mb-1">Hero Subtitle (العربية)</label>
              <textarea
                rows={2}
                dir="rtl"
                value={cmsData.heroSubtitle_ar}
                onChange={(e) => setCmsData({ ...cmsData, heroSubtitle_ar: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-plum-900 mb-1">CTA Button Text (English)</label>
              <input
                type="text"
                value={cmsData.heroCtaText}
                onChange={(e) => setCmsData({ ...cmsData, heroCtaText: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-plum-900 mb-1">CTA Button Text (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={cmsData.heroCtaText_ar}
                onChange={(e) => setCmsData({ ...cmsData, heroCtaText_ar: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-plum-900 mb-1">CTA Link Destination</label>
              <input
                type="text"
                value={cmsData.heroCtaLink}
                onChange={(e) => setCmsData({ ...cmsData, heroCtaLink: e.target.value })}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>
          </div>

          {/* Hero Images Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-plum-900 mb-1">Desktop Hero Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://res.cloudinary.com/..."
                  value={cmsData.heroDesktopImage}
                  onChange={(e) => setCmsData({ ...cmsData, heroDesktopImage: e.target.value })}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-3 py-2 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
                />
                <button
                  type="button"
                  onClick={() => handleOpenPicker('desktop')}
                  className="bg-cream-200 hover:bg-cream-300 text-plum-900 p-2 rounded-xl text-xs flex items-center gap-1 font-semibold shrink-0"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-plum-900 mb-1">Mobile Hero Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://res.cloudinary.com/..."
                  value={cmsData.heroMobileImage}
                  onChange={(e) => setCmsData({ ...cmsData, heroMobileImage: e.target.value })}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-3 py-2 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
                />
                <button
                  type="button"
                  onClick={() => handleOpenPicker('mobile')}
                  className="bg-cream-200 hover:bg-cream-300 text-plum-900 p-2 rounded-xl text-xs flex items-center gap-1 font-semibold shrink-0"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Homepage Section Visibility Toggles */}
        <div className="bg-white p-6 rounded-3xl border border-ink-100 shadow-xs space-y-4">
          <div className="pb-3 border-b border-ink-100">
            <h3 className="font-serif text-lg font-bold text-plum-900">Section Visibility Control</h3>
            <p className="text-xs text-ink-500">Enable or disable specific sections on the storefront homepage</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-ink-100 bg-cream-50/50 cursor-pointer hover:bg-cream-100 transition-colors">
              <span className="text-xs font-semibold text-plum-900">New Arrivals Rail</span>
              <input
                type="checkbox"
                checked={cmsData.showNewArrivals}
                onChange={(e) => setCmsData({ ...cmsData, showNewArrivals: e.target.checked })}
                className="w-4 h-4 accent-plum-900 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-ink-100 bg-cream-50/50 cursor-pointer hover:bg-cream-100 transition-colors">
              <span className="text-xs font-semibold text-plum-900">Shop by Occasion</span>
              <input
                type="checkbox"
                checked={cmsData.showOccasions}
                onChange={(e) => setCmsData({ ...cmsData, showOccasions: e.target.checked })}
                className="w-4 h-4 accent-plum-900 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-ink-100 bg-cream-50/50 cursor-pointer hover:bg-cream-100 transition-colors">
              <span className="text-xs font-semibold text-plum-900">Hand Bouquets Rail</span>
              <input
                type="checkbox"
                checked={cmsData.showHandBouquets}
                onChange={(e) => setCmsData({ ...cmsData, showHandBouquets: e.target.checked })}
                className="w-4 h-4 accent-plum-900 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-ink-100 bg-cream-50/50 cursor-pointer hover:bg-cream-100 transition-colors">
              <span className="text-xs font-semibold text-plum-900">Flowers in Vase Grid</span>
              <input
                type="checkbox"
                checked={cmsData.showFlowersInVase}
                onChange={(e) => setCmsData({ ...cmsData, showFlowersInVase: e.target.checked })}
                className="w-4 h-4 accent-plum-900 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-ink-100 bg-cream-50/50 cursor-pointer hover:bg-cream-100 transition-colors">
              <span className="text-xs font-semibold text-plum-900">From Our Blog</span>
              <input
                type="checkbox"
                checked={cmsData.showBlog}
                onChange={(e) => setCmsData({ ...cmsData, showBlog: e.target.checked })}
                className="w-4 h-4 accent-plum-900 rounded"
              />
            </label>
          </div>
        </div>

      </form>

      {/* Media Picker Modal */}
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
      />
    </div>
  );
}
