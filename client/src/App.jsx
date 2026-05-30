import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLoader, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import API from './services/api';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Chatbot from './components/Chatbot';
import AuthScreen from './components/AuthScreen';

export default function App() {
  const { token, user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const fetchExpenses = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/expenses');
      setExpenses(res.data || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError('Session expired. Please sign in again.');
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        setError(
          'Cannot reach the API server. Start the backend with `npm run server` from the project root (port 5000).'
        );
      } else if (err.response?.status === 503) {
        setError('Database is not ready yet. Wait a moment and retry.');
      } else {
        setError(err.response?.data?.message || 'Failed to load expenses.');
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchExpenses();
    } else {
      setExpenses([]);
      setEditingExpense(null);
    }
  }, [token, fetchExpenses]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const handleAddOrUpdateExpense = async (expenseData) => {
    try {
      if (editingExpense) {
        const res = await API.put(`/expenses/${editingExpense._id}`, expenseData);
        setExpenses((prev) =>
          prev.map((item) => (item._id === editingExpense._id ? res.data : item))
        );
        setEditingExpense(null);
      } else {
        const res = await API.post('/expenses', expenseData);
        setExpenses((prev) => [res.data, ...prev]);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving expense. Please try again.');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((item) => item._id !== id));
      if (editingExpense?._id === id) {
        setEditingExpense(null);
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting expense. Please try again.');
    }
  };

  return (
    <div className="bg-mesh min-h-screen text-stone-800 dark:text-stone-100 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Navbar theme={theme} toggleTheme={toggleTheme} user={user} />

        <AnimatePresence mode="wait">
          {!token ? (
            <AuthScreen key="auth" />
          ) : loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[60vh] flex flex-col items-center justify-center text-center"
            >
              <FiLoader className="text-4xl text-amber-500 dark:text-amber-400 animate-spin mb-4" />
              <h3 className="text-base font-bold text-stone-800 dark:text-white">
                Loading your expenses
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-medium">
                Syncing from the database…
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="h-[60vh] flex flex-col items-center justify-center text-center max-w-md mx-auto"
            >
              <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl mb-4 border border-rose-200/50">
                <FiAlertTriangle className="text-4xl mx-auto text-rose-500 dark:text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-stone-800 dark:text-white">
                Connection issue
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 font-medium leading-relaxed">
                {error}
              </p>
              <button
                onClick={fetchExpenses}
                className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300"
              >
                <FiRefreshCw /> Retry
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-8"
            >
              <Dashboard expenses={expenses} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-1">
                  <ExpenseForm
                    onSubmit={handleAddOrUpdateExpense}
                    editingExpense={editingExpense}
                    onCancelEdit={() => setEditingExpense(null)}
                  />
                </div>
                <div className="lg:col-span-2">
                  <ExpenseList
                    expenses={expenses}
                    onEdit={setEditingExpense}
                    onDelete={handleDeleteExpense}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {token && <Chatbot />}
      </div>
    </div>
  );
}
