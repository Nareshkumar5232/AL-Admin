import { create } from 'zustand';
import { Review, ReviewStatus } from '@/types';

interface ReviewState {
  reviews: Review[];
  addReview: (review: Partial<Review>) => void;
  updateReviewStatus: (id: string, status: ReviewStatus) => void;
  deleteReview: (id: string) => void;
}

export const useReviewStore = create<ReviewState>()((set) => ({
  reviews: [],
  
  addReview: (reviewData: Partial<Review>) =>
    set((state) => {
      const newReview: Review = {
        id: `rev-${String(state.reviews.length + 1).padStart(3, '0')}`,
        customerId: reviewData.customerId || 'cust-001',
        customerName: reviewData.customerName || 'Customer',
        customerAvatar: reviewData.customerAvatar,
        productId: reviewData.productId || 'prod-001',
        productName: reviewData.productName || 'Product',
        rating: reviewData.rating || 5,
        comment: reviewData.comment || '',
        status: reviewData.status || 'pending',
        createdAt: new Date().toISOString(),
      };
      return { reviews: [newReview, ...state.reviews] };
    }),
  updateReviewStatus: (id: string, status: ReviewStatus) =>
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === id ? { ...r, status } : r
      ),
    })),

  deleteReview: (id: string) =>
    set((state) => ({
      reviews: state.reviews.filter((r) => r.id !== id),
    })),
}));
