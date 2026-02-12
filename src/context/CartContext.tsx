import React, { createContext, useContext, useState } from 'react';

interface CartItem {
  id: string; // Combined: productId + color + size
  productId: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity: number, size: string, color: { name: string; hex: string }) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: any, quantity: number, size: string, color: { name: string; hex: string }) => {
    setCartItems((prev) => {
      const variantId = `${product.id}-${color.name}-${size}`;
      const existingItem = prev.find((item) => item.id === variantId);

      if (existingItem) {
        return prev.map((item) =>
          item.id === variantId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      const newItem: CartItem = {
        id: variantId,
        productId: product.id,
        name: product.title || product.name,
        price: Number(product.price),
        image: product.images?.[0]?.url || product.images?.[0] || '',
        quantity,
        selectedSize: size,
        selectedColor: color,
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, size: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};