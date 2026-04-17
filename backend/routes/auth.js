const express = require('express');
const router = express.Router();

// In-memory user storage (fake DB)
const users = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@foliobooks.com',
    password: 'demo123'
  }
];

// Helper to create sessionId
const createSessionId = (userId, email) => {
  return Buffer.from(`${userId}:${email}`).toString('base64');
};

// Register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if user exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user
  const newUser = {
    id: String(users.length + 1),
    name,
    email,
    password
  };
  users.push(newUser);

  const sessionId = createSessionId(newUser.id, newUser.email);

  res.json({
    sessionId,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const sessionId = createSessionId(user.id, user.email);

  res.json({
    sessionId,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

module.exports = router;