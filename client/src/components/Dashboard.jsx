import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiTrendingUp, FiLayers, FiActivity, FiArrowUpRight, FiGlobe } from 'react-icons/fi';
import { useCurrency } from '../context/CurrencyContext';
import { formatMoney } from '../lib/formatMoney';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid
} from 'recharts';

const COLORS = [
  '#f59e0b', // Amber
  '#ea580c', // Orange
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#d97706', // Warm gold
  '#ef4444', // Red
  '#14b8a6', // Teal
  '#a855f7', // Violet
  '#78716c', // Stone
];

export default function Dashboard({ expenses }) {
  const { currency: preferredCurrency } = useCurrency();

  const metrics = useMemo(() => {
    if (expenses.length === 0) {
      return {
        total: 0,
        count: 0,
        average: 0,
        topCategory: 'N/A',
        displayCurrency: preferredCurrency,
        isMixed: false,
        currencyCount: 0,
      };
    }

    const codes = [...new Set(expenses.map((item) => item.currency || 'USD'))];
    const isMixed = codes.length > 1;
    const displayCurrency = isMixed ? preferredCurrency : codes[0] || preferredCurrency;
    const scoped = isMixed
      ? expenses.filter((item) => (item.currency || 'USD') === displayCurrency)
      : expenses;

    const total = scoped.reduce((sum, item) => sum + item.amount, 0);
    const count = expenses.length;
    const average = scoped.length ? total / scoped.length : 0;

    const categoryTotals = {};
    scoped.forEach((item) => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
    });

    let topCat = 'N/A';
    let maxSpent = -1;
    Object.entries(categoryTotals).forEach(([cat, val]) => {
      if (val > maxSpent) {
        maxSpent = val;
        topCat = cat;
      }
    });

    return {
      total,
      count,
      average,
      topCategory: topCat,
      displayCurrency,
      isMixed,
      currencyCount: codes.length,
    };
  }, [expenses, preferredCurrency]);

  // 2. Dynamic Monthly BarChart Summary
  const barData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyAggregation = {};

    // Populate actual spending
    expenses.forEach((item) => {
      if (!item.date) return;
      const dateObj = new Date(item.date);
      const monthIndex = dateObj.getMonth();
      const year = dateObj.getFullYear();
      const key = `${months[monthIndex]} ${year}`;
      
      monthlyAggregation[key] = (monthlyAggregation[key] || 0) + item.amount;
    });

    // Convert to array of objects
    const data = Object.entries(monthlyAggregation).map(([monthYear, amount]) => ({
      month: monthYear,
      amount: Math.round(amount * 100) / 100
    }));

    // Sort chronologically by date
    data.sort((a, b) => {
      const partsA = a.month.split(' ');
      const partsB = b.month.split(' ');
      const indexA = months.indexOf(partsA[0]);
      const indexB = months.indexOf(partsB[0]);
      const yearA = parseInt(partsA[1]);
      const yearB = parseInt(partsB[1]);

      if (yearA !== yearB) return yearA - yearB;
      return indexA - indexB;
    });

    // Default mock series if empty to keep charts looking stunning
    if (data.length === 0) {
      return [
        { month: 'No Data', amount: 0 }
      ];
    }

    return data;
  }, [expenses]);

  // 3. Dynamic Category PieChart Summary
  const pieData = useMemo(() => {
    const categoryTotals = {};
    expenses.forEach((item) => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
    });

    const data = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100
    }));

    if (data.length === 0) {
      return [{ name: 'No Expenses', value: 1 }];
    }

    return data;
  }, [expenses]);

  // 4. Custom Recharts Glass Tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      const formatted = metrics.isMixed
        ? `${val.toFixed(2)} (mixed currencies)`
        : formatMoney(val, metrics.displayCurrency);
      return (
        <div className="glass-panel px-4 py-2.5 rounded-xl text-left border shadow-lg border-amber-500/10 dark:border-stone-700 text-xs font-semibold">
          {label && <p className="text-stone-500 dark:text-stone-400 mb-1">{label}</p>}
          <p className="text-amber-600 dark:text-amber-400 text-sm font-bold flex items-center gap-1">
            Amount: <span className="text-gray-900 dark:text-white">{formatted}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.96 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20
      } 
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {metrics.isMixed && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
          <FiGlobe className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <p>
            You have expenses in <strong>{metrics.currencyCount} currencies</strong>. Totals below are
            for <strong>{metrics.displayCurrency}</strong> only. Charts combine amounts without
            conversion.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spending */}
        <motion.div variants={cardVariants} className="glass-panel p-5 rounded-2xl relative overflow-hidden group shadow-sm border border-white/40 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">Total Outflow</span>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 border border-amber-500/10">
              <FiDollarSign className="text-base text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-none tabular-nums">
            {formatMoney(metrics.total, metrics.displayCurrency)}
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium flex items-center gap-1">
            <FiArrowUpRight className="text-amber-500" /> All-time total
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-orange-500"></div>
        </motion.div>

        {/* Transactions Count */}
        <motion.div variants={cardVariants} className="glass-panel p-5 rounded-2xl relative overflow-hidden group shadow-sm border border-white/40 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">Total Records</span>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
              <FiLayers className="text-base text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-none">
            {metrics.count} <span className="text-xs font-medium text-gray-400">items</span>
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium flex items-center gap-1">
            <FiActivity className="text-emerald-500" /> Active transaction items
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-teal-500"></div>
        </motion.div>

        {/* Average Spend */}
        <motion.div variants={cardVariants} className="glass-panel p-5 rounded-2xl relative overflow-hidden group shadow-sm border border-white/40 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">Average Outflow</span>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 border border-amber-500/10">
              <FiTrendingUp className="text-base text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-none tabular-nums">
            {formatMoney(metrics.average, metrics.displayCurrency)}
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium flex items-center gap-1">
            Calculated per transaction
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-yellow-500"></div>
        </motion.div>

        {/* Top Category */}
        <motion.div variants={cardVariants} className="glass-panel p-5 rounded-2xl relative overflow-hidden group shadow-sm border border-white/40 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">Top Category</span>
            <div className="p-2 bg-rose-500/10 rounded-xl text-rose-600 dark:text-rose-400 border border-rose-500/10">
              <FiLayers className="text-base text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-none truncate">
            {metrics.topCategory}
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium flex items-center gap-1">
            Highest cumulative spending
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rose-500 to-pink-500"></div>
        </motion.div>
      </div>

      {/* Dynamic Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Monthly Spending Trend BarChart (lg:col-span-3) */}
        <motion.div 
          variants={cardVariants}
          className="glass-panel p-6 rounded-2xl shadow-sm border border-white/40 dark:border-gray-800 lg:col-span-3 flex flex-col justify-between"
        >
          <div className="mb-4 text-left">
            <h4 className="text-base font-bold text-gray-800 dark:text-white">Monthly Cost Timeline</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Aggregate outflows grouped chronologically</p>
          </div>
          <div className="h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height={280} minWidth={0}>
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#ea580c" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#888888', fontSize: 11, fontWeight: 500 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{ fill: '#888888', fontSize: 11, fontWeight: 500 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <ReTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)', radius: 8 }} />
                <Bar 
                  dataKey="amount" 
                  fill="url(#barGrad)" 
                  radius={[8, 8, 0, 0]} 
                  name="Outflow"
                  maxBarSize={45} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Breakdown PieChart (lg:col-span-2) */}
        <motion.div 
          variants={cardVariants}
          className="glass-panel p-6 rounded-2xl shadow-sm border border-white/40 dark:border-gray-800 lg:col-span-2 flex flex-col justify-between"
        >
          <div className="mb-4 text-left">
            <h4 className="text-base font-bold text-gray-800 dark:text-white">Category Allocation</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Budget percentage share across categories</p>
          </div>
          <div className="h-[280px] w-full min-w-0 relative">
            <ResponsiveContainer width="100%" height={280} minWidth={0}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => percent > 0.05 ? `${name}` : ''}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="rgba(255, 255, 255, 0.15)"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <ReTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Centered Total Indicator */}
            {expenses.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-7">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Budgeted</span>
                <span className="text-lg font-bold text-gray-800 dark:text-white mt-1 tabular-nums text-center px-1">
                  {formatMoney(metrics.total, metrics.displayCurrency)}
                </span>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
