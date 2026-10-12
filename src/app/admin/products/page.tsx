'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Search, Loader2, Image as ImageIcon, Sparkles, Globe } from 'lucide-react';
import { Product, Category } from '@/types';
import {
  getAdminProductsAction,
  saveProductAction,
  deleteProductAction,
  toggleProductActiveAction,
  SaveProductPayload,
} from '@/app/actions/product';
import { getAdminCategoriesAction } from '@/app/actions/category';
import { translateTextAction } from '@/app/actions/translate';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [editingProduct, setEditingProduct] = useState<Partial<SaveProductPayload> | null>(null);

  // Media Picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [pickerTargetField, setPickerTargetField] = useState<'main' | 'hover'>('main');

  const loadData = async () => {
    setLoading(true);
    const prodRes = await getAdminProductsAction();
    const catRes = await getAdminCategoriesAction();

    if (catRes.success && catRes.data) {
      setCategories(catRes.data);
    } else {
      setCategories([]);
    }

    if (prodRes.success && prodRes.data) {
      setProducts(prodRes.data);
    } else {
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.name_ar && p.name_ar.includes(searchQuery)) ||
      p.slug.toLowerCase().includes(q)
    );
  });

  const handleCreateNew = () => {
    setEditingProduct({
      name: '',
      name_ar: '',
      slug: '',
      description: '',
      description_ar: '',
      short_description: '',
      short_description_ar: '',
      arabic_translation_source: 'manual',
      price: 250,
      compare_at_price: null,
      category_id: categories[0]?.id || null,
      is_featured: false,
      is_new_arrival: true,
      stock_status: 'in_stock',
      active: true,
      main_image_url: '',
      hover_image_url: null,
      sort_order: 1,
    });
    setModalOpen(true);
  };

  const handleEdit = (prod: Product) => {
    setEditingProduct({
      id: prod.id,
      name: prod.name,
      name_ar: prod.name_ar || '',
      slug: prod.slug,
      description: prod.description || '',
      description_ar: prod.description_ar || '',
      short_description: prod.short_description || '',
      short_description_ar: prod.short_description_ar || '',
      arabic_translation_source: prod.arabic_translation_source || (prod.name_ar ? 'manual' : 'auto'),
      price: prod.price,
      compare_at_price: prod.compare_at_price,
      category_id: prod.category_id,
      is_featured: prod.is_featured,
      is_new_arrival: prod.is_new_arrival,
      stock_status: prod.stock_status,
      active: prod.active,
      main_image_url: prod.main_image_url,
      hover_image_url: prod.hover_image_url,
      sort_order: prod.sort_order,
    });
    setModalOpen(true);
  };

  const handleAutoTranslateArabic = async () => {
    if (!editingProduct?.name || editingProduct.name.trim().length === 0) {
      setFeedback({ type: 'error', message: 'Please enter an English product name first.' });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setTranslating(true);
    try {
      const nameRes = await translateTextAction(editingProduct.name.trim(), 'product_name');
      const translatedName = nameRes.success && nameRes.translation ? nameRes.translation : (editingProduct.name_ar || '');

      let translatedDesc = editingProduct.description_ar || '';
      if (editingProduct.description && editingProduct.description.trim().length > 0 && !editingProduct.description_ar) {
        const descRes = await translateTextAction(editingProduct.description.trim(), 'product_description');
        if (descRes.success && descRes.translation) {
          translatedDesc = descRes.translation;
        }
      }

      setEditingProduct({
        ...editingProduct,
        name_ar: translatedName,
        description_ar: translatedDesc,
        arabic_translation_source: 'automatic',
      });

      setFeedback({ type: 'success', message: '✨ Arabic translation generated successfully!' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (e: any) {
      setFeedback({ type: 'error', message: 'Failed to generate translation. You can still type Arabic manually.' });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setTranslating(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const res = await toggleProductActiveAction(id, !currentActive);
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
      );
      setFeedback({ type: 'success', message: 'Product status updated.' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to update status.' });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const res = await deleteProductAction(id);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setFeedback({ type: 'success', message: 'Product deleted successfully.' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to delete product.' });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || editingProduct.price === undefined) return;

    setSaving(true);
    setFeedback(null);

    const res = await saveProductAction(editingProduct as SaveProductPayload);
    setSaving(false);

    if (res.success) {
      setFeedback({ type: 'success', message: 'Product saved successfully!' });
      setModalOpen(false);
      loadData();
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Unable to save product. Please check fields.' });
    }
  };

  const handleOpenMediaPicker = (field: 'main' | 'hover') => {
    setPickerTargetField(field);
    setMediaPickerOpen(true);
  };

  const handleMediaSelect = (url: string) => {
    if (editingProduct) {
      if (pickerTargetField === 'main') {
        setEditingProduct({ ...editingProduct, main_image_url: url });
      } else {
        setEditingProduct({ ...editingProduct, hover_image_url: url });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-plum-900">Products Management</h1>
          <p className="text-xs text-ink-500 mt-1">Create, edit and prioritize bilingual English & Arabic catalog products.</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 bg-plum-900 hover:bg-plum-800 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Product</span>
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

      {/* Search Bar */}
      <div className="bg-white px-4 py-2.5 rounded-xl border border-ink-200 shadow-2xs flex items-center max-w-md focus-within:border-plum-800 focus-within:ring-2 focus-within:ring-plum-800/20 transition-all">
        <Search className="w-4 h-4 text-ink-400 mr-2.5 rtl:mr-0 rtl:ml-2.5 shrink-0" />
        <input
          type="text"
          placeholder="Filter products by English or Arabic name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none bg-transparent"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl p-6 border border-ink-200/80 shadow-2xs">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-ink-500">
            <Loader2 className="w-6 h-6 animate-spin mb-2 text-plum-800" />
            <span className="text-xs font-medium">Loading catalog products...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-ink-200 rounded-2xl bg-cream-50/30 p-8">
            <ImageIcon className="w-10 h-10 text-ink-400 mx-auto mb-3 stroke-[1.5]" />
            <p className="font-serif text-base font-bold text-plum-950">No Products Found</p>
            <p className="text-xs text-ink-600 font-medium mt-1">
              {searchQuery ? 'No products matched your search query.' : 'Create your first catalog product using the button above.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-ink-200">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100/90 border-b border-ink-200 text-ink-800 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Product Name (EN / AR)</th>
                  <th className="py-3.5 px-4">Arabic Status</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Badges</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-cream-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream-200 shrink-0 border border-ink-200">
                          <Image src={product.main_image_url} alt={product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-plum-950">{product.name}</p>
                          {product.name_ar && (
                            <p className="text-[11px] text-plum-800 font-arabic font-semibold">{product.name_ar}</p>
                          )}
                          <p className="text-[10px] text-ink-500 font-mono">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {product.name_ar ? (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          product.arabic_translation_source === 'automatic' || product.arabic_translation_source === 'auto'
                            ? 'bg-blue-50 text-blue-950 border-blue-200'
                            : 'bg-emerald-50 text-emerald-950 border-emerald-200'
                        }`}>
                          <Globe className="w-3 h-3" />
                          {product.arabic_translation_source === 'automatic' || product.arabic_translation_source === 'auto' ? 'Auto-Translated' : 'Manual Arabic'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-950 border border-amber-200">
                          Missing Arabic
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-plum-950">
                      QAR {product.price.toFixed(2)}
                      {product.compare_at_price && (
                        <span className="text-[11px] text-ink-500 line-through ml-1 font-normal">
                          QAR {product.compare_at_price.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          product.stock_status === 'in_stock'
                            ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                            : 'bg-rose-50 text-rose-950 border-rose-200'
                        }`}
                      >
                        {product.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 space-x-1 rtl:space-x-reverse">
                      {product.is_featured && (
                        <span className="bg-plum-50 text-plum-950 border border-plum-200 px-2 py-0.5 rounded-md text-[10px] font-bold">Featured</span>
                      )}
                      {product.is_new_arrival && (
                        <span className="bg-amber-50 text-amber-950 border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold">New</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(product.id, product.active)}
                        className="flex items-center gap-1 text-xs font-semibold focus:outline-none cursor-pointer"
                      >
                        {product.active ? (
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
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-end space-x-1 rtl:space-x-reverse">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-plum-900 hover:bg-plum-100/70 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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

      {/* Product Edit Modal */}
      {modalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-plum-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-ink-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl font-bold text-plum-950">
                {editingProduct.id ? 'Edit Product' : 'Create New Product'}
              </h2>
              <button
                type="button"
                onClick={handleAutoTranslateArabic}
                disabled={translating}
                className="inline-flex items-center gap-1.5 bg-blush-100 hover:bg-blush-200 text-plum-950 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                title="Auto-translate English text to natural Arabic"
              >
                {translating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-gold-600" />}
                <span>{translating ? 'Translating...' : '✨ Generate Arabic'}</span>
              </button>
            </div>

            <p className="text-[11px] text-ink-600 mb-6 bg-cream-50 p-3 rounded-xl border border-ink-200/80">
              💡 <strong>Bilingual Policy:</strong> Leave Arabic fields empty to generate natural Arabic automatically from English content. Manually typed Arabic is always preserved and never overwritten.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Dual Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5">Product Name (English) <span className="text-rose-600">*</span></label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Royal Rose Symphony"
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5 font-arabic">اسم المنتج (العربية)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editingProduct.name_ar || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_ar: e.target.value, arabic_translation_source: 'manual' })}
                    placeholder="مثال: سيمفونية الورد الملكي"
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all font-arabic"
                  />
                </div>
              </div>

              {/* Dual Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5">Description (English)</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    placeholder="Detailed floral arrangement description..."
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5 font-arabic">الوصف (العربية)</label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={editingProduct.description_ar || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description_ar: e.target.value, arabic_translation_source: 'manual' })}
                    placeholder="وصف تنسيق الزهور بالتفصيل..."
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all font-arabic"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5">Price (QAR) <span className="text-rose-600">*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={editingProduct.price ?? 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5">Compare Price (QAR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.compare_at_price ?? ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        compare_at_price: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5">Category</label>
                  <select
                    value={editingProduct.category_id || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value || null })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  >
                    <option value="">No Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-plum-950 mb-1.5">Stock Status</label>
                  <select
                    value={editingProduct.stock_status || 'in_stock'}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock_status: e.target.value as 'in_stock' | 'out_of_stock',
                      })
                    }
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Main Image with Cloudinary Picker */}
              <div>
                <label className="block font-semibold text-plum-950 mb-1.5">Main Image (Cloudinary URL) <span className="text-rose-600">*</span></label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editingProduct.main_image_url || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, main_image_url: e.target.value })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleOpenMediaPicker('main')}
                    className="bg-cream-100 hover:bg-cream-200 text-plum-950 border border-ink-200 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-plum-800" />
                    <span>Choose</span>
                  </button>
                </div>
              </div>

              {/* Hover Image */}
              <div>
                <label className="block font-semibold text-plum-950 mb-1.5">Hover Image (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingProduct.hover_image_url || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, hover_image_url: e.target.value })}
                    className="w-full bg-cream-50/50 border border-ink-200 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleOpenMediaPicker('hover')}
                    className="bg-cream-100 hover:bg-cream-200 text-plum-950 border border-ink-200 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-plum-800" />
                    <span>Choose</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                    className="text-plum-900 rounded focus:ring-plum-800"
                  />
                  <span className="font-semibold text-plum-950">Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_new_arrival || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_new_arrival: e.target.checked })}
                    className="text-plum-900 rounded focus:ring-plum-800"
                  />
                  <span className="font-semibold text-plum-950">New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.active ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, active: e.target.checked })}
                    className="text-plum-900 rounded focus:ring-plum-800"
                  />
                  <span className="font-semibold text-plum-950">Active</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-ink-200">
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
                  className="px-6 py-2.5 rounded-xl bg-plum-900 hover:bg-plum-800 disabled:opacity-50 text-white font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{saving ? 'Saving...' : 'Save Product'}</span>
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
        onSelect={handleMediaSelect}
        title={`Select ${pickerTargetField === 'main' ? 'Main' : 'Hover'} Product Image`}
      />
    </div>
  );
}

