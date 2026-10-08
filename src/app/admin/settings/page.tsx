'use client';

import React, { useState } from 'react';
import { Settings, Save, Check } from 'lucide-react';
import { DEMO_SITE_SETTINGS } from '@/lib/data/storefront';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(DEMO_SITE_SETTINGS);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-plum-900">Store Settings</h1>
          <p className="text-xs text-ink-500 mt-1">Configure WhatsApp number, admin emails, currency and shipping thresholds.</p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center space-x-2 bg-plum-900 hover:bg-plum-800 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-md"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Settings Saved!' : 'Save Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-ink-100 shadow-xs space-y-6 text-xs">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-plum-900 mb-1">Store Name *</label>
            <input
              type="text"
              required
              value={settings.store_name}
              onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
              className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-plum-900 mb-1">Currency Symbol *</label>
            <input
              type="text"
              required
              value={settings.currency_symbol}
              onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
              className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-plum-900 mb-1">WhatsApp Contact Number *</label>
            <input
              type="text"
              required
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-plum-900 mb-1">Admin Notification Email *</label>
            <input
              type="email"
              required
              value={settings.admin_email}
              onChange={(e) => setSettings({ ...settings, admin_email: e.target.value })}
              className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-plum-900 mb-1">Free Delivery Threshold ({settings.currency_symbol}) *</label>
            <input
              type="number"
              required
              value={settings.free_shipping_threshold}
              onChange={(e) => setSettings({ ...settings, free_shipping_threshold: parseFloat(e.target.value) })}
              className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-plum-900 mb-1">Flat Delivery Fee ({settings.currency_symbol}) *</label>
            <input
              type="number"
              required
              value={settings.flat_shipping_fee}
              onChange={(e) => setSettings({ ...settings, flat_shipping_fee: parseFloat(e.target.value) })}
              className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
            />
          </div>
        </div>

      </form>
    </div>
  );
}
