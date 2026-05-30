const cron = require('node-cron');
const Expense = require('../models/Expense');

// Runs every hour
cron.schedule('0 * * * *', async () => {
  console.log('⏰ Running recurring expense job...');
  const now = new Date();
  const dueExpenses = await Expense.find({
    recurring: { $ne: 'none' },
    $or: [
      { nextRun: { $lte: now } },
      { nextRun: null, date: { $lte: now } }
    ]
  });

  for (const exp of dueExpenses) {
    // Determine next occurrence
    const next = exp.nextRun ? new Date(exp.nextRun) : new Date(exp.date);
    switch (exp.recurring) {
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
    // Clone the expense for the next occurrence
    const clone = new Expense({
      title: exp.title,
      amount: exp.amount,
      currency: exp.currency,
      category: exp.category,
      date: next,
      recurring: exp.recurring,
      userId: exp.userId,
    });
    await clone.save();
    // Update nextRun on original
    exp.nextRun = next;
    await exp.save();
    console.log(`✅ Generated next ${exp.recurring} expense "${exp.title}" for ${next.toISOString()}`);
  }
});
