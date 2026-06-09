// AL HIKMATH ENTERPRISES PVT LTD - Review Service
// Handles all review-related API calls

import { apiService } from './api';
import { Review, ReviewStatus } from '@/types';

export const reviewService = {
  // GET /api/reviews
  async getReviews(filters?: {
    status?: ReviewStatus;
    productId?: string;
  }): Promise<Review[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.productId) params.append('productId', filters.productId);

    const query = params.toString();
    const endpoint = query ? `/admin/reviews?${query}` : '/admin/reviews';
    return apiService.get<Review[]>(endpoint);
  },

  // GET /api/reviews/:id
  async getReview(id: string): Promise<Review> {
    return apiService.get<Review>(`/admin/reviews/${id}`);
  },

  // PUT /api/reviews/:id/status
  async updateReviewStatus(id: string, status: ReviewStatus): Promise<Review> {
    return apiService.put<Review>(`/admin/reviews/${id}`, { status });
  },

  // PUT /api/reviews/:id
  async updateReview(id: string, reviewData: Partial<Review>): Promise<Review> {
    return apiService.put<Review>(`/admin/reviews/${id}`, reviewData);
  },

  // DELETE /api/reviews/:id
  async deleteReview(id: string): Promise<{ success: boolean }> {
    return apiService.delete(`/admin/reviews/${id}`);
  },
};
