const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Helper functions
const getTotalSpent = async () => {
  const result = await Expense.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return result[0] ? result[0].total : 0;
};

const getCategoryTotal = async (category) => {
  const result = await Expense.aggregate([
    { $match: { category: { $regex: new RegExp(`^${category}$`, 'i') } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return result[0] ? result[0].total : 0;
};

const getBiggestExpense = async () => {
  return await Expense.findOne().sort({ amount: -1 }).limit(1);
};

const getAverageExpense = async () => {
  const result = await Expense.aggregate([
    { $group: { _id: null, avg: { $avg: '$amount' } } },
  ]);
  return result[0] ? Math.round(result[0].avg * 100) / 100 : 0;
};

const getExpenseCount = async () => {
  return await Expense.countDocuments();
};

const getLatestExpense = async () => {
  return await Expense.findOne().sort({ date: -1 }).limit(1);
};

router.post('/', async (req, res) => {
  const { question } = req.body;
  const q = question?.toLowerCase() || '';
  try {
    // 1. Total spent queries
    if (q.includes('total') && (q.includes('spend') || q.includes('spent') || q.includes('expense') || q.includes('cost'))) {
      const total = await getTotalSpent();
      return res.json({ answer: `Your total spending across all categories is $${total.toFixed(2)}.` });
    }
    
    // 2. Average spent queries
    if (q.includes('average') || q.includes('mean')) {
      const avg = await getAverageExpense();
      return res.json({ answer: `Your average expense amount is $${avg.toFixed(2)}.` });
    }
    
    // 3. Count queries
    if (q.includes('how many') || q.includes('count') || q.includes('number of')) {
      const count = await getExpenseCount();
      return res.json({ answer: `You have logged a total of ${count} expenses.` });
    }
    
    // 4. Biggest / Highest spent queries
    if (q.includes('biggest') || q.includes('highest') || q.includes('largest') || q.includes('max')) {
      const exp = await getBiggestExpense();
      if (exp) {
        return res.json({ answer: `Your single largest expense is "${exp.title}" in the ${exp.category} category for $${exp.amount.toFixed(2)}.` });
      }
      return res.json({ answer: 'No expenses have been recorded yet.' });
    }

    // 5. Latest / Recent queries
    if (q.includes('latest') || q.includes('recent') || q.includes('last')) {
      const exp = await getLatestExpense();
      if (exp) {
        const formattedDate = new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return res.json({ answer: `Your most recent expense is "${exp.title}" ($${exp.amount.toFixed(2)}) under ${exp.category} on ${formattedDate}.` });
      }
      return res.json({ answer: 'No expenses have been recorded yet.' });
    }

    // 6. Dynamic Category Matcher
    const categories = ['food', 'transport', 'utilities', 'entertainment', 'shopping', 'bills', 'travel', 'health', 'others'];
    let matchedCategory = null;
    for (const cat of categories) {
      if (q.includes(cat)) {
        matchedCategory = cat;
        break;
      }
    }
    
    if (matchedCategory) {
      const catProper = matchedCategory.charAt(0).toUpperCase() + matchedCategory.slice(1);
      const total = await getCategoryTotal(matchedCategory);
      return res.json({ answer: `You have spent a total of $${total.toFixed(2)} on ${catProper}.` });
    }

    // Fallback if user just typed total
    if (q.includes('total')) {
      const total = await getTotalSpent();
      return res.json({ answer: `Total spending is $${total.toFixed(2)}.` });
    }

    // Fallback friendly instruction response
    return res.json({ 
      answer: "I can answer specific questions about your spending: \n" +
              "• 'What is my total spent?' \n" +
              "• 'How much have I spent on Food / Shopping / Transport?' \n" +
              "• 'What is my biggest expense?' \n" +
              "• 'What is my average expense amount?' \n" +
              "• 'How many expenses have I logged?' \n" +
              "• 'What is my latest transaction?'" 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: 'Error processing your question. Please try again.' });
  }
});

module.exports = router;
