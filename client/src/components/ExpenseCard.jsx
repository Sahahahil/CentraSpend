import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiCoffee, FiTruck, FiZap, FiTv, FiShoppingBag, FiFileText, FiCompass, FiHeart, FiTag } from 'react-icons/fi';
import { formatMoney } from '../lib/formatMoney';

const CATEGORY_MAP = {
  Food: { icon: FiCoffee, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  Transport: { icon: FiTruck, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  Utilities: { icon: FiZap, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  Entertainment: { icon: FiTv, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
  Shopping: { icon: FiShoppingBag, color: 'text-violet-500 bg-violet-500/10 border-violet-500/20' },
  Bills: { icon: FiFileText, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
  Travel: { icon: FiCompass, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
  Health: { icon: FiHeart, color: 'text-pink-500 bg-pink-500/10 border-pink-500/20' },
  Others: { icon: FiTag, color: 'text-stone-500 dark:text-stone-400 bg-stone-500/10 border-stone-500/20' }
};

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  const { _id, title, amount, category, date, currency = 'USD' } = expense;
  const config = CATEGORY_MAP[category] || CATEGORY_MAP.Others;
  const CategoryIcon = config.icon;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="glass-panel p-4.5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300"
    >
      <div className="flex items-center gap-4.5 min-w-0">
        {/* Category Icon */}
        <div className={`p-3.5 rounded-xl border flex-shrink-0 ${config.color}`}>
          <CategoryIcon className="text-xl shrink-0 [color:inherit]" />
        </div>

        {/* Info */}
        <div className="text-left min-w-0">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate pr-2">
            {title}
          </h4>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">{formattedDate}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
            <span className="font-semibold text-gray-600 dark:text-gray-300">{category}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
            <span className="font-medium text-amber-700/90 dark:text-amber-400/90">{currency}</span>
          </div>
        </div>
      </div>

      {/* Right Side Actions & Price */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <span className="text-base font-bold text-gray-900 dark:text-white leading-none tabular-nums">
          −{formatMoney(amount, currency)}
        </span>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 border-l border-gray-200/50 dark:border-gray-700/50 pl-3">
          <button
            onClick={() => onEdit(expense)}
            title="Edit Expense"
            className="p-1.5 rounded-lg text-stone-400 dark:text-amber-300/80 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <FiEdit2 className="text-sm" />
          </button>
          <button
            onClick={() => onDelete(_id)}
            title="Delete Expense"
            className="p-1.5 rounded-lg text-stone-400 dark:text-amber-300/80 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
