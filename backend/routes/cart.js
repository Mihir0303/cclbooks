const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const books = require('../data/books');
const { v4: uuidv4 } = require('uuid');

// Get cart by sessionId
router.get('/', async (req, res) => {
  try {
    const { sessionId } = req.query;
    
    if (!sessionId) {
      return res.status(400).json({ message: 'sessionId required' });
    }
    
    let cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      return res.json({ items: [], total: 0, count: 0 });
    }
    
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({
      items: cart.items,
      total,
      count,
      userName: cart.userName
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to cart
router.post('/add', async (req, res) => {
  try {
    const { sessionId, bookId, quantity = 1, userName } = req.body;
    
    if (!sessionId || !bookId) {
      return res.status(400).json({ message: 'sessionId and bookId required' });
    }
    
    const book = books.find(b => b.id === bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    let cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      cart = new Cart({ sessionId, userName: userName || 'Guest', items: [] });
    }
    
    const existingItem = cart.items.find(item => item.bookId === bookId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        bookId: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        cover: book.cover,
        quantity
      });
    }
    
    await cart.save();
    
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({
      items: cart.items,
      total,
      count,
      userName: cart.userName
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update quantity
router.put('/update', async (req, res) => {
  try {
    const { sessionId, bookId, quantity } = req.body;
    
    if (!sessionId || !bookId || quantity === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const item = cart.items.find(item => item.bookId === bookId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.bookId !== bookId);
    } else {
      item.quantity = quantity;
    }
    
    await cart.save();
    
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({
      items: cart.items,
      total,
      count,
      userName: cart.userName
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove item
router.delete('/remove/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const { sessionId } = req.query;
    
    if (!sessionId) {
      return res.status(400).json({ message: 'sessionId required' });
    }
    
    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item.bookId !== bookId);
    await cart.save();
    
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({
      items: cart.items,
      total,
      count,
      userName: cart.userName
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear cart
router.delete('/clear', async (req, res) => {
  try {
    const { sessionId } = req.query;
    
    if (!sessionId) {
      return res.status(400).json({ message: 'sessionId required' });
    }
    
    await Cart.findOneAndDelete({ sessionId });
    
    res.json({ message: 'Cart cleared', items: [], total: 0, count: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Checkout
router.post('/checkout', async (req, res) => {
  try {
    const { sessionId, userName } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ message: 'sessionId required' });
    }
    
    const cart = await Cart.findOne({ sessionId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = uuidv4().slice(0, 8).toUpperCase();
    
    // Calculate estimated delivery (5-7 business days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
    
    const order = new Order({
      orderId,
      sessionId,
      userName: userName || cart.userName,
      items: cart.items.map(item => ({
        bookId: item.bookId,
        title: item.title,
        author: item.author,
        price: item.price,
        cover: item.cover,
        quantity: item.quantity
      })),
      total,
      estimatedDelivery
    });
    
    await order.save();
    
    // Clear cart
    await Cart.findOneAndDelete({ sessionId });
    
    res.json({
      orderId,
      total,
      estimatedDelivery,
      itemsCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;