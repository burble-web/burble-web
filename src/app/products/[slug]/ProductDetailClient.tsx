'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Plus, Minus, Check, MessageSquare, Zap } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/lib/cart/store';
import { useLocale } from '@/lib/i18n/context';

interface ProductDetailClientProps {
  product: Product;
  whatsappNumber: string;
  freeShippingThreshold?: number;
  flatShippingFee?: number;
}

export function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { t } = useLocale();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    router.push(`/checkout?buyNow=${encodeURIComponent(product.slug)}&qty=${quantity}`);
  };

  const handleWhatsAppOrder = () => {
    router.push(`/checkout?buyNow=${encodeURIComponent(product.slug)}&qty=${quantity}&method=whatsapp`);
  };

  return (
    <div className="mt-8 pt-6 border-t border-ink-100 space-y-4">
      {product.stock_status === 'out_of_stock' ? (
        <div className="w-full py-4 px-6 rounded-xl font-semibold text-xs bg-ink-100 text-ink-600 border border-ink-200 text-center uppercase tracking-wider">
          {t.product.outOfStock}
        </div>
      ) : (
        <>
          {/* Quantity & Actions Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between sm:justify-start border border-ink-200 rounded-xl bg-cream-50 p-1 shrink-0">
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

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 px-5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 border border-plum-900 ${
                added
                  ? 'bg-emerald-700 border-emerald-700 text-white'
                  : 'bg-white text-plum-900 hover:bg-plum-50 active:scale-95 shadow-xs'
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

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-xs bg-plum-900 hover:bg-plum-800 text-white transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{t.product.buyNow}</span>
            </button>
          </div>

          {/* Direct WhatsApp Order CTA */}
          <button
            onClick={handleWhatsAppOrder}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>{t.product.orderWhatsApp}</span>
          </button>
        </>
      )}
    </div>
  );
}
