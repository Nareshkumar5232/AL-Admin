"use client";

import React, { useState, useMemo, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import EmptyState from '@/components/shared/EmptyState';
import StatusBadge from '@/components/shared/StatusBadge';
import OrderDetailModal from '@/components/orders/OrderDetailModal';
import { useOrderStore } from '@/store/orderStore';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Order, OrderStatus, PaymentMethod } from '@/types';
import { Search, Eye, RotateCcw, AlertCircle, ShoppingBag, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useOrderStore();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Notification state
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
  }, [searchQuery, statusFilter, paymentFilter, sortBy]);

  // Filtered and Sorted Orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((o) => o.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter) {
      result = result.filter((o) => o.paymentMethod === paymentFilter);
    }

    // Sort logic
    switch (sortBy) {
      case 'total-high':
        result.sort((a, b) => b.total - a.total);
        break;
      case 'total-low':
        result.sort((a, b) => a.total - b.total);
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
  }, [orders, searchQuery, statusFilter, paymentFilter, sortBy]);

  // Paginated Orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as OrderStatus);
    triggerToast(`Order status ${orderId} updated to ${newStatus}.`);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setPaymentFilter('');
    setSortBy('newest');
  };

  const columns = [
    { header: 'Order ID' },
    { header: 'Customer Info' },
    { header: 'Date' },
    { header: 'Products Count' },
    { header: 'Total (INR)' },
    { header: 'Payment Method' },
    { header: 'Order Status' },
    { header: 'Actions', className: 'text-right' },
  ];

  const getStatusSelectColors = (s: string) => {
    switch (s) {
      case 'pending': return 'text-[#FFD43B] bg-[#FFD43B]/10 border-[#FFD43B]/20';
      case 'processing': return 'text-[#00BFFF] bg-[#00BFFF]/10 border-[#00BFFF]/20';
      case 'shipped': return 'text-[#845EF7] bg-[#845EF7]/10 border-[#845EF7]/20';
      case 'delivered': return 'text-[#9EFF00] bg-[#9EFF00]/10 border-[#9EFF00]/20';
      case 'cancelled': return 'text-[#FF6B6B] bg-[#FF6B6B]/10 border-[#FF6B6B]/20';
      default: return 'text-white bg-[#222] border-white/10';
    }
  };

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
        title="Transaction Ledger"
        description="Monitor checkout operations, execute routing updates, and audit order logs."
      />

      {/* Filters Hub */}
      <div 
        className="glass-card-static p-4 border flex flex-col xl:flex-row gap-4 items-center justify-between mb-6"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="relative w-full xl:max-w-xs shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Audit Customer name/ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input pl-10"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 w-full xl:w-auto">
          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-input min-w-[130px] bg-[#222] appearance-none cursor-pointer text-xs uppercase font-bold"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <option value="">Order Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Payment Method Select */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="admin-input min-w-[140px] bg-[#222] appearance-none cursor-pointer text-xs uppercase font-bold"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <option value="">Payment Gateways</option>
            <option value="upi">UPI</option>
            <option value="card">Credit/Debit Card</option>
            <option value="netbanking">Net Banking</option>
            <option value="wallet">Digital Wallet</option>
            <option value="cod">Cash On Delivery</option>
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
            <option value="total-high">Price: High to Low</option>
            <option value="total-low">Price: Low to High</option>
          </select>

          {/* Reset button */}
          <button
            onClick={handleResetFilters}
            className="p-2.5 rounded-lg border flex items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition-all text-xs uppercase font-bold cursor-pointer shrink-0 col-span-2 sm:col-span-1"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <RotateCcw size={14} /> <span className="sm:hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Orders List Table */}
      <DataTable
        data={paginatedOrders}
        columns={columns}
        isLoading={false}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredOrders.length}
        emptyState={
          <EmptyState
            title="Transactions Ledger Empty"
            description="No matching transactions found on checkout databases."
            type={searchQuery ? 'search' : 'database'}
          />
        }
        renderRow={(order) => (
          <tr key={order.id} className="hover:bg-white/5 transition-colors">
            {/* ID */}
            <td className="font-mono text-xs text-[#00BFFF] font-bold">
              {order.id}
            </td>

            {/* Customer info */}
            <td>
              <div className="space-y-0.5">
                <span className="font-bold text-white text-sm block">
                  {order.customerName}
                </span>
                <span className="text-[10px] text-gray-400 block font-semibold">
                  {order.customerEmail}
                </span>
              </div>
            </td>

            {/* Date */}
            <td style={{ color: 'var(--text-secondary)' }}>
              {formatDate(order.createdAt)}
            </td>

            {/* Products count */}
            <td className="font-semibold text-white">
              {order.products.reduce((acc, p) => acc + p.quantity, 0)} items
            </td>

            {/* Total */}
            <td className="font-extrabold text-white text-sm">
              {formatCurrency(order.total)}
            </td>

            {/* Payment Method */}
            <td className="text-xs uppercase font-bold text-gray-400">
              {order.paymentMethod}
            </td>

            {/* Status Selector Dropdown */}
            <td>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className={`py-1 px-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border cursor-pointer ${getStatusSelectColors(order.status)}`}
              >
                <option value="pending" className="bg-[#1A1A1A] text-[#FFD43B]">Pending</option>
                <option value="processing" className="bg-[#1A1A1A] text-[#00BFFF]">Processing</option>
                <option value="shipped" className="bg-[#1A1A1A] text-[#845EF7]">Shipped</option>
                <option value="delivered" className="bg-[#1A1A1A] text-[#9EFF00]">Delivered</option>
                <option value="cancelled" className="bg-[#1A1A1A] text-[#FF6B6B]">Cancelled</option>
              </select>
            </td>

            {/* Actions */}
            <td className="text-right">
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setIsDetailOpen(true);
                }}
                className="p-1.5 rounded-lg border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all text-[#9EFF00] cursor-pointer flex items-center gap-1 ml-auto text-xs uppercase font-bold"
              >
                <Eye size={13} /> Audit
              </button>
            </td>
          </tr>
        )}
      />

      {/* Details modal */}
      <OrderDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </div>
  );
}
