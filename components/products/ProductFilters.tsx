"use client";

import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { mockCategories } from '@/data/mock-categories';

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
}

export default function ProductFilters({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  status,
  setStatus,
  sortBy,
  setSortBy,
}: ProductFiltersProps) {
  const handleReset = () => {
    setSearchQuery('');
    setCategory('');
    setStatus('');
    setSortBy('newest');
  };

  return (
    <div 
      className="glass-card-static p-4 border flex flex-col lg:flex-row gap-4 items-center justify-between mb-6"
      style={{ borderColor: 'var(--border-color)' }}
    >
      {/* Search Input */}
      <div className="relative w-full lg:max-w-xs shrink-0">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Filter catalog keys..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="admin-input pl-10"
        />
      </div>

      {/* Select Filters Group */}
      <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 w-full lg:w-auto">
        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="admin-input min-w-[140px] bg-[#222] appearance-none cursor-pointer text-xs uppercase font-bold"
          style={{ background: 'var(--bg-tertiary)' }}
        >
          <option value="">Categories</option>
          {mockCategories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="admin-input min-w-[110px] bg-[#222] appearance-none cursor-pointer text-xs uppercase font-bold"
          style={{ background: 'var(--bg-tertiary)' }}
        >
          <option value="">Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="admin-input min-w-[130px] bg-[#222] appearance-none cursor-pointer text-xs uppercase font-bold"
          style={{ background: 'var(--bg-tertiary)' }}
        >
          <option value="newest">Newest Entries</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="stock-low">Stock: Low Alert</option>
          <option value="stock-high">Stock: High to Low</option>
        </select>

        {/* Reset Filters */}
        <button
          onClick={handleReset}
          className="p-2.5 rounded-lg border flex items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition-all text-xs uppercase font-bold cursor-pointer shrink-0 col-span-2 sm:col-span-1"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          <RotateCcw size={14} /> <span className="sm:hidden lg:inline">Reset</span>
        </button>
      </div>
    </div>
  );
}
