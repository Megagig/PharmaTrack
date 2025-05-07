import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../store/authStore';

// Create axios instance with base URL
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('API URL:', apiUrl);

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Disable sending cookies with requests
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });

    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response?.status === 401) {
      // Log the user out
      useAuthStore.getState().logout();
      // Redirect to login page (this will be handled by the router)
      window.location.href = '/login';
    }

    return Promise.reject(
      error.response?.data?.message || error.message || 'An error occurred'
    );
  }
);

export default api;
