// AL HIKMATH ENTERPRISES PVT LTD - Admin Panel
// API Service Placeholder
// This file is a placeholder for future backend integration.
// All data currently comes from mock data files in /data directory.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const apiService = {
  baseUrl: API_BASE_URL,

  // Future: GET /products
  getProducts: async () => {
    // return fetch(`${API_BASE_URL}/products`).then(res => res.json());
    throw new Error('API not implemented. Using mock data.');
  },

  // Future: POST /products
  createProduct: async () => {
    throw new Error('API not implemented. Using mock data.');
  },

  // Future: GET /orders
  getOrders: async () => {
    throw new Error('API not implemented. Using mock data.');
  },

  // Future: GET /customers
  getCustomers: async () => {
    throw new Error('API not implemented. Using mock data.');
  },

  // Future: GET /analytics
  getAnalytics: async () => {
    throw new Error('API not implemented. Using mock data.');
  },
};
