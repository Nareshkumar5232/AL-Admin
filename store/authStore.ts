import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminUser } from '@/types';

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
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
      login: (email: string, password: string) => {
        if (email === 'admin@gmail.com' && password === 'admin@123') {
          set({ user: DEMO_USER, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'al-hikmath-admin-auth',
    }
  )
);
