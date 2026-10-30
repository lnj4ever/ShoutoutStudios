import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { findProduct, unitPrice } from "./catalog.js";

const KEY = "shoutout-cart-v1";
const CartContext = createContext(null);

function load() {
  try {
    const lines = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(lines) ? lines.filter((l) => findProduct(l.productId)) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(load);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable: cart lives for this visit only */
    }
  }, [lines]);

  const value = useMemo(() => {
    const subtotal = lines.reduce((s, l) => s + unitPrice(findProduct(l.productId), l.selections) * l.qty, 0);
    const count = lines.reduce((s, l) => s + (findProduct(l.productId).unit ? 1 : l.qty), 0);
    return {
      lines,
      subtotal,
      count,
      open,
      setOpen,
      add(line) {
        setLines((ls) => [...ls, { ...line, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }]);
        setOpen(true);
      },
      setQty(id, qty) {
        setLines((ls) =>
          ls.map((l) => {
            if (l.id !== id) return l;
            const min = findProduct(l.productId).minQty || 1;
            return { ...l, qty: Math.max(min, Math.min(999, qty)) };
          }),
        );
      },
      remove(id) {
        setLines((ls) => ls.filter((l) => l.id !== id));
      },
      removeMany(ids) {
        setLines((ls) => ls.filter((l) => !ids.includes(l.id)));
      },
      clear() {
        setLines([]);
      },
    };
  }, [lines, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
