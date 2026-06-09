// AL HIKMATH ENTERPRISES PVT LTD - Auth Store
// Zustand store with persistence — manages admin session state

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser } from "@/types";
import { authService } from "@/services/auth.service";
import { getAdminToken, setAdminToken, clearAdminToken } from "@/services/api";

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  restoreSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      /**
       * Attempt login against the real backend.
       * On success: stores token in localStorage AND in Zustand state.
       */
      login: async (email: string, password: string): Promise<boolean> => {
        try {
          console.log("[AuthStore] Login attempt:", email);
          const response = await authService.login(email, password);

          if (response.token) {
            // Persist token in both localStorage (for API interceptor) and Zustand state
            setAdminToken(response.token);
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
            });
            console.log("[AuthStore] ✅ Login successful, state updated");
            return true;
          }

          console.warn("[AuthStore] ❌ No token in response");
          return false;
        } catch (error) {
          console.error("[AuthStore] Login failed:", error);
          return false;
        }
      },

      /**
       * Logout: clear all auth state and localStorage token.
       */
      logout: () => {
        console.log("[AuthStore] Logging out");
        clearAdminToken();
        set({ user: null, token: null, isAuthenticated: false });
        authService.logout().catch(() => {}); // Fire-and-forget backend logout
      },

      /**
       * Called on app mount to re-sync the localStorage token
       * into the API interceptor (handles browser refresh case).
       */
      restoreSession: () => {
        const { token, isAuthenticated } = get();
        if (isAuthenticated && token) {
          // Ensure localStorage has the token (Zustand persist may have restored state
          // but not explicitly written to localStorage key "admin_token")
          const lsToken = getAdminToken();
          if (!lsToken) {
            console.log("[AuthStore] Re-syncing token to localStorage after hydration");
            setAdminToken(token);
          }
        }
      },
    }),
    {
      name: "al-hikmath-admin-auth",
      // Only persist user data and isAuthenticated — token is kept in both
      // localStorage["admin_token"] (for API interceptor) and here
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // After Zustand rehydrates from localStorage, sync token to the
        // "admin_token" key so the API interceptor can read it
        if (state?.token && state.isAuthenticated) {
          console.log("[AuthStore] Rehydrating — restoring admin_token to localStorage");
          setAdminToken(state.token);
        }
      },
    }
  )
);
