'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Loader2, Image as ImageIcon, Sparkles, FolderTree } from 'lucide-react';
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
    if (res.success && res.data) {
      setCategories(res.data);
    } else {
      setCategories([]);
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
              image_url: '',
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

      <div className="bg-white rounded-3xl p-6 border border-ink-200/80 shadow-2xs">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-ink-500">
            <Loader2 className="w-6 h-6 animate-spin mb-2 text-plum-800" />
            <span className="text-xs font-medium">Loading categories...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-ink-200 rounded-2xl bg-cream-50/30 p-8">
            <FolderTree className="w-10 h-10 text-ink-400 mx-auto mb-3 stroke-[1.5]" />
            <p className="font-serif text-base font-bold text-plum-950">No Categories Found</p>
            <p className="text-xs text-ink-600 font-medium mt-1">Create your first catalog category using the button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-ink-200">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100/90 border-b border-ink-200 text-ink-800 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Category (EN / AR)</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Sort Order</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-cream-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-plum-950">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-cream-200 shrink-0 border border-ink-200 flex items-center justify-center">
                          {cat.image_url ? (
                            <Image
                              src={cat.image_url}
                              alt={cat.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <FolderTree className="w-4 h-4 text-plum-600" />
                          )}
                        </div>
                        <div>
                          <span>{cat.name}</span>
                          {cat.name_ar && (
                            <span className="block text-[11px] text-plum-800 font-arabic font-semibold">{cat.name_ar}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-ink-600 font-medium">/{cat.slug}</td>
                    <td className="py-3.5 px-4 font-bold text-plum-950">{cat.sort_order}</td>
                    <td className="py-3.5 px-4">
                      {cat.active ? (
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
                        className="p-2 text-plum-900 hover:bg-plum-100/70 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
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
                {editingCategory.id ? 'Edit Category' : 'Create Category'}
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
                  <label className="block font-semibold text-plum-950 mb-1.5">Category Name (English) <span className="text-rose-600">*</span></label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5 font-arabic">اسم الفئة (العربية)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editingCategory.name_ar || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name_ar: e.target.value })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5">Description (English)</label>
                  <input
                    type="text"
                    value={editingCategory.description || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5 font-arabic">الوصف (العربية)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editingCategory.description_ar || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description_ar: e.target.value })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all font-arabic"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-plum-950 mb-1.5">Category Image (Cloudinary URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCategory.image_url || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, image_url: e.target.value })}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5">Display Order</label>
                  <input
                    type="number"
                    value={editingCategory.sort_order ?? 0}
                    onChange={(e) => setEditingCategory({ ...editingCategory, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingCategory.active ?? true}
                      onChange={(e) => setEditingCategory({ ...editingCategory, active: e.target.checked })}
                      className="text-plum-900 rounded focus:ring-plum-800"
                    />
                    <span className="font-semibold text-plum-950">Active</span>
                  </label>
                </div>
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

