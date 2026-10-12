'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, MessageSquare, Banknote, ArrowLeft, ArrowRight, Loader2, AlertCircle, Zap, RefreshCw } from 'lucide-react';
import { useCart, UUID_REGEX } from '@/lib/cart/store';
import { processCheckoutAction } from '@/app/actions/order';
import { createWhatsAppOrderLink } from '@/lib/whatsapp/message';
import { SiteSettings, Order, CartItem } from '@/types';
import { useLocale } from '@/lib/i18n/context';
import { getLocalizedValue, formatPrice } from '@/lib/i18n/utils';

interface CheckoutClientProps {
  settings: SiteSettings;
  buyNowItem?: CartItem | null;
  buyNowError?: string | null;
  initialMethod?: 'cod' | 'whatsapp';
}

export function CheckoutClient({
  settings,
  buyNowItem = null,
  buyNowError = null,
  initialMethod = 'cod',
}: CheckoutClientProps) {
  const router = useRouter();
  const { items: cartItems, subtotal: cartSubtotal, removePurchasedItems, sanitize, clearCart } = useCart();
  const { locale, direction, t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isBuyNow = Boolean(buyNowItem);
  const activeItems: CartItem[] = isBuyNow && buyNowItem ? [buyNowItem] : cartItems;
  const activeSubtotal = isBuyNow && buyNowItem
    ? buyNowItem.product.price * buyNowItem.quantity
    : cartSubtotal;

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    city: 'Doha',
    district: '',
    pincode: '',
    delivery_notes: '',
    payment_method: (initialMethod === 'whatsapp' ? 'whatsapp' : 'cod') as 'whatsapp' | 'cod',
  });

  const shippingFee = activeSubtotal >= settings.free_shipping_threshold || activeSubtotal === 0 ? 0 : settings.flat_shipping_fee;
  const totalAmount = activeSubtotal + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isSubmittingRef = React.useRef(false);

  // Stale items detection & sanitization check
  const hasInvalidItem = !isBuyNow && cartItems.some((item) => !item?.product?.id || !UUID_REGEX.test(item.product.id));

  const handleCleanCart = () => {
    sanitize();
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Prevent duplicate clicks/submissions while request is in progress
    if (isSubmittingRef.current || loading) {
      return;
    }

    if (activeItems.length === 0) {
      setErrorMsg(t.checkout.emptyCartError);
      return;
    }

    // Client-side pre-validation of product UUIDs
    const invalidItem = activeItems.find((item) => !item?.product?.id || !UUID_REGEX.test(item.product.id));
    if (invalidItem) {
      setErrorMsg(locale === 'ar' 
        ? 'أحد المنتجات في السلة يحتوي على معرف غير صالح. يرجى تحديث السلة.' 
        : 'One or more items in your cart have an invalid identifier. Please refresh or update your cart.');
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    try {
      const res = await processCheckoutAction({ ...formData, locale }, activeItems);

      if (!res.success || !res.order) {
        setErrorMsg(res.error || (locale === 'ar' ? 'تعذر إتمام الطلب. يرجى المحاولة مرة أخرى.' : 'Failed to place order. Please try again.'));
        setLoading(false);
        isSubmittingRef.current = false;
        return;
      }

      // If standard cart checkout, clear only the items actually purchased, preserving unpurchased items
      if (!isBuyNow) {
        removePurchasedItems(activeItems.map((it) => it.product.id));
      }

      // Build WhatsApp URL if WhatsApp ordering was chosen
      if (formData.payment_method === 'whatsapp') {
        const waUrl = createWhatsAppOrderLink({
          whatsappNumber: settings.whatsapp_number,
          orderNumber: res.order.order_number,
          formData,
          items: activeItems,
          subtotal: res.order.subtotal,
          shippingFee: res.order.shipping_fee,
          totalAmount: res.order.total_amount,
          currencySymbol: settings.currency_symbol,
          locale,
          createdAt: res.order.created_at,
          paymentMethod: 'whatsapp',
        });

        // Attempt non-blocking window.open in browser
        try {
          window.open(waUrl, '_blank');
        } catch (popupErr) {
          console.warn('[Checkout] Popup blocker intercepted window.open, fallback button provided on success page.');
        }

        // Navigate immediately to dedicated success route
        router.push(`/order-success/${encodeURIComponent(res.order.order_number)}?source=whatsapp&waUrl=${encodeURIComponent(waUrl)}`);
      } else {
        // Cash on Delivery: navigate immediately to dedicated success route
        router.push(`/order-success/${encodeURIComponent(res.order.order_number)}`);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || (locale === 'ar' ? 'حدث خطأ غير متوقع.' : 'An unexpected error occurred.'));
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  // If Buy Now parameter had an error (e.g. out of stock or inactive product)
  if (buyNowError) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-ink-100 shadow-xs max-w-xl mx-auto my-8">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3 stroke-[1.5]" />
        <h2 className="font-serif text-2xl font-bold text-plum-900 mb-2">
          {locale === 'ar' ? 'تعذر إتمام الشراء الفوري' : 'Buy Now Unavailable'}
        </h2>
        <p className="text-xs text-ink-600 mb-6 leading-relaxed">
          {buyNowError}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/products"
            className="px-6 py-2.5 bg-plum-900 text-white text-xs font-semibold rounded-full hover:bg-plum-800 transition-colors"
          >
            {t.product.allProductsPill}
          </Link>
          <Link
            href="/cart"
            className="px-6 py-2.5 bg-cream-100 border border-ink-200 text-plum-900 text-xs font-semibold rounded-full hover:bg-cream-200 transition-colors"
          >
            {t.cart.title}
          </Link>
        </div>
      </div>
    );
  }

  if (activeItems.length === 0) {
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
        
        {isBuyNow && (
          <div className="p-3 bg-plum-50 border border-plum-200 text-plum-900 text-xs rounded-xl font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-plum-800 fill-current" />
              <span>{locale === 'ar' ? 'أنت تكمل شراء هذا المنتج مباشرة (Buy Now)' : 'Direct Express Checkout (Buy Now)'}</span>
            </div>
            <Link href="/cart" className="text-[11px] underline font-bold hover:text-plum-700">
              {locale === 'ar' ? 'عرض السلة الكاملة' : 'View Full Cart'}
            </Link>
          </div>
        )}

        {hasInvalidItem && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-950 text-xs rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{locale === 'ar' ? 'تم اكتشاف عناصر غير صالحة في السلة.' : 'Invalid or stale items detected in cart.'}</span>
            </div>
            <button
              type="button"
              onClick={handleCleanCart}
              className="inline-flex items-center gap-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold px-3 py-1 rounded-lg text-[11px] transition-colors shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{locale === 'ar' ? 'تنظيف السلة' : 'Clean Cart'}</span>
            </button>
          </div>
        )}

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
            {activeItems.map((item) => {
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
              <span>{formatPrice(activeSubtotal, locale, settings.currency_symbol)}</span>
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

