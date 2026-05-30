import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiCreditCard } from 'react-icons/fi';

export default function Navbar({ theme, toggleTheme }) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel px-6 py-4 rounded-2xl flex items-center justify-between shadow-sm backdrop-blur-md mb-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-500">
          <FiCreditCard className="text-2xl animate-pulse" />
        </div>
        <div className="text-left">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-none m-0 flex items-center gap-1 tracking-tight">
            Centra<span className="text-indigo-500 dark:text-indigo-400">Spend</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
            Personal Expense Intelligence
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Decorative Status badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          Live Sync Active
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <motion.div
            initial={false}
            animate={{ rotate: theme === 'dark' ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            {theme === 'dark' ? (
              <FiSun className="text-xl text-amber-400" />
            ) : (
              <FiMoon className="text-xl text-indigo-600" />
            )}
          </motion.div>
        </button>
      </div>
    </motion.header>
  );
}
