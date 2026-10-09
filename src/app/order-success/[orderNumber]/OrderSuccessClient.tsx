'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, MessageSquare, Banknote, ArrowRight, ArrowLeft, ExternalLink, AlertCircle, ShoppingBag } from 'lucide-react';
import { Order, SiteSettings } from '@/types';
import { useLocale } from '@/lib/i18n/context';
import { getLocalizedValue, formatPrice, formatDate } from '@/lib/i18n/utils';

interface OrderSuccessClientProps {
  order: Order | null;
  orderNumber: string;
  settings: SiteSettings;
  searchSource?: string;
  waUrl?: string;
}

export function OrderSuccessClient({
  order,
  orderNumber,
  settings,
  searchSource,
  waUrl,
}: OrderSuccessClientProps) {
  const { locale, direction, t } = useLocale();
  const isAr = locale === 'ar';

  const isWhatsApp = (order?.source || searchSource) === 'whatsapp';

  if (!order) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-ink-100 shadow-sm text-center max-w-xl mx-auto my-8 space-y-6">
        <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <AlertCircle className="w-8 h-8 stroke-[1.5]" />
        </div>
        <div>
          <span className="inline-block bg-cream-200 text-plum-900 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2 font-mono">
            #{orderNumber}
          </span>
          <h2 className="font-serif text-2xl font-bold text-plum-900">
            {isAr ? 'تفاصيل الطلب قيد المعالجة' : 'Order Information'}
          </h2>
          <p className="text-xs text-ink-600 mt-2 max-w-md mx-auto leading-relaxed">
            {isAr
              ? `تم تسجيل طلبك برقم مرجعي #${orderNumber}. إذا كنت قد اخترت الطلب عبر واتساب، يرجى المتابعة لإرسال الرسالة إلى فريقنا.`
              : `Your order #${orderNumber} has been logged in our store system.`}
          </p>
        </div>

        {waUrl && (
          <div className="pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3.5 rounded-full shadow-md transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>{t.checkout.continueToWhatsApp}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-ink-100">
          <Link
            href="/products"
            className="px-6 py-2.5 bg-plum-900 text-white text-xs font-semibold rounded-full hover:bg-plum-800 transition-colors"
          >
            {t.checkout.continueShopping}
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 bg-cream-100 border border-ink-200 text-plum-900 text-xs font-semibold rounded-full hover:bg-cream-200 transition-colors"
          >
            {t.checkout.backToHome}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-ink-100 shadow-sm max-w-3xl mx-auto my-6 space-y-8">
      {/* Top Status Icon & Heading */}
      <div className="text-center space-y-3">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-xs ${
          isWhatsApp ? 'bg-emerald-100 text-emerald-700' : 'bg-plum-100 text-plum-900'
        }`}>
          {isWhatsApp ? (
            <MessageSquare className="w-8 h-8 fill-current" />
          ) : (
            <CheckCircle className="w-8 h-8 stroke-[1.5]" />
          )}
        </div>

        <div>
          <span className="inline-block bg-cream-200 text-plum-950 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider mb-2 font-mono border border-ink-200">
            {t.checkout.orderNumberLabel}: #{order.order_number}
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-plum-950">
            {isWhatsApp
              ? (isAr ? 'تم تأكيد وتجهيز طلب الواتساب!' : 'WhatsApp Order Confirmed & Prepared!')
              : t.checkout.orderSuccessTitle}
          </h1>
          <p className="text-xs text-ink-600 mt-2 max-w-lg mx-auto leading-relaxed">
            {isWhatsApp ? t.checkout.whatsappSuccessNote : t.checkout.codSuccessNote}
          </p>
        </div>

        {/* WhatsApp Action Callout for WhatsApp orders */}
        {isWhatsApp && waUrl && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-md mx-auto space-y-3">
            <p className="text-[11px] text-emerald-950 font-medium">
              {isAr
                ? 'إذا لم يفتح تطبيق واتساب تلقائياً على جهازك، اضغط على الزر التالي لإرسال تفاصيل باقتك:'
                : 'If your WhatsApp chat did not open automatically, click below to send your order details:'}
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-sm transition-all w-full"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>{t.checkout.continueToWhatsApp}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Order Summary & Customer Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-cream-50 p-6 rounded-2xl border border-ink-100/80 text-xs">
        {/* Customer & Delivery Details */}
        <div className="space-y-3">
          <h3 className="font-serif text-sm font-bold text-plum-950 border-b border-ink-200/80 pb-2">
            {isAr ? 'بيانات العميل والتوصيل' : 'Customer & Delivery'}
          </h3>
          <div className="space-y-1.5 text-ink-800">
            <div className="flex justify-between">
              <span className="text-ink-500 font-medium">{isAr ? 'الاسم:' : 'Name:'}</span>
              <span className="font-bold text-plum-950">{order.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500 font-medium">{isAr ? 'رقم الهاتف:' : 'Phone:'}</span>
              <span className="font-bold text-plum-950" dir="ltr">{order.customer_phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500 font-medium">{isAr ? 'البريد:' : 'Email:'}</span>
              <span className="font-medium text-plum-950" dir="ltr">{order.customer_email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500 font-medium">{isAr ? 'العنوان:' : 'Address:'}</span>
              <span className="font-medium text-end max-w-[180px]">{order.delivery_address}, {order.city}</span>
            </div>
            {order.delivery_notes && (
              <div className="pt-2 border-t border-ink-100 text-[11px] text-ink-600">
                <span className="font-semibold text-plum-900">{isAr ? 'ملاحظات:' : 'Note:'} </span>
                <span>{order.delivery_notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Items & Totals */}
        <div className="space-y-3">
          <h3 className="font-serif text-sm font-bold text-plum-950 border-b border-ink-200/80 pb-2 flex items-center justify-between">
            <span>{isAr ? 'تفاصيل الباقات والأسعار' : 'Purchased Items & Totals'}</span>
            <span className="text-[10px] font-bold uppercase bg-plum-100 text-plum-900 px-2 py-0.5 rounded-full">
              {order.source === 'whatsapp' ? 'WhatsApp' : 'COD'}
            </span>
          </h3>

          <div className="space-y-2 max-h-40 overflow-y-auto pe-1">
            {order.order_items && order.order_items.length > 0 ? (
              order.order_items.map((item, idx) => {
                const name = isAr && item.product_name_ar ? item.product_name_ar : item.product_name;
                return (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="truncate max-w-[160px] font-medium text-ink-900">
                      {name} × {item.quantity}
                    </span>
                    <span className="font-bold text-plum-950">
                      {formatPrice(item.total, locale, settings.currency_symbol)}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-ink-400 italic text-[11px]">{isAr ? 'تم تسجيل الباقة بنجاح' : 'Items recorded'}</p>
            )}
          </div>

          <div className="pt-3 border-t border-ink-200/80 space-y-1 text-[11px]">
            <div className="flex justify-between text-ink-600">
              <span>{t.checkout.itemsSubtotal}</span>
              <span>{formatPrice(order.subtotal, locale, settings.currency_symbol)}</span>
            </div>
            <div className="flex justify-between text-ink-600">
              <span>{t.checkout.deliveryFee}</span>
              <span>{order.shipping_fee > 0 ? formatPrice(order.shipping_fee, locale, settings.currency_symbol) : t.checkout.freeDelivery}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-plum-950 pt-2 border-t border-ink-200">
              <span>{t.checkout.totalAmount}</span>
              <span className="font-serif text-sm">{formatPrice(order.total_amount, locale, settings.currency_symbol)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-ink-100">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-plum-900 text-white font-semibold text-xs px-6 py-3 rounded-full hover:bg-plum-800 transition-colors shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t.checkout.continueShopping}</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-cream-100 border border-ink-200 text-plum-900 font-semibold text-xs px-6 py-3 rounded-full hover:bg-cream-200 transition-colors"
        >
          {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t.checkout.backToHome}</span>
        </Link>
      </div>
    </div>
  );
}
