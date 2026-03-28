import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://smartshop-akc7.onrender.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor — attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartshop_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor — handle 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('smartshop_token');
      localStorage.removeItem('smartshop_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
