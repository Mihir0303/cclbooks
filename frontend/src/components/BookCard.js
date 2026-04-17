import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './BookCard.css';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  
  const discount = book.originalPrice 
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;
  
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('½');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }
    
    return stars.join('');
  };
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(book.id, 1);
  };
  
  return (
    <Link to={`/book/${book.id}`} className="book-card">
      <div className="book-card-image">
        <img src={book.cover} alt={book.title} />
        {book.badge && <span className="book-badge">{book.badge}</span>}
        {discount > 0 && <span className="book-discount">-{discount}%</span>}
        <div className="book-card-overlay">
          <button 
            className="overlay-add-btn"
            onClick={handleAddToCart}
            disabled={!isLoggedIn}
          >
            {isLoggedIn ? 'Add to Cart' : 'Login to Buy'}
          </button>
        </div>
      </div>
      
      <div className="book-card-info">
        <span className="book-category">{book.category}</span>
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        <div className="book-rating">
          <span className="stars">{renderStars(book.rating)}</span>
          <span className="reviews">({book.reviews.toLocaleString()})</span>
        </div>
        <div className="book-price">
          <span className="current">${book.price.toFixed(2)}</span>
          {book.originalPrice && (
            <span className="original">${book.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BookCard;