import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import { useCurrency } from '../context/CurrencyContext';
import { formatMoney } from '../lib/formatMoney';
import CurrencyPicker from './CurrencyPicker';

const CATEGORIES = [
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Bills',
  'Travel',
  'Health',
  'Others',
];

export default function ExpenseForm({ onSubmit, editingExpense, onCancelEdit }) {
  const { currency: defaultCurrency } = useCurrency();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [expenseCurrency, setExpenseCurrency] = useState(defaultCurrency);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editingExpense) {
      setExpenseCurrency(defaultCurrency);
    }
  }, [defaultCurrency, editingExpense]);

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title || '');
      setAmount(editingExpense.amount ?? '');
      setCategory(editingExpense.category || 'Food');
      setExpenseCurrency(editingExpense.currency || defaultCurrency);
      if (editingExpense.date) {
        setDate(new Date(editingExpense.date).toISOString().split('T')[0]);
      } else {
        setDate(new Date().toISOString().split('T')[0]);
      }
      setError('');
    } else {
      resetForm();
    }
  }, [editingExpense, defaultCurrency]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory('Food');
    setExpenseCurrency(defaultCurrency);
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
    if (Number.isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    onSubmit({
      title: title.trim(),
      amount: numAmount,
      category,
      currency: expenseCurrency,
      date: new Date(date).toISOString(),
    });
    resetForm();
  };

  const amountLabel = expenseCurrency
    ? `Amount (${expenseCurrency})`
    : 'Amount';

  return (
    <motion.div
      layout
      className={`glass-panel p-6 rounded-2xl border transition-all duration-300 ${
        editingExpense
          ? 'border-amber-500/50 shadow-[0_0_20px_-3px_rgba(245,158,11,0.25)] bg-amber-500/5'
          : 'border-white/40 dark:border-stone-800'
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-stone-800 dark:text-white">
            {editingExpense ? 'Edit Transaction' : 'Quick Add Expense'}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {editingExpense ? 'Modify selected transaction details' : 'Log a new cash outflow item'}
          </p>
        </div>
        {editingExpense && (
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-full border border-amber-500/20">
            Edit Mode
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5 ml-1">
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

        <CurrencyPicker
          id="expense-currency"
          label="Currency"
          value={expenseCurrency}
          onChange={setExpenseCurrency}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5 ml-1">
              {amountLabel}
            </label>
            <input
              type="number"
              id="amount"
              step="any"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="input-premium font-medium"
              required
            />
            {amount && !Number.isNaN(parseFloat(amount)) && (
              <p className="text-[10px] text-amber-700/80 dark:text-amber-400/90 mt-1 ml-1">
                Preview: {formatMoney(parseFloat(amount), expenseCurrency)}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5 ml-1">
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

        <div>
          <label htmlFor="date" className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5 ml-1">
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

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-xs font-medium text-rose-500 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl"
            >
              <FiInfo className="flex-shrink-0 text-sm text-rose-500 dark:text-rose-400" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 pt-2">
          {editingExpense ? (
            <>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-200"
              >
                <FiCheck className="text-lg text-white" />
                Update
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onCancelEdit();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200/50 dark:border-stone-700/50 rounded-xl font-semibold hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-200"
              >
                <FiX className="text-lg text-stone-600 dark:text-stone-300" />
                Cancel
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer transition-all duration-200"
            >
              <FiPlus className="text-lg text-white" />
              Add Expense
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
