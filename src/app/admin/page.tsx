import React from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, FolderTree, ArrowRight, DollarSign, MessageSquare, Banknote } from 'lucide-react';
import { DEMO_PRODUCTS, DEMO_CATEGORIES } from '@/lib/data/storefront';

const RECENT_DEMO_ORDERS = [
  { id: '1', number: 'BURBLE-20261007-4819', name: 'Fatima Al-Thani', source: 'whatsapp', total: 580.00, status: 'confirmed', date: 'Just now' },
  { id: '2', number: 'BURBLE-20261007-9102', name: 'Rashid Mansoor', source: 'cod', total: 320.00, status: 'pending', date: '25 mins ago' },
  { id: '3', number: 'BURBLE-20261007-1283', name: 'Aisha K.', source: 'whatsapp', total: 290.00, status: 'delivered', date: '2 hours ago' },
  { id: '4', number: 'BURBLE-20261007-7731', name: 'Mohammed H.', source: 'cod', total: 350.00, status: 'out_for_delivery', date: '5 hours ago' },
];

export default async function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-plum-900">Dashboard Overview</h1>
        <p className="text-xs text-ink-500 mt-1">Welcome back to Burble store management panel.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-ink-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-plum-100 text-plum-900 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-ink-500 font-medium">Total Sales</p>
            <h3 className="font-serif text-2xl font-bold text-plum-900">QAR 1,540.00</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ink-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-plum-100 text-plum-900 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-ink-500 font-medium">Orders Count</p>
            <h3 className="font-serif text-2xl font-bold text-plum-900">4 Orders</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ink-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-plum-100 text-plum-900 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-ink-500 font-medium">Active Products</p>
            <h3 className="font-serif text-2xl font-bold text-plum-900">{DEMO_PRODUCTS.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ink-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-plum-100 text-plum-900 rounded-xl">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-ink-500 font-medium">Categories</p>
            <h3 className="font-serif text-2xl font-bold text-plum-900">{DEMO_CATEGORIES.length}</h3>
          </div>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl p-6 border border-ink-100 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-bold text-plum-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-plum-800 hover:text-plum-700 flex items-center space-x-1">
            <span>Manage All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-ink-100 text-ink-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {RECENT_DEMO_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-plum-900">#{order.number}</td>
                  <td className="py-3.5 px-4 font-medium text-ink-900">{order.name}</td>
                  <td className="py-3.5 px-4">
                    {order.source === 'whatsapp' ? (
                      <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-200">
                        <MessageSquare className="w-3 h-3 text-emerald-600 fill-current" />
                        <span>WHATSAPP</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 bg-plum-50 text-plum-900 px-2.5 py-1 rounded-full text-[10px] font-bold border border-plum-200">
                        <Banknote className="w-3 h-3 text-plum-800" />
                        <span>COD</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-plum-900">QAR {order.total.toFixed(2)}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-bold border border-amber-200 uppercase">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-ink-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
