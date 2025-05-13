import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../store/authStore';
import { notifications } from '@mantine/notifications';

// Create axios instance with base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a more robust API service with retry logic and better error handling
class ApiService {
  private static instance: ApiService;
  private maxRetries = 2;
  private retryDelay = 1000; // 1 second

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Generic GET request with retry logic
  public async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  // Generic POST request with retry logic
  public async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('POST', endpoint, data, config);
  }

  // Generic PUT request with retry logic
  public async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('PUT', endpoint, data, config);
  }

  // Generic DELETE request with retry logic
  public async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }

  // Generic request method with retry logic
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
    retryCount = 0
  ): Promise<T> {
    try {
      const token = useAuthStore.getState().token;
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(config?.headers || {})
      };

      const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      
      console.log(`Making ${method} request to ${url}`);
      
      const response = await axios.request<T>({
        method,
        url,
        data,
        headers,
        ...config,
        timeout: 10000, // 10 seconds timeout
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      
      // Log the error for debugging
      console.error(`API Error (${method} ${endpoint}):`, {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
      });

      // Handle authentication errors
      if (axiosError.response?.status === 401) {
        console.log('Authentication error: Token expired or invalid');
        // Log the user out
        useAuthStore.getState().logout();
        // Show notification
        notifications.show({
          title: 'Session Expired',
          message: 'Your session has expired. Please log in again.',
          color: 'red',
        });
        // Redirect to login page
        window.location.href = '/login';
        throw new Error('Authentication failed. Please log in again.');
      }

      // Retry logic for network errors or 5xx server errors
      if (
        (axiosError.code === 'ECONNABORTED' || 
         axiosError.code === 'ERR_NETWORK' || 
         (axiosError.response && axiosError.response.status >= 500)) && 
        retryCount < this.maxRetries
      ) {
        console.log(`Retrying request (${retryCount + 1}/${this.maxRetries})...`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
        
        // Retry the request
        return this.request<T>(method, endpoint, data, config, retryCount + 1);
      }

      // Get the most specific error message available
      const errorMessage =
        (axiosError.response?.data as any)?.message ||
        (typeof axiosError.response?.data === 'string' ? axiosError.response?.data : null) ||
        axiosError.message ||
        'An error occurred';

      // Show notification for non-retryable errors
      if (retryCount >= this.maxRetries) {
        notifications.show({
          title: 'Connection Error',
          message: 'Failed to connect to the server after multiple attempts. Please try again later.',
          color: 'red',
        });
      }

      throw new Error(errorMessage);
    }
  }

  // Method to check if the API is available
  public async checkApiAvailability(): Promise<boolean> {
    try {
      await axios.get(`${API_URL}/health`, { timeout: 5000 });
      return true;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance();

// Export for backward compatibility with existing code
export default {
  get: <T>(url: string, config?: AxiosRequestConfig) => apiService.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiService.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiService.put<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => apiService.delete<T>(url, config),
};
