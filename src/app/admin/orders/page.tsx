'use client';

import React, { useState } from 'react';
import { ShoppingBag, MessageSquare, Banknote, Search, Filter } from 'lucide-react';
import { Order, OrderStatus } from '@/types';

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-1',
    order_number: 'BURBLE-20261007-4819',
    source: 'whatsapp',
    customer_name: 'Fatima Al-Thani',
    customer_email: 'fatima@example.com',
    customer_phone: '+974 5555 1234',
    delivery_address: 'Villa 14, West Bay Lagoon',
    city: 'Doha',
    subtotal: 555.00,
    shipping_fee: 25.00,
    total_amount: 580.00,
    status: 'confirmed',
    email_sent: true,
    created_at: new Date().toISOString(),
    order_items: [
      { product_name: 'Blush Elegance Bouquet', price: 280, quantity: 1, total: 280 },
      { product_name: 'Classic Red Roses Vase', price: 275, quantity: 1, total: 275 },
    ],
  },
  {
    id: 'ord-2',
    order_number: 'BURBLE-20261007-9102',
    source: 'cod',
    customer_name: 'Rashid Mansoor',
    customer_email: 'rashid@example.com',
    customer_phone: '+974 6666 8899',
    delivery_address: 'Building 45, Pearl Qatar',
    city: 'Doha',
    subtotal: 320.00,
    shipping_fee: 0.00,
    total_amount: 320.00,
    status: 'pending',
    email_sent: true,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    order_items: [
      { product_name: 'Pastel Dream Bouquet', price: 320, quantity: 1, total: 320 },
    ],
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_DEMO_ORDERS);
  const [sourceFilter, setSourceFilter] = useState<'all' | 'whatsapp' | 'cod'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesSource = sourceFilter === 'all' || o.source === sourceFilter;
    const matchesSearch =
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-plum-900">Orders Management</h1>
        <p className="text-xs text-ink-500 mt-1">Monitor, filter and update customer order fulfillment statuses.</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-ink-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="text"
            placeholder="Search by order # or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream-50 border border-ink-100 rounded-xl pl-9 pr-4 py-2 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-ink-400" />
          <button
            onClick={() => setSourceFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold ${
              sourceFilter === 'all' ? 'bg-plum-900 text-white' : 'bg-cream-100 text-ink-700'
            }`}
          >
            All Sources
          </button>
          <button
            onClick={() => setSourceFilter('cod')}
            className={`px-3 py-1.5 rounded-lg font-semibold ${
              sourceFilter === 'cod' ? 'bg-plum-900 text-white' : 'bg-cream-100 text-ink-700'
            }`}
          >
            COD Only
          </button>
          <button
            onClick={() => setSourceFilter('whatsapp')}
            className={`px-3 py-1.5 rounded-lg font-semibold ${
              sourceFilter === 'whatsapp' ? 'bg-emerald-600 text-white' : 'bg-cream-100 text-ink-700'
            }`}
          >
            WhatsApp Only
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-ink-100 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-ink-100 text-ink-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer & Address</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-plum-900">
                    #{order.order_number}
                    <p className="text-[10px] text-ink-400 font-normal font-sans">
                      {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-plum-900">{order.customer_name}</p>
                    <p className="text-[11px] text-ink-500">{order.customer_phone}</p>
                    <p className="text-[11px] text-ink-500 truncate max-w-xs">{order.delivery_address}, {order.city}</p>
                  </td>
                  <td className="py-4 px-4">
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
                  <td className="py-4 px-4">
                    <ul className="space-y-0.5 text-[11px] text-ink-700">
                      {order.order_items?.map((item, idx) => (
                        <li key={idx}>
                          • {item.product_name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-4 px-4 font-bold text-plum-900">
                    QAR {order.total_amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="bg-cream-50 border border-ink-100 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-plum-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
