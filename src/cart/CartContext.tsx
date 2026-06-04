import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (product: Product, qty?: number) => void;
  updateQty: (productId: number, qty: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartState | undefined>(undefined);
const STORAGE_KEY = "ecommerce_cart";

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function add(product: Product, qty = 1) {
    if (product.stock <= 0) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        const quantity = Math.min(existing.quantity + qty, product.stock);
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity, product } : i,
        );
      }
      return [...prev, { product, quantity: Math.min(qty, product.stock) }];
    });
  }

  function updateQty(productId: number, qty: number) {
    setItems((prev) =>
      prev.flatMap((i) => {
        if (i.product.id !== productId) return [i];
        const clamped = Math.min(Math.max(qty, 1), i.product.stock);
        return [{ ...i, quantity: clamped }];
      }),
    );
  }

  function remove(productId: number) {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }

  function clear() {
    setItems([]);
  }

  const { count, subtotal } = useMemo(() => {
    return items.reduce(
      (acc, i) => ({
        count: acc.count + i.quantity,
        subtotal: acc.subtotal + Number(i.product.price) * i.quantity,
      }),
      { count: 0, subtotal: 0 },
    );
  }, [items]);

  return (
    <CartContext.Provider value={{ items, count, subtotal, add, updateQty, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
