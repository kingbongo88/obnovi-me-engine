import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  inventory_id: string;
  model_name: string;
  storage_gb: number;
  grade: string;
  list_price: number;
  photo?: string | null;
}

interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        if (get().items.find((i) => i.inventory_id === item.inventory_id)) return;
        set({ items: [...get().items, item] });
      },
      remove: (id) => set({ items: get().items.filter((i) => i.inventory_id !== id) }),
      clear: () => set({ items: [] }),
    }),
    { name: "obnovime-cart" },
  ),
);
