const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/authMiddleware');

// List all categories
router.get('/', auth, async (req, res) => {
  const cats = await Category.find();
  res.json(cats);
});

// Create new category
router.post('/', auth, async (req, res) => {
  const cat = new Category(req.body);
  await cat.save();
  res.json(cat);
});

// Update existing category
router.put('/:id', auth, async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(cat);
});

// Delete category
router.delete('/:id', auth, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
