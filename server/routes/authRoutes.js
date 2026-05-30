const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// Register new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already used' });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash: hash });
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { name: user.name, email: user.email, preferredCurrency: user.preferredCurrency } });
});

// Login existing user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { name: user.name, email: user.email, preferredCurrency: user.preferredCurrency } });
});

module.exports = router;
