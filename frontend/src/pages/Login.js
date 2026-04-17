import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { fetchCart } = useCart();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const success = await login(email, password);
    if (success) {
      await fetchCart();
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
    setLoading(false);
  };
  
  const fillDemo = () => {
    setEmail('demo@foliobooks.com');
    setPassword('demo123');
  };
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-left-content">
            <h2>Welcome Back</h2>
            <p>Sign in to continue your reading journey</p>
            <div className="auth-quote">
              <span className="quote-icon">📖</span>
              <blockquote>"A reader lives a thousand lives before he dies."</blockquote>
              <cite>- George R.R. Martin</cite>
            </div>
            <div className="auth-perks">
              <p>✓ Track your orders</p>
              <p>✓ Save your favorite books</p>
              <p>✓ Get personalized recommendations</p>
            </div>
          </div>
        </div>
        
        <div className="auth-right">
          <div className="auth-form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              {error && <div className="auth-error">{error}</div>}
              
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••"
                />
              </div>
              
              <button type="submit" className="btn-primary auth-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
              
              <button type="button" className="btn-outline demo-btn" onClick={fillDemo}>
                Try Demo Account
              </button>
              
              <p className="auth-switch">
                Don't have an account? <Link to="/register">Sign Up</Link>
              </p>
              
              <div className="demo-credentials">
                <p><strong>Demo Credentials:</strong></p>
                <p>Email: demo@foliobooks.com</p>
                <p>Password: demo123</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;