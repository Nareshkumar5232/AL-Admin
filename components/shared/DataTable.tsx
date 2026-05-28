"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Column {
  header: string;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column[];
  renderRow: (item: T, index: number) => React.ReactNode;
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  emptyState?: React.ReactNode;
  totalItems?: number;
}

export default function DataTable<T>({
  data,
  columns,
  renderRow,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  emptyState,
  totalItems,
}: DataTableProps<T>) {
  return (
    <div className="flex flex-col gap-4">
      {/* Table Card Container */}
      <div 
        className="w-full overflow-hidden glass-card-static border"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="w-full overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className={col.className}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 size={32} className="animate-spin text-[#9EFF00]" />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Retrieving secure database records...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-0">
                    {emptyState || (
                      <div className="py-16 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                        No records found.
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                data.map((item, index) => renderRow(item, index))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!isLoading && data.length > 0 && totalPages > 1 && onPageChange && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-1">
          <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Showing page <span className="text-white font-bold">{currentPage}</span> of{' '}
            <span className="text-white font-bold">{totalPages}</span>
            {totalItems !== undefined && (
              <>
                {' '}
                (<span className="text-[#9EFF00] font-bold">{totalItems}</span> total items)
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-white/5"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;
                
                return (
                  <React.Fragment key={p}>
                    {showEllipsis && (
                      <span className="px-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => onPageChange(p)}
                      className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        currentPage === p
                          ? 'bg-[#9EFF00] text-black shadow-md shadow-[#9EFF00]/10'
                          : 'border hover:bg-white/5'
                      }`}
                      style={{ 
                        borderColor: currentPage === p ? 'transparent' : 'var(--border-color)',
                        color: currentPage === p ? '#000000' : 'var(--text-primary)'
                      }}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-white/5"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
