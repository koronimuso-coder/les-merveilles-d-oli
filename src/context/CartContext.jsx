import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApp } from './AppContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { siteSettings, playCartSound } = useApp();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('oli_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('oli_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add Item to Cart
  const addToCart = (product, quantity = 1, selectedOptions = {}) => {
    // Generate a unique ID for the cart item based on product ID and selected options key-value
    const optionsKey = Object.entries(selectedOptions)
      .map(([optName, optVal]) => `${optName}:${optVal.nameFr}`)
      .sort()
      .join('|');
    const cartItemId = `${product.id}-${optionsKey}`;

    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.id === cartItemId);
      if (existing) {
        return prevItems.map(item => 
          item.id === cartItemId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, {
        id: cartItemId,
        product,
        quantity,
        selectedOptions,
        addedAt: new Date().toISOString()
      }];
    });

    // Custom UI event to trigger flying particles/animations
    const event = new CustomEvent('cart-item-added', { 
      detail: { productId: product.id, count: quantity } 
    });
    window.dispatchEvent(event);
    playCartSound();
  };

  // Remove Item
  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
  };

  // Update Quantity
  const updateQuantity = (cartItemId, qty) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.id === cartItemId 
        ? { ...item, quantity: qty }
        : item
    ));
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      // Base price (use promo price if available)
      const basePrice = item.product.promoPrice || item.product.price;
      
      // Calculate extra options price
      const optionsExtra = Object.values(item.selectedOptions).reduce((optSum, optionChoice) => {
        return optSum + (optionChoice.extraPrice || 0);
      }, 0);

      return sum + ((basePrice + optionsExtra) * item.quantity);
    }, 0);
  };

  const getTaxes = (subtotal) => {
    return subtotal * (siteSettings.taxesPercent / 100);
  };

  const getTotalCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getSubtotal,
      getTaxes,
      getTotalCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
