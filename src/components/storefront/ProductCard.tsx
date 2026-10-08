'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/lib/cart/store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, toggleWishlist, isInWishlist } = useCart();
  const [added, setAdded] = React.useState(false);
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white rounded-2xl p-3 border border-ink-100/70 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-cream-100 mb-3">
          <Link href={`/products/${product.slug}`}>
            <Image
              src={product.main_image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.hover_image_url && (
              <Image
                src={product.hover_image_url}
                alt={product.name}
                fill
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            )}
          </Link>

          {/* New / Sale Badge */}
          {product.compare_at_price && (
            <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Sale
            </span>
          )}
          {!product.compare_at_price && product.is_new_arrival && (
            <span className="absolute top-2.5 left-2.5 bg-plum-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              New
            </span>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all ${
              isWishlisted
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 text-ink-700 hover:bg-white hover:text-rose-500'
            }`}
            aria-label="Add to wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-serif text-sm font-medium text-plum-900 line-clamp-1 group-hover:text-plum-700 transition-colors">
            {product.name}
          </h3>
        </Link>
      </div>

      {/* Price & Cart Button Row */}
      <div className="mt-3 pt-2 border-t border-ink-100/50 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-plum-900">
            QAR {product.price.toFixed(2)}
          </span>
          {product.compare_at_price && (
            <span className="text-[11px] text-ink-500 line-through ml-1.5 font-normal">
              QAR {product.compare_at_price.toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className={`p-2 rounded-lg transition-all ${
            added
              ? 'bg-emerald-700 text-white'
              : 'bg-plum-900 text-white hover:bg-plum-800 active:scale-95'
          }`}
          title="Add to cart"
        >
          {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
