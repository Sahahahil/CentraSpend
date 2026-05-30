import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiTrendingUp, FiLayers, FiActivity, FiArrowUpRight } from 'react-icons/fi';
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
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
  '#6b7280'  // Gray
];

export default function Dashboard({ expenses }) {
  
  // 1. Dynamic Key Metrics Calculations
  const metrics = useMemo(() => {
    if (expenses.length === 0) {
      return { total: 0, count: 0, average: 0, topCategory: 'N/A' };
    }

    const total = expenses.reduce((sum, item) => sum + item.amount, 0);
    const count = expenses.length;
    const average = total / count;

    // Calculate Top Category
    const categoryTotals = {};
    expenses.forEach((item) => {
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

    return { total, count, average, topCategory: topCat };
  }, [expenses]);

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
      return (
        <div className="glass-panel px-4 py-2.5 rounded-xl text-left border shadow-lg border-indigo-500/10 dark:border-gray-800 text-xs font-semibold">
          {label && <p className="text-gray-500 dark:text-gray-400 mb-1">{label}</p>}
          <p className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center gap-1">
            Amount: <span className="text-gray-900 dark:text-white">${payload[0].value.toFixed(2)}</span>
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
      {/* 4 Metrics Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spending */}
        <motion.div variants={cardVariants} className="glass-panel p-5 rounded-2xl relative overflow-hidden group shadow-sm border border-white/40 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">Total Outflow</span>
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-500/10">
              <FiDollarSign className="text-base" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-none">
            ${metrics.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium flex items-center gap-1">
            <FiArrowUpRight className="text-indigo-500" /> Dynamic database sum
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-violet-500"></div>
        </motion.div>

        {/* Transactions Count */}
        <motion.div variants={cardVariants} className="glass-panel p-5 rounded-2xl relative overflow-hidden group shadow-sm border border-white/40 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">Total Records</span>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
              <FiLayers className="text-base" />
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
              <FiTrendingUp className="text-base" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-none">
            ${metrics.average.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
              <FiLayers className="text-base" />
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
          <div className="h-[280px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.15} />
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
          <div className="h-[280px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
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
                <span className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                  ${metrics.total > 1000 ? `${(metrics.total/1000).toFixed(1)}k` : Math.round(metrics.total)}
                </span>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
