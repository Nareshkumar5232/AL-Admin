import { create } from 'zustand';
import { Order, OrderStatus } from '@/types';

interface OrderState {
  orders: Order[];
  addOrder: (order: Partial<Order>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
}

export const useOrderStore = create<OrderState>()((set) => ({
  orders: [],
  addOrder: (orderData: Partial<Order>) =>
    set((state) => {
      const newOrder: Order = {
        id: `ORD-${String(state.orders.length + 1).padStart(5, '0')}`,
        customerId: orderData.customerId || 'cust-001',
        customerName: orderData.customerName || 'Customer',
        customerEmail: orderData.customerEmail || 'customer@example.com',
        products: orderData.products || [],
        total: orderData.total || 0,
        status: orderData.status || 'pending',
        paymentMethod: orderData.paymentMethod || 'upi',
        shippingAddress: orderData.shippingAddress || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { orders: [newOrder, ...state.orders] };
    }),
  updateOrderStatus: (id: string, status: OrderStatus) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
      ),
    })),
  deleteOrder: (id: string) =>
    set((state) => ({ orders: state.orders.filter((o) => o.id !== id) })),
}));
