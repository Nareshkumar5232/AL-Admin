// AL HIKMATH ENTERPRISES PVT LTD - Customer Service
// Handles all customer-related API calls

import { apiService } from './api';
import { Customer, CustomerStatus } from '@/types';

export const customerService = {
  // GET /api/customers
  async getCustomers(filters?: {
    status?: CustomerStatus;
    search?: string;
  }): Promise<Customer[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString();
    const endpoint = query ? `/admin/customers?${query}` : '/admin/customers';
    return apiService.get<Customer[]>(endpoint);
  },

  // GET /api/customers/:id
  async getCustomer(id: string): Promise<Customer> {
    return apiService.get<Customer>(`/admin/customers/${id}`);
  },

  // POST /api/customers
  async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    return apiService.post<Customer>('/admin/customers', customerData);
  },

  // PUT /api/customers/:id
  async updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer> {
    return apiService.put<Customer>(`/admin/customers/${id}`, customerData);
  },

  // DELETE /api/customers/:id
  async deleteCustomer(id: string): Promise<{ success: boolean }> {
    return apiService.delete(`/admin/customers/${id}`);
  },
};
