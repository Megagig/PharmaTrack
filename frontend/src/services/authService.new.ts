import axios from 'axios';
import { UserRole } from '../store/authStore';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
  pharmacyId?: string;
}

export interface PharmacyRegisterRequest extends RegisterRequest {
  pharmacy: {
    name: string;
    pharmacistInCharge: string;
    pcnLicenseNumber: string;
    phoneNumber: string;
    email?: string;
    address: string;
    ward: string;
    lga: string;
  };
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: UserRole;
    pharmacyId?: string;
  };
  token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Direct API calls without using the shared axios instance
export const authService = {
  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log('Sending login request to:', `${API_URL}/auth/login`);
      
      const response = await axios({
        method: 'post',
        url: `${API_URL}/auth/login`,
        data: data,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Login successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
      }
      
      throw new Error('An unexpected error occurred');
    }
  },

  // Register user (executive or admin)
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await axios({
        method: 'post',
        url: `${API_URL}/auth/register`,
        data: data,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
      }
      
      throw new Error('Registration failed');
    }
  },

  // Register pharmacy with user
  registerPharmacy: async (data: PharmacyRegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await axios({
        method: 'post',
        url: `${API_URL}/auth/register-pharmacy`,
        data: data,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Pharmacy registration failed:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
      }
      
      throw new Error('Pharmacy registration failed');
    }
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios({
        method: 'post',
        url: `${API_URL}/auth/change-password`,
        data: data,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Password change failed:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
      }
      
      throw new Error('Password change failed');
    }
  },

  // Get current user profile
  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios({
        method: 'get',
        url: `${API_URL}/auth/me`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
      }
      
      throw new Error('Failed to get user profile');
    }
  },
};
