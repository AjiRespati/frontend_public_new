import { create } from "zustand";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  total: number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,

  addItem: (product) => {
    const existing = get().items.find((i) => i.id === product.id);
    let newItems;
    if (existing) {
      newItems = get().items.map((i) =>
        i.id === product.id && i.quantity < i.stock
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    } else {
      newItems = [...get().items, { ...product, quantity: 1 }];
    }
    const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    set({ items: newItems, total });
  },

  removeItem: (id) => {
    const newItems = get().items.filter((i) => i.id !== id);
    const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    set({ items: newItems, total });
  },

  increaseQty: (id) => {
    const newItems = get().items.map((i) =>
      i.id === id && i.quantity < i.stock
        ? { ...i, quantity: i.quantity + 1 }
        : i
    );
    const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    set({ items: newItems, total });
  },

  decreaseQty: (id) => {
    const newItems = get().items
      .map((i) =>
        i.id === id && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
      .filter((i) => i.quantity > 0);
    const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    set({ items: newItems, total });
  },

  clearCart: () => set({ items: [], total: 0 }),
}));
