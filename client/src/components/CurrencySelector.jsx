import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { motion } from 'framer-motion';
import { FiGlobe } from 'react-icons/fi';

/** Default currency for new expenses (saved to profile when logged in). */
export default function CurrencySelector() {
  const { currencies, currency, changeCurrency, loading } = useCurrency();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative flex items-center gap-1.5"
      title="Default currency for new expenses"
    >
      <FiGlobe className="text-amber-600 dark:text-amber-400 shrink-0" aria-hidden />
      <select
        value={currency}
        onChange={(e) => changeCurrency(e.target.value)}
        disabled={loading || currencies.length === 0}
        aria-label="Default currency"
        className="max-w-[7.5rem] bg-amber-50/80 dark:bg-stone-800/80 text-stone-800 dark:text-stone-100 rounded-xl px-2.5 py-1.5 text-xs font-semibold border border-amber-200/60 dark:border-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-400/40 cursor-pointer"
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.code}
          </option>
        ))}
      </select>
    </motion.div>
  );
}
