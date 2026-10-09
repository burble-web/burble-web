'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { DEMO_CATEGORIES } from '@/lib/data/storefront';
import { Category } from '@/types';
import {
  getAdminCategoriesAction,
  saveCategoryAction,
  deleteCategoryAction,
  SaveCategoryPayload,
} from '@/app/actions/category';
import { translateTextAction } from '@/app/actions/translate';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [editingCategory, setEditingCategory] = useState<Partial<SaveCategoryPayload>>({});

  const loadCategories = async () => {
    setLoading(true);
    const res = await getAdminCategoriesAction();
    if (res.success && res.data && res.data.length > 0) {
      setCategories(res.data);
    } else {
      setCategories(DEMO_CATEGORIES);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAutoTranslate = async () => {
    if (!editingCategory.name || editingCategory.name.trim().length === 0) {
      setFeedback({ type: 'error', message: 'Please enter English category name first.' });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setTranslating(true);
    try {
      const nameRes = await translateTextAction(editingCategory.name.trim(), 'category_name');
      const translatedName = nameRes.success && nameRes.translation ? nameRes.translation : (editingCategory.name_ar || '');
      
      let translatedDesc = editingCategory.description_ar || '';
      if (editingCategory.description && editingCategory.description.trim().length > 0 && !editingCategory.description_ar) {
        const descRes = await translateTextAction(editingCategory.description.trim(), 'category_description');
        if (descRes.success && descRes.translation) {
          translatedDesc = descRes.translation;
        }
      }

      setEditingCategory({
        ...editingCategory,
        name_ar: translatedName,
        description_ar: translatedDesc,
      });

      setFeedback({ type: 'success', message: '✨ Arabic category translation generated!' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setFeedback({ type: 'error', message: 'Failed to auto-translate category.' });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setTranslating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory.name) return;

    setSaving(true);
    setFeedback(null);

    const res = await saveCategoryAction(editingCategory as SaveCategoryPayload);
    setSaving(false);

    if (res.success) {
      setFeedback({ type: 'success', message: 'Category saved successfully!' });
      setModalOpen(false);
      loadCategories();
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save category.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    const res = await deleteCategoryAction(id);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Category deleted.' });
      loadCategories();
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to delete category.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-plum-900">Categories Management</h1>
          <p className="text-xs text-ink-500 mt-1">Organize products into bilingual store categories and occasions.</p>
        </div>

        <button
          onClick={() => {
            setEditingCategory({
              name: '',
              name_ar: '',
              description: '',
              description_ar: '',
              image_url: '/demo-media/product_blush_bouquet.jpg',
              sort_order: categories.length + 1,
              active: true,
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-plum-900 hover:bg-plum-800 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
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
            <span className="text-xs font-medium">Loading categories...</span>
          </div>
        ) : (
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="border-b border-ink-100 text-ink-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Category (EN / AR)</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Sort Order</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-plum-900">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-cream-200 shrink-0 border border-ink-100">
                        <Image
                          src={cat.image_url || '/demo-media/product_blush_bouquet.jpg'}
                          alt={cat.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span>{cat.name}</span>
                        {cat.name_ar && (
                          <span className="block text-[11px] text-plum-700 font-arabic font-normal">{cat.name_ar}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-ink-500">/{cat.slug}</td>
                  <td className="py-3.5 px-4 font-bold">{cat.sort_order}</td>
                  <td className="py-3.5 px-4">
                    {cat.active ? (
                      <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-ink-400 flex items-center gap-1 font-semibold">
                        <XCircle className="w-4 h-4" />
                        <span>Inactive</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-end space-x-1 rtl:space-x-reverse">
                    <button
                      onClick={() => {
                        setEditingCategory({
                          id: cat.id,
                          name: cat.name,
                          name_ar: cat.name_ar || '',
                          slug: cat.slug,
                          description: cat.description,
                          description_ar: cat.description_ar || '',
                          image_url: cat.image_url,
                          sort_order: cat.sort_order,
                          active: cat.active,
                        });
                        setModalOpen(true);
                      }}
                      className="p-1.5 text-plum-800 hover:bg-plum-100 rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-ink-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl font-bold text-plum-900">
                {editingCategory.id ? 'Edit Category' : 'Create Category'}
              </h2>
              <button
                type="button"
                onClick={handleAutoTranslate}
                disabled={translating}
                className="inline-flex items-center gap-1.5 bg-blush-100 hover:bg-blush-200 text-plum-900 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors"
              >
                {translating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-gold-600" />}
                <span>{translating ? 'Translating...' : '✨ Generate Arabic'}</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-plum-900 mb-1">Category Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-plum-900 mb-1 font-arabic">اسم الفئة (العربية)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editingCategory.name_ar || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name_ar: e.target.value })}
                    className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-plum-900 mb-1">Description (English)</label>
                  <input
                    type="text"
                    value={editingCategory.description || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-plum-900 mb-1 font-arabic">الوصف (العربية)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editingCategory.description_ar || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description_ar: e.target.value })}
                    className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none font-arabic"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-plum-900 mb-1">Category Image (Cloudinary URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCategory.image_url || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, image_url: e.target.value })}
                    className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="bg-plum-100 hover:bg-plum-200 text-plum-900 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Choose</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-plum-900 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingCategory.sort_order ?? 0}
                    onChange={(e) => setEditingCategory({ ...editingCategory, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingCategory.active ?? true}
                      onChange={(e) => setEditingCategory({ ...editingCategory, active: e.target.checked })}
                      className="text-plum-800 rounded focus:ring-plum-800"
                    />
                    <span className="font-semibold text-plum-900">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-ink-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-ink-200 text-ink-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-plum-900 text-white font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? 'Saving...' : 'Save Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setEditingCategory({ ...editingCategory, image_url: url })}
        title="Select Category Image"
      />
    </div>
  );
}

