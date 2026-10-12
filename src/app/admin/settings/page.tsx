'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Loader2 } from 'lucide-react';
import { SiteSettings } from '@/types';
import { getAdminSettingsAction, saveSettingsAction, SaveSettingsPayload } from '@/app/actions/settings';

const INITIAL_SETTINGS: SiteSettings = {
  id: 1,
  store_name: '',
  store_name_ar: '',
  tagline: '',
  tagline_ar: '',
  whatsapp_number: '',
  admin_email: '',
  currency_symbol: 'QAR',
  currency_symbol_ar: 'ر.ق',
  announcement_text: '',
  announcement_text_ar: '',
  announcement_enabled: true,
  free_shipping_threshold: 300,
  flat_shipping_fee: 25,
  updated_at: new Date().toISOString(),
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      const res = await getAdminSettingsAction();
      if (res.success && res.data) {
        setSettings(res.data);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload: SaveSettingsPayload = {
      store_name: settings.store_name,
      store_name_ar: settings.store_name_ar,
      tagline: settings.tagline,
      tagline_ar: settings.tagline_ar,
      whatsapp_number: settings.whatsapp_number,
      admin_email: settings.admin_email,
      currency_symbol: settings.currency_symbol,
      announcement_text: settings.announcement_text,
      announcement_text_ar: settings.announcement_text_ar,
      announcement_enabled: settings.announcement_enabled,
      free_shipping_threshold: Number(settings.free_shipping_threshold),
      flat_shipping_fee: Number(settings.flat_shipping_fee),
    };

    const res = await saveSettingsAction(payload);
    setSaving(false);

    if (res.success) {
      setFeedback({ type: 'success', message: 'Store settings saved successfully!' });
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save settings.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-plum-950">Store Settings</h1>
          <p className="text-xs text-ink-500 mt-1">Configure bilingual store identity, WhatsApp number, admin emails, currency and shipping thresholds.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 bg-plum-900 hover:bg-plum-800 disabled:opacity-50 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : feedback?.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-medium border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-16 rounded-3xl border border-ink-200/80 flex flex-col items-center justify-center text-ink-500">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-plum-800" />
          <span className="text-xs font-medium">Loading store settings...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-ink-200/80 shadow-2xs space-y-6 text-xs">
          
          <div className="pb-3 border-b border-ink-200">
            <h3 className="font-serif text-lg font-bold text-plum-950">Brand & Contact Details</h3>
            <p className="text-xs text-ink-500 mt-0.5">Basic brand configuration and primary contact information.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-plum-950 mb-1.5">Store Name (English) <span className="text-rose-600">*</span></label>
              <input
                type="text"
                required
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
              />
            </div>

            <div>
              <label className="block font-semibold text-plum-950 mb-1.5 font-arabic">اسم المتجر (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={settings.store_name_ar || ''}
                onChange={(e) => setSettings({ ...settings, store_name_ar: e.target.value })}
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all font-arabic"
              />
            </div>

            <div>
              <label className="block font-semibold text-plum-950 mb-1.5">Store Tagline (English)</label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
              />
            </div>

            <div>
              <label className="block font-semibold text-plum-950 mb-1.5 font-arabic">شعار المتجر (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={settings.tagline_ar || ''}
                onChange={(e) => setSettings({ ...settings, tagline_ar: e.target.value })}
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all font-arabic"
              />
            </div>

            <div>
              <label className="block font-semibold text-plum-950 mb-1.5">Currency Symbol <span className="text-rose-600">*</span></label>
              <input
                type="text"
                required
                value={settings.currency_symbol}
                onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
              />
            </div>

            <div>
              <label className="block font-semibold text-plum-950 mb-1.5">WhatsApp Contact Number <span className="text-rose-600">*</span></label>
              <input
                type="text"
                required
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-plum-950 mb-1.5">Admin Notification Email <span className="text-rose-600">*</span></label>
              <input
                type="email"
                required
                value={settings.admin_email}
                onChange={(e) => setSettings({ ...settings, admin_email: e.target.value })}
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
              />
            </div>
          </div>

          <div className="pt-4 pb-2 border-t border-ink-200">
            <h3 className="font-serif text-lg font-bold text-plum-950">Shipping & Delivery Fees</h3>
            <p className="text-xs text-ink-500 mt-0.5">Threshold for complimentary delivery and standard shipping charges.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-plum-950 mb-1.5">Free Delivery Threshold ({settings.currency_symbol}) <span className="text-rose-600">*</span></label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={settings.free_shipping_threshold}
                onChange={(e) => setSettings({ ...settings, free_shipping_threshold: parseFloat(e.target.value) || 0 })}
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
              />
            </div>

            <div>
              <label className="block font-semibold text-plum-950 mb-1.5">Flat Delivery Fee ({settings.currency_symbol}) <span className="text-rose-600">*</span></label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={settings.flat_shipping_fee}
                onChange={(e) => setSettings({ ...settings, flat_shipping_fee: parseFloat(e.target.value) || 0 })}
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-ink-200 space-y-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.announcement_enabled ?? true}
                onChange={(e) => setSettings({ ...settings, announcement_enabled: e.target.checked })}
                className="text-plum-900 rounded focus:ring-plum-800 cursor-pointer"
              />
              <span className="font-semibold text-plum-950">Enable Global Announcement Bar</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-plum-950 mb-1.5">Announcement Text (English)</label>
                <input
                  type="text"
                  value={settings.announcement_text || ''}
                  onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
                  className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-plum-950 mb-1.5 font-arabic">نص الإعلان (العربية)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={settings.announcement_text_ar || ''}
                  onChange={(e) => setSettings({ ...settings, announcement_text_ar: e.target.value })}
                  className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all font-arabic"
                />
              </div>
            </div>
          </div>

        </form>
      )}
    </div>
  );
}

