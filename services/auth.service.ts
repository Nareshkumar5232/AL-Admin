// AL HIKMATH ENTERPRISES PVT LTD - Authentication Service
// POST /api/admin/login → stores JWT as "admin_token" in localStorage

import { apiClient, setAdminToken, clearAdminToken, API_BASE_URL } from "./api";
import type { AdminUser } from "@/types";

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export const authService = {
  /**
   * POST /api/admin/login
   * Sends credentials, extracts token from response, stores it.
   * The backend returns: { token: "eyJ...", user: { ... } }
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    console.log("[AdminAuth] Attempting login for:", email);

    // Use a raw axios call so we can inspect the full response structure
    const response = await apiClient.post<LoginResponse>("/admin/login", {
      email,
      password,
    });

    const data = response.data;
    console.log("[AdminAuth] Login response keys:", Object.keys(data));

    // Extract token — handle both { token } and { data: { token } } shapes
    const token: string =
      (data as any).token ||
      (data as any).accessToken ||
      (data as any).jwt ||
      (data as any).data?.token ||
      "";

    if (!token) {
      console.error("[AdminAuth] ❌ No token found in login response:", data);
      throw new Error("Authentication failed: no token in response");
    }

    // Store token so every subsequent request carries it
    setAdminToken(token);
    console.log("[AdminAuth] ✅ Token stored successfully");

    // Extract user — handle both { user } and flat shapes
    const user: AdminUser =
      (data as any).user ||
      (data as any).admin ||
      (data as any).data?.user ||
      { id: "admin", name: "Admin", email, role: "Super Admin" };

    return { token, user };
  },

  /** POST /api/admin/logout */
  async logout(): Promise<{ success: boolean }> {
    try {
      await apiClient.post("/admin/logout");
    } catch {
      // Swallow — clear locally regardless
    } finally {
      clearAdminToken();
      console.log("[AdminAuth] Logged out, token cleared");
    }
    return { success: true };
  },

  /** GET /api/admin/profile */
  async getProfile(): Promise<AdminUser> {
    const response = await apiClient.get<AdminUser>("/admin/profile");
    return response.data;
  },
};
