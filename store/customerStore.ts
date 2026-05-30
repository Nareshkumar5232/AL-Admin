import { create } from 'zustand';
import { Customer, CustomerStatus } from '@/types';

interface CustomerState {
  customers: Customer[];
  addCustomer: (customer: Partial<Customer>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
}

export const useCustomerStore = create<CustomerState>()((set) => ({
  customers: [],
  addCustomer: (customerData: Partial<Customer>) =>
    set((state) => {
      const newCustomer: Customer = {
        id: `cust-${String(state.customers.length + 1).padStart(3, '0')}`,
        name: customerData.name || 'New Customer',
        email: customerData.email || 'customer@example.com',
        phone: customerData.phone || '+91 9876543210',
        avatar: customerData.avatar,
        ordersCount: customerData.ordersCount || 0,
        totalSpent: customerData.totalSpent || 0,
        status: customerData.status || 'active',
        joinedAt: new Date().toISOString(),
        lastOrderAt: new Date().toISOString(),
        address: customerData.address || '',
      };
      return { customers: [newCustomer, ...state.customers] };
    }),
  updateCustomer: (id: string, updates: Partial<Customer>) =>
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  deleteCustomer: (id: string) =>
    set((state) => ({ customers: state.customers.filter((c) => c.id !== id) })),
}));
