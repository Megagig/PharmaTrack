import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'PHARMACY' | 'EXECUTIVE' | 'ADMIN';

interface User {
  id: string;
  email: string;
  role: UserRole;
  pharmacyId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
