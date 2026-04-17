import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import api from '../utils/api';
import './Home.css';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [topRatedBooks, setTopRatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const categories = [
    { name: 'All', icon: '📚', color: '#c4a882' },
    { name: 'Fiction', icon: '📖', color: '#e8d5b7' },
    { name: 'Self-Help', icon: '🌱', color: '#7a9e7e' },
    { name: 'Science Fiction', icon: '🚀', color: '#d4860b' },
    { name: 'Finance', icon: '💰', color: '#8b6f47' },
    { name: 'Non-Fiction', icon: '📰', color: '#5c4a2a' },
    { name: 'Business', icon: '💼', color: '#f0a832' }
  ];
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [featuredRes, booksRes] = await Promise.all([
          api.get('/books/featured'),
          api.get('/books?limit=4&sort=rating')
        ]);
        setFeaturedBooks(featuredRes.data);
        setTopRatedBooks(booksRes.data.books);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, []);
  
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-spine"></div>
        <div className="container hero-content">
          <h1>Discover Your Next Great Read</h1>
          <p>Curated collections of the world's finest books, delivered to your doorstep.</p>
          <Link to="/books" className="btn-primary hero-btn">Browse Collection →</Link>
        </div>
      </section>
      
      {/* Categories */}
      <section className="categories">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link 
                key={cat.name} 
                to={`/books?category=${cat.name}`}
                className="category-chip"
                style={{ backgroundColor: cat.color }}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Books */}
      <section className="featured">
        <div className="container">
          <h2 className="section-title">✨ Featured Books</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="books-grid">
              {featuredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Top Rated */}
      <section className="top-rated">
        <div className="container">
          <h2 className="section-title">⭐ Top Rated Books</h2>
          <div className="books-grid">
            {topRatedBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Promo Banner */}
      <section className="promo">
        <div className="container promo-container">
          <div className="promo-content">
            <h2>Free Shipping on Orders Over $35</h2>
            <p>Join our community of book lovers and enjoy exclusive perks.</p>
            <Link to="/books" className="btn-secondary">Start Shopping →</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;