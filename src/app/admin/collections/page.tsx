'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Loader2, Image as ImageIcon, Sparkles, Layers } from 'lucide-react';
import { Collection, Product } from '@/types';
import {
  getAdminCollectionsAction,
  saveCollectionAction,
  deleteCollectionAction,
  SaveCollectionPayload,
} from '@/app/actions/collection';
import { getAdminProductsAction } from '@/app/actions/product';
import { translateTextAction } from '@/app/actions/translate';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<(Collection & { product_ids?: string[] })[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [editingCollection, setEditingCollection] = useState<Partial<SaveCollectionPayload>>({});

  const loadData = async () => {
    setLoading(true);
    const colRes = await getAdminCollectionsAction();
    const prodRes = await getAdminProductsAction();

    if (prodRes.success && prodRes.data) {
      setProducts(prodRes.data);
    } else {
      setProducts([]);
    }

    if (colRes.success && colRes.data) {
      setCollections(colRes.data);
    } else {
      setCollections([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAutoTranslate = async () => {
    if (!editingCollection.title || editingCollection.title.trim().length === 0) {
      setFeedback({ type: 'error', message: 'Please enter collection title in English first.' });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setTranslating(true);
    try {
      const titleRes = await translateTextAction(editingCollection.title.trim(), 'collection_name');
      const translatedTitle = titleRes.success && titleRes.translation ? titleRes.translation : (editingCollection.title_ar || '');
      
      let translatedSubtitle = editingCollection.subtitle_ar || '';
      if (editingCollection.subtitle && editingCollection.subtitle.trim().length > 0 && !editingCollection.subtitle_ar) {
        const subRes = await translateTextAction(editingCollection.subtitle.trim(), 'collection_subtitle');
        if (subRes.success && subRes.translation) {
          translatedSubtitle = subRes.translation;
        }
      }

      setEditingCollection({
        ...editingCollection,
        title_ar: translatedTitle,
        subtitle_ar: translatedSubtitle,
      });

      setFeedback({ type: 'success', message: '✨ Arabic collection translation generated!' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setFeedback({ type: 'error', message: 'Failed to auto-translate collection.' });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setTranslating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollection.title) return;

    setSaving(true);
    setFeedback(null);

    const res = await saveCollectionAction(editingCollection as SaveCollectionPayload);
    setSaving(false);

    if (res.success) {
      setFeedback({ type: 'success', message: 'Collection saved successfully!' });
      setModalOpen(false);
      loadData();
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save collection.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;
    const res = await deleteCollectionAction(id);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Collection deleted.' });
      loadData();
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to delete collection.' });
    }
  };

  const toggleProductSelection = (prodId: string) => {
    const current = editingCollection.product_ids || [];
    const updated = current.includes(prodId)
      ? current.filter((id) => id !== prodId)
      : [...current, prodId];
    setEditingCollection({ ...editingCollection, product_ids: updated });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-plum-900">Collections & Occasions</h1>
          <p className="text-xs text-ink-500 mt-1">Group products into bilingual occasions, flowers, and promotional collections.</p>
        </div>

        <button
          onClick={() => {
            setEditingCollection({
              title: '',
              title_ar: '',
              subtitle: '',
              subtitle_ar: '',
              type: 'occasion',
              image_url: '',
              sort_order: collections.length + 1,
              active: true,
              product_ids: [],
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-plum-900 hover:bg-plum-800 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Collection</span>
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

      <div className="bg-white rounded-3xl p-6 border border-ink-200/80 shadow-2xs">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-ink-500">
            <Loader2 className="w-6 h-6 animate-spin mb-2 text-plum-800" />
            <span className="text-xs font-medium">Loading collections...</span>
          </div>
        ) : collections.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-ink-200 rounded-2xl bg-cream-50/30 p-8">
            <Layers className="w-10 h-10 text-ink-400 mx-auto mb-3 stroke-[1.5]" />
            <p className="font-serif text-base font-bold text-plum-950">No Collections Found</p>
            <p className="text-xs text-ink-600 font-medium mt-1">Create your first occasion, flower type, or collection above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-ink-200">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100/90 border-b border-ink-200 text-ink-800 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Collection (EN / AR)</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Products Linked</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {collections.map((col) => (
                  <tr key={col.id} className="hover:bg-cream-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-plum-950">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-cream-200 shrink-0 border border-ink-200 flex items-center justify-center">
                          {col.image_url ? (
                            <Image
                              src={col.image_url}
                              alt={col.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Layers className="w-4 h-4 text-plum-600" />
                          )}
                        </div>
                        <div>
                          <p>{col.title}</p>
                          {col.title_ar && (
                            <p className="text-[11px] text-plum-800 font-arabic font-semibold">{col.title_ar}</p>
                          )}
                          <p className="text-[10px] text-ink-500 font-mono">/{col.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 capitalize font-semibold text-plum-900">{col.type}</td>
                    <td className="py-3.5 px-4 font-bold text-plum-950">
                      {col.product_ids ? `${col.product_ids.length} products` : '0 products'}
                    </td>
                    <td className="py-3.5 px-4">
                      {col.active ? (
                        <span className="text-emerald-800 flex items-center gap-1 font-bold">
                          <CheckCircle className="w-4 h-4" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="text-ink-600 flex items-center gap-1 font-medium">
                          <XCircle className="w-4 h-4" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-end space-x-1 rtl:space-x-reverse">
                      <button
                        onClick={() => {
                          setEditingCollection({
                            id: col.id,
                            title: col.title,
                            title_ar: col.title_ar || '',
                            slug: col.slug,
                            subtitle: col.subtitle,
                            subtitle_ar: col.subtitle_ar || '',
                            image_url: col.image_url,
                            type: col.type,
                            sort_order: col.sort_order,
                            active: col.active,
                            product_ids: col.product_ids || [],
                          });
                          setModalOpen(true);
                        }}
                        className="p-2 text-plum-900 hover:bg-plum-100/70 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(col.id)}
                        className="p-2 text-rose-700 hover:bg-rose-100/70 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-plum-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-ink-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl font-bold text-plum-950">
                {editingCollection.id ? 'Edit Collection' : 'Create Collection'}
              </h2>
              <button
                type="button"
                onClick={handleAutoTranslate}
                disabled={translating}
                className="inline-flex items-center gap-1.5 bg-blush-100 hover:bg-blush-200 text-plum-950 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                {translating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-gold-600" />}
                <span>{translating ? 'Translating...' : '✨ Generate Arabic'}</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5">Collection Title (English) <span className="text-rose-600">*</span></label>
                  <input
                    type="text"
                    required
                    value={editingCollection.title || ''}
                    onChange={(e) => setEditingCollection({ ...editingCollection, title: e.target.value })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5 font-arabic">عنوان المجموعة (العربية)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editingCollection.title_ar || ''}
                    onChange={(e) => setEditingCollection({ ...editingCollection, title_ar: e.target.value })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5">Subtitle (English)</label>
                  <input
                    type="text"
                    value={editingCollection.subtitle || ''}
                    onChange={(e) => setEditingCollection({ ...editingCollection, subtitle: e.target.value })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5 font-arabic">الوصف الفرعي (العربية)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editingCollection.subtitle_ar || ''}
                    onChange={(e) => setEditingCollection({ ...editingCollection, subtitle_ar: e.target.value })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5">Type</label>
                  <select
                    value={editingCollection.type || 'occasion'}
                    onChange={(e) =>
                      setEditingCollection({
                        ...editingCollection,
                        type: e.target.value as 'occasion' | 'flower' | 'collection',
                      })
                    }
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  >
                    <option value="occasion">Occasion</option>
                    <option value="flower">Flower Type</option>
                    <option value="collection">General Collection</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5">Sort Order</label>
                  <input
                    type="number"
                    value={editingCollection.sort_order ?? 0}
                    onChange={(e) =>
                      setEditingCollection({ ...editingCollection, sort_order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-plum-950 mb-1.5">Image (Cloudinary URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCollection.image_url || ''}
                    onChange={(e) => setEditingCollection({ ...editingCollection, image_url: e.target.value })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="bg-cream-100 hover:bg-cream-200 text-plum-950 border border-ink-200 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-plum-800" />
                    <span>Choose</span>
                  </button>
                </div>
              </div>

              {/* Linked Products Checklist */}
              <div>
                <label className="block font-semibold text-plum-950 mb-1.5">Associated Products</label>
                <div className="max-h-36 overflow-y-auto bg-cream-50/50 border border-ink-200 rounded-xl p-3 space-y-2">
                  {products.map((prod) => {
                    const isChecked = (editingCollection.product_ids || []).includes(prod.id);
                    return (
                      <label key={prod.id} className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleProductSelection(prod.id)}
                          className="text-plum-900 rounded focus:ring-plum-800"
                        />
                        <span className="text-ink-900 font-medium">{prod.name}</span>
                        {prod.name_ar && <span className="text-plum-800 font-arabic text-[11px]">({prod.name_ar})</span>}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCollection.active ?? true}
                    onChange={(e) => setEditingCollection({ ...editingCollection, active: e.target.checked })}
                    className="text-plum-900 rounded focus:ring-plum-800"
                  />
                  <span className="font-semibold text-plum-950">Active</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-ink-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-ink-200 text-ink-800 font-semibold hover:bg-cream-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-semibold flex items-center gap-2 disabled:opacity-50 shadow-xs transition-colors cursor-pointer"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? 'Saving...' : 'Save Collection'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setEditingCollection({ ...editingCollection, image_url: url })}
        title="Select Collection Image"
      />
    </div>
  );
}

