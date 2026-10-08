'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Copy, Check, Loader2 } from 'lucide-react';
import { uploadMediaAssetAction, getMediaAssetsAction, MediaAssetRecord } from '@/app/actions/media';

const INITIAL_MEDIA = [
  { id: '1', name: 'hero_desktop.jpg', url: '/demo-media/hero_desktop.jpg' },
  { id: '2', name: 'hero_mobile_v2.jpg', url: '/demo-media/hero_mobile_v2.jpg' },
  { id: '3', name: 'product_blush_bouquet.jpg', url: '/demo-media/product_blush_bouquet.jpg' },
  { id: '4', name: 'product_red_roses.jpg', url: '/demo-media/product_red_roses.jpg' },
  { id: '5', name: 'product_pastel_bouquet.jpg', url: '/demo-media/product_pastel_bouquet.jpg' },
  { id: '6', name: 'premium_banner.jpg', url: '/demo-media/premium_banner.jpg' },
  { id: '7', name: 'delivery_banner.jpg', url: '/demo-media/delivery_banner.jpg' },
];

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<{ id: string; name: string; url: string }[]>(INITIAL_MEDIA);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadAssets() {
      const dbAssets = await getMediaAssetsAction();
      if (dbAssets && dbAssets.length > 0) {
        const formatted = dbAssets.map((a: MediaAssetRecord) => ({
          id: a.id,
          name: a.alt_text || a.public_id || 'Cloudinary Media Asset',
          url: a.url,
        }));
        setMediaList(formatted);
      }
    }
    loadAssets();
  }, []);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadMediaAssetAction(formData);
    setUploading(false);

    if (res.success && res.asset) {
      const newAsset = {
        id: res.asset.id,
        name: res.asset.alt_text || file.name,
        url: res.asset.url,
      };
      setMediaList((prev) => [newAsset, ...prev]);
    } else {
      setErrorMsg(res.error || 'Failed to upload image to Cloudinary.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-plum-900">Media Library</h1>
          <p className="text-xs text-ink-500 mt-1">Manage Cloudinary storefront assets, hero images and product photos.</p>
        </div>

        <label className="inline-flex items-center space-x-2 bg-plum-900 hover:bg-plum-800 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50">
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span>{uploading ? 'Uploading to Cloudinary...' : 'Upload New Asset'}</span>
          <input type="file" accept="image/*" disabled={uploading} onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mediaList.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl p-3 border border-ink-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-cream-200 mb-3">
              <Image src={item.url} alt={item.name} fill className="object-cover" />
            </div>

            <div>
              <p className="text-xs font-semibold text-plum-900 truncate" title={item.name}>
                {item.name}
              </p>

              <button
                onClick={() => handleCopyUrl(item.url, item.id)}
                className="w-full mt-2 py-1.5 px-2 bg-cream-100 hover:bg-plum-50 text-plum-900 rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1 transition-colors border border-ink-100"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">URL Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-plum-700" />
                    <span>Copy Media URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
