const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  currency: { type: String, default: 'USD' }, // NEW: store currency code per expense
  category: String,
  date: {
    type: Date,
    default: Date.now,
  },
  recurring: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly'],
    default: 'none',
  },
  nextRun: Date, // for recurring scheduling
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // link to owner
});

module.exports = mongoose.model('Expense', expenseSchema);
