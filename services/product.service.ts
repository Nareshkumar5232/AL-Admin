// AL HIKMATH ENTERPRISES PVT LTD - Product Service
// Handles all product-related API calls

import { apiService } from './api';
import { Product } from '@/types';

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
    const endpoint = query ? `/products?${query}` : '/products';
    return apiService.get<Product[]>(endpoint);
  },

  // GET /api/products/:id
  async getProduct(id: string): Promise<Product> {
    return apiService.get<Product>(`/products/${id}`);
  },

  // POST /api/products
  async createProduct(productData: Partial<Product>): Promise<Product> {
    return apiService.post<Product>('/products', productData);
  },

  // PUT /api/products/:id
  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    return apiService.put<Product>(`/products/${id}`, productData);
  },

  // DELETE /api/products/:id
  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return apiService.delete(`/products/${id}`);
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
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/products/upload-images`,
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
    return apiService.delete(`/products/image/${imageId}`);
  },
};
