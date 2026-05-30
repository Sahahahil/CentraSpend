import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLoader, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import API from './services/api';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Chatbot from './components/Chatbot';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [theme, setTheme] = useState('dark'); // 'light' or 'dark' (default to premium dark mode)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Initial State: Fetch expenses & Setup Local Storage Theme
  useEffect(() => {
    // Load theme setting
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/expenses');
      setExpenses(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Could not connect to database server. Please verify port 5000 is open.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Toggle dark/light theme setting
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 3. Create or Update transaction
  const handleAddOrUpdateExpense = async (expenseData) => {
    try {
      if (editingExpense) {
        // Edit Mode
        const res = await API.put(`/expenses/${editingExpense._id}`, expenseData);
        setExpenses((prev) =>
          prev.map((item) => (item._id === editingExpense._id ? res.data : item))
        );
        setEditingExpense(null);
      } else {
        // Add Mode
        const res = await API.post('/expenses', expenseData);
        setExpenses((prev) => [res.data, ...prev]);
      }
    } catch (err) {
      console.error(err);
      alert('Error updating expense. Please try again.');
    }
  };

  // 4. Delete transaction
  const handleDeleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((item) => item._id !== id));
      // If we are currently editing the deleted expense, cancel edit
      if (editingExpense && editingExpense._id === id) {
        setEditingExpense(null);
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting expense. Please try again.');
    }
  };

  // 5. Select transaction for editing
  const handleEditSelect = (expense) => {
    setEditingExpense(expense);
  };

  // 6. Abort current editing operation
  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  return (
    <div className="bg-mesh min-h-screen text-gray-800 dark:text-gray-100 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        <AnimatePresence mode="wait">
          {loading ? (
            /* Premium Spinner Load Frame */
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[60vh] flex flex-col items-center justify-center text-center"
            >
              <FiLoader className="text-4xl text-indigo-500 animate-spin mb-4" />
              <h3 className="text-base font-bold text-gray-800 dark:text-white">Connecting Database</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Fetching transaction records...</p>
            </motion.div>
          ) : error ? (
            /* Database Error Alert Frame */
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="h-[60vh] flex flex-col items-center justify-center text-center max-w-md mx-auto"
            >
              <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl mb-4 border border-rose-500/10">
                <FiAlertTriangle className="text-4xl" />
              </div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white">Connection Interrupted</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium leading-relaxed">
                {error}
              </p>
              <button
                onClick={fetchExpenses}
                className="mt-5 flex items-center gap-2 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300"
              >
                <FiRefreshCw /> Retry Connection
              </button>
            </motion.div>
          ) : (
            /* Core Dashboard Layout Workspace */
            <motion.div
              key="workspace"
              initial={{ opacity: 0, y: 30, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Dynamic Stats Grid and Visual Charts */}
              <Dashboard expenses={expenses} />

              {/* Bottom Interactive Feed Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Form Input Widget (1/3 Width) */}
                <div className="lg:col-span-1">
                  <ExpenseForm
                    onSubmit={handleAddOrUpdateExpense}
                    editingExpense={editingExpense}
                    onCancelEdit={handleCancelEdit}
                  />
                </div>

                {/* Search Feed & Transaction Cards (2/3 Width) */}
                <div className="lg:col-span-2">
                  <ExpenseList
                    expenses={expenses}
                    onEdit={handleEditSelect}
                    onDelete={handleDeleteExpense}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating AI Chatbot popup panel */}
        <Chatbot />

      </div>
    </div>
  );
}
