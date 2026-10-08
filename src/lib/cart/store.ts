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

// Initialize state from localStorage once on client
if (typeof window !== 'undefined') {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    memoryState = {
      items: savedCart ? JSON.parse(savedCart) : [],
      wishlist: savedWishlist ? JSON.parse(savedWishlist) : [],
    };
  } catch (e) {
    console.error('Failed to load cart state', e);
  }
}

// Cart actions
export const cartStore = {
  addItem(product: Product, quantity = 1) {
    const existingIndex = memoryState.items.findIndex((item) => item.product.id === product.id);
    const newItems = [...memoryState.items];
    if (existingIndex > -1) {
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: newItems[existingIndex].quantity + quantity,
      };
    } else {
      newItems.push({ product, quantity });
    }
    memoryState = { ...memoryState, items: newItems };
    emitChange();
  },

  removeItem(productId: string) {
    memoryState = {
      ...memoryState,
      items: memoryState.items.filter((item) => item.product.id !== productId),
    };
    emitChange();
  },

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    memoryState = {
      ...memoryState,
      items: memoryState.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    };
    emitChange();
  },

  clearCart() {
    memoryState = { ...memoryState, items: [] };
    emitChange();
  },

  toggleWishlist(productId: string) {
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
    updateQuantity: cartStore.updateQuantity.bind(cartStore),
    clearCart: cartStore.clearCart.bind(cartStore),
    toggleWishlist: cartStore.toggleWishlist.bind(cartStore),
    isInWishlist: (productId: string) => state.wishlist.includes(productId),
  };
}
