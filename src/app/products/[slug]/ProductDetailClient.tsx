'use client';

import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, Check, MessageSquare } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/lib/cart/store';
import { useLocale } from '@/lib/i18n/context';
import { createWhatsAppOrderLink } from '@/lib/whatsapp/message';

interface ProductDetailClientProps {
  product: Product;
  whatsappNumber: string;
  freeShippingThreshold?: number;
  flatShippingFee?: number;
}

export function ProductDetailClient({
  product,
  whatsappNumber,
  freeShippingThreshold = 300,
  flatShippingFee = 25,
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { locale, t } = useLocale();

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppQuickOrder = () => {
    const itemSubtotal = product.price * quantity;
    const shipping = itemSubtotal >= freeShippingThreshold ? 0 : flatShippingFee;
    const total = itemSubtotal + shipping;

    const waUrl = createWhatsAppOrderLink({
      whatsappNumber,
      orderNumber: `QUICK-${Math.floor(1000 + Math.random() * 9000)}`,
      formData: {
        customer_name: locale === 'ar' ? 'عميل الطلب السريع' : 'Direct Order Customer',
        customer_email: 'pending@whatsapp.com',
        customer_phone: '+974 0000 0000',
        delivery_address: locale === 'ar' ? 'الدوحة، قطر' : 'Doha, Qatar',
        city: locale === 'ar' ? 'الدوحة' : 'Doha',
        payment_method: 'whatsapp',
      },
      items: [{ product, quantity }],
      subtotal: itemSubtotal,
      shippingFee: shipping,
      totalAmount: total,
      locale,
    });

    window.open(waUrl, '_blank');
  };

  return (
    <div className="mt-8 pt-6 border-t border-ink-100 space-y-4">
      {product.stock_status === 'out_of_stock' ? (
        <div className="w-full py-4 px-6 rounded-xl font-semibold text-xs bg-ink-100 text-ink-600 border border-ink-200 text-center uppercase tracking-wider">
          {t.product.outOfStock}
        </div>
      ) : (
        <>
          {/* Quantity & Add to Cart Row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-ink-200 rounded-xl bg-cream-50 p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-ink-700 hover:text-plum-900 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-plum-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-ink-700 hover:text-plum-900 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
                added
                  ? 'bg-emerald-700 text-white'
                  : 'bg-plum-900 text-white hover:bg-plum-800 active:scale-95'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.product.addedToCart}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.product.addToCart}</span>
                </>
              )}
            </button>
          </div>

          {/* Direct WhatsApp Order CTA */}
          <button
            onClick={handleWhatsAppQuickOrder}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>{t.product.orderWhatsApp}</span>
          </button>
        </>
      )}
    </div>
  );
}
