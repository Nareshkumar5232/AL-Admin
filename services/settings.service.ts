// AL HIKMATH ENTERPRISES PVT LTD - Settings Service
// Handles all settings-related API calls

import { apiService } from './api';

export interface StoreSettings {
  storeName: string;
  storeAddress: string;
  storePhone1: string;
  storePhone2?: string;
  gstin: string;
  email?: string;
  website?: string;
  shippingFee?: number;
}

export const settingsService = {
  // GET /api/settings
  async getSettings(): Promise<StoreSettings> {
    return apiService.get<StoreSettings>('/admin/settings');
  },

  // PUT /api/settings
  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    return apiService.put<StoreSettings>('/admin/settings', settings);
  },
};
