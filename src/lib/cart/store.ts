'use client';

import { useSyncExternalStore } from 'react';
import { CartItem, Product } from '@/types';

const CART_STORAGE_KEY = 'burble_cart_v1';
const WISHLIST_STORAGE_KEY = 'burble_wishlist_v1';

interface CartState {
  items: CartItem[];
  wishlist: string[]; // Product IDs
}

let listeners: (() => void)[] = [];
let memoryState: CartState = {
  items: [],
  wishlist: [],
};

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(id: unknown): id is string {
  return typeof id === 'string' && UUID_REGEX.test(id.trim());
}

/**
 * Strips out legacy mock products (e.g. prod-5) or corrupted items from cart state
 */
export function sanitizeCartItems(rawItems: any[]): CartItem[] {
  if (!Array.isArray(rawItems)) return [];
  return rawItems.filter((item): item is CartItem => {
    if (!item || typeof item !== 'object') return false;
    if (!item.product || typeof item.product !== 'object') return false;
    const { id, name, price } = item.product;
    if (!isValidUUID(id)) {
      console.warn(`[Cart Store] Purging invalid product ID "${id}" from cart storage.`);
      return false;
    }
    if (typeof name !== 'string' || typeof price !== 'number' || isNaN(price) || price < 0) {
      return false;
    }
    if (typeof item.quantity !== 'number' || item.quantity < 1 || isNaN(item.quantity)) {
      return false;
    }
    return true;
  });
}

function sanitizeWishlist(rawWishlist: any[]): string[] {
  if (!Array.isArray(rawWishlist)) return [];
  return rawWishlist.filter((id): id is string => isValidUUID(id));
}

// Helper to safely load initial state on browser
function getSnapshot(): CartState {
  return memoryState;
}

const SERVER_SNAPSHOT: CartState = { items: [], wishlist: [] };

function getServerSnapshot(): CartState {
  return SERVER_SNAPSHOT;
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function emitChange() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(memoryState.items));
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(memoryState.wishlist));
  }
  for (const listener of listeners) {
    listener();
  }
}

// Initialize state from localStorage once on client with automated sanitization
if (typeof window !== 'undefined') {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    const rawItems = savedCart ? JSON.parse(savedCart) : [];
    const rawWishlist = savedWishlist ? JSON.parse(savedWishlist) : [];

    memoryState = {
      items: sanitizeCartItems(rawItems),
      wishlist: sanitizeWishlist(rawWishlist),
    };

    // If invalid items were stripped during parse, immediately sync back clean state to localStorage
    if (rawItems.length !== memoryState.items.length || rawWishlist.length !== memoryState.wishlist.length) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(memoryState.items));
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(memoryState.wishlist));
    }
  } catch (e) {
    console.error('Failed to load cart state from localStorage', e);
  }
}

// Cart actions
export const cartStore = {
  addItem(product: Product, quantity = 1) {
    if (!product || !isValidUUID(product.id)) {
      console.error(`[Cart Store] Cannot add product with invalid UUID identifier:`, product?.id);
      return false;
    }

    const qty = Math.max(1, Math.min(100, quantity));
    const existingIndex = memoryState.items.findIndex((item) => item.product.id === product.id);
    const newItems = [...memoryState.items];

    if (existingIndex > -1) {
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: Math.min(100, newItems[existingIndex].quantity + qty),
      };
    } else {
      newItems.push({ product, quantity: qty });
    }

    memoryState = { ...memoryState, items: newItems };
    emitChange();
    return true;
  },

  removeItem(productId: string) {
    memoryState = {
      ...memoryState,
      items: memoryState.items.filter((item) => item.product.id !== productId),
    };
    emitChange();
  },

  removePurchasedItems(purchasedProductIds: string[]) {
    if (!purchasedProductIds || purchasedProductIds.length === 0) return;
    const idsSet = new Set(purchasedProductIds);
    memoryState = {
      ...memoryState,
      items: memoryState.items.filter((item) => !idsSet.has(item.product.id)),
    };
    emitChange();
  },

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    const safeQty = Math.min(100, quantity);
    memoryState = {
      ...memoryState,
      items: memoryState.items.map((item) =>
        item.product.id === productId ? { ...item, quantity: safeQty } : item
      ),
    };
    emitChange();
  },

  clearCart() {
    memoryState = { ...memoryState, items: [] };
    emitChange();
  },

  sanitize() {
    const cleaned = sanitizeCartItems(memoryState.items);
    if (cleaned.length !== memoryState.items.length) {
      memoryState = { ...memoryState, items: cleaned };
      emitChange();
    }
  },

  toggleWishlist(productId: string) {
    if (!isValidUUID(productId)) return;
    const exists = memoryState.wishlist.includes(productId);
    memoryState = {
      ...memoryState,
      wishlist: exists
        ? memoryState.wishlist.filter((id) => id !== productId)
        : [...memoryState.wishlist, productId],
    };
    emitChange();
  },
};

/**
 * Custom React Hook for accessing cart & wishlist state in Client Components
 */
export function useCart() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const totalItemsCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return {
    items: state.items,
    wishlist: state.wishlist,
    totalItemsCount,
    subtotal,
    addItem: cartStore.addItem.bind(cartStore),
    removeItem: cartStore.removeItem.bind(cartStore),
    removePurchasedItems: cartStore.removePurchasedItems.bind(cartStore),
    updateQuantity: cartStore.updateQuantity.bind(cartStore),
    clearCart: cartStore.clearCart.bind(cartStore),
    sanitize: cartStore.sanitize.bind(cartStore),
    toggleWishlist: cartStore.toggleWishlist.bind(cartStore),
    isInWishlist: (productId: string) => state.wishlist.includes(productId),
  };
}
