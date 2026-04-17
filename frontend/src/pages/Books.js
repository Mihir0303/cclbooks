import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from '../components/BookCard';
import api from '../utils/api';
import './Books.css';

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('default');
  
  const categories = ['All', 'Fiction', 'Self-Help', 'Science Fiction', 'Finance', 'Non-Fiction', 'Business', 'Memoir'];
  
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 12,
          ...(selectedCategory !== 'All' && { category: selectedCategory }),
          ...(searchParams.get('search') && { search: searchParams.get('search') }),
          ...(sortBy !== 'default' && { sort: sortBy })
        };
        
        const response = await api.get('/books', { params });
        setBooks(response.data.books);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [currentPage, selectedCategory, sortBy, searchParams]);
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="books-page">
      <div className="container">
        <div className="books-header">
          <h1>Browse Our Collection</h1>
          <p>Discover your next favorite book from our curated selection</p>
        </div>
        
        <div className="books-layout">
          {/* Sidebar */}
          <aside className="books-sidebar">
            <div className="filter-section">
              <h3>Categories</h3>
              <div className="category-filters">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`category-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <div className="books-main">
            <div className="books-toolbar">
              <div className="results-count">
                {!loading && <span>{books.length} books found</span>}
              </div>
              <div className="sort-select">
                <label>Sort by:</label>
                <select value={sortBy} onChange={handleSortChange}>
                  <option value="default">Default</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="loading">Loading books...</div>
            ) : books.length === 0 ? (
              <div className="empty-state">
                <p>No books found matching your criteria.</p>
                <button 
                  className="btn-outline"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSortBy('default');
                    setSearchParams({});
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="books-grid">
                  {books.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ← Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Books;