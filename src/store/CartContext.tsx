import React, { createContext, useContext, useState } from "react";
import { CartItem, Product } from "../types";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, note?: string) => void;
  removeFromCart: (productId: number) => void;
  updateNote: (productId: number, note: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, note?: string) => {
    setItems([...items, { ...product, specialNote: note }]);
  };

  const removeFromCart = (productId: number) => {
    setItems(items.filter((item) => item.id !== productId));
  };

  const updateNote = (productId: number, note: string) => {
    setItems(
      items.map((item) =>
        item.id === productId ? { ...item, specialNote: note } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateNote, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}