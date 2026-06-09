// AL HIKMATH ENTERPRISES PVT LTD - Product Service
// Handles all product-related API calls

import { apiService, API_BASE_URL } from './api';
import { Product } from '@/types';

function extractProduct(payload: any): any {
  if (!payload) return null;
  if (payload.product && typeof payload.product === 'object') {
    return payload.product;
  }
  return payload;
}

export const productService = {
  // GET /api/products
  async getProducts(filters?: {
    category?: string;
    status?: string;
    search?: string;
  }): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString();
    const endpoint = query ? `/admin/products?${query}` : '/admin/products';
    const response = await apiService.get<{ products: any[], total: number, pages: number, currentPage: number }>(endpoint);
    return (response.products || []).map(p => ({ ...p, id: p._id || p.id }));
  },

  // GET /api/products/:id
  async getProduct(id: string): Promise<Product> {
    const response = await apiService.get<any>(`/admin/products/${id}`);
    const product = extractProduct(response);
    return { ...product, id: product._id || product.id };
  },

  // POST /api/products
  async createProduct(productData: Partial<Product>): Promise<Product> {
    const response = await apiService.post<any>('/admin/products', productData);
    const product = extractProduct(response);
    return { ...product, id: product._id || product.id };
  },

  // PUT /api/products/:id
  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const response = await apiService.put<any>(`/admin/products/${id}`, productData);
    const product = extractProduct(response);
    return { ...product, id: product._id || product.id };
  },

  // DELETE /api/products/:id
  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return apiService.delete(`/admin/products/${id}`);
  },

  // POST /api/products/upload-images
  async uploadProductImages(
    productId: string,
    files: File[]
  ): Promise<{ images: string[] }> {
    const formData = new FormData();
    formData.append('productId', productId);
    files.forEach((file) => formData.append('files', file));

    const response = await fetch(
      `${API_BASE_URL}/admin/products/upload-images`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}`,
        },
      }
    );

    if (!response.ok) throw new Error('Image upload failed');
    return response.json();
  },

  // DELETE /api/products/image/:imageId
  async deleteProductImage(imageId: string): Promise<{ success: boolean }> {
    return apiService.delete(`/admin/products/image/${imageId}`);
  },
};
