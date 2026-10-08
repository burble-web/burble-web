'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Loader2, Image as ImageIcon, Layers } from 'lucide-react';
import { Collection, Product } from '@/types';
import { DEMO_OCCASIONS, DEMO_PRODUCTS } from '@/lib/data/storefront';
import {
  getAdminCollectionsAction,
  saveCollectionAction,
  deleteCollectionAction,
  SaveCollectionPayload,
} from '@/app/actions/collection';
import { getAdminProductsAction } from '@/app/actions/product';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<(Collection & { product_ids?: string[] })[]>([]);
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [editingCollection, setEditingCollection] = useState<Partial<SaveCollectionPayload>>({});

  const loadData = async () => {
    setLoading(true);
    const colRes = await getAdminCollectionsAction();
    const prodRes = await getAdminProductsAction();

    if (prodRes.success && prodRes.data && prodRes.data.length > 0) {
      setProducts(prodRes.data);
    }

    if (colRes.success && colRes.data && colRes.data.length > 0) {
      setCollections(colRes.data);
    } else {
      setCollections(DEMO_OCCASIONS);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

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
          <p className="text-xs text-ink-500 mt-1">Group products into occasions, flowers, and promotional collections.</p>
        </div>

        <button
          onClick={() => {
            setEditingCollection({
              title: '',
              subtitle: '',
              type: 'occasion',
              image_url: '/demo-media/product_blush_bouquet.jpg',
              sort_order: collections.length + 1,
              active: true,
              product_ids: [],
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 bg-plum-900 hover:bg-plum-800 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-sm"
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

      <div className="bg-white rounded-3xl p-6 border border-ink-100 shadow-xs">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-ink-400">
            <Loader2 className="w-6 h-6 animate-spin mb-2" />
            <span className="text-xs font-medium">Loading collections...</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-ink-100 text-ink-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Collection</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Products Linked</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {collections.map((col) => (
                <tr key={col.id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-plum-900">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-cream-200 shrink-0 border border-ink-100">
                        <Image
                          src={col.image_url || '/demo-media/product_blush_bouquet.jpg'}
                          alt={col.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p>{col.title}</p>
                        <p className="text-[11px] text-ink-500 font-mono">/{col.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 capitalize font-semibold text-plum-800">{col.type}</td>
                  <td className="py-3.5 px-4 font-bold text-plum-900">
                    {col.product_ids ? `${col.product_ids.length} products` : '0 products'}
                  </td>
                  <td className="py-3.5 px-4">
                    {col.active ? (
                      <span className="text-emerald-700 flex items-center space-x-1 font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-ink-400 flex items-center space-x-1 font-semibold">
                        <XCircle className="w-4 h-4" />
                        <span>Inactive</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => {
                        setEditingCollection({
                          id: col.id,
                          title: col.title,
                          slug: col.slug,
                          subtitle: col.subtitle,
                          image_url: col.image_url,
                          type: col.type,
                          sort_order: col.sort_order,
                          active: col.active,
                          product_ids: col.product_ids || [],
                        });
                        setModalOpen(true);
                      }}
                      className="p-1.5 text-plum-800 hover:bg-plum-100 rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(col.id)}
                      className="p-1.5 text-rose-700 hover:bg-rose-100 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-plum-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-ink-100 max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-2xl font-bold text-plum-900 mb-4">
              {editingCollection.id ? 'Edit Collection' : 'Create Collection'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-plum-900 mb-1">Collection Title *</label>
                <input
                  type="text"
                  required
                  value={editingCollection.title || ''}
                  onChange={(e) => setEditingCollection({ ...editingCollection, title: e.target.value })}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-plum-900 mb-1">Subtitle / Description</label>
                <input
                  type="text"
                  value={editingCollection.subtitle || ''}
                  onChange={(e) => setEditingCollection({ ...editingCollection, subtitle: e.target.value })}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-plum-900 mb-1">Type</label>
                  <select
                    value={editingCollection.type || 'occasion'}
                    onChange={(e) =>
                      setEditingCollection({
                        ...editingCollection,
                        type: e.target.value as 'occasion' | 'flower' | 'collection',
                      })
                    }
                    className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
                  >
                    <option value="occasion">Occasion</option>
                    <option value="flower">Flower Type</option>
                    <option value="collection">General Collection</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-plum-900 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={editingCollection.sort_order ?? 0}
                    onChange={(e) =>
                      setEditingCollection({ ...editingCollection, sort_order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-plum-900 mb-1">Image (Cloudinary URL)</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={editingCollection.image_url || ''}
                    onChange={(e) => setEditingCollection({ ...editingCollection, image_url: e.target.value })}
                    className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="bg-plum-100 hover:bg-plum-200 text-plum-900 font-semibold px-3 py-2 rounded-xl text-xs flex items-center space-x-1 shrink-0"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Choose</span>
                  </button>
                </div>
              </div>

              {/* Linked Products Checklist */}
              <div>
                <label className="block font-semibold text-plum-900 mb-1">Associated Products</label>
                <div className="max-h-36 overflow-y-auto bg-cream-50 border border-ink-100 rounded-xl p-3 space-y-2">
                  {products.map((prod) => {
                    const isChecked = (editingCollection.product_ids || []).includes(prod.id);
                    return (
                      <label key={prod.id} className="flex items-center space-x-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleProductSelection(prod.id)}
                          className="text-plum-800 rounded focus:ring-plum-800"
                        />
                        <span className="text-ink-900 font-medium">{prod.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCollection.active ?? true}
                    onChange={(e) => setEditingCollection({ ...editingCollection, active: e.target.checked })}
                    className="text-plum-800 rounded focus:ring-plum-800"
                  />
                  <span className="font-semibold text-plum-900">Active</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-ink-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-ink-200 text-ink-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-plum-900 text-white font-semibold flex items-center space-x-2 disabled:opacity-50"
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
