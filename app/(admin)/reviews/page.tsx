"use client";

import React, { useState, useMemo, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import EmptyState from '@/components/shared/EmptyState';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useReviewStore } from '@/store/reviewStore';
import { formatDate } from '@/lib/utils';
import { Review, ReviewStatus } from '@/types';
import { Search, Star, Trash2, CheckCircle, XCircle, RotateCcw, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewsPage() {
  const { reviews, updateReviewStatus, deleteReview } = useReviewStore();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal and Confirmation state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, ratingFilter, statusFilter, sortBy]);

  // Filtered and Sorted Reviews
  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.customerName.toLowerCase().includes(q) ||
          r.productName.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q)
      );
    }

    // Rating filter
    if (ratingFilter) {
      const rVal = parseInt(ratingFilter);
      result = result.filter((r) => r.rating === rVal);
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((r) => r.status === statusFilter);
    }

    // Sort logic
    switch (sortBy) {
      case 'rating-high':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-low':
        result.sort((a, b) => a.rating - b.rating);
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [reviews, searchQuery, ratingFilter, statusFilter, sortBy]);

  // Paginated Reviews
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReviews, currentPage]);

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const handleApprove = (id: string) => {
    updateReviewStatus(id, 'approved');
    triggerToast('Review approved and published to catalog.');
  };

  const handleReject = (id: string) => {
    updateReviewStatus(id, 'rejected');
    triggerToast('Review rejected and omitted from catalog.');
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteReview(deleteTargetId);
      triggerToast('Review feedback entry deleted from system.');
      setDeleteTargetId(null);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setRatingFilter('');
    setStatusFilter('');
    setSortBy('newest');
  };

  // Render visual star ratings
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-[#FFD43B]">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star
            key={idx}
            size={13}
            fill={idx < rating ? '#FFD43B' : 'transparent'}
            className={idx < rating ? 'text-[#FFD43B]' : 'text-gray-600'}
          />
        ))}
      </div>
    );
  };

  const columns = [
    { header: 'Client' },
    { header: 'Product' },
    { header: 'Rating' },
    { header: 'Commentary' },
    { header: 'Date Submitted' },
    { header: 'Security status' },
    { header: 'Moderation actions', className: 'text-right' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-6 right-6 z-50 glass-card-static p-4 border flex items-center gap-3 bg-[#1A1A1A]/95 text-xs font-bold uppercase shadow-2xl border-[#9EFF00]/30 shadow-[#9EFF00]/10"
          >
            <ShieldCheck size={18} className="text-[#9EFF00]" />
            <span className="text-white">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <PageHeader
        title="Moderation Console"
        description="Audit user feedback comments, approve or reject catalog reviews, and purge entries."
      />

      {/* Filters Hub */}
      <div 
        className="glass-card-static p-4 border flex flex-col lg:flex-row gap-4 items-center justify-between mb-6"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="relative w-full lg:max-w-xs shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search keywords or accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input pl-10"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 w-full lg:w-auto">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-input min-w-[130px] bg-[#222] appearance-none cursor-pointer text-xs uppercase font-bold"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <option value="">Review Statuses</option>
            <option value="pending">Pending Audit</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Rating filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="admin-input min-w-[120px] bg-[#222] appearance-none cursor-pointer text-xs uppercase font-bold"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <option value="">Rating stars</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="admin-input min-w-[130px] bg-[#222] appearance-none cursor-pointer text-xs uppercase font-bold"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <option value="newest">Recent Audits</option>
            <option value="oldest">Historical Audits</option>
            <option value="rating-high">Rating: High to Low</option>
            <option value="rating-low">Rating: Low to High</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={handleResetFilters}
            className="p-2.5 rounded-lg border flex items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition-all text-xs uppercase font-bold cursor-pointer shrink-0 col-span-2 sm:col-span-1"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <RotateCcw size={14} /> <span className="sm:hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Reviews Table */}
      <DataTable
        data={paginatedReviews}
        columns={columns}
        isLoading={false}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredReviews.length}
        emptyState={
          <EmptyState
            title="Feedback Queue is Empty"
            description="No matching reviews found in moderation registers."
            type={searchQuery ? 'search' : 'database'}
          />
        }
        renderRow={(review) => (
          <tr key={review.id} className="hover:bg-white/5 transition-colors">
            {/* Customer */}
            <td className="font-bold text-white text-sm">
              {review.customerName}
            </td>

            {/* Product */}
            <td className="font-medium text-white max-w-[150px] truncate">
              {review.productName}
            </td>

            {/* Rating */}
            <td>
              {renderStars(review.rating)}
            </td>

            {/* Comment */}
            <td className="max-w-[280px]">
              <p className="text-gray-300 leading-relaxed text-xs break-words italic">
                "{review.comment}"
              </p>
            </td>

            {/* Date */}
            <td style={{ color: 'var(--text-secondary)' }}>
              {formatDate(review.createdAt)}
            </td>

            {/* Status */}
            <td>
              <StatusBadge status={review.status} />
            </td>

            {/* Actions */}
            <td className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                {review.status !== 'approved' && (
                  <button
                    onClick={() => handleApprove(review.id)}
                    title="Approve Review"
                    className="p-1.5 rounded-lg border border-green-500/10 hover:border-green-500/20 hover:bg-green-500/10 transition-all text-[#9EFF00] cursor-pointer"
                  >
                    <CheckCircle size={14} />
                  </button>
                )}
                {review.status !== 'rejected' && (
                  <button
                    onClick={() => handleReject(review.id)}
                    title="Reject Review"
                    className="p-1.5 rounded-lg border border-red-500/10 hover:border-red-500/20 hover:bg-red-500/10 transition-all text-red-400 cursor-pointer"
                  >
                    <XCircle size={14} />
                  </button>
                )}
                <button
                  onClick={() => setDeleteTargetId(review.id)}
                  title="Purge Review"
                  className="p-1.5 rounded-lg border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all text-gray-400 hover:text-white cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Purge Review Feedback"
        description="Are you sure you want to delete this customer feedback record? This will purge it permanently from catalog indexes."
        confirmText="Purge Record"
        cancelText="Cancel"
      />
    </div>
  );
}
