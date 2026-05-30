const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/authMiddleware');
const { Parser } = require('json2csv');
const csv = require('csv-parser');
const fs = require('fs');

// GET all expenses for logged-in user
router.get('/', auth, async (req, res) => {
  const expenses = await Expense.find({ userId: req.user._id });
  res.json(expenses);
});

// CREATE expense
router.post('/', auth, async (req, res) => {
  const expense = new Expense({ ...req.body, userId: req.user._id });
  await expense.save();
  res.json(expense);
});

// UPDATE expense
router.put('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE expense
router.delete('/:id', auth, async (req, res) => {
  await Expense.deleteOne({ _id: req.params.id, userId: req.user._id });
  res.json({ message: 'Deleted' });
});

/* ---------- Recurring generation endpoint (called by cron) ---------- */
router.post('/_generate-next', auth, async (req, res) => {
  const { expenseId } = req.body;
  const expense = await Expense.findById(expenseId);
  if (!expense || expense.recurring === 'none') {
    return res.status(400).json({ message: 'No recurring expense' });
  }
  const next = expense.nextRun ? new Date(expense.nextRun) : new Date(expense.date);
  switch (expense.recurring) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
  }
  const clone = new Expense({
    title: expense.title,
    amount: expense.amount,
    currency: expense.currency,
    category: expense.category,
    date: next,
    recurring: expense.recurring,
    userId: expense.userId,
  });
  await clone.save();
  expense.nextRun = next;
  await expense.save();
  res.json(clone);
});

/* ---------- Export (CSV) ---------- */
router.get('/export', auth, async (req, res) => {
  const expenses = await Expense.find({ userId: req.user._id });
  const fields = ['title', 'amount', 'currency', 'category', 'date', 'recurring'];
  const parser = new Parser({ fields });
  const csvData = parser.parse(expenses);
  res.header('Content-Type', 'text/csv');
  res.attachment('expenses.csv');
  res.send(csvData);
});

/* ---------- Import (CSV) ---------- */
router.post('/import', auth, async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const filePath = req.files.file.tempFilePath;
  const imported = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', async (row) => {
      const expense = new Expense({
        title: row.title,
        amount: parseFloat(row.amount),
        currency: row.currency || 'USD',
        category: row.category,
        date: row.date,
        recurring: row.recurring || 'none',
        userId: req.user._id,
      });
      await expense.save();
      imported.push(expense);
    })
    .on('end', () => {
      res.json({ importedCount: imported.length, imported });
    })
    .on('error', (err) => {
      res.status(500).json({ message: err.message });
    });
});

/* ---------- Search ---------- */
router.get('/search', auth, async (req, res) => {
  const { q, min, max, start, end, category } = req.query;
  const filter = { userId: req.user._id };
  if (q) filter.title = { $regex: q, $options: 'i' };
  if (min) filter.amount = { ...filter.amount, $gte: Number(min) };
  if (max) filter.amount = { ...filter.amount, $lte: Number(max) };
  if (start) filter.date = { ...filter.date, $gte: new Date(start) };
  if (end) filter.date = { ...filter.date, $lte: new Date(end) };
  if (category) filter.category = category;
  const results = await Expense.find(filter);
  res.json(results);
});

module.exports = router;
