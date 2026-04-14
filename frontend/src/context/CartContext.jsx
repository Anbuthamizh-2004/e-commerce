import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCartItems([]); return; }
    try {
      setLoading(true);
      const res = await getCart();
      setCartItems(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addItem = async (productId, quantity = 1) => {
    try {
      await addToCart(productId, quantity);
      await fetchCart();
      toast.success('Added to cart!');
    } catch (e) {
      toast.error('Failed to add to cart');
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      await updateCartItem(productId, quantity);
      await fetchCart();
    } catch (e) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      await removeFromCart(productId);
      await fetchCart();
      toast.success('Removed from cart');
    } catch (e) {
      toast.error('Failed to remove item');
    }
  };

  const clearAllItems = async () => {
    try {
      await clearCart();
      setCartItems([]);
    } catch (e) {
      console.error(e);
    }
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, loading, addItem, updateItem, removeItem, clearAllItems, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
