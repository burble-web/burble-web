'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/lib/cart/store';
import { useLocale } from '@/lib/i18n/context';
import { SiteSettings } from '@/types';
import { getLocalizedValue, formatPrice } from '@/lib/i18n/utils';

interface CartPageClientProps {
  settings: SiteSettings;
}

export function CartPageClient({ settings }: CartPageClientProps) {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { locale, direction, t } = useLocale();

  const freeShippingThreshold = settings.free_shipping_threshold || 300;
  const flatShippingFee = settings.flat_shipping_fee || 25;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeeded = freeShippingThreshold - subtotal;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : flatShippingFee;
  const totalAmount = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-ink-100 shadow-xs my-8 max-w-xl mx-auto">
        <div className="w-20 h-20 bg-cream-100 text-plum-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-plum-900 mb-2">
          {t.cart.emptyTitle}
        </h2>
        <p className="text-xs sm:text-sm text-ink-500 mb-8 max-w-sm mx-auto">
          {t.cart.emptySubtitle}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-plum-900 hover:bg-plum-800 text-white text-xs font-semibold rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <span>{t.cart.startShopping}</span>
          {direction === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-start">
      {/* Items List (Left Column) */}
      <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-ink-100 shadow-xs space-y-6">
        
        {/* Free Shipping Progress Indicator */}
        <div className="bg-plum-50 p-4 rounded-2xl border border-plum-100 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-plum-900 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-plum-800" />
              {amountNeeded > 0
                ? t.cart.freeShippingAddMore.replace('{amount}', formatPrice(amountNeeded, locale, settings.currency_symbol))
                : t.cart.freeShippingUnlocked}
            </span>
            <span className="font-bold text-plum-800">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-plum-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-plum-800 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Table / List Header */}
        <div className="hidden sm:grid grid-cols-12 text-xs font-semibold text-ink-400 border-b border-ink-100 pb-3 uppercase tracking-wider">
          <span className="col-span-6">{t.product.productName}</span>
          <span className="col-span-2 text-center">{t.product.price}</span>
          <span className="col-span-2 text-center">{t.product.quantity}</span>
          <span className="col-span-2 text-end">{t.cart.subtotal}</span>
        </div>

        {/* Items rows */}
        <div className="divide-y divide-ink-100">
          {items.map((item) => {
            const productName = getLocalizedValue({
              locale,
              english: item.product.name,
              arabic: item.product.name_ar,
            });
            const itemTotal = item.product.price * item.quantity;

            return (
              <div key={item.product.id} className="py-5 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                {/* Product details */}
                <div className="w-full sm:col-span-6 flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-cream-100 border border-ink-100 shrink-0">
                    <Image
                      src={item.product.main_image_url}
                      alt={productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-serif text-sm sm:text-base font-bold text-plum-900 hover:text-plum-700 transition-colors line-clamp-2"
                    >
                      {productName}
                    </Link>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="mt-2 text-ink-400 hover:text-rose-600 transition-colors text-[11px] inline-flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.cart.removeItem}</span>
                    </button>
                  </div>
                </div>

                {/* Unit Price */}
                <div className="hidden sm:block sm:col-span-2 text-center text-xs font-medium text-ink-700">
                  {formatPrice(item.product.price, locale, settings.currency_symbol)}
                </div>

                {/* Quantity Selector */}
                <div className="w-full sm:w-auto sm:col-span-2 flex justify-between sm:justify-center items-center">
                  <span className="sm:hidden text-xs text-ink-500">{t.product.quantity}:</span>
                  <div className="flex items-center border border-ink-200 rounded-xl bg-cream-50 p-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 text-ink-600 hover:text-plum-900 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-plum-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 text-ink-600 hover:text-plum-900 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Total Line Price */}
                <div className="w-full sm:w-auto sm:col-span-2 flex justify-between sm:justify-end items-center text-end font-serif font-bold text-sm text-plum-900">
                  <span className="sm:hidden text-xs font-sans text-ink-500">{t.cart.subtotal}:</span>
                  <span>{formatPrice(itemTotal, locale, settings.currency_symbol)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions under list */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-ink-100">
          <Link
            href="/products"
            className="text-xs font-semibold text-plum-800 hover:text-plum-900 inline-flex items-center gap-1.5"
          >
            {direction === 'rtl' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{locale === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}</span>
          </Link>

          <button
            onClick={clearCart}
            className="text-xs font-medium text-ink-400 hover:text-rose-600 transition-colors"
          >
            {t.cart.clearCart}
          </button>
        </div>

      </div>

      {/* Order Summary Card (Right Column) */}
      <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-ink-100 shadow-xs space-y-6 sticky top-24">
        <h3 className="font-serif text-xl font-bold text-plum-900 border-b border-ink-100 pb-3">
          {t.checkout.orderSummary}
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between text-ink-700">
            <span>{t.checkout.itemsSubtotal}</span>
            <span className="font-medium text-plum-900">
              {formatPrice(subtotal, locale, settings.currency_symbol)}
            </span>
          </div>

          <div className="flex justify-between text-ink-700">
            <span>{t.checkout.deliveryFee}</span>
            <span className="font-medium text-plum-900">
              {shippingFee > 0
                ? formatPrice(shippingFee, locale, settings.currency_symbol)
                : <span className="text-emerald-700 font-bold">{t.checkout.freeDelivery}</span>}
            </span>
          </div>

          <div className="pt-3 border-t border-ink-100 flex justify-between items-baseline font-serif">
            <span className="text-base font-bold text-plum-900">{t.checkout.totalAmount}</span>
            <span className="text-2xl font-bold text-plum-900">
              {formatPrice(totalAmount, locale, settings.currency_symbol)}
            </span>
          </div>

          <p className="text-[11px] text-ink-500 font-light pt-1">
            {t.cart.taxesShippingNote}
          </p>
        </div>

        <Link
          href="/checkout"
          className="w-full py-4 bg-plum-900 hover:bg-plum-800 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 text-center"
        >
          <span>{t.cart.proceedToCheckout}</span>
          {direction === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </Link>

        {/* Feature badges */}
        <div className="pt-6 border-t border-ink-100 grid grid-cols-2 gap-3 text-[11px] text-ink-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-plum-800 shrink-0" />
            <span>{t.features.secure}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-plum-800 shrink-0" />
            <span>{t.features.quality}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
