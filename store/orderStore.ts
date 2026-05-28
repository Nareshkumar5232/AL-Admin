import { create } from 'zustand';
import { Order, OrderStatus } from '@/types';
import { mockOrders } from '@/data/mock-orders';

interface OrderState {
  orders: Order[];
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

export const useOrderStore = create<OrderState>()((set) => ({
  orders: mockOrders,
  updateOrderStatus: (id: string, status: OrderStatus) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
      ),
    })),
}));
