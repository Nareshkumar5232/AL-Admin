// AL HIKMATH ENTERPRISES PVT LTD - Order Service
// Handles all order-related API calls

import { apiService } from './api';
import { Order, OrderStatus } from '@/types';

export const orderService = {
  // GET /api/admin/orders
  async getOrders(filters?: {
    status?: OrderStatus;
    paymentMethod?: string;
    search?: string;
  }): Promise<Order[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString();
    const endpoint = query ? `/admin/orders?${query}` : '/admin/orders';
    return apiService.get<Order[]>(endpoint);
  },

  // GET /api/admin/orders/:id
  async getOrder(id: string): Promise<Order> {
    return apiService.get<Order>(`/admin/orders/${id}`);
  },

  // POST /api/admin/orders
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    return apiService.post<Order>('/admin/orders', orderData);
  },

  // PUT /api/admin/orders/:id/status
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    return apiService.put<Order>(`/admin/orders/${id}/status`, { status });
  },

  // PUT /api/admin/orders/:id
  async updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
    return apiService.put<Order>(`/admin/orders/${id}`, orderData);
  },

  // DELETE /api/admin/orders/:id
  async deleteOrder(id: string): Promise<{ success: boolean }> {
    return apiService.delete(`/admin/orders/${id}`);
  },
};
