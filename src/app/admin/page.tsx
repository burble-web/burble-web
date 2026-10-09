import React from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, FolderTree, ArrowRight, ArrowLeft, DollarSign, MessageSquare, Banknote, Clock } from 'lucide-react';
import { getServerTranslations } from '@/lib/i18n/server';
import { formatPrice, formatDate } from '@/lib/i18n/utils';
import { getAdminDashboardMetricsAction } from '@/app/actions/order';

export const instant = false;

export default async function AdminDashboardPage() {
  const { locale, direction, t } = await getServerTranslations();
  const isAr = locale === 'ar';

  const metrics = await getAdminDashboardMetricsAction();

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-plum-900">{t.admin.overviewTitle}</h1>
        <p className="text-xs text-ink-500 mt-1">{t.admin.overviewSubtitle}</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-ink-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-plum-100 text-plum-900 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-ink-500 font-medium">{t.admin.totalSales}</p>
            <h3 className="font-serif text-2xl font-bold text-plum-900">
              {formatPrice(metrics.totalSales, locale, 'QAR')}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ink-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-plum-100 text-plum-900 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-ink-500 font-medium">{t.admin.ordersCount}</p>
            <h3 className="font-serif text-2xl font-bold text-plum-900">
              {isAr ? `${metrics.ordersCount} طلبات` : `${metrics.ordersCount} Orders`}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ink-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-plum-100 text-plum-900 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-ink-500 font-medium">{t.admin.activeProducts}</p>
            <h3 className="font-serif text-2xl font-bold text-plum-900">
              {metrics.productsCount}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ink-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-plum-100 text-plum-900 rounded-xl">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-ink-500 font-medium">{t.admin.categoriesCount}</p>
            <h3 className="font-serif text-2xl font-bold text-plum-900">
              {metrics.categoriesCount}
            </h3>
          </div>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl p-6 border border-ink-100 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-bold text-plum-900">{t.admin.recentOrders}</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-plum-800 hover:text-plum-700 flex items-center gap-1">
            <span>{t.admin.manageAllOrders}</span>
            {direction === 'rtl' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>

        {metrics.recentOrders.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-ink-200 rounded-2xl">
            <ShoppingBag className="w-10 h-10 text-ink-300 mx-auto mb-2 stroke-[1.5]" />
            <p className="text-sm font-semibold text-plum-900">
              {isAr ? 'لا توجد طلبات مسجلة حتى الآن' : 'No orders recorded yet'}
            </p>
            <p className="text-xs text-ink-500 mt-1">
              {isAr ? 'ستظهر الطلبات الجديدة هنا فور قيام العملاء بالشراء.' : 'New customer orders will appear here in real time.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs">
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
                {metrics.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-plum-900">#{order.order_number}</td>
                    <td className="py-3.5 px-4 font-medium text-ink-900">{order.customer_name}</td>
                    <td className="py-3.5 px-4">
                      {order.source === 'whatsapp' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-200">
                          <MessageSquare className="w-3 h-3 text-emerald-600 fill-current" />
                          <span>WHATSAPP</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-plum-50 text-plum-900 px-2.5 py-1 rounded-full text-[10px] font-bold border border-plum-200">
                          <Banknote className="w-3 h-3 text-plum-800" />
                          <span>COD</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-plum-900">{formatPrice(order.total_amount, locale, 'QAR')}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        order.status === 'delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        order.status === 'cancelled' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                        'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-ink-500">
                      {formatDate(order.created_at, locale)}
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
