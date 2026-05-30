import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiSun, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import InputWithIcon from './InputWithIcon';

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) {
          setError('Please enter your name.');
          return;
        }
        await register(name.trim(), email, password);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK'
          ? 'Cannot reach the server. Start the backend on port 5000.'
          : 'Something went wrong. Please try again.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-[70vh] flex items-center justify-center"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 mb-4">
            <FiSun className="text-3xl text-white" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 tracking-tight">
            Welcome to <span className="text-gradient-warm">CentraSpend</span>
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 font-medium">
            Track spending with clarity — sign in to sync your data.
          </p>
        </div>

        <div className="warm-card p-8">
          <div className="flex rounded-xl bg-amber-50/80 dark:bg-stone-800/80 p-1 mb-6 border border-amber-100 dark:border-stone-700">
            {['login', 'register'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setMode(tab);
                  setError('');
                }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                  mode === tab
                    ? 'bg-white dark:bg-stone-700 text-amber-800 dark:text-amber-200 shadow-sm'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                }`}
              >
                {tab === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <InputWithIcon
                icon={FiUser}
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <InputWithIcon
              icon={FiMail}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <InputWithIcon
              icon={FiLock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            {error && (
              <p className="text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
              {!loading && <FiArrowRight className="text-white" />}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-stone-400 dark:text-stone-500 mt-6">
          Your expenses stay private to your account.
        </p>
      </div>
    </motion.div>
  );
}
