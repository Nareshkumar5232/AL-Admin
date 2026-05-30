// AL HIKMATH ENTERPRISES PVT LTD - Authentication Service
// Handles all authentication-related API calls

import { apiService } from './api';
import { AdminUser } from '@/types';

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export const authService = {
  // POST /api/admin/login
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/admin/login', {
      email,
      password,
    });

    // Store token for future requests
    if (response.token) {
      apiService.setAuthToken(response.token);
    }

    return response;
  },

  // POST /api/admin/logout
  async logout(): Promise<{ success: boolean }> {
    try {
      await apiService.post('/admin/logout', {});
      apiService.clearAuth();
      return { success: true };
    } catch {
      // Clear auth even if logout fails
      apiService.clearAuth();
      return { success: true };
    }
  },

  // GET /api/admin/profile
  async getProfile(): Promise<AdminUser> {
    return apiService.get<AdminUser>('/admin/profile');
  },

  // PUT /api/admin/profile
  async updateProfile(profileData: Partial<AdminUser>): Promise<AdminUser> {
    return apiService.put<AdminUser>('/admin/profile', profileData);
  },

  // POST /api/admin/change-password
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean }> {
    return apiService.post('/admin/change-password', {
      currentPassword,
      newPassword,
    });
  },
};
