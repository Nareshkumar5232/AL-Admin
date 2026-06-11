// AL HIKMATH ENTERPRISES PVT LTD - Settings Service
// Handles all settings-related API calls

import { apiService } from './api';

export interface StoreSettings {
  storeName: string;
  storeAddress: string;
  phone1: string;
  phone2?: string;
  taxId: string;
  email?: string;
  website?: string;
  shippingCost?: number;
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
