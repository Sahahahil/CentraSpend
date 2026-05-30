import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSearch, FiSliders, FiInbox, FiTrendingDown, FiArrowDown } from 'react-icons/fi';
import ExpenseCard from './ExpenseCard';

const CATEGORIES = [
  'All',
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

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc

  // Process filters and sorting
  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...expenses];

    // Apply Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((exp) => exp.title.toLowerCase().includes(q));
    }

    // Apply Category Filter
    if (categoryFilter !== 'All') {
      result = result.filter((exp) => exp.category === categoryFilter);
    }

    // Apply Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'date-desc':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return result;
  }, [expenses, search, categoryFilter, sortBy]);

  return (
    <div className="space-y-5">
      {/* Search, Filter & Sort Panel */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-white/40 dark:border-gray-800">
        
        {/* Search Bar */}
        <div className="input-with-icon flex-1">
          <span className="input-with-icon__icon" aria-hidden="true">
            <FiSearch />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="input-with-icon__field w-full pr-4 py-3 rounded-xl border border-amber-200/60 dark:border-stone-700 bg-white/60 dark:bg-stone-900/60 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-500 transition-all duration-200 font-medium"
          />
        </div>

        {/* Filters Grid */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 whitespace-nowrap flex items-center gap-1">
              <FiSliders className="text-sm text-amber-600 dark:text-amber-400" /> Category:
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-gray-900/40 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-indigo-500 font-medium text-sm cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 whitespace-nowrap flex items-center gap-1">
              <FiArrowDown className="text-sm text-amber-600 dark:text-amber-400" /> Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-gray-900/40 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-indigo-500 font-medium text-sm cursor-pointer"
            >
              <option value="date-desc">Newest Date</option>
              <option value="date-asc">Oldest Date</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expense Cards Feed */}
      <div className="relative">
        <div className="max-h-[500px] overflow-y-auto pr-1 space-y-3">
          <AnimatePresence initial={false} mode="popLayout">
            {filteredAndSortedExpenses.length > 0 ? (
              filteredAndSortedExpenses.map((expense) => (
                <ExpenseCard
                  key={expense._id}
                  expense={expense}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center border-dashed border-gray-200 dark:border-gray-800/80 shadow-inner"
              >
                <div className="p-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl mb-4 border border-amber-500/20">
                  <FiInbox className="text-4xl" />
                </div>
                <h4 className="text-base font-bold text-gray-800 dark:text-gray-100">
                  No Transactions Found
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[280px] mt-1.5 leading-relaxed font-medium">
                  {expenses.length === 0
                    ? "Your expense registry is currently empty. Use the quick add form to log your first transaction!"
                    : "No transactions match your current search queries or filter settings. Try adjusting them."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
