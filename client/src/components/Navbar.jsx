import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiCreditCard, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import CurrencySelector from './CurrencySelector';

export default function Navbar({ theme, toggleTheme, user }) {
  const { token, logout } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel px-6 py-4 rounded-2xl flex items-center justify-between shadow-sm mb-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-xl border border-amber-300/30 text-amber-600 dark:text-amber-400">
          <FiCreditCard className="text-2xl text-amber-600 dark:text-amber-400" />
        </div>
        <div className="text-left">
          <h1 className="text-xl font-bold text-stone-900 dark:text-white leading-none m-0 tracking-tight">
            Centra<span className="text-gradient-warm">Spend</span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-1">
            Warm &amp; clear expense tracking
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {token && (
          <>
            <CurrencySelector />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Signed in'}
            </div>
          </>
        )}

        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200/50 dark:border-stone-700/50 text-stone-700 dark:text-stone-200 hover:bg-amber-100 dark:hover:bg-stone-700 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <motion.div
            initial={false}
            animate={{ rotate: theme === 'dark' ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            {theme === 'dark' ? (
              <FiSun className="text-xl text-amber-400" />
            ) : (
              <FiMoon className="text-xl text-amber-700" />
            )}
          </motion.div>
        </button>

        {token && (
          <button
            onClick={logout}
            aria-label="Sign out"
            className="p-2.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200/50 dark:border-stone-700/50 text-stone-600 dark:text-stone-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-200 cursor-pointer"
            title="Sign out"
          >
            <FiLogOut className="text-lg" />
          </button>
        )}
      </div>
    </motion.header>
  );
}
