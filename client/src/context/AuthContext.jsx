import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);

  // Load user profile when token is present
  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (err) {
        console.error('Failed to load profile', err);
        setToken(null);
        localStorage.removeItem('token');
      }
    };
    fetchProfile();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
