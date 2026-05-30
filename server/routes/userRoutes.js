const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// Get current logged‑in user profile
router.get('/me', auth, async (req, res) => {
  const { name, email, preferredCurrency } = req.user;
  res.json({ name, email, preferredCurrency });
});

// Update user profile (currently only preferredCurrency)
router.patch('/me', auth, async (req, res) => {
  const { preferredCurrency } = req.body;
  if (preferredCurrency) req.user.preferredCurrency = preferredCurrency;
  await req.user.save();
  res.json({ preferredCurrency: req.user.preferredCurrency });
});

module.exports = router;
