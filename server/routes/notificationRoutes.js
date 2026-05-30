const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Expense = require('../models/Expense');

router.get('/', auth, async (req, res) => {
  // Upcoming recurring expenses within next 7 days
  const now = new Date();
  const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcoming = await Expense.find({
    userId: req.user._id,
    recurring: { $ne: 'none' },
    $or: [
      { nextRun: { $gte: now, $lte: weekLater } },
      { nextRun: null, date: { $gte: now, $lte: weekLater } }
    ]
  });

  const alerts = upcoming.map((exp) => ({
    type: 'recurring',
    message: `Upcoming ${exp.recurring} expense "${exp.title}" on ${new Date(exp.nextRun || exp.date).toDateString()}`,
  }));

  // Placeholder for budget overrun alerts – could be added later
  res.json(alerts);
});

module.exports = router;
