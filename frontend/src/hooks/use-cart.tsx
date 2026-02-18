import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CartItem = {
  productId?: string;
  name: string;
  brand?: string;
  price: number;
  qty: number;
  maxQty?: number;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  incrementItem: (productId?: string, name?: string) => void;
  decrementItem: (productId?: string, name?: string) => void;
  removeItem: (productId?: string, name?: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const storageKeyCart = "aura_cart_items";

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKeyCart);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as CartItem[];
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch {
      localStorage.removeItem(storageKeyCart);
    }
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      localStorage.removeItem(storageKeyCart);
      return;
    }
    localStorage.setItem(storageKeyCart, JSON.stringify(items));
  }, [items]);

  const upsertItem = (next: CartItem[]) => {
    setItems(next.filter((item) => item.qty > 0));
  };

  const addItem = (item: Omit<CartItem, "qty">, qty: number = 1) => {
    upsertItem(
      (() => {
        const existingIndex = items.findIndex(
          (entry) => entry.productId === item.productId && entry.name === item.name,
        );
        if (existingIndex !== -1) {
          const next = [...items];
          const existing = next[existingIndex];
          const limit = existing.maxQty ?? item.maxQty;
          const currentQty = existing.qty;
          const desiredQty = currentQty + qty;

          if (typeof limit === "number" && desiredQty > limit) {
            next[existingIndex] = {
              ...existing,
              qty: limit,
            };
            return next;
          }

          next[existingIndex] = {
            ...existing,
            qty: desiredQty,
            ...(item.maxQty !== undefined && item.maxQty !== existing.maxQty ? { maxQty: item.maxQty } : {}),
          };
          return next;
        }
        return [
          ...items,
          {
            ...item,
            qty,
          },
        ];
      })(),
    );
  };

  const incrementItem = (productId?: string, name?: string) => {
    upsertItem(
      items.map((item) =>
        item.productId === productId && item.name === name
          ? (() => {
              const limit = item.maxQty;
              if (typeof limit === "number" && item.qty >= limit) {
                return item;
              }
              return {
                ...item,
                qty: item.qty + 1,
              };
            })()
          : item,
      ),
    );
  };

  const decrementItem = (productId?: string, name?: string) => {
    upsertItem(
      items.map((item) =>
        item.productId === productId && item.name === name
          ? {
              ...item,
              qty: item.qty - 1,
            }
          : item,
      ),
    );
  };

  const removeItem = (productId?: string, name?: string) => {
    setItems(items.filter((item) => !(item.productId === productId && item.name === name)));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const value: CartContextValue = {
    items,
    totalItems,
    totalAmount,
    addItem,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};
