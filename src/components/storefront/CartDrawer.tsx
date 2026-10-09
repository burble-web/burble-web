'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart/store';
import { useLocale } from '@/lib/i18n/context';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { t, isRtl, formatPrice, getLocalized } = useLocale();

  const freeShippingThreshold = 300;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeeded = freeShippingThreshold - subtotal;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-plum-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className={`fixed inset-y-0 ${isRtl ? 'left-0 pr-10' : 'right-0 pl-10'} max-w-full flex`}>
        <div className="w-screen max-w-md bg-cream-100 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-ink-100 bg-white flex items-center justify-between">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <ShoppingBag className="w-5 h-5 text-plum-800" />
              <h2 className="font-serif text-xl font-bold text-plum-900">{t.cart.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-ink-500 hover:text-plum-900 transition-colors"
              aria-label={t.common.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-plum-50 p-4 border-b border-plum-100 text-xs">
            {amountNeeded > 0 ? (
              <p className="text-plum-900 font-medium mb-1.5">
                {t.cart.freeShippingAddMore.replace('{amount}', formatPrice(amountNeeded))}
              </p>
            ) : (
              <p className="text-emerald-700 font-bold mb-1.5">{t.cart.freeShippingUnlocked}</p>
            )}
            <div className="w-full bg-plum-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-plum-800 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-ink-300 mx-auto mb-3 stroke-[1.5]" />
                <p className="font-serif text-lg font-semibold text-plum-900">{t.cart.emptyTitle}</p>
                <p className="text-xs text-ink-500 mt-1 mb-6">{t.cart.emptySubtitle}</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-plum-800 text-white text-xs font-medium rounded-lg hover:bg-plum-900 transition-colors shadow-sm"
                >
                  {t.cart.startShopping}
                </button>
              </div>
            ) : (
              items.map((item) => {
                const productName = getLocalized(item.product.name, item.product.name_ar);
                return (
                  <div
                    key={item.product.id}
                    className="flex items-center space-x-4 rtl:space-x-reverse bg-white p-3.5 rounded-xl border border-ink-100 shadow-sm"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-cream-200 shrink-0">
                      <Image
                        src={item.product.main_image_url}
                        alt={productName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-plum-900 truncate">
                        {productName}
                      </h4>
                      <p className="text-xs font-bold text-plum-800 mt-0.5">
                        {formatPrice(item.product.price)}
                      </p>

                      <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                        <div className="flex items-center border border-ink-100 rounded-md bg-cream-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-ink-600 hover:text-plum-800"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-ink-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-ink-600 hover:text-plum-800"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-ink-400 hover:text-rose-600 transition-colors"
                          title={t.cart.removeItem}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout CTA */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-ink-100 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-700 font-medium">{t.cart.subtotal}</span>
                <span className="font-serif text-lg font-bold text-plum-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-ink-500">
                {t.cart.taxesShippingNote}
              </p>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full py-3 bg-plum-800 text-white font-medium text-xs rounded-xl hover:bg-plum-900 transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-md"
                >
                  <span>{t.cart.proceedToCheckout}</span>
                  <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </Link>

                <Link
                  href="/cart"
                  onClick={onClose}
                  className="w-full py-2.5 bg-cream-100 hover:bg-cream-200 text-plum-900 font-semibold text-xs rounded-xl transition-colors border border-ink-200 flex items-center justify-center"
                >
                  <span>{t.cart.title}</span>
                </Link>

                <button
                  onClick={clearCart}
                  className="w-full py-2 text-xs text-ink-500 hover:text-rose-600 transition-colors text-center"
                >
                  {t.cart.clearCart}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
