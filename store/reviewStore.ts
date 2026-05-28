import { create } from 'zustand';
import { Review, ReviewStatus } from '@/types';
import { mockReviews } from '@/data/mock-reviews';

interface ReviewState {
  reviews: Review[];
  updateReviewStatus: (id: string, status: ReviewStatus) => void;
  deleteReview: (id: string) => void;
}

export const useReviewStore = create<ReviewState>()((set) => ({
  reviews: mockReviews,
  
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
