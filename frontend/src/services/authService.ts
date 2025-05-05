import api from './api';
import { UserRole } from '../store/authStore';

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
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  // Register user (executive or admin)
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // Register pharmacy with user
  registerPharmacy: async (data: PharmacyRegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register-pharmacy', data);
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/change-password', data);
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    const response = await api.get<AuthResponse['user']>('/auth/me');
    return response.data;
  },
};
