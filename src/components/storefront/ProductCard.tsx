'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/lib/cart/store';
import { useLocale } from '@/lib/i18n/context';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { t, formatPrice, getLocalized } = useLocale();
  const [added, setAdded] = React.useState(false);

  const productName = getLocalized(product.name, product.name_ar);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative bg-white rounded-2xl p-2.5 sm:p-3 border border-ink-100/70 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between w-full h-full min-w-0">
      <div className="min-w-0">
        {/* Image Container — Consistent aspect-square with object-fit cover */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-cream-100 mb-2 sm:mb-3 shrink-0">
          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            <Image
              src={product.main_image_url}
              alt={productName}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.hover_image_url && (
              <Image
                src={product.hover_image_url}
                alt={productName}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            )}
          </Link>

          {/* Out of Stock / New / Sale Badge */}
          {product.stock_status === 'out_of_stock' ? (
            <span className="absolute top-2 start-2 bg-ink-800/90 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider">
              {t.product.outOfStock}
            </span>
          ) : product.compare_at_price ? (
            <span className="absolute top-2 start-2 bg-rose-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider">
              {t.product.sale}
            </span>
          ) : product.is_new_arrival ? (
            <span className="absolute top-2 start-2 bg-plum-800 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider">
              {t.product.newBadge}
            </span>
          ) : null}
        </div>

        {/* Product Title — Reserved fixed height for 2 lines so cards stay equal height */}
        <Link href={`/products/${product.slug}`} className="block min-w-0">
          <h3 className="font-serif text-xs sm:text-sm font-medium text-plum-900 line-clamp-2 h-8 sm:h-9 group-hover:text-plum-700 transition-colors leading-snug">
            {productName}
          </h3>
        </Link>
      </div>

      {/* Price & Cart Button Row — Consistent height & alignment */}
      <div className="mt-2 pt-2 border-t border-ink-100/50 flex items-center justify-between min-h-[38px] shrink-0">
        <div className="flex flex-col justify-center min-w-0">
          <span className="text-xs font-bold text-plum-900 leading-none">
            {formatPrice(product.price)}
          </span>
          {product.compare_at_price ? (
            <span className="text-[10px] text-ink-500 line-through font-normal mt-0.5 leading-none">
              {formatPrice(product.compare_at_price)}
            </span>
          ) : (
            <span className="text-[10px] invisible font-normal mt-0.5 leading-none select-none">
              &nbsp;
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock_status === 'out_of_stock'}
          className={`p-1.5 sm:p-2 rounded-lg shrink-0 transition-all ${
            product.stock_status === 'out_of_stock'
              ? 'bg-ink-200 text-ink-400 cursor-not-allowed'
              : added
              ? 'bg-emerald-700 text-white'
              : 'bg-plum-900 text-white hover:bg-plum-800 active:scale-95'
          }`}
          title={
            product.stock_status === 'out_of_stock'
              ? t.product.outOfStock
              : added
              ? t.product.addedToCart
              : t.product.addToCart
          }
        >
          {added ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>
      </div>
    </div>
  );
}
