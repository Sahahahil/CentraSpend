import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'USD');
  const { token, user, setUser } = useAuth();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await API.get('/currencies');
        setCurrencies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load currencies', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Sync with user profile if logged in
  useEffect(() => {
    if (token && user?.preferredCurrency) {
      setCurrency(user.preferredCurrency);
    }
  }, [token, user]);

  // Persist to localStorage and optionally to profile
  const changeCurrency = async (newCode) => {
    setCurrency(newCode);
    localStorage.setItem('currency', newCode);
    if (token) {
      await API.patch('/users/me', { preferredCurrency: newCode }, { headers: { Authorization: `Bearer ${token}` } });
      // update user context
      setUser((prev) => ({ ...prev, preferredCurrency: newCode }));
    }
  };

  const getCurrency = (code) =>
    currencies.find((c) => c.code === code) || { code: code || 'USD', name: code || 'USD', symbol: code || 'USD' };

  return (
    <CurrencyContext.Provider value={{ currencies, currency, changeCurrency, loading, getCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
