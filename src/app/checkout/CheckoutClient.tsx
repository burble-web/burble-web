'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, MessageSquare, Banknote, CheckCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/cart/store';
import { processCheckoutAction } from '@/app/actions/order';
import { createWhatsAppOrderLink } from '@/lib/whatsapp/message';
import { SiteSettings, Order } from '@/types';
import { useLocale } from '@/lib/i18n/context';
import { getLocalizedValue, formatPrice } from '@/lib/i18n/utils';

interface CheckoutClientProps {
  settings: SiteSettings;
}

export function CheckoutClient({ settings }: CheckoutClientProps) {
  const { items, subtotal, clearCart } = useCart();
  const { locale, direction, t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    city: 'Doha',
    district: '',
    pincode: '',
    delivery_notes: '',
    payment_method: 'cod' as 'whatsapp' | 'cod',
  });

  const shippingFee = subtotal >= settings.free_shipping_threshold || subtotal === 0 ? 0 : settings.flat_shipping_fee;
  const totalAmount = subtotal + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isSubmittingRef = React.useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isSubmittingRef.current || loading) {
      return;
    }

    if (items.length === 0) {
      setErrorMsg(t.checkout.emptyCartError);
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    try {
      const res = await processCheckoutAction({ ...formData, locale }, items);

      if (!res.success || !res.order) {
        setErrorMsg(res.error || (locale === 'ar' ? 'تعذر إتمام الطلب. يرجى المحاولة مرة أخرى.' : 'Failed to place order. Please try again.'));
        setLoading(false);
        isSubmittingRef.current = false;
        return;
      }

      // If WhatsApp order, open link and save state
      if (formData.payment_method === 'whatsapp') {
        const waUrl = createWhatsAppOrderLink({
          whatsappNumber: settings.whatsapp_number,
          orderNumber: res.order.order_number,
          formData,
          items,
          subtotal,
          shippingFee,
          totalAmount,
          currencySymbol: settings.currency_symbol,
          locale,
        });

        clearCart();
        setCompletedOrder(res.order);
        window.open(waUrl, '_blank');
      } else {
        // Cash on Delivery order
        clearCart();
        setCompletedOrder(res.order);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || (locale === 'ar' ? 'حدث خطأ غير متوقع.' : 'An unexpected error occurred.'));
      isSubmittingRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  // Confirmation view after order completion
  if (completedOrder) {
    const isAr = locale === 'ar';
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-ink-100 shadow-sm text-center max-w-2xl mx-auto my-8 space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div>
          <span className="inline-block bg-plum-100 text-plum-900 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
            {t.checkout.orderNumberLabel}: #{completedOrder.order_number}
          </span>
          <h2 className="font-serif text-3xl font-bold text-plum-900">
            {completedOrder.source === 'whatsapp' 
              ? (isAr ? 'تم تجهيز طلب الواتساب!' : 'WhatsApp Order Prepared!') 
              : t.checkout.orderSuccessTitle}
          </h2>
          <p className="text-xs text-ink-500 mt-2 max-w-md mx-auto">
            {completedOrder.source === 'whatsapp'
              ? (isAr 
                  ? 'تم فتح تطبيق واتساب. أرسل الرسالة الجاهزة لفريقنا لتأكيد تفاصيل وموعد التوصيل.' 
                  : 'Your WhatsApp chat has opened. Send the pre-filled message to our team to confirm delivery details.')
              : (isAr
                  ? `تم استلام طلبك بنجاح وسنقوم بتوصيل باقتك الطازجة عبر الدفع عند الاستلام.`
                  : `A confirmation email has been sent to ${completedOrder.customer_email}. We will deliver your fresh blooms via Cash on Delivery.`)}
          </p>
        </div>

        <div className="bg-cream-100 p-4 rounded-2xl text-start text-xs space-y-2 border border-ink-100/60">
          <div className="flex justify-between font-semibold text-plum-900">
            <span>{isAr ? 'اسم العميل:' : 'Customer Name:'}</span>
            <span>{completedOrder.customer_name}</span>
          </div>
          <div className="flex justify-between font-semibold text-plum-900">
            <span>{isAr ? 'رقم الهاتف:' : 'Contact Phone:'}</span>
            <span dir="ltr">{completedOrder.customer_phone}</span>
          </div>
          <div className="flex justify-between font-semibold text-plum-900">
            <span>{isAr ? 'عنوان التوصيل:' : 'Delivery Address:'}</span>
            <span>{completedOrder.delivery_address}, {completedOrder.city}</span>
          </div>
          <div className="flex justify-between font-bold text-plum-900 pt-2 border-t border-ink-200">
            <span>{t.checkout.totalAmount}:</span>
            <span>{formatPrice(completedOrder.total_amount, locale, settings.currency_symbol)} ({completedOrder.source === 'whatsapp' ? (isAr ? 'واتساب' : 'WHATSAPP') : (isAr ? 'عند الاستلام' : 'COD')})</span>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-plum-900 text-white font-semibold text-xs px-6 py-3 rounded-full hover:bg-plum-800 transition-colors"
        >
          {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t.checkout.backToHome}</span>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-ink-100 my-8">
        <ShoppingBag className="w-12 h-12 text-ink-300 mx-auto mb-3 stroke-[1.5]" />
        <p className="font-serif text-xl font-bold text-plum-900">{t.cart.emptyTitle}</p>
        <p className="text-xs text-ink-500 mt-1 mb-6">{t.cart.emptySubtitle}</p>
        <Link
          href="/products"
          className="px-6 py-3 bg-plum-900 text-white text-xs font-semibold rounded-full hover:bg-plum-800"
        >
          {t.cart.startShopping}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Form Details */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-ink-100 shadow-xs space-y-6">
        
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        {/* Customer Information */}
        <div>
          <h3 className="font-serif text-lg font-bold text-plum-900 mb-4 border-b border-ink-100 pb-2">
            {t.checkout.customerDetailsTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-plum-900 mb-1">{t.checkout.fullName}</label>
              <input
                type="text"
                name="customer_name"
                required
                value={formData.customer_name}
                onChange={handleChange}
                placeholder={t.checkout.fullNamePlaceholder}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-plum-900 mb-1">{t.checkout.contactPhone}</label>
              <input
                type="tel"
                name="customer_phone"
                required
                value={formData.customer_phone}
                onChange={handleChange}
                placeholder={t.checkout.contactPhonePlaceholder}
                dir="ltr"
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-plum-900 mb-1">{t.checkout.emailAddress}</label>
              <input
                type="email"
                name="customer_email"
                required
                value={formData.customer_email}
                onChange={handleChange}
                placeholder={t.checkout.emailPlaceholder}
                dir="ltr"
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div>
          <h3 className="font-serif text-lg font-bold text-plum-900 mb-4 border-b border-ink-100 pb-2">
            {t.checkout.deliveryAddressTitle}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-plum-900 mb-1">{t.checkout.deliveryAddress}</label>
              <textarea
                name="delivery_address"
                required
                rows={2}
                value={formData.delivery_address}
                onChange={handleChange}
                placeholder={t.checkout.deliveryAddressPlaceholder}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-plum-900 mb-1">{t.checkout.city}</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
                >
                  <option value="Doha">{locale === 'ar' ? 'الدوحة' : 'Doha'}</option>
                  <option value="Al Rayyan">{locale === 'ar' ? 'الريان' : 'Al Rayyan'}</option>
                  <option value="Al Wakrah">{locale === 'ar' ? 'الوكرة' : 'Al Wakrah'}</option>
                  <option value="Lusail">{locale === 'ar' ? 'لوسيل' : 'Lusail'}</option>
                  <option value="Al Khor">{locale === 'ar' ? 'الخور' : 'Al Khor'}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-plum-900 mb-1">{t.checkout.district}</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder={t.checkout.districtPlaceholder}
                  className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-plum-900 mb-1">{t.checkout.deliveryNotes}</label>
              <input
                type="text"
                name="delivery_notes"
                value={formData.delivery_notes}
                onChange={handleChange}
                placeholder={t.checkout.deliveryNotesPlaceholder}
                className="w-full bg-cream-50 border border-ink-100 rounded-xl px-4 py-2.5 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-plum-800/30"
              />
            </div>
          </div>
        </div>

        {/* Order Payment Method Selection */}
        <div>
          <h3 className="font-serif text-lg font-bold text-plum-900 mb-4 border-b border-ink-100 pb-2">
            {t.checkout.paymentMethodTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <label
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                formData.payment_method === 'cod'
                  ? 'border-plum-800 bg-plum-50/50 shadow-xs'
                  : 'border-ink-100 bg-cream-50 hover:bg-white'
              }`}
            >
              <input
                type="radio"
                name="payment_method"
                value="cod"
                checked={formData.payment_method === 'cod'}
                onChange={handleChange}
                className="mt-1 text-plum-800 focus:ring-plum-800"
              />
              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs text-plum-900">
                  <Banknote className="w-4 h-4 text-plum-800" />
                  <span>{t.checkout.codTitle}</span>
                </div>
                <p className="text-[11px] text-ink-500 font-normal mt-1">
                  {t.checkout.codSubtitle}
                </p>
              </div>
            </label>

            <label
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                formData.payment_method === 'whatsapp'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                  : 'border-ink-100 bg-cream-50 hover:bg-white'
              }`}
            >
              <input
                type="radio"
                name="payment_method"
                value="whatsapp"
                checked={formData.payment_method === 'whatsapp'}
                onChange={handleChange}
                className="mt-1 text-emerald-600 focus:ring-emerald-600"
              />
              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800">
                  <MessageSquare className="w-4 h-4 text-emerald-600 fill-current" />
                  <span>{t.checkout.whatsappTitle}</span>
                </div>
                <p className="text-[11px] text-ink-500 font-normal mt-1">
                  {t.checkout.whatsappSubtitle}
                </p>
              </div>
            </label>

          </div>
        </div>

      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-ink-100 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-plum-900 mb-4 border-b border-ink-100 pb-2">
            {t.checkout.orderSummary}
          </h3>

          <div className="space-y-3 max-h-72 overflow-y-auto px-1 mb-6">
            {items.map((item) => {
              const productName = getLocalizedValue({
                locale,
                english: item.product.name,
                arabic: item.product.name_ar,
              });
              return (
                <div key={item.product.id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream-200 shrink-0">
                      <Image
                        src={item.product.main_image_url}
                        alt={productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-plum-900 truncate">{productName}</p>
                      <p className="text-[11px] text-ink-500">{t.product.quantity}: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-plum-900 shrink-0">
                    {formatPrice(item.product.price * item.quantity, locale, settings.currency_symbol)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 pt-4 border-t border-ink-100 text-xs">
            <div className="flex justify-between text-ink-700">
              <span>{t.checkout.itemsSubtotal}</span>
              <span>{formatPrice(subtotal, locale, settings.currency_symbol)}</span>
            </div>
            <div className="flex justify-between text-ink-700">
              <span>{t.checkout.deliveryFee}</span>
              <span>{shippingFee > 0 ? formatPrice(shippingFee, locale, settings.currency_symbol) : t.checkout.freeDelivery}</span>
            </div>
            <div className="flex justify-between font-serif text-lg font-bold text-plum-900 pt-3 border-t border-ink-100">
              <span>{t.checkout.totalAmount}</span>
              <span>{formatPrice(totalAmount, locale, settings.currency_symbol)}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-8 py-4 rounded-xl font-semibold text-xs text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
            formData.payment_method === 'whatsapp'
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-plum-900 hover:bg-plum-800'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.checkout.processing}</span>
            </>
          ) : (
            <>
              <span>
                {formData.payment_method === 'whatsapp'
                  ? t.checkout.placeOrderWhatsAppButton
                  : t.checkout.placeOrderButton}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

