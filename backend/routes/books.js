const express = require('express');
const router = express.Router();
const books = require('../data/books');

// Get all books with filtering, search, sorting, pagination
router.get('/', (req, res) => {
  let { category, search, sort, page = 1, limit = 12 } = req.query;
  
  let filteredBooks = [...books];
  
  // Filter by category
  if (category && category !== 'All') {
    filteredBooks = filteredBooks.filter(book => book.category === category);
  }
  
  // Search by title or author
  if (search) {
    const searchLower = search.toLowerCase();
    filteredBooks = filteredBooks.filter(book => 
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower)
    );
  }
  
  // Sorting
  if (sort) {
    switch(sort) {
      case 'rating':
        filteredBooks.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-asc':
        filteredBooks.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredBooks.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filteredBooks.sort((a, b) => b.year - a.year);
        break;
      default:
        break;
    }
  }
  
  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;
  
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
  
  res.json({
    books: paginatedBooks,
    total: filteredBooks.length,
    page: pageNum,
    totalPages: Math.ceil(filteredBooks.length / limitNum)
  });
});

// Get featured books (with badge)
router.get('/featured', (req, res) => {
  const featured = books.filter(book => book.badge !== null).slice(0, 6);
  res.json(featured);
});

// Get single book by ID
router.get('/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  // Get related books (same category, excluding current)
  const related = books
    .filter(b => b.category === book.category && b.id !== book.id)
    .slice(0, 4);
  
  res.json({ book, related });
});

module.exports = router;