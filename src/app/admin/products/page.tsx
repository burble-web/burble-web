'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';
import { DEMO_PRODUCTS, DEMO_CATEGORIES } from '@/lib/data/storefront';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = () => {
    setEditingProduct({
      name: '',
      slug: '',
      description: '',
      price: 250,
      compare_at_price: null,
      category_id: DEMO_CATEGORIES[0].id,
      is_featured: false,
      is_new_arrival: true,
      stock_status: 'in_stock',
      active: true,
      main_image_url: '/demo-media/product_blush_bouquet.jpg',
      sort_order: 1,
    });
    setModalOpen(true);
  };

  const handleEdit = (prod: Product) => {
    setEditingProduct(prod);
    setModalOpen(true);
  };

  const handleToggleActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name) return;

    if (editingProduct.id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? ({ ...p, ...editingProduct } as Product) : p))
      );
    } else {
      const newProd: Product = {
        ...(editingProduct as Product),
        id: `prod-${Date.now()}`,
        slug: editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProducts([newProd, ...products]);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-plum-900">Products Management</h1>
          <p className="text-xs text-ink-500 mt-1">Create, edit and prioritize store catalog products.</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center space-x-2 bg-plum-900 hover:bg-plum-800 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Product</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-ink-100 shadow-xs flex items-center max-w-md">
        <Search className="w-4 h-4 text-ink-400 mr-2" />
        <input
          type="text"
          placeholder="Filter products by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none bg-transparent"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl p-6 border border-ink-100 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-ink-100 text-ink-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream-200 shrink-0 border border-ink-100">
                        <Image src={product.main_image_url} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-plum-900">{product.name}</p>
                        <p className="text-[11px] text-ink-500 font-mono">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-plum-900">
                    QAR {product.price.toFixed(2)}
                    {product.compare_at_price && (
                      <span className="text-[11px] text-ink-400 line-through ml-1 font-normal">
                        QAR {product.compare_at_price.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        product.stock_status === 'in_stock'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {product.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 space-x-1">
                    {product.is_featured && (
                      <span className="bg-plum-100 text-plum-900 px-2 py-0.5 rounded-md text-[10px] font-bold">Featured</span>
                    )}
                    {product.is_new_arrival && (
                      <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md text-[10px] font-bold">New</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(product.id)}
                      className="flex items-center space-x-1 text-xs font-semibold focus:outline-none"
                    >
                      {product.active ? (
                        <span className="text-emerald-700 flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="text-ink-400 flex items-center space-x-1">
                          <XCircle className="w-4 h-4" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-1.5 text-plum-800 hover:bg-plum-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Edit Modal */}
      {modalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-plum-950/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-ink-100 max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-2xl font-bold text-plum-900 mb-4">
              {editingProduct.id ? 'Edit Product' : 'Create New Product'}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-plum-900 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-plum-900 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-plum-900 mb-1">Price (QAR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-plum-900 mb-1">Compare Price (QAR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.compare_at_price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, compare_at_price: e.target.value ? parseFloat(e.target.value) : null })}
                    className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-plum-900 mb-1">Main Image URL / Cloudinary Path *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.main_image_url || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, main_image_url: e.target.value })}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                    className="text-plum-800 rounded focus:ring-plum-800"
                  />
                  <span className="font-semibold text-plum-900">Featured</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_new_arrival || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_new_arrival: e.target.checked })}
                    className="text-plum-800 rounded focus:ring-plum-800"
                  />
                  <span className="font-semibold text-plum-900">New Arrival</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.active ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, active: e.target.checked })}
                    className="text-plum-800 rounded focus:ring-plum-800"
                  />
                  <span className="font-semibold text-plum-900">Active</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-ink-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-ink-200 text-ink-700 font-semibold hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-semibold shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
