import React from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';

export const RecurringToggle = ({ value, onChange }) => (
  <div className="flex items-center space-x-2">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Recurring</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-premium"
    >
      <option value="none">None</option>
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
    </select>
    {value !== 'none' && (
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }} className="text-indigo-500">
        <FiRefreshCw />
      </motion.div>
    )}
  </div>
);
