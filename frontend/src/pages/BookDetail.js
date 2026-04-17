import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import api from '../utils/api';
import './BookDetail.css';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/books/${id}`);
        setBook(response.data.book);
        setRelatedBooks(response.data.related);
      } catch (error) {
        console.error('Failed to fetch book:', error);
        navigate('/books');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBook();
    window.scrollTo(0, 0);
  }, [id, navigate]);
  
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    addToCart(book.id, quantity);
  };
  
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '★';
    if (hasHalfStar) stars += '½';
    while (stars.length < 5) stars += '☆';
    return stars;
  };
  
  if (loading) {
    return (
      <div className="container loading-container">
        <div className="loading">Loading book details...</div>
      </div>
    );
  }
  
  if (!book) return null;
  
  return (
    <div className="book-detail">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> / 
          <Link to="/books">Books</Link> / 
          <span>{book.title}</span>
        </div>
        
        {/* Main Content */}
        <div className="detail-grid">
          <div className="detail-cover">
            <img src={book.cover} alt={book.title} />
          </div>
          
          <div className="detail-info">
            <h1>{book.title}</h1>
            <p className="author">by {book.author}</p>
            
            <div className="rating-section">
              <div className="stars">{renderStars(book.rating)}</div>
              <span className="rating-value">{book.rating}</span>
              <span className="reviews">({book.reviews.toLocaleString()} reviews)</span>
            </div>
            
            <div className="price-section">
              <span className="current-price">${book.price.toFixed(2)}</span>
              {book.originalPrice && (
                <>
                  <span className="original-price">${book.originalPrice.toFixed(2)}</span>
                  <span className="discount-badge">
                    Save ${(book.originalPrice - book.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>
            
            <div className="book-meta">
              <p><strong>Publisher:</strong> {book.publisher}</p>
              <p><strong>Published:</strong> {book.year}</p>
              <p><strong>Pages:</strong> {book.pages}</p>
              <p><strong>Category:</strong> {book.category}</p>
            </div>
            
            <div className="description">
              <h3>Description</h3>
              <p>{book.description}</p>
            </div>
            
            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>
            
            <button className="btn-primary add-to-cart-btn" onClick={handleAddToCart}>
              {isLoggedIn ? 'Add to Cart' : 'Login to Purchase'}
            </button>
          </div>
        </div>
        
        {/* Perks */}
        <div className="perks">
          <div className="perk">
            <span className="perk-icon">🚚</span>
            <span>Free shipping on orders $35+</span>
          </div>
          <div className="perk">
            <span className="perk-icon">🔄</span>
            <span>30-day easy returns</span>
          </div>
          <div className="perk">
            <span className="perk-icon">🔒</span>
            <span>Secure checkout</span>
          </div>
        </div>
        
        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div className="related-books">
            <h2>You Might Also Like</h2>
            <div className="related-grid">
              {relatedBooks.map(relatedBook => (
                <BookCard key={relatedBook.id} book={relatedBook} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;