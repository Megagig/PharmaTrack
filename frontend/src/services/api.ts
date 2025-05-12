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
  (config: any) => {
    const token = useAuthStore.getState().token;

    // Log token for debugging (remove in production)
    console.log(
      'Using token for request:',
      token ? 'Token exists' : 'No token'
    );

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
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
      console.log('Authentication error: Token expired or invalid');
      // Log the user out
      useAuthStore.getState().logout();
      // Redirect to login page (this will be handled by the router)
      window.location.href = '/login';
    }

    // Handle 403 Forbidden errors (insufficient permissions)
    if (error.response?.status === 403) {
      console.log('Authorization error: Insufficient permissions');
      // You might want to redirect to a permission denied page or show a message
    }

    // Handle 400 Bad Request errors (validation errors)
    if (error.response?.status === 400) {
      console.log('Validation error:', error.response?.data);
      // Return the specific error message for form validation
    }

    // Get the most specific error message available
    const errorMessage =
      (error.response?.data as any)?.message ||
      (typeof error.response?.data === 'string'
        ? error.response?.data
        : null) ||
      error.message ||
      'An error occurred';

    console.error('Error message:', errorMessage);

    return Promise.reject(errorMessage);
  }
);

export default api;
