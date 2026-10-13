'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Save, Check, Loader2, Image as ImageIcon, Sparkles, Upload, Video, Film } from 'lucide-react';
import { saveCmsConfigurationAction, getAdminCmsConfigurationAction } from '@/app/actions/cms';
import { translateTextAction } from '@/app/actions/translate';
import { uploadMediaAssetAction, getCloudinaryUploadSignatureAction, registerMediaAssetAction } from '@/app/actions/media';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';

export default function AdminCMSPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);

  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<
    | { type: 'videoDesktop' }
    | { type: 'videoMobile' }
    | { type: 'slideDesktop'; index: number }
    | { type: 'slideMobile'; index: number }
    | { type: 'promoGiftHampers' }
    | { type: 'promoCombos' }
    | { type: 'promoDiyFlowers' }
  >({ type: 'slideDesktop', index: 0 });

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
    heroMediaType: 'images' as 'images' | 'video',
    heroVideoUrl: '',
    heroVideoMobileUrl: '',
    heroSlides: [
      {
        desktopImage: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455269/burble/hero_desktop.jpg',
        mobileImage: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455274/burble/hero_mobile.jpg',
      },
      {
        desktopImage: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455271/burble/hero_slide_two.jpg',
        mobileImage: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455275/burble/hero_mobile_v2.jpg',
      },
      {
        desktopImage: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455268/burble/premium_banner.jpg',
        mobileImage: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455274/burble/hero_mobile.jpg',
      },
    ],
    showNewArrivals: true,
    showOccasions: true,
    showHandBouquets: true,
    showFlowersInVase: true,
    showBlog: true,
    promoGiftHampersImage: '',
    promoCombosImage: '',
    promoDiyFlowersImage: '',
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

        const loadedMediaType = heroContent.media_type || (heroContent.video_url ? 'video' : 'images');
        const loadedVideoUrl = heroContent.video_url || '';
        const loadedVideoMobileUrl = heroContent.video_mobile_url || loadedVideoUrl;

        const defaultSlides = [
          {
            desktopImage: heroContent.desktop_image || 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455269/burble/hero_desktop.jpg',
            mobileImage: heroContent.mobile_image || 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455274/burble/hero_mobile.jpg',
          },
          {
            desktopImage: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455271/burble/hero_slide_two.jpg',
            mobileImage: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455275/burble/hero_mobile_v2.jpg',
          },
          {
            desktopImage: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455268/burble/premium_banner.jpg',
            mobileImage: 'https://res.cloudinary.com/ivsez8nl/image/upload/v1791455274/burble/hero_mobile.jpg',
          },
        ];

        let loadedSlides = defaultSlides;
        if (Array.isArray(heroContent.slides) && heroContent.slides.length > 0) {
          loadedSlides = heroContent.slides.map((s: any, idx: number) => ({
            desktopImage: s.desktop_image || s.desktopImage || defaultSlides[idx]?.desktopImage || '',
            mobileImage: s.mobile_image || s.mobileImage || defaultSlides[idx]?.mobileImage || '',
          }));
          while (loadedSlides.length < 3) {
            loadedSlides.push(defaultSlides[loadedSlides.length] || { desktopImage: '', mobileImage: '' });
          }
        }

        const promo = sections.find((s: any) => s.section_key === 'promo_cards');
        const promoContent = promo?.content_json || {};
        const categories = res.categories || [];
        const giftCat = categories.find((c: any) => c.slug === 'gift-hampers');
        const combosCat = categories.find((c: any) => c.slug === 'combos');
        const diyCat = categories.find((c: any) => c.slug === 'diy-flowers');

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
          heroDesktopImage: heroContent.desktop_image || loadedSlides[0].desktopImage,
          heroMobileImage: heroContent.mobile_image || loadedSlides[0].mobileImage,
          heroMediaType: loadedMediaType,
          heroVideoUrl: loadedVideoUrl,
          heroVideoMobileUrl: loadedVideoMobileUrl,
          heroSlides: loadedSlides.slice(0, 3),
          showNewArrivals: sections.find((s: any) => s.section_key === 'new_arrivals')?.is_visible ?? true,
          showOccasions: sections.find((s: any) => s.section_key === 'occasions')?.is_visible ?? true,
          showHandBouquets: sections.find((s: any) => s.section_key === 'hand_bouquets')?.is_visible ?? true,
          showFlowersInVase: sections.find((s: any) => s.section_key === 'flowers_in_vase')?.is_visible ?? true,
          showBlog: sections.find((s: any) => s.section_key === 'blog')?.is_visible ?? true,
          promoGiftHampersImage: promoContent.gift_hampers_image || giftCat?.image_url || '',
          promoCombosImage: promoContent.combos_image || combosCat?.image_url || '',
          promoDiyFlowersImage: promoContent.diy_flowers_image || diyCat?.image_url || '',
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

  const applyMediaUrl = (
    target:
      | { type: 'videoDesktop' }
      | { type: 'videoMobile' }
      | { type: 'slideDesktop'; index: number }
      | { type: 'slideMobile'; index: number }
      | { type: 'promoGiftHampers' }
      | { type: 'promoCombos' }
      | { type: 'promoDiyFlowers' },
    url: string
  ) => {
    if (target.type === 'videoDesktop') {
      setCmsData((prev) => ({ ...prev, heroVideoUrl: url }));
    } else if (target.type === 'videoMobile') {
      setCmsData((prev) => ({ ...prev, heroVideoMobileUrl: url }));
    } else if (target.type === 'promoGiftHampers') {
      setCmsData((prev) => ({ ...prev, promoGiftHampersImage: url }));
    } else if (target.type === 'promoCombos') {
      setCmsData((prev) => ({ ...prev, promoCombosImage: url }));
    } else if (target.type === 'promoDiyFlowers') {
      setCmsData((prev) => ({ ...prev, promoDiyFlowersImage: url }));
    } else if (target.type === 'slideDesktop') {
      setCmsData((prev) => {
        const nextSlides = [...prev.heroSlides];
        nextSlides[target.index] = {
          ...nextSlides[target.index],
          desktopImage: url,
        };
        return {
          ...prev,
          heroSlides: nextSlides,
          heroDesktopImage: target.index === 0 ? url : prev.heroDesktopImage,
        };
      });
    } else if (target.type === 'slideMobile') {
      setCmsData((prev) => {
        const nextSlides = [...prev.heroSlides];
        nextSlides[target.index] = {
          ...nextSlides[target.index],
          mobileImage: url,
        };
        return {
          ...prev,
          heroSlides: nextSlides,
          heroMobileImage: target.index === 0 ? url : prev.heroMobileImage,
        };
      });
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target:
      | { type: 'videoDesktop' }
      | { type: 'videoMobile' }
      | { type: 'slideDesktop'; index: number }
      | { type: 'slideMobile'; index: number }
      | { type: 'promoGiftHampers' }
      | { type: 'promoCombos' }
      | { type: 'promoDiyFlowers' }
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetKey = target.type + ('index' in target ? `_${target.index}` : '');
    setUploadingTarget(targetKey);
    setError(null);

    try {
      let uploadedUrl = '';

      // 1. First attempt: Direct stream to Cloudinary via signed payload (handles large video files up to 100MB)
      try {
        const sigRes = await getCloudinaryUploadSignatureAction('burble');
        if (sigRes.success && sigRes.signature && sigRes.cloudName && sigRes.apiKey) {
          const cldFormData = new FormData();
          cldFormData.append('file', file);
          cldFormData.append('api_key', sigRes.apiKey);
          cldFormData.append('timestamp', sigRes.timestamp!.toString());
          cldFormData.append('signature', sigRes.signature);
          cldFormData.append('folder', sigRes.folder || 'burble');
          if (sigRes.publicId) cldFormData.append('public_id', sigRes.publicId);

          const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
          const uploadRes = await fetch(
            `https://api.cloudinary.com/v1_1/${sigRes.cloudName}/${resourceType}/upload`,
            {
              method: 'POST',
              body: cldFormData,
            }
          );

          const cldData = await uploadRes.json();
          if (uploadRes.ok && cldData.secure_url) {
            uploadedUrl = cldData.secure_url;
            registerMediaAssetAction({
              public_id: cldData.public_id,
              url: cldData.secure_url,
              format: cldData.format,
              folder: sigRes.folder || 'burble',
              alt_text: file.name,
            }).catch(() => {});
          } else if (cldData?.error?.message) {
            console.warn('[Direct Upload Cloudinary Notice]', cldData.error.message);
          }
        }
      } catch (directErr) {
        console.warn('[Direct Upload Network Exception, falling back]', directErr);
      }

      // 2. Second attempt / Fallback: Server Action multipart upload
      if (!uploadedUrl) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await uploadMediaAssetAction(formData);
        if (res.success && res.asset?.url) {
          uploadedUrl = res.asset.url;
        } else {
          throw new Error(res.error || 'Failed to upload video to Cloudinary.');
        }
      }

      applyMediaUrl(target, uploadedUrl);

      // Auto-save promo card image upload immediately to live storefront
      if (['promoGiftHampers', 'promoCombos', 'promoDiyFlowers'].includes(target.type)) {
        const nextCms = {
          ...cmsData,
          promoGiftHampersImage: target.type === 'promoGiftHampers' ? uploadedUrl : cmsData.promoGiftHampersImage,
          promoCombosImage: target.type === 'promoCombos' ? uploadedUrl : cmsData.promoCombosImage,
          promoDiyFlowersImage: target.type === 'promoDiyFlowers' ? uploadedUrl : cmsData.promoDiyFlowersImage,
        };
        await saveCmsConfigurationAction(nextCms);
        setFeedback('✨ Promotional card image uploaded and saved live to storefront!');
      } else {
        setFeedback('✨ Media uploaded successfully!');
      }
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setError(err?.message || 'Upload failed. Please check file format and try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setUploadingTarget(null);
      e.target.value = '';
    }
  };

  const handleOpenPicker = (
    target:
      | { type: 'videoDesktop' }
      | { type: 'videoMobile' }
      | { type: 'slideDesktop'; index: number }
      | { type: 'slideMobile'; index: number }
      | { type: 'promoGiftHampers' }
      | { type: 'promoCombos' }
      | { type: 'promoDiyFlowers' }
  ) => {
    setPickerTarget(target);
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
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ink-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-ink-200">
            <div>
              <h3 className="font-serif text-lg font-bold text-plum-950">Announcement Bar</h3>
              <p className="text-xs text-ink-500 mt-0.5">Top sticky promotional ribbon displayed across the storefront.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={cmsData.announcementEnabled}
                onChange={(e) => setCmsData({ ...cmsData, announcementEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-ink-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-ink-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-plum-900"></div>
              <span className="ms-3 text-xs font-semibold text-plum-950">
                {cmsData.announcementEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-plum-950 mb-1.5">
                Announcement Text (English)
              </label>
              <input
                type="text"
                value={cmsData.announcementText}
                onChange={(e) => setCmsData({ ...cmsData, announcementText: e.target.value })}
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-plum-950 mb-1.5 font-arabic">
                Announcement Text (العربية)
              </label>
              <input
                type="text"
                dir="rtl"
                value={cmsData.announcementText_ar}
                onChange={(e) => setCmsData({ ...cmsData, announcementText_ar: e.target.value })}
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all font-arabic"
              />
            </div>
          </div>
        </div>

        {/* 2. Hero Section Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ink-200/80 shadow-2xs space-y-5">
          <div className="pb-4 border-b border-ink-200">
            <h3 className="font-serif text-lg font-bold text-plum-950">Hero Main Banner</h3>
            <p className="text-xs text-ink-500 mt-0.5">Above-the-fold full-width storefront hero showcase.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-plum-950 mb-1.5">Hero Title (English)</label>
              <textarea
                rows={2}
                value={cmsData.heroTitle}
                onChange={(e) => setCmsData({ ...cmsData, heroTitle: e.target.value })}
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-plum-950 mb-1.5 font-arabic">Hero Title (العربية)</label>
              <textarea
                rows={2}
                dir="rtl"
                value={cmsData.heroTitle_ar}
                onChange={(e) => setCmsData({ ...cmsData, heroTitle_ar: e.target.value })}
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all font-arabic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-plum-950 mb-1.5">Hero Subtitle (English)</label>
              <textarea
                rows={2}
                value={cmsData.heroSubtitle}
                onChange={(e) => setCmsData({ ...cmsData, heroSubtitle: e.target.value })}
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-plum-950 mb-1.5 font-arabic">Hero Subtitle (العربية)</label>
              <textarea
                rows={2}
                dir="rtl"
                value={cmsData.heroSubtitle_ar}
                onChange={(e) => setCmsData({ ...cmsData, heroSubtitle_ar: e.target.value })}
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all font-arabic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-plum-950 mb-1.5">CTA Button Text (English)</label>
              <input
                type="text"
                value={cmsData.heroCtaText}
                onChange={(e) => setCmsData({ ...cmsData, heroCtaText: e.target.value })}
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-plum-950 mb-1.5 font-arabic">CTA Button Text (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={cmsData.heroCtaText_ar}
                onChange={(e) => setCmsData({ ...cmsData, heroCtaText_ar: e.target.value })}
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all font-arabic"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-plum-950 mb-1.5">CTA Link Destination</label>
              <input
                type="text"
                value={cmsData.heroCtaLink}
                onChange={(e) => setCmsData({ ...cmsData, heroCtaLink: e.target.value })}
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
              />
            </div>
          </div>

          {/* Hero Media Type Selector & Upload Controls */}
          <div className="pt-4 border-t border-ink-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-cream-50/70 p-4 rounded-2xl border border-ink-200">
              <div>
                <span className="text-xs font-bold text-plum-950 block">Hero Media Format</span>
                <span className="text-[11px] text-ink-500">
                  Choose between a single background video or a rotating 3-image carousel with laptop (16:9) & mobile (9:16) ratios.
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-ink-200 text-xs font-semibold text-plum-950 shadow-2xs hover:bg-cream-100/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={cmsData.heroMediaType === 'video'}
                    onChange={(e) => {
                      const isVideo = e.target.checked;
                      setCmsData({
                        ...cmsData,
                        heroMediaType: isVideo ? 'video' : 'images',
                      });
                    }}
                    className="w-4 h-4 accent-plum-900 rounded cursor-pointer"
                  />
                  <Film className="w-3.5 h-3.5 text-plum-800" />
                  <span>Video Mode (Tick for Video)</span>
                </label>
              </div>
            </div>

            {/* VIDEO MODE: Only 1 video can be added, images are hidden */}
            {cmsData.heroMediaType === 'video' ? (
              <div className="p-5 rounded-2xl bg-cream-50/40 border border-plum-900/10 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-plum-900">
                  <Video className="w-4 h-4 text-plum-800" />
                  <span>Single Hero Video (Laptop 16:9 & Mobile 9:16)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Laptop Screen (16:9) Video */}
                  <div className="space-y-2 bg-white p-4 rounded-xl border border-ink-200">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-plum-950 flex items-center gap-1.5">
                        <span>Laptop Screen Video</span>
                        <span className="bg-blush-100 text-plum-900 text-[9px] font-bold px-1.5 py-0.5 rounded">16:9 Ratio</span>
                      </label>
                      {uploadingTarget === 'videoDesktop' && (
                        <span className="text-[10px] text-plum-800 font-semibold flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://... (mp4, webm)"
                        value={cmsData.heroVideoUrl}
                        onChange={(e) => setCmsData({ ...cmsData, heroVideoUrl: e.target.value })}
                        className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-3 py-2 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800"
                      />
                      <label className="bg-plum-900 hover:bg-plum-950 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer transition-colors shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Upload</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, { type: 'videoDesktop' })}
                        />
                      </label>
                    </div>
                    {cmsData.heroVideoUrl && (
                      <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-ink-200 bg-black">
                        <video src={cmsData.heroVideoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Mobile Screen (9:16) Video */}
                  <div className="space-y-2 bg-white p-4 rounded-xl border border-ink-200">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-plum-950 flex items-center gap-1.5">
                        <span>Mobile Screen Video</span>
                        <span className="bg-blush-100 text-plum-900 text-[9px] font-bold px-1.5 py-0.5 rounded">9:16 Ratio</span>
                      </label>
                      {uploadingTarget === 'videoMobile' && (
                        <span className="text-[10px] text-plum-800 font-semibold flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://... (mp4, webm)"
                        value={cmsData.heroVideoMobileUrl}
                        onChange={(e) => setCmsData({ ...cmsData, heroVideoMobileUrl: e.target.value })}
                        className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-3 py-2 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800"
                      />
                      <label className="bg-plum-900 hover:bg-plum-950 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer transition-colors shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Upload</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, { type: 'videoMobile' })}
                        />
                      </label>
                    </div>
                    {cmsData.heroVideoMobileUrl && (
                      <div className="mt-2 h-44 w-28 mx-auto rounded-lg overflow-hidden border border-ink-200 bg-black">
                        <video src={cmsData.heroVideoMobileUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* IMAGES MODE: 3 images that move one by one (laptop 16:9 and mobile 9:16 for each) */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-plum-900">
                    <ImageIcon className="w-4 h-4 text-plum-800" />
                    <span>3 Hero Images (Rotate one-by-one on homepage)</span>
                  </div>
                  <span className="text-[11px] text-ink-500 font-medium">3 Slides configured</span>
                </div>

                <div className="space-y-4">
                  {[0, 1, 2].map((idx) => {
                    const slide = cmsData.heroSlides[idx] || {
                      desktopImage: '',
                      mobileImage: '',
                    };
                    return (
                      <div
                        key={idx}
                        className="p-4 sm:p-5 rounded-2xl bg-cream-50/40 border border-ink-200 space-y-4 hover:border-plum-800/30 transition-all"
                      >
                        <div className="flex items-center justify-between border-b border-ink-200/60 pb-2">
                          <span className="text-xs font-bold text-plum-950 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-plum-900 text-white text-[10px] flex items-center justify-center font-serif">
                              {idx + 1}
                            </span>
                            Slide #{idx + 1}
                          </span>
                          <span className="text-[10px] text-ink-400 uppercase tracking-widest font-semibold">
                            {idx === 0 ? 'Primary Default' : `Auto-Slide 0${idx + 1}`}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Laptop 16:9 Image */}
                          <div className="space-y-2 bg-white p-3 sm:p-4 rounded-xl border border-ink-200">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-bold text-plum-950 flex items-center gap-1.5">
                                <span>Laptop Screen</span>
                                <span className="bg-blush-100 text-plum-900 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  16:9 Ratio
                                </span>
                              </label>
                              {uploadingTarget === `slideDesktop_${idx}` && (
                                <span className="text-[10px] text-plum-800 font-semibold flex items-center gap-1">
                                  <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                                </span>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="https://res.cloudinary.com/..."
                                value={slide.desktopImage}
                                onChange={(e) => {
                                  const url = e.target.value;
                                  applyMediaUrl({ type: 'slideDesktop', index: idx }, url);
                                }}
                                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-3 py-2 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800"
                              />
                              <label className="bg-plum-900 hover:bg-plum-950 text-white px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer transition-colors shadow-2xs">
                                <Upload className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline text-[11px]">Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(e, { type: 'slideDesktop', index: idx })}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => handleOpenPicker({ type: 'slideDesktop', index: idx })}
                                className="bg-cream-100 hover:bg-cream-200 text-plum-950 border border-ink-200 p-2 rounded-xl text-xs shrink-0 cursor-pointer transition-colors"
                                title="Select from Media Library"
                              >
                                <ImageIcon className="w-4 h-4 text-plum-800" />
                              </button>
                            </div>

                            {slide.desktopImage && (
                              <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-ink-200 bg-cream-100">
                                <img
                                  src={slide.desktopImage}
                                  alt={`Slide ${idx + 1} Laptop`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>

                          {/* Mobile 9:16 Image */}
                          <div className="space-y-2 bg-white p-3 sm:p-4 rounded-xl border border-ink-200">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-bold text-plum-950 flex items-center gap-1.5">
                                <span>Mobile Screen</span>
                                <span className="bg-blush-100 text-plum-900 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  9:16 Ratio
                                </span>
                              </label>
                              {uploadingTarget === `slideMobile_${idx}` && (
                                <span className="text-[10px] text-plum-800 font-semibold flex items-center gap-1">
                                  <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                                </span>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="https://res.cloudinary.com/..."
                                value={slide.mobileImage}
                                onChange={(e) => {
                                  const url = e.target.value;
                                  applyMediaUrl({ type: 'slideMobile', index: idx }, url);
                                }}
                                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-3 py-2 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800"
                              />
                              <label className="bg-plum-900 hover:bg-plum-950 text-white px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer transition-colors shadow-2xs">
                                <Upload className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline text-[11px]">Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(e, { type: 'slideMobile', index: idx })}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => handleOpenPicker({ type: 'slideMobile', index: idx })}
                                className="bg-cream-100 hover:bg-cream-200 text-plum-950 border border-ink-200 p-2 rounded-xl text-xs shrink-0 cursor-pointer transition-colors"
                                title="Select from Media Library"
                              >
                                <ImageIcon className="w-4 h-4 text-plum-800" />
                              </button>
                            </div>

                            {slide.mobileImage && (
                              <div className="mt-2 h-36 w-24 mx-auto rounded-lg overflow-hidden border border-ink-200 bg-cream-100">
                                <img
                                  src={slide.mobileImage}
                                  alt={`Slide ${idx + 1} Mobile`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Promotional Cards Grid Images */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ink-200/80 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-ink-200 gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-plum-950">Promotional Cards Grid Images</h3>
              <p className="text-xs text-ink-500 mt-0.5">Customize the 3 promotional cards displayed on the storefront homepage (Gift Hampers, Combos, DIY Flowers).</p>
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-plum-900 hover:bg-plum-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-xs self-start sm:self-auto cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Cards</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Gift Hampers */}
            <div className="p-4 rounded-2xl border border-ink-200/80 bg-cream-50/30 flex flex-col justify-between space-y-3">
              <div>
                <span className="inline-block bg-plum-100 text-plum-900 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1">
                  Card 1
                </span>
                <h4 className="font-semibold text-xs text-plum-950">Gift Hampers</h4>
                <p className="text-[11px] text-ink-500 mb-2">Card floral background image</p>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="https://res.cloudinary.com/..."
                    value={cmsData.promoGiftHampersImage}
                    onChange={(e) => setCmsData({ ...cmsData, promoGiftHampersImage: e.target.value })}
                    className="w-full bg-white border border-ink-200 rounded-xl px-3 py-2 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800"
                  />
                  <label className="bg-plum-900 hover:bg-plum-950 text-white px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, { type: 'promoGiftHampers' })}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleOpenPicker({ type: 'promoGiftHampers' })}
                    className="bg-cream-100 hover:bg-cream-200 text-plum-950 border border-ink-200 p-2 rounded-xl text-xs shrink-0 cursor-pointer transition-colors"
                    title="Select from Media Library"
                  >
                    <ImageIcon className="w-4 h-4 text-plum-800" />
                  </button>
                </div>
              </div>
              {cmsData.promoGiftHampersImage && (
                <div className="h-28 w-full rounded-xl overflow-hidden border border-ink-200 bg-cream-100 relative">
                  <img
                    src={cmsData.promoGiftHampersImage}
                    alt="Gift Hampers Card"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Card 2: Combos */}
            <div className="p-4 rounded-2xl border border-ink-200/80 bg-cream-50/30 flex flex-col justify-between space-y-3">
              <div>
                <span className="inline-block bg-plum-100 text-plum-900 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1">
                  Card 2
                </span>
                <h4 className="font-semibold text-xs text-plum-950">Combos</h4>
                <p className="text-[11px] text-ink-500 mb-2">Card floral background image</p>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="https://res.cloudinary.com/..."
                    value={cmsData.promoCombosImage}
                    onChange={(e) => setCmsData({ ...cmsData, promoCombosImage: e.target.value })}
                    className="w-full bg-white border border-ink-200 rounded-xl px-3 py-2 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800"
                  />
                  <label className="bg-plum-900 hover:bg-plum-950 text-white px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, { type: 'promoCombos' })}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleOpenPicker({ type: 'promoCombos' })}
                    className="bg-cream-100 hover:bg-cream-200 text-plum-950 border border-ink-200 p-2 rounded-xl text-xs shrink-0 cursor-pointer transition-colors"
                    title="Select from Media Library"
                  >
                    <ImageIcon className="w-4 h-4 text-plum-800" />
                  </button>
                </div>
              </div>
              {cmsData.promoCombosImage && (
                <div className="h-28 w-full rounded-xl overflow-hidden border border-ink-200 bg-cream-100 relative">
                  <img
                    src={cmsData.promoCombosImage}
                    alt="Combos Card"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Card 3: DIY Flowers */}
            <div className="p-4 rounded-2xl border border-ink-200/80 bg-cream-50/30 flex flex-col justify-between space-y-3">
              <div>
                <span className="inline-block bg-plum-100 text-plum-900 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1">
                  Card 3
                </span>
                <h4 className="font-semibold text-xs text-plum-950">DIY Flowers</h4>
                <p className="text-[11px] text-ink-500 mb-2">Card floral background image</p>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="https://res.cloudinary.com/..."
                    value={cmsData.promoDiyFlowersImage}
                    onChange={(e) => setCmsData({ ...cmsData, promoDiyFlowersImage: e.target.value })}
                    className="w-full bg-white border border-ink-200 rounded-xl px-3 py-2 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800"
                  />
                  <label className="bg-plum-900 hover:bg-plum-950 text-white px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, { type: 'promoDiyFlowers' })}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleOpenPicker({ type: 'promoDiyFlowers' })}
                    className="bg-cream-100 hover:bg-cream-200 text-plum-950 border border-ink-200 p-2 rounded-xl text-xs shrink-0 cursor-pointer transition-colors"
                    title="Select from Media Library"
                  >
                    <ImageIcon className="w-4 h-4 text-plum-800" />
                  </button>
                </div>
              </div>
              {cmsData.promoDiyFlowersImage && (
                <div className="h-28 w-full rounded-xl overflow-hidden border border-ink-200 bg-cream-100 relative">
                  <img
                    src={cmsData.promoDiyFlowersImage}
                    alt="DIY Flowers Card"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. Homepage Section Visibility Toggles */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ink-200/80 shadow-2xs space-y-5">
          <div className="pb-4 border-b border-ink-200">
            <h3 className="font-serif text-lg font-bold text-plum-950">Section Visibility Control</h3>
            <p className="text-xs text-ink-500 mt-0.5">Enable or disable specific sections on the storefront homepage.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <label className="flex items-center justify-between p-4 rounded-2xl border border-ink-200 bg-cream-50/40 cursor-pointer hover:bg-cream-100/60 transition-colors">
              <span className="text-xs font-semibold text-plum-950">New Arrivals Rail</span>
              <input
                type="checkbox"
                checked={cmsData.showNewArrivals}
                onChange={(e) => setCmsData({ ...cmsData, showNewArrivals: e.target.checked })}
                className="w-4 h-4 accent-plum-900 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl border border-ink-200 bg-cream-50/40 cursor-pointer hover:bg-cream-100/60 transition-colors">
              <span className="text-xs font-semibold text-plum-950">Shop by Occasion</span>
              <input
                type="checkbox"
                checked={cmsData.showOccasions}
                onChange={(e) => setCmsData({ ...cmsData, showOccasions: e.target.checked })}
                className="w-4 h-4 accent-plum-900 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl border border-ink-200 bg-cream-50/40 cursor-pointer hover:bg-cream-100/60 transition-colors">
              <span className="text-xs font-semibold text-plum-950">Hand Bouquets Rail</span>
              <input
                type="checkbox"
                checked={cmsData.showHandBouquets}
                onChange={(e) => setCmsData({ ...cmsData, showHandBouquets: e.target.checked })}
                className="w-4 h-4 accent-plum-900 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl border border-ink-200 bg-cream-50/40 cursor-pointer hover:bg-cream-100/60 transition-colors">
              <span className="text-xs font-semibold text-plum-950">Flowers in Vase Grid</span>
              <input
                type="checkbox"
                checked={cmsData.showFlowersInVase}
                onChange={(e) => setCmsData({ ...cmsData, showFlowersInVase: e.target.checked })}
                className="w-4 h-4 accent-plum-900 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl border border-ink-200 bg-cream-50/40 cursor-pointer hover:bg-cream-100/60 transition-colors">
              <span className="text-xs font-semibold text-plum-950">From Our Blog</span>
              <input
                type="checkbox"
                checked={cmsData.showBlog}
                onChange={(e) => setCmsData({ ...cmsData, showBlog: e.target.checked })}
                className="w-4 h-4 accent-plum-900 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

      </form>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={async (url) => {
          applyMediaUrl(pickerTarget, url);
          if (['promoGiftHampers', 'promoCombos', 'promoDiyFlowers'].includes(pickerTarget.type)) {
            const nextCms = {
              ...cmsData,
              promoGiftHampersImage: pickerTarget.type === 'promoGiftHampers' ? url : cmsData.promoGiftHampersImage,
              promoCombosImage: pickerTarget.type === 'promoCombos' ? url : cmsData.promoCombosImage,
              promoDiyFlowersImage: pickerTarget.type === 'promoDiyFlowers' ? url : cmsData.promoDiyFlowersImage,
            };
            await saveCmsConfigurationAction(nextCms);
            setFeedback('✨ Promotional card image selected and saved live to storefront!');
            setTimeout(() => setFeedback(null), 3000);
          }
        }}
      />
    </div>
  );
}
