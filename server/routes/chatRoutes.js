const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/authMiddleware');

const userMatch = (userId) => ({ $match: { userId } });

const formatAmount = (amount, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  } catch {
    return `${currency || 'USD'} ${Number(amount).toFixed(2)}`;
  }
};

const getTotalSpent = async (userId) => {
  const result = await Expense.aggregate([
    userMatch(userId),
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return result[0] ? result[0].total : 0;
};

const getCategoryTotal = async (userId, category) => {
  const result = await Expense.aggregate([
    userMatch(userId),
    { $match: { category: { $regex: new RegExp(`^${category}$`, 'i') } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return result[0] ? result[0].total : 0;
};

const getBiggestExpense = async (userId) => {
  return Expense.findOne({ userId }).sort({ amount: -1 }).limit(1);
};

const getAverageExpense = async (userId) => {
  const result = await Expense.aggregate([
    userMatch(userId),
    { $group: { _id: null, avg: { $avg: '$amount' } } },
  ]);
  return result[0] ? Math.round(result[0].avg * 100) / 100 : 0;
};

const getExpenseCount = async (userId) => {
  return Expense.countDocuments({ userId });
};

const getLatestExpense = async (userId) => {
  return Expense.findOne({ userId }).sort({ date: -1 }).limit(1);
};

router.post('/', auth, async (req, res) => {
  const { question } = req.body;
  const q = question?.toLowerCase() || '';
  const userId = req.user._id;

  try {
    const count = await getExpenseCount(userId);
    if (count === 0) {
      return res.json({
        answer:
          "You don't have any expenses yet. Add some transactions first, then ask me about totals, categories, or your biggest spend.",
      });
    }

  if (
      (q.includes('total') &&
        (q.includes('spend') || q.includes('spent') || q.includes('expense') || q.includes('cost'))) ||
      (q.includes('how much') && (q.includes('spend') || q.includes('spent')))
    ) {
      const total = await getTotalSpent(userId);
      const codes = await Expense.distinct('currency', { userId });
      const note =
        codes.length > 1
          ? ' (sum across currencies — not converted)'
          : codes[0]
            ? ` (${codes[0]})`
            : '';
      return res.json({
        answer: `Your total spending across all categories is ${formatAmount(total, codes[0] || 'USD')}${note}.`,
      });
    }

    if (q.includes('average') || q.includes('mean')) {
      const avg = await getAverageExpense(userId);
      const codes = await Expense.distinct('currency', { userId });
      return res.json({
        answer: `Your average expense amount is ${formatAmount(avg, codes[0] || 'USD')}.`,
      });
    }

    if (q.includes('how many') || q.includes('count') || q.includes('number of')) {
      return res.json({ answer: `You have logged a total of ${count} expenses.` });
    }

    if (q.includes('biggest') || q.includes('highest') || q.includes('largest') || q.includes('max')) {
      const exp = await getBiggestExpense(userId);
      if (exp) {
        return res.json({
          answer: `Your single largest expense is "${exp.title}" in the ${exp.category} category for ${formatAmount(exp.amount, exp.currency)}.`,
        });
      }
      return res.json({ answer: 'No expenses have been recorded yet.' });
    }

    if (q.includes('latest') || q.includes('recent') || q.includes('last')) {
      const exp = await getLatestExpense(userId);
      if (exp) {
        const formattedDate = new Date(exp.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        return res.json({
          answer: `Your most recent expense is "${exp.title}" (${formatAmount(exp.amount, exp.currency)}) under ${exp.category} on ${formattedDate}.`,
        });
      }
      return res.json({ answer: 'No expenses have been recorded yet.' });
    }

    const categories = [
      'food',
      'transport',
      'utilities',
      'entertainment',
      'shopping',
      'bills',
      'travel',
      'health',
      'others',
    ];
    let matchedCategory = null;
    for (const cat of categories) {
      if (q.includes(cat)) {
        matchedCategory = cat;
        break;
      }
    }

    if (matchedCategory) {
      const catProper = matchedCategory.charAt(0).toUpperCase() + matchedCategory.slice(1);
      const total = await getCategoryTotal(userId, matchedCategory);
      const codes = await Expense.distinct('currency', {
        userId,
        category: { $regex: new RegExp(`^${matchedCategory}$`, 'i') },
      });
      return res.json({
        answer: `You have spent a total of ${formatAmount(total, codes[0] || 'USD')} on ${catProper}.`,
      });
    }

    if (q.includes('total')) {
      const total = await getTotalSpent(userId);
      const codes = await Expense.distinct('currency', { userId });
      return res.json({
        answer: `Total spending is ${formatAmount(total, codes[0] || 'USD')}${codes.length > 1 ? ' (mixed currencies)' : ''}.`,
      });
    }

    return res.json({
      answer:
        "I can answer questions about your spending:\n" +
        "• What is my total spent?\n" +
        "• How much have I spent on Food / Shopping / Transport?\n" +
        "• What is my biggest expense?\n" +
        "• What is my average expense amount?\n" +
        "• How many expenses have I logged?\n" +
        "• What is my latest transaction?",
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ answer: 'Error processing your question. Please try again.' });
  }
});

module.exports = router;
