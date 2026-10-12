'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  MessageSquare,
  Banknote,
  Search,
  Loader2,
  RefreshCw,
  Copy,
  Check,
  Eye,
  X,
  Phone,
  Mail,
  MapPin,
  Flower,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Order, OrderStatus, OrderSource } from '@/types';
import { getAdminOrdersAction, updateOrderStatusAction } from '@/app/actions/order';
import { useLocale } from '@/lib/i18n/context';
import { formatDate } from '@/lib/i18n/utils';
import { normalizeWhatsAppNumber } from '@/lib/whatsapp/message';

const ALL_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

type DateRangeFilter = 'all' | 'today' | 'last_7_days' | 'last_30_days';
type SortOption = 'newest' | 'oldest' | 'highest_amount' | 'lowest_amount';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | OrderSource>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [clientNow, setClientNow] = useState<number | null>(null);

  const { formatPrice, locale, direction, t } = useLocale();
  const isAr = locale === 'ar';

  const loadOrders = async () => {
    setLoading(true);
    const res = await getAdminOrdersAction();
    if (res.success && res.data) {
      setOrders(res.data);
      if (selectedOrder) {
        const updated = res.data.find((o) => o.id === selectedOrder.id);
        if (updated) setSelectedOrder(updated);
      }
    } else {
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    setClientNow(Date.now());
    loadOrders();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    const res = await updateOrderStatusAction(orderId, newStatus);
    setUpdatingId(null);

    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      setFeedback({
        type: 'success',
        message: t.admin.statusUpdated || `Order status updated to ${newStatus}.`,
      });
      setTimeout(() => setFeedback(null), 2500);
    } else {
      setFeedback({
        type: 'error',
        message: res.error || 'Failed to update order status.',
      });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  // Filtered & Sorted orders computation
  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders
      .filter((order) => {
        // Status filter
        if (statusFilter !== 'all' && order.status !== statusFilter) {
          return false;
        }

        // Source filter
        if (sourceFilter !== 'all' && order.source !== sourceFilter) {
          return false;
        }

        // Date range filter
        if (dateRangeFilter !== 'all' && clientNow) {
          const orderTimestamp = new Date(order.created_at).getTime();
          const oneDayMs = 24 * 60 * 60 * 1000;
          if (dateRangeFilter === 'today') {
            const todayStart = new Date(clientNow);
            todayStart.setHours(0, 0, 0, 0);
            if (orderTimestamp < todayStart.getTime()) return false;
          } else if (dateRangeFilter === 'last_7_days') {
            if (orderTimestamp < clientNow - 7 * oneDayMs) return false;
          } else if (dateRangeFilter === 'last_30_days') {
            if (orderTimestamp < clientNow - 30 * oneDayMs) return false;
          }
        }

        // Search query filter
        if (query) {
          const orderNum = (order.order_number || '').toLowerCase();
          const customerName = (order.customer_name || '').toLowerCase();
          const customerPhone = (order.customer_phone || '').toLowerCase();
          const customerEmail = (order.customer_email || '').toLowerCase();
          const city = (order.city || '').toLowerCase();
          const address = (order.delivery_address || '').toLowerCase();
          const itemsMatch = (order.order_items || []).some(
            (it) =>
              (it.product_name || '').toLowerCase().includes(query) ||
              (it.product_name_ar || '').toLowerCase().includes(query)
          );

          if (
            !orderNum.includes(query) &&
            !customerName.includes(query) &&
            !customerPhone.includes(query) &&
            !customerEmail.includes(query) &&
            !city.includes(query) &&
            !address.includes(query) &&
            !itemsMatch
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortOption === 'oldest') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortOption === 'highest_amount') {
          return Number(b.total_amount) - Number(a.total_amount);
        }
        if (sortOption === 'lowest_amount') {
          return Number(a.total_amount) - Number(b.total_amount);
        }
        return 0;
      });
  }, [orders, statusFilter, sourceFilter, dateRangeFilter, searchQuery, sortOption]);

  const getStatusBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300';
      case 'cancelled':
        return 'bg-rose-100 text-rose-950 border-rose-300';
      case 'out_for_delivery':
        return 'bg-indigo-100 text-indigo-950 border-indigo-300';
      case 'processing':
        return 'bg-purple-100 text-purple-950 border-purple-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-950 border-blue-300';
      case 'pending':
      default:
        return 'bg-amber-100 text-amber-950 border-amber-300';
    }
  };

  const getStatusLabel = (st: OrderStatus) => {
    const key = `status${st.charAt(0).toUpperCase() + st.slice(1)}` as keyof typeof t.admin;
    return t.admin[key] || st.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Refresh Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-ink-200">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-plum-950">
            {t.admin.orders}
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 font-medium mt-1">
            {isAr
              ? 'مراقبة وإدارة كافة طلبات العملاء وتحديث حالات التوصيل في الوقت الفعلي.'
              : 'Monitor, filter, and manage real-time customer order fulfillment.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadOrders}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-white hover:bg-cream-200 text-plum-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-ink-200 shadow-2xs disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-plum-800 ${loading ? 'animate-spin' : ''}`} />
            <span>{t.admin.refreshOrders}</span>
          </button>
        </div>
      </div>

      {/* Toast Alert Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold border flex items-center gap-2.5 shadow-xs transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Interactive Filtering & Search Control Panel */}
      <div className="bg-white p-5 rounded-3xl border border-ink-200 shadow-xs space-y-4">
        
        {/* Row 1: Search & Date / Sorting dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
            <input
              type="text"
              placeholder={t.admin.searchOrdersPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cream-100/70 border border-ink-200 rounded-xl ps-9 pe-4 py-2.5 text-xs text-ink-950 font-semibold placeholder:text-ink-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-plum-800 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Date Range Selector */}
          <div className="md:col-span-3">
            <select
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value as DateRangeFilter)}
              className="w-full bg-cream-100/70 border border-ink-200 rounded-xl px-3 py-2.5 text-xs text-ink-950 font-bold focus:outline-none focus:ring-2 focus:ring-plum-800 focus:bg-white transition-all cursor-pointer"
            >
              <option value="all">{t.admin.filterByDate}: {t.admin.allTime}</option>
              <option value="today">{t.admin.today}</option>
              <option value="last_7_days">{t.admin.last7Days}</option>
              <option value="last_30_days">{t.admin.last30Days}</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="w-full bg-cream-100/70 border border-ink-200 rounded-xl px-3 py-2.5 text-xs text-ink-950 font-bold focus:outline-none focus:ring-2 focus:ring-plum-800 focus:bg-white transition-all cursor-pointer"
            >
              <option value="newest">{t.admin.sortBy}: {t.admin.newestFirst}</option>
              <option value="oldest">{t.admin.sortBy}: {t.admin.oldestFirst}</option>
              <option value="highest_amount">{t.admin.sortBy}: {t.admin.highestAmount}</option>
              <option value="lowest_amount">{t.admin.sortBy}: {t.admin.lowestAmount}</option>
            </select>
          </div>
        </div>

        {/* Row 2: Status Chips & Source Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-ink-100">
          
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-plum-900 text-white shadow-2xs'
                  : 'bg-cream-100 text-ink-700 hover:bg-cream-200 border border-ink-200'
              }`}
            >
              {t.admin.allStatuses} ({orders.length})
            </button>
            {ALL_STATUSES.map((st) => {
              const count = orders.filter((o) => o.status === st).length;
              const isSelected = statusFilter === st;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-plum-900 text-white shadow-2xs'
                      : 'bg-cream-100 text-ink-700 hover:bg-cream-200 border border-ink-200'
                  }`}
                >
                  <span>{getStatusLabel(st)}</span>
                  <span className="ms-1.5 text-[10px] opacity-80">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Source Filter Options */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                sourceFilter === 'all'
                  ? 'bg-plum-900 text-white shadow-2xs'
                  : 'bg-cream-100 text-ink-700 hover:bg-cream-200 border border-ink-200'
              }`}
            >
              {t.admin.allSources}
            </button>
            <button
              onClick={() => setSourceFilter('whatsapp')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                sourceFilter === 'whatsapp'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-cream-100 text-emerald-950 hover:bg-emerald-50 border border-emerald-300'
              }`}
            >
              <MessageSquare className="w-3 h-3 text-emerald-700 fill-current" />
              <span>{t.admin.sourceWhatsApp}</span>
            </button>
            <button
              onClick={() => setSourceFilter('cod')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                sourceFilter === 'cod'
                  ? 'bg-plum-900 text-white shadow-2xs'
                  : 'bg-cream-100 text-plum-950 hover:bg-plum-50 border border-plum-300'
              }`}
            >
              <Banknote className="w-3 h-3 text-plum-800" />
              <span>{t.admin.sourceCOD}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink-200 shadow-xs">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-plum-900 mb-2" />
            <span className="text-xs font-bold text-ink-600">
              {isAr ? 'جاري تحميل سجلات الطلبات من قاعدة البيانات...' : 'Loading customer orders from database...'}
            </span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-ink-200 rounded-2xl bg-cream-100/40 p-6">
            <div className="w-14 h-14 rounded-2xl bg-cream-200 text-ink-500 flex items-center justify-center mx-auto mb-3 border border-ink-200">
              <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
            </div>
            <p className="font-serif text-xl font-bold text-plum-950">{t.admin.noOrdersFound}</p>
            <p className="text-xs text-ink-600 font-medium mt-1 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all' || sourceFilter !== 'all' || dateRangeFilter !== 'all'
                ? t.admin.adjustFilters
                : t.admin.ordersAppearRealTime}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-ink-200">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100/90 border-b border-ink-200 text-ink-800 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 text-start">{t.admin.orderReference}</th>
                  <th className="py-3.5 px-4 text-start">{t.admin.items}</th>
                  <th className="py-3.5 px-4 text-start">{t.admin.customer}</th>
                  <th className="py-3.5 px-4 text-start">{t.admin.deliveryAddress}</th>
                  <th className="py-3.5 px-4 text-start">{t.admin.source}</th>
                  <th className="py-3.5 px-4 text-start">{t.admin.total}</th>
                  <th className="py-3.5 px-4 text-start">{t.admin.status}</th>
                  <th className="py-3.5 px-4 text-start">{t.admin.date}</th>
                  <th className="py-3.5 px-4 text-end">{t.admin.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {filteredOrders.map((order) => {
                  const firstItem = order.order_items?.[0];
                  const itemCount = order.order_items?.length || 0;
                  const itemThumbnail = firstItem?.image_url || firstItem?.product?.main_image_url;

                  return (
                    <tr key={order.id} className="hover:bg-cream-100/60 transition-colors">
                      
                      {/* 1. Order Reference + Copy Action */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-plum-950 text-xs">
                            #{order.order_number}
                          </span>
                          <button
                            onClick={() => handleCopy(order.order_number, order.id)}
                            className="p-1 rounded-md text-ink-400 hover:text-plum-900 hover:bg-cream-200 transition-colors"
                            title={t.admin.copyReference}
                            aria-label={t.admin.copyReference}
                          >
                            {copiedId === order.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <span className="text-[10px] text-ink-500 font-mono block mt-0.5">
                          {order.city || 'Doha, Qatar'}
                        </span>
                      </td>

                      {/* 2. Product Thumbnails & Stack */}
                      <td className="py-4 px-4 min-w-[200px]">
                        <div className="flex items-center gap-2.5">
                          {/* Thumbnail / Stack */}
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-cream-200 shrink-0 border border-ink-200 flex items-center justify-center">
                            {itemThumbnail ? (
                              <Image
                                src={itemThumbnail}
                                alt={firstItem?.product_name || 'Product'}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            ) : (
                              <Flower className="w-5 h-5 text-plum-700" />
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="min-w-0">
                            <p className="font-bold text-plum-950 truncate max-w-[170px]" title={firstItem?.product_name}>
                              {isAr && firstItem?.product_name_ar ? firstItem.product_name_ar : firstItem?.product_name || (isAr ? 'طلب زهور' : 'Floral Order')}
                            </p>
                            <p className="text-[11px] text-ink-600 font-medium">
                              {firstItem ? `${formatPrice(firstItem.price)} × ${firstItem.quantity}` : ''}
                            </p>
                            {itemCount > 1 && (
                              <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-plum-100 text-plum-900 font-bold text-[10px] rounded-md">
                                +{itemCount - 1} {isAr ? 'منتجات أخرى' : 'more items'}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 3. Customer Information */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-ink-950 text-xs">{order.customer_name}</div>
                        <a
                          href={`tel:${order.customer_phone}`}
                          className="text-[11px] text-plum-900 hover:underline font-mono font-medium block"
                          dir="ltr"
                        >
                          {order.customer_phone}
                        </a>
                        <span className="text-[10px] text-ink-500 truncate max-w-[140px] block">
                          {order.customer_email}
                        </span>
                      </td>

                      {/* 4. Delivery Address Preview */}
                      <td className="py-4 px-4 max-w-[180px]">
                        <p className="text-xs text-ink-800 font-semibold truncate" title={order.delivery_address}>
                          {order.delivery_address}
                        </p>
                        <p className="text-[11px] text-ink-500 truncate">
                          {order.district ? `${order.district}, ` : ''}{order.city}
                        </p>
                        {order.delivery_notes && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-plum-900 bg-plum-50 border border-plum-200 px-1.5 py-0.5 rounded-md truncate max-w-full">
                            <FileText className="w-3 h-3 text-plum-700 shrink-0" />
                            <span className="truncate">{order.delivery_notes}</span>
                          </span>
                        )}
                      </td>

                      {/* 5. Source Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {order.source === 'whatsapp' ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-300">
                            <MessageSquare className="w-3 h-3 text-emerald-700 fill-current" />
                            <span>{t.admin.sourceWhatsApp}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-plum-100 text-plum-950 px-2.5 py-1 rounded-full text-[10px] font-bold border border-plum-300">
                            <Banknote className="w-3 h-3 text-plum-800" />
                            <span>{t.admin.sourceCOD}</span>
                          </span>
                        )}
                      </td>

                      {/* 6. Total Amount */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-bold text-plum-950 text-sm block">
                          {formatPrice(order.total_amount, 'QAR')}
                        </span>
                        <span className="text-[10px] text-ink-500 block">
                          {Number(order.shipping_fee) === 0 ? (isAr ? 'توصيل مجاني' : 'Free Delivery') : `+ ${formatPrice(order.shipping_fee)} ${isAr ? 'توصيل' : 'shipping'}`}
                        </span>
                      </td>

                      {/* 7. Status Selector Dropdown */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl border shadow-2xs focus:outline-none cursor-pointer pe-6 ${getStatusBadgeStyle(
                              order.status
                            )}`}
                          >
                            {ALL_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {getStatusLabel(st)}
                              </option>
                            ))}
                          </select>
                          {updatingId === order.id && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin absolute end-2 top-1/2 -translate-y-1/2 text-ink-700" />
                          )}
                        </div>
                      </td>

                      {/* 8. Placed At Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-ink-600 font-medium text-[11px]">
                        {formatDate(order.created_at, locale)}
                      </td>

                      {/* 9. Actions */}
                      <td className="py-4 px-4 text-end whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-plum-900 hover:bg-plum-800 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                            title={t.admin.viewDetails}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{t.admin.viewDetails}</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* Dedicated Order Details Drawer / Modal                   */}
      {/* ========================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-plum-950/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-ink-200 max-h-[92vh] overflow-y-auto space-y-6"
            dir={direction}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-ink-200 gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-plum-950">
                    #{selectedOrder.order_number}
                  </span>
                  <button
                    onClick={() => handleCopy(selectedOrder.order_number, 'modal-copy')}
                    className="p-1 rounded-md text-ink-500 hover:text-plum-900 hover:bg-cream-100 transition-colors"
                    title={t.admin.copyReference}
                  >
                    {copiedId === 'modal-copy' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeStyle(
                    selectedOrder.status
                  )}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
                <p className="text-xs text-ink-600 font-medium mt-1">
                  {t.admin.placedAt}: {formatDate(selectedOrder.created_at, locale)}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-ink-400 hover:text-ink-900 hover:bg-cream-100 transition-colors"
                aria-label="Close details"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Operational Communication Toolbar */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-cream-100/80 rounded-2xl border border-ink-200">
              <a
                href={`https://api.whatsapp.com/send?phone=${normalizeWhatsAppNumber(selectedOrder.customer_phone)}&text=${encodeURIComponent(
                  isAr
                    ? `مرحباً ${selectedOrder.customer_name}، نتواصل معك بخصوص طلبك رقم #${selectedOrder.order_number} من متجر بيربل للزهور.`
                    : `Hello ${selectedOrder.customer_name}, contacting you regarding your Burble flower order #${selectedOrder.order_number}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>{t.admin.openInWhatsApp}</span>
              </a>

              <a
                href={`tel:${selectedOrder.customer_phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-cream-200 text-plum-950 text-xs font-bold border border-ink-200 transition-colors shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-plum-800" />
                <span>{t.admin.callCustomer}</span>
              </a>

              <a
                href={`mailto:${selectedOrder.customer_email}?subject=Burble%20Order%20%23${selectedOrder.order_number}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-cream-200 text-plum-950 text-xs font-bold border border-ink-200 transition-colors shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5 text-plum-800" />
                <span>{t.admin.sendEmail}</span>
              </a>

              {/* Status Updater inside Modal */}
              <div className="ms-auto flex items-center gap-2">
                <span className="text-xs font-bold text-ink-700">{t.admin.updateStatus}:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border shadow-2xs cursor-pointer ${getStatusBadgeStyle(
                    selectedOrder.status
                  )}`}
                >
                  {ALL_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {getStatusLabel(st)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer & Delivery Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Customer Info Card */}
              <div className="p-4 rounded-2xl border border-ink-200 bg-white space-y-2.5">
                <div className="flex items-center gap-2 pb-2 border-b border-ink-100 text-plum-900 font-bold">
                  <Phone className="w-4 h-4 text-plum-800" />
                  <span>{t.admin.customer} & {t.admin.contact}</span>
                </div>
                <div>
                  <span className="text-ink-500 block text-[10px] uppercase font-bold">{t.admin.customer}</span>
                  <p className="font-bold text-plum-950 text-sm">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <span className="text-ink-500 block text-[10px] uppercase font-bold">الهاتف / Phone</span>
                  <p className="font-mono font-bold text-plum-900" dir="ltr">{selectedOrder.customer_phone}</p>
                </div>
                <div>
                  <span className="text-ink-500 block text-[10px] uppercase font-bold">البريد الإلكتروني / Email</span>
                  <p className="font-semibold text-ink-800">{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <span className="text-ink-500 block text-[10px] uppercase font-bold">{t.admin.source}</span>
                  <span className="inline-block mt-0.5 font-bold text-plum-900 uppercase">
                    {selectedOrder.source === 'whatsapp' ? t.admin.sourceWhatsApp : t.admin.sourceCOD}
                  </span>
                </div>
              </div>

              {/* Delivery Address Card */}
              <div className="p-4 rounded-2xl border border-ink-200 bg-white space-y-2.5">
                <div className="flex items-center gap-2 pb-2 border-b border-ink-100 text-plum-900 font-bold">
                  <MapPin className="w-4 h-4 text-plum-800" />
                  <span>{t.admin.deliveryAddress}</span>
                </div>
                <div>
                  <span className="text-ink-500 block text-[10px] uppercase font-bold">عنوان الشارع والمبنى / Street</span>
                  <p className="font-bold text-plum-950">{selectedOrder.delivery_address}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-ink-500 block text-[10px] uppercase font-bold">المدينة / City</span>
                    <p className="font-semibold text-ink-900">{selectedOrder.city}</p>
                  </div>
                  {selectedOrder.district && (
                    <div>
                      <span className="text-ink-500 block text-[10px] uppercase font-bold">المنطقة / District</span>
                      <p className="font-semibold text-ink-900">{selectedOrder.district}</p>
                    </div>
                  )}
                </div>

                {selectedOrder.delivery_notes && (
                  <div className="pt-2 border-t border-ink-100">
                    <span className="text-plum-900 block text-[10px] uppercase font-bold">
                      {t.admin.deliveryNotes}
                    </span>
                    <p className="p-2.5 mt-1 bg-plum-50 text-plum-950 font-medium rounded-xl border border-plum-200">
                      &ldquo;{selectedOrder.delivery_notes}&rdquo;
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Ordered Items Full Table */}
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-plum-950">
                {t.admin.itemsSummary}
              </h3>

              <div className="rounded-2xl border border-ink-200 overflow-hidden">
                <table className="w-full text-start text-xs">
                  <thead>
                    <tr className="bg-cream-100/90 border-b border-ink-200 text-ink-800 font-bold uppercase text-[11px]">
                      <th className="py-3 px-4 text-start">{t.admin.items}</th>
                      <th className="py-3 px-4 text-start">{t.admin.unitPrice}</th>
                      <th className="py-3 px-4 text-center">الكمية / Qty</th>
                      <th className="py-3 px-4 text-end">{t.admin.total}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-200">
                    {(selectedOrder.order_items || []).map((item, idx) => {
                      const itemImg = item.image_url || item.product?.main_image_url;
                      return (
                        <tr key={idx} className="hover:bg-cream-50/60">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream-200 shrink-0 border border-ink-200 flex items-center justify-center">
                                {itemImg ? (
                                  <Image
                                    src={itemImg}
                                    alt={item.product_name}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <Flower className="w-5 h-5 text-plum-700" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-plum-950">{item.product_name}</p>
                                {item.product_name_ar && (
                                  <p className="text-[11px] font-semibold text-plum-800 font-arabic">{item.product_name_ar}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-ink-900">
                            {formatPrice(item.price)}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-plum-950 text-center">
                            {item.quantity}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-plum-950 text-end">
                            {formatPrice(item.total)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Totals Breakdown */}
            <div className="p-4 rounded-2xl bg-cream-100/90 border border-ink-200 max-w-sm ms-auto space-y-2 text-xs">
              <div className="flex items-center justify-between text-ink-700 font-medium">
                <span>{t.admin.subtotal}:</span>
                <span className="font-bold text-plum-950">{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-ink-700 font-medium">
                <span>{t.admin.shippingFee}:</span>
                <span className="font-bold text-plum-950">
                  {Number(selectedOrder.shipping_fee) === 0 ? t.checkout.freeDelivery : formatPrice(selectedOrder.shipping_fee)}
                </span>
              </div>
              <div className="pt-2 border-t border-ink-200 flex items-center justify-between font-bold text-base text-plum-950">
                <span>{t.admin.total}:</span>
                <span>{formatPrice(selectedOrder.total_amount, 'QAR')}</span>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-ink-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl border border-ink-200 text-ink-800 font-bold hover:bg-cream-100 transition-colors text-xs cursor-pointer"
              >
                {t.common.close}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
