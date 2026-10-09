import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  ShoppingBag,
  FolderTree,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  MessageSquare,
  Banknote,
  Clock,
  ExternalLink,
  Plus,
  Sliders,
  Flower,
  Eye,
} from 'lucide-react';
import { getServerTranslations } from '@/lib/i18n/server';
import { formatPrice, formatDate } from '@/lib/i18n/utils';
import { getAdminDashboardMetricsAction } from '@/app/actions/order';

export const instant = false;

export default async function AdminDashboardPage() {
  const { locale, direction, t } = await getServerTranslations();
  const isAr = locale === 'ar';

  const metrics = await getAdminDashboardMetricsAction();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header & Operational Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-ink-200">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-plum-950">
            {t.admin.overviewTitle}
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 font-medium mt-1">
            {t.admin.overviewSubtitle}
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-plum-950 bg-white hover:bg-cream-200 border border-ink-200 transition-all shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-plum-800" />
            <span>{t.admin.addProduct}</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-plum-900 hover:bg-plum-800 transition-all shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t.admin.manageAllOrders}</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid - 5 Distinct Operational Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* 1. Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-ink-200 shadow-xs flex flex-col justify-between hover:border-plum-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-ink-600 uppercase tracking-wider">
              {t.admin.totalSales}
            </span>
            <div className="p-2.5 bg-plum-100 text-plum-900 rounded-xl border border-plum-200 shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-serif text-2xl font-bold text-plum-950 truncate">
              {formatPrice(metrics.totalSales, locale, 'QAR')}
            </h3>
            <p className="text-[10px] text-ink-500 font-medium mt-0.5">
              {t.admin.totalSalesSubtitle}
            </p>
          </div>
        </div>

        {/* 2. Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-ink-200 shadow-xs flex flex-col justify-between hover:border-plum-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-ink-600 uppercase tracking-wider">
              {t.admin.ordersCount}
            </span>
            <div className="p-2.5 bg-plum-100 text-plum-900 rounded-xl border border-plum-200 shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-serif text-2xl font-bold text-plum-950">
              {metrics.ordersCount}
            </h3>
            <p className="text-[10px] text-ink-500 font-medium mt-0.5">
              {isAr ? 'كافة طلبات المتجر' : 'All-time store orders'}
            </p>
          </div>
        </div>

        {/* 3. Pending Orders (Operational Focus) */}
        <div className={`p-5 rounded-2xl border shadow-xs flex flex-col justify-between transition-colors ${
          metrics.pendingOrdersCount > 0
            ? 'bg-amber-50/70 border-amber-300'
            : 'bg-white border-ink-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              metrics.pendingOrdersCount > 0 ? 'text-amber-900' : 'text-ink-600'
            }`}>
              {t.admin.pendingOrders}
            </span>
            <div className={`p-2.5 rounded-xl border shrink-0 ${
              metrics.pendingOrdersCount > 0
                ? 'bg-amber-200 text-amber-950 border-amber-300'
                : 'bg-cream-100 text-ink-700 border-ink-200'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className={`font-serif text-2xl font-bold ${
              metrics.pendingOrdersCount > 0 ? 'text-amber-950' : 'text-plum-950'
            }`}>
              {metrics.pendingOrdersCount}
            </h3>
            <p className={`text-[10px] font-semibold mt-0.5 ${
              metrics.pendingOrdersCount > 0 ? 'text-amber-800' : 'text-ink-500'
            }`}>
              {metrics.pendingOrdersCount > 0
                ? t.admin.pendingOrdersSubtitle
                : isAr ? 'لا توجد طلبات معلقة' : 'No pending fulfillment'}
            </p>
          </div>
        </div>

        {/* 4. Active Products */}
        <div className="bg-white p-5 rounded-2xl border border-ink-200 shadow-xs flex flex-col justify-between hover:border-plum-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-ink-600 uppercase tracking-wider">
              {t.admin.activeProducts}
            </span>
            <div className="p-2.5 bg-plum-100 text-plum-900 rounded-xl border border-plum-200 shrink-0">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-serif text-2xl font-bold text-plum-950">
              {metrics.productsCount}
            </h3>
            <p className="text-[10px] text-ink-500 font-medium mt-0.5">
              {isAr ? 'منتج متاح للطلب' : 'Catalog bouquets available'}
            </p>
          </div>
        </div>

        {/* 5. Categories */}
        <div className="bg-white p-5 rounded-2xl border border-ink-200 shadow-xs flex flex-col justify-between hover:border-plum-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-ink-600 uppercase tracking-wider">
              {t.admin.categoriesCount}
            </span>
            <div className="p-2.5 bg-plum-100 text-plum-900 rounded-xl border border-plum-200 shrink-0">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-serif text-2xl font-bold text-plum-950">
              {metrics.categoriesCount}
            </h3>
            <p className="text-[10px] text-ink-500 font-medium mt-0.5">
              {isAr ? 'تصنيف ومناسبة' : 'Store categories & tags'}
            </p>
          </div>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-ink-200">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-plum-950">
              {t.admin.recentOrders}
            </h2>
            <p className="text-xs text-ink-600 font-medium mt-0.5">
              {isAr ? 'أحدث الطلبات الواردة من المتجر مباشرة' : 'Latest orders received across Cash on Delivery & WhatsApp'}
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="self-start sm:self-center inline-flex items-center gap-2 text-xs font-bold text-plum-950 hover:text-plum-900 bg-cream-100 hover:bg-cream-200 px-4 py-2 rounded-xl border border-ink-200 transition-colors"
          >
            <span>{t.admin.manageAllOrders}</span>
            {direction === 'rtl' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>

        {metrics.recentOrders.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-ink-200 rounded-2xl bg-cream-100/50 p-6">
            <div className="w-14 h-14 rounded-2xl bg-cream-200 text-ink-500 flex items-center justify-center mx-auto mb-3 border border-ink-200">
              <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
            </div>
            <p className="font-serif text-lg font-bold text-plum-950">
              {t.admin.noOrdersRecordedYet}
            </p>
            <p className="text-xs text-ink-600 font-medium mt-1 max-w-md mx-auto">
              {t.admin.ordersAppearRealTime}
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
                  <th className="py-3.5 px-4 text-start">{t.admin.source}</th>
                  <th className="py-3.5 px-4 text-start">{t.admin.total}</th>
                  <th className="py-3.5 px-4 text-start">{t.admin.status}</th>
                  <th className="py-3.5 px-4 text-start">{t.admin.date}</th>
                  <th className="py-3.5 px-4 text-end">{t.admin.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {metrics.recentOrders.map((order) => {
                  const firstItem = order.order_items?.[0];
                  const itemCount = order.order_items?.length || 0;
                  const itemThumbnail = firstItem?.image_url || firstItem?.product?.main_image_url;

                  return (
                    <tr key={order.id} className="hover:bg-cream-100/60 transition-colors">
                      {/* Order Reference */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-plum-950 text-xs block">
                          #{order.order_number}
                        </span>
                        <span className="text-[10px] text-ink-500 font-mono block">
                          {order.city || 'Qatar'}
                        </span>
                      </td>

                      {/* Item Thumbnail & Summary */}
                      <td className="py-4 px-4 min-w-[180px]">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-cream-200 shrink-0 border border-ink-200 flex items-center justify-center">
                            {itemThumbnail ? (
                              <Image
                                src={itemThumbnail}
                                alt={firstItem?.product_name || 'Product'}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <Flower className="w-4 h-4 text-plum-700" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-plum-950 truncate max-w-[160px]">
                              {isAr && firstItem?.product_name_ar ? firstItem.product_name_ar : firstItem?.product_name || (isAr ? 'طلب زهور' : 'Floral Order')}
                            </p>
                            {itemCount > 1 && (
                              <span className="text-[10px] font-bold text-plum-800 bg-plum-100 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                                +{itemCount - 1} {isAr ? 'منتجات إضافية' : 'more items'}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Customer Details */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-ink-950 text-xs">{order.customer_name}</div>
                        <div className="text-[11px] text-ink-600 font-medium font-mono" dir="ltr">
                          {order.customer_phone}
                        </div>
                      </td>

                      {/* Order Source Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {order.source === 'whatsapp' ? (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-950 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-300">
                            <MessageSquare className="w-3 h-3 text-emerald-700 fill-current" />
                            <span>{t.admin.sourceWhatsApp}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-plum-100 text-plum-950 px-2.5 py-1 rounded-full text-[10px] font-bold border border-plum-300">
                            <Banknote className="w-3 h-3 text-plum-800" />
                            <span>{t.admin.sourceCOD}</span>
                          </span>
                        )}
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4 whitespace-nowrap font-bold text-plum-950 text-sm">
                        {formatPrice(order.total_amount, locale, 'QAR')}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                            : order.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-950 border-rose-300'
                            : order.status === 'out_for_delivery'
                            ? 'bg-indigo-100 text-indigo-950 border-indigo-300'
                            : order.status === 'processing'
                            ? 'bg-purple-100 text-purple-950 border-purple-300'
                            : order.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-950 border-blue-300'
                            : 'bg-amber-100 text-amber-950 border-amber-300'
                        }`}>
                          {t.admin[`status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}` as keyof typeof t.admin] || order.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-ink-600 font-medium text-[11px]">
                        {formatDate(order.created_at, locale)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-end whitespace-nowrap">
                        <Link
                          href="/admin/orders"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-plum-50 hover:bg-plum-100 text-plum-950 border border-plum-200 text-xs font-bold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-plum-800" />
                          <span>{t.admin.viewDetails}</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

