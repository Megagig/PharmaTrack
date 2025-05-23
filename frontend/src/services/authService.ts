import axios from 'axios';
import { UserRole } from '../store/authStore';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a dedicated axios instance for auth
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// API calls
export const authService = {
  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log('Sending login request to:', `${API_URL}/auth/login`);
      const response = await authApi.post<AuthResponse>('/auth/login', data);
      console.log('Login successful:', response.data.user.email);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw errorMessage;
      }

      throw 'An unexpected error occurred';
    }
  },

  // Register user (executive or admin)
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await authApi.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw errorMessage;
      }

      throw 'Registration failed';
    }
  },

  // Register pharmacy with user
  registerPharmacy: async (
    data: PharmacyRegisterRequest
  ): Promise<AuthResponse> => {
    try {
      const response = await authApi.post<AuthResponse>(
        '/auth/register-pharmacy',
        data
      );
      return response.data;
    } catch (error) {
      console.error('Pharmacy registration failed:', error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw errorMessage;
      }

      throw 'Pharmacy registration failed';
    }
  },

  // Change password
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<{ message: string }> => {
    try {
      const response = await authApi.post<{ message: string }>(
        '/auth/change-password',
        data
      );
      return response.data;
    } catch (error) {
      console.error('Password change failed:', error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw errorMessage;
      }

      throw 'Password change failed';
    }
  },

  // Get current user profile
  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    try {
      const response = await authApi.get<AuthResponse['user']>('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get user profile:', error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw errorMessage;
      }

      throw 'Failed to get user profile';
    }
  },
};
