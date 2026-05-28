"use client";

import React, { useState, useMemo, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import EmptyState from '@/components/shared/EmptyState';
import StatusBadge from '@/components/shared/StatusBadge';
import CustomerDetailModal from '@/components/customers/CustomerDetailModal';
import { mockCustomers } from '@/data/mock-customers';
import { useOrderStore } from '@/store/orderStore';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Customer } from '@/types';
import { Search, Eye, RotateCcw } from 'lucide-react';

export default function CustomersPage() {
  const { orders } = useOrderStore();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('orders-high');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy]);

  // Filtered and Sorted Customers
  const filteredCustomers = useMemo(() => {
    let result = [...mockCustomers];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q)
      );
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((c) => c.status === statusFilter);
    }

    // Sort logic
    switch (sortBy) {
      case 'spent-high':
        result.sort((a, b) => b.totalSpent - a.totalSpent);
        break;
      case 'spent-low':
        result.sort((a, b) => a.totalSpent - b.totalSpent);
        break;
      case 'orders-high':
        result.sort((a, b) => b.ordersCount - a.ordersCount);
        break;
      case 'joined-new':
        result.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, statusFilter, sortBy]);

  // Paginated Customers
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setSortBy('orders-high');
  };

  const columns = [
    { header: 'Client' },
    { header: 'Email & Contact' },
    { header: 'Orders Audit' },
    { header: 'Total Value Injected' },
    { header: 'Joined Date' },
    { header: 'System Status' },
    { header: 'Actions', className: 'text-right' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Registry Database"
        description="Audit customer accounts, registration metadata, and financial contribution ratios."
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
            placeholder="Filter by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input pl-10"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 w-full lg:w-auto">
          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-input min-w-[130px] bg-[#222] appearance-none cursor-pointer text-xs uppercase font-bold"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <option value="">System Statuses</option>
            <option value="active">Active Clients</option>
            <option value="inactive">Inactive Clients</option>
          </select>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="admin-input min-w-[140px] bg-[#222] appearance-none cursor-pointer text-xs uppercase font-bold"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <option value="orders-high">Most Orders</option>
            <option value="spent-high">Highest Revenue</option>
            <option value="spent-low">Lowest Revenue</option>
            <option value="joined-new">Recently Joined</option>
          </select>

          {/* Reset filters */}
          <button
            onClick={handleResetFilters}
            className="p-2.5 rounded-lg border flex items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition-all text-xs uppercase font-bold cursor-pointer shrink-0 col-span-2 sm:col-span-1"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <RotateCcw size={14} /> <span className="sm:hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Customer table */}
      <DataTable
        data={paginatedCustomers}
        columns={columns}
        isLoading={false}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredCustomers.length}
        emptyState={
          <EmptyState
            title="Client Registry Empty"
            description="No customer records match specified administrative query keys."
            type={searchQuery ? 'search' : 'database'}
          />
        }
        renderRow={(customer) => (
          <tr key={customer.id} className="hover:bg-white/5 transition-colors">
            {/* Name */}
            <td>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 font-extrabold text-sm shrink-0">
                  {customer.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-sm truncate max-w-[180px]">
                    {customer.name}
                  </h4>
                  <span className="text-[9px] font-mono tracking-wider font-semibold opacity-60 text-gray-400">
                    ID: {customer.id}
                  </span>
                </div>
              </div>
            </td>

            {/* Email & Contact */}
            <td>
              <div className="space-y-0.5 text-xs font-semibold">
                <span className="text-white block">{customer.email}</span>
                <span style={{ color: 'var(--text-secondary)' }} className="block text-[10px]">
                  {customer.phone}
                </span>
              </div>
            </td>

            {/* Orders count */}
            <td className="font-semibold text-white">
              {customer.ordersCount} transactions
            </td>

            {/* Spent */}
            <td className="font-extrabold text-white text-sm">
              {formatCurrency(customer.totalSpent)}
            </td>

            {/* Date Joined */}
            <td style={{ color: 'var(--text-secondary)' }}>
              {formatDate(customer.joinedAt)}
            </td>

            {/* Status */}
            <td>
              <StatusBadge status={customer.status} />
            </td>

            {/* Actions */}
            <td className="text-right">
              <button
                onClick={() => {
                  setSelectedCustomer(customer);
                  setIsDetailOpen(true);
                }}
                className="p-1.5 rounded-lg border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all text-[#9EFF00] cursor-pointer flex items-center gap-1 ml-auto text-xs uppercase font-bold"
              >
                <Eye size={13} /> Profile
              </button>
            </td>
          </tr>
        )}
      />

      {/* Profile Detail modal */}
      <CustomerDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        orders={orders}
      />
    </div>
  );
}
