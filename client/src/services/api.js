import axios from 'axios';

// Create Axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to attach auth token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Ensure Authorization header follows Bearer scheme expected by backend
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default API;
