import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { isLoggedIn } = useAuth();
  const { cartItems, cartTotal, cartCount, updateQuantity, removeItem, checkout } = useCart();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  
  const shippingThreshold = 35;
  const shippingCost = cartTotal >= shippingThreshold ? 0 : 4.99;
  const grandTotal = cartTotal + shippingCost;
  
  const handleUpdateQuantity = (bookId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity >= 1) {
      updateQuantity(bookId, newQuantity);
    }
  };
  
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const order = await checkout();
      setOrderComplete(order);
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  if (!isLoggedIn) {
    return (
      <div className="container cart-gate">
        <div className="gate-content">
          <span className="gate-icon">🔒</span>
          <h2>Please Login to View Your Cart</h2>
          <p>Sign in to see items you've added to your cart and proceed with checkout.</p>
          <div className="gate-buttons">
            <Link to="/login" className="btn-primary">Login</Link>
            <Link to="/register" className="btn-outline">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (orderComplete) {
    return (
      <div className="container checkout-success">
        <div className="success-content">
          <div className="success-icon">✅</div>
          <h2>Order Confirmed!</h2>
          <p>Thank you for your purchase, book lover!</p>
          <div className="order-details">
            <p><strong>Order ID:</strong> {orderComplete.orderId}</p>
            <p><strong>Total:</strong> ${orderComplete.total.toFixed(2)}</p>
            <p><strong>Estimated Delivery:</strong> {new Date(orderComplete.estimatedDelivery).toLocaleDateString()}</p>
          </div>
          <Link to="/books" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="container empty-cart">
        <div className="empty-content">
          <span className="empty-icon">📚</span>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any books to your cart yet.</p>
          <Link to="/books" className="btn-primary">Browse Books</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container cart-page">
      <h1>Your Cart ({cartCount} items)</h1>
      
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.bookId} className="cart-item">
              <img src={item.cover} alt={item.title} className="cart-item-image" />
              
              <div className="cart-item-details">
                <h3>{item.title}</h3>
                <p className="item-author">{item.author}</p>
                <p className="item-price">${item.price.toFixed(2)} each</p>
              </div>
              
              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button onClick={() => handleUpdateQuantity(item.bookId, item.quantity, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.bookId, item.quantity, 1)}>+</button>
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => removeItem(item.bookId)}
                >
                  Remove
                </button>
              </div>
              
              <div className="cart-item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h3>Order Summary</h3>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span>
              {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
              {cartTotal < shippingThreshold && (
                <small> (${(shippingThreshold - cartTotal).toFixed(2)} more for free shipping)</small>
              )}
            </span>
          </div>
          
          <div className="summary-row total">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
          
          <button 
            className="btn-primary checkout-btn"
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
          </button>
          
          <Link to="/books" className="continue-shopping">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;