import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>FolioBooks</h3>
            <p>Your cozy corner for discovering your next great read.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/books">Browse Books</Link>
          </div>
          
          <div className="footer-section">
            <h4>Categories</h4>
            <Link to="/books?category=Fiction">Fiction</Link>
            <Link to="/books?category=Self-Help">Self-Help</Link>
            <Link to="/books?category=Science Fiction">Sci-Fi</Link>
            <Link to="/books?category=Finance">Finance</Link>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <p>📧 hello@foliobooks.com</p>
            <p>📞 (555) 123-4567</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 FolioBooks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;