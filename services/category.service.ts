// AL HIKMATH ENTERPRISES PVT LTD - Category Service
// Handles all category-related API calls

import { apiService } from './api';
import { Category } from '@/types';

export const categoryService = {
  // GET /api/admin/categories
  async getCategories(search?: string): Promise<Category[]> {
    const query = search ? `?search=${search}` : '';
    return apiService.get<Category[]>(`/admin/categories${query}`);
  },

  // GET /api/admin/categories/:id
  async getCategory(id: string): Promise<Category> {
    return apiService.get<Category>(`/admin/categories/${id}`);
  },

  // POST /api/admin/categories
  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    return apiService.post<Category>('/admin/categories', categoryData);
  },

  // PUT /api/admin/categories/:id
  async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    return apiService.put<Category>(`/admin/categories/${id}`, categoryData);
  },

  // DELETE /api/admin/categories/:id
  async deleteCategory(id: string): Promise<{ success: boolean }> {
    return apiService.delete(`/admin/categories/${id}`);
  },
};
