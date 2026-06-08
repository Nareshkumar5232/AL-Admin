import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminUser } from '@/types';
import { authService } from '@/services/auth.service';

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const DEMO_USER: AdminUser = {
  id: 'admin-001',
  name: 'Admin User',
  email: 'admin@gmail.com',
  role: 'Super Admin',
  avatar: undefined,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const response = await authService.login(email, password);
          if (response.token && response.user) {
            set({ user: response.user, isAuthenticated: true });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        // Also clear token from API service via authService
        authService.logout().catch(console.error);
      },
    }),
    {
      name: 'al-hikmath-admin-auth',
    }
  )
);
