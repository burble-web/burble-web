'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, MessageSquare, Banknote, Search, Filter, Loader2, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { getAdminOrdersAction, updateOrderStatusAction } from '@/app/actions/order';
import { useLocale } from '@/lib/i18n/context';

const ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<'all' | 'whatsapp' | 'cod'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { formatPrice, locale } = useLocale();

  const loadOrders = async () => {
    setLoading(true);
    const res = await getAdminOrdersAction();
    if (res.success && res.data) {
      setOrders(res.data);
    } else {
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesSource = sourceFilter === 'all' || o.source === sourceFilter;
    const matchesSearch =
      (o.order_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customer_phone || '').includes(searchQuery);
    return matchesSource && matchesSearch;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    const res = await updateOrderStatusAction(orderId, newStatus);
    setUpdatingId(null);

    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setFeedback({ type: 'success', message: `Order status updated to ${newStatus}.` });
      setTimeout(() => setFeedback(null), 2500);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to update order status.' });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-plum-900">Orders Management</h1>
          <p className="text-xs text-ink-500 mt-1">Monitor, filter and update real-time customer order fulfillment statuses.</p>
        </div>

        <button
          onClick={loadOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-cream-200 hover:bg-cream-300 text-plum-900 px-4 py-2 rounded-xl text-xs font-semibold transition-colors border border-ink-100"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-ink-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
          <input
            type="text"
            placeholder="Search by order #, name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream-50 border border-ink-200 rounded-xl ps-9 pe-4 py-2 text-xs text-ink-950 font-medium placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/30 focus:border-plum-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-ink-500 shrink-0" />
          <button
            onClick={() => setSourceFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
              sourceFilter === 'all'
                ? 'bg-plum-900 text-white shadow-xs'
                : 'bg-cream-100 text-ink-800 hover:bg-cream-200 border border-ink-200'
            }`}
          >
            All Sources ({orders.length})
          </button>
          <button
            onClick={() => setSourceFilter('whatsapp')}
            className={`px-3.5 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
              sourceFilter === 'whatsapp'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-cream-100 text-emerald-950 hover:bg-emerald-50 border border-emerald-300'
            }`}
          >
            WhatsApp ({orders.filter((o) => o.source === 'whatsapp').length})
          </button>
          <button
            onClick={() => setSourceFilter('cod')}
            className={`px-3.5 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
              sourceFilter === 'cod'
                ? 'bg-plum-900 text-white shadow-xs'
                : 'bg-cream-100 text-plum-950 hover:bg-plum-50 border border-plum-300'
            }`}
          >
            Cash on Delivery ({orders.filter((o) => o.source === 'cod').length})
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-ink-200/80 shadow-xs">
        {loading ? (
          <div className="py-16 text-center text-ink-500 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-plum-800 mb-2" />
            <span className="text-xs font-medium">Loading customer orders from database...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-ink-200 rounded-2xl">
            <ShoppingBag className="w-12 h-12 text-ink-400 mx-auto mb-3 stroke-[1.5]" />
            <p className="font-serif text-lg font-bold text-plum-950">No Orders Found</p>
            <p className="text-xs text-ink-600 font-medium mt-1 max-w-sm mx-auto">
              {searchQuery || sourceFilter !== 'all'
                ? 'Try adjusting your search criteria or filter options.'
                : 'Customer orders placed via WhatsApp or COD will appear here in real time.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-ink-100">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100/90 border-b border-ink-200 text-ink-800 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Placed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream-50/80 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-plum-950 whitespace-nowrap">
                      #{order.order_number}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-ink-950 text-xs">{order.customer_name}</div>
                      <div className="text-[11px] text-ink-600 font-medium">{order.customer_phone}</div>
                      <div className="text-[11px] text-ink-500 truncate max-w-xs">{order.delivery_address}, {order.city}</div>
                    </td>
                    <td className="py-4 px-4">
                      {order.order_items && order.order_items.length > 0 ? (
                        <div className="space-y-1 max-w-xs">
                          {order.order_items.map((item, idx) => (
                            <div key={idx} className="text-xs text-ink-800 flex justify-between font-medium">
                              <span className="truncate">{item.product_name} × {item.quantity}</span>
                              <span className="font-bold ms-2 text-plum-950">{formatPrice(item.total)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-ink-400 italic">No item snapshot</span>
                      )}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {order.source === 'whatsapp' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-300">
                          <MessageSquare className="w-3 h-3 text-emerald-700 fill-current" />
                          <span>WHATSAPP</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-plum-100 text-plum-950 px-2.5 py-1 rounded-full text-[10px] font-bold border border-plum-300">
                          <Banknote className="w-3 h-3 text-plum-800" />
                          <span>COD</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-bold text-plum-950 text-sm">
                        {formatPrice(order.total_amount)}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border shadow-xs focus:outline-none cursor-pointer ${
                          order.status === 'delivered' ? 'bg-emerald-100 text-emerald-950 border-emerald-300' :
                          order.status === 'cancelled' ? 'bg-rose-100 text-rose-950 border-rose-300' :
                          order.status === 'out_for_delivery' ? 'bg-indigo-100 text-indigo-950 border-indigo-300' :
                          'bg-amber-100 text-amber-950 border-amber-300'
                        }`}
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st.replace(/_/g, ' ').toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-ink-700 font-medium text-[11px]">
                      {new Date(order.created_at).toLocaleDateString(locale === 'ar' ? 'ar-QA' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
