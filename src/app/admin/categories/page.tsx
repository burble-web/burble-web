'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, CheckCircle, XCircle } from 'lucide-react';
import { DEMO_CATEGORIES } from '@/lib/data/storefront';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory.name) return;

    if (editingCategory.id) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? ({ ...c, ...editingCategory } as Category) : c))
      );
    } else {
      const newCat: Category = {
        ...(editingCategory as Category),
        id: `cat-${Date.now()}`,
        slug: editingCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        active: true,
        sort_order: categories.length + 1,
        created_at: new Date().toISOString(),
      };
      setCategories([...categories, newCat]);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-plum-900">Categories Management</h1>
          <p className="text-xs text-ink-500 mt-1">Organize products into store categories and occasions.</p>
        </div>

        <button
          onClick={() => {
            setEditingCategory({ name: '', description: '', image_url: '/demo-media/product_blush_bouquet.jpg' });
            setModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 bg-plum-900 hover:bg-plum-800 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-ink-100 shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-ink-100 text-ink-500 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Sort Order</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-cream-50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-plum-900">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-cream-200 shrink-0 border border-ink-100">
                      <Image src={cat.image_url || '/demo-media/product_blush_bouquet.jpg'} alt={cat.name} fill className="object-cover" />
                    </div>
                    <span>{cat.name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono text-ink-500">/{cat.slug}</td>
                <td className="py-3.5 px-4 font-bold">{cat.sort_order}</td>
                <td className="py-3.5 px-4">
                  <span className="text-emerald-700 flex items-center space-x-1 font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    <span>Active</span>
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setModalOpen(true);
                    }}
                    className="p-1.5 text-plum-800 hover:bg-plum-100 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-plum-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-ink-100">
            <h2 className="font-serif text-2xl font-bold text-plum-900 mb-4">
              {editingCategory.id ? 'Edit Category' : 'Create Category'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-plum-900 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-plum-900 mb-1">Description</label>
                <input
                  type="text"
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-plum-900 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingCategory.image_url || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, image_url: e.target.value })}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-ink-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-ink-200 text-ink-700"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-plum-900 text-white font-semibold">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
