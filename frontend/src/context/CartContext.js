import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user?.sessionId) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/cart?sessionId=${user.sessionId}`);
      setCartItems(response.data.items || []);
      setCartTotal(response.data.total || 0);
      setCartCount(response.data.count || 0);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user?.sessionId) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
    }
  }, [isLoggedIn, user?.sessionId]);

  const addToCart = async (bookId, quantity = 1) => {
    if (!isLoggedIn) {
      toast.error('Please login to add items to cart');
      return false;
    }

    try {
      const response = await api.post('/cart/add', {
        sessionId: user.sessionId,
        bookId,
        quantity,
        userName: user.name
      });
      
      setCartItems(response.data.items);
      setCartTotal(response.data.total);
      setCartCount(response.data.count);
      toast.success('Added to cart!');
      return true;
    } catch (error) {
      toast.error('Failed to add to cart');
      return false;
    }
  };

  const updateQuantity = async (bookId, quantity) => {
    try {
      const response = await api.put('/cart/update', {
        sessionId: user.sessionId,
        bookId,
        quantity
      });
      
      setCartItems(response.data.items);
      setCartTotal(response.data.total);
      setCartCount(response.data.count);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (bookId) => {
    try {
      const response = await api.delete(`/cart/remove/${bookId}?sessionId=${user.sessionId}`);
      setCartItems(response.data.items);
      setCartTotal(response.data.total);
      setCartCount(response.data.count);
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete(`/cart/clear?sessionId=${user.sessionId}`);
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const checkout = async () => {
    try {
      const response = await api.post('/cart/checkout', {
        sessionId: user.sessionId,
        userName: user.name
      });
      
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
      
      return response.data;
    } catch (error) {
      toast.error('Checkout failed');
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartTotal,
      cartCount,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      checkout,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};