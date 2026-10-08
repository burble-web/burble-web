'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, Check, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadMediaAssetAction, getMediaAssetsAction, MediaAssetRecord } from '@/app/actions/media';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

const INITIAL_MEDIA = [
  { id: '1', name: 'hero_desktop.jpg', url: '/demo-media/hero_desktop.jpg' },
  { id: '2', name: 'hero_mobile_v2.jpg', url: '/demo-media/hero_mobile_v2.jpg' },
  { id: '3', name: 'product_blush_bouquet.jpg', url: '/demo-media/product_blush_bouquet.jpg' },
  { id: '4', name: 'product_red_roses.jpg', url: '/demo-media/product_red_roses.jpg' },
  { id: '5', name: 'product_pastel_bouquet.jpg', url: '/demo-media/product_pastel_bouquet.jpg' },
  { id: '6', name: 'premium_banner.jpg', url: '/demo-media/premium_banner.jpg' },
  { id: '7', name: 'delivery_banner.jpg', url: '/demo-media/delivery_banner.jpg' },
];

export function MediaPickerModal({ isOpen, onClose, onSelect, title = 'Select Image from Media Library' }: MediaPickerModalProps) {
  const [mediaList, setMediaList] = useState<{ id: string; name: string; url: string }[]>(INITIAL_MEDIA);
  const [uploading, setUploading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen]);

  if (!isOpen) return null;

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
      setSelectedUrl(res.asset.url);
    } else {
      setErrorMsg(res.error || 'Failed to upload image to Cloudinary.');
    }
  };

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-plum-950/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-ink-100 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-ink-100">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-plum-800" />
            <h3 className="font-serif text-lg font-bold text-plum-900">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-ink-400 hover:text-ink-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Action */}
        <div className="py-3 border-b border-ink-100 flex items-center justify-between">
          <p className="text-xs text-ink-500">Choose from existing media or upload a new asset to Cloudinary.</p>
          <label className="inline-flex items-center space-x-1.5 bg-plum-900 hover:bg-plum-800 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 shrink-0">
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
            <input type="file" accept="image/*" disabled={uploading} onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {errorMsg && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto py-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
          {mediaList.map((item) => {
            const isSelected = selectedUrl === item.url;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedUrl(item.url)}
                className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                  isSelected ? 'border-plum-800 ring-2 ring-plum-800/30 shadow-md' : 'border-ink-100 hover:border-plum-300'
                }`}
              >
                <Image src={item.url} alt={item.name} fill className="object-cover" />
                {isSelected && (
                  <div className="absolute inset-0 bg-plum-950/30 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-plum-800 text-white flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-ink-100 flex items-center justify-between">
          <span className="text-xs text-ink-500 truncate max-w-xs">
            {selectedUrl ? `Selected: ${selectedUrl.split('/').pop()}` : 'No image selected'}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-ink-200 text-ink-700 text-xs font-semibold hover:bg-cream-100"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedUrl}
              className="px-5 py-2 rounded-xl bg-plum-900 hover:bg-plum-800 disabled:opacity-50 text-white text-xs font-semibold shadow-md"
            >
              Use Selected Image
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
