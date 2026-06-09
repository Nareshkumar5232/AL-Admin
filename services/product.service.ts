// AL HIKMATH ENTERPRISES PVT LTD - Product Service
// All requests go through adminApi which attaches the Bearer token automatically

import { adminApi, API_BASE_URL, getAdminToken } from "./api";
import type { Product } from "@/types";

function extractProduct(payload: any): any {
  if (!payload) return null;
  if (payload.product && typeof payload.product === "object") return payload.product;
  return payload;
}

export const productService = {
  // GET /api/admin/products
  async getProducts(filters?: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<Product[]> {
    const params: Record<string, unknown> = {};
    if (filters?.category) params.category = filters.category;
    if (filters?.status) params.status = filters.status;
    if (filters?.search) params.search = filters.search;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    const response = await adminApi.get<{
      products: any[];
      total: number;
      pages: number;
      currentPage: number;
    }>("/admin/products", params);

    return (response.products || []).map((p) => ({ ...p, id: p._id || p.id }));
  },

  // GET /api/admin/products/:id
  async getProduct(id: string): Promise<Product> {
    const response = await adminApi.get<any>(`/admin/products/${id}`);
    const product = extractProduct(response);
    return { ...product, id: product._id || product.id };
  },

  // POST /api/admin/products
  async createProduct(productData: Partial<Product>): Promise<Product> {
    const response = await adminApi.post<any>("/admin/products", productData);
    const product = extractProduct(response);
    return { ...product, id: product._id || product.id };
  },

  // PUT /api/admin/products/:id
  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const response = await adminApi.put<any>(`/admin/products/${id}`, productData);
    const product = extractProduct(response);
    return { ...product, id: product._id || product.id };
  },

  // DELETE /api/admin/products/:id
  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return adminApi.delete(`/admin/products/${id}`);
  },

  // POST /api/admin/products/upload-images (multipart/form-data)
  async uploadProductImages(productId: string, files: File[]): Promise<{ images: string[] }> {
    const formData = new FormData();
    formData.append("productId", productId);
    files.forEach((file) => formData.append("files", file));
    // adminApi.upload uses the axios instance — token is auto-attached by interceptor
    return adminApi.upload<{ images: string[] }>("/admin/products/upload-images", formData);
  },

  // DELETE /api/admin/products/:productId/image/:imageId
  async deleteProductImage(productId: string, imageId: string): Promise<{ success: boolean }> {
    return adminApi.delete(`/admin/products/${productId}/image/${imageId}`);
  },
};
