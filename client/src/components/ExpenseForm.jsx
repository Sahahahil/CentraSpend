import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiCheck, FiX, FiInfo } from 'react-icons/fi';

const CATEGORIES = [
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Bills',
  'Travel',
  'Health',
  'Others'
];

export default function ExpenseForm({ onSubmit, editingExpense, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title || '');
      setAmount(editingExpense.amount || '');
      setCategory(editingExpense.category || 'Food');
      if (editingExpense.date) {
        setDate(new Date(editingExpense.date).toISOString().split('T')[0]);
      } else {
        setDate(new Date().toISOString().split('T')[0]);
      }
      setError('');
    } else {
      resetForm();
    }
  }, [editingExpense]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory('Food');
    setDate(new Date().toISOString().split('T')[0]);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a description/title.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    const expenseData = {
      title: title.trim(),
      amount: numAmount,
      category,
      date: new Date(date).toISOString(),
    };

    onSubmit(expenseData);
    resetForm();
  };

  return (
    <motion.div 
      layout
      className={`glass-panel p-6 rounded-2xl border transition-all duration-300 ${
        editingExpense 
          ? 'border-violet-500/50 shadow-[0_0_20px_-3px_rgba(139,92,246,0.3)] bg-violet-500/5 dark:bg-violet-500/5' 
          : 'border-white/40 dark:border-gray-800'
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            {editingExpense ? 'Edit Transaction' : 'Quick Add Expense'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {editingExpense ? 'Modify selected transaction details' : 'Log a new cash outflow item'}
          </p>
        </div>
        {editingExpense && (
          <span className="text-xs font-semibold px-2.5 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full animate-pulse border border-violet-500/20">
            Edit Mode
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 ml-1">
            Expense Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Grocery shopping, Gas refill"
            className="input-premium font-medium"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 ml-1">
              Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="input-premium font-medium"
              required
            />
          </div>

          {/* Category Selector */}
          <div>
            <label htmlFor="category" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 ml-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-premium font-medium cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Input */}
        <div>
          <label htmlFor="date" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 ml-1">
            Transaction Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-premium font-medium cursor-pointer"
            required
          />
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-xs font-medium text-rose-500 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl"
            >
              <FiInfo className="flex-shrink-0 text-sm" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          {editingExpense ? (
            <>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-200"
              >
                <FiCheck className="text-lg" />
                Update
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onCancelEdit();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 rounded-xl font-semibold hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-200"
              >
                <FiX className="text-lg" />
                Cancel
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-sm hover:shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer transition-all duration-200"
            >
              <FiPlus className="text-lg" />
              Add Expense
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
