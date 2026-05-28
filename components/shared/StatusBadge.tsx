"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusClass = (statusStr: string) => {
    const s = statusStr.toLowerCase();
    switch (s) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      case 'active':
      case 'approved':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  const getDisplayLabel = (statusStr: string) => {
    // capitalize
    return statusStr.charAt(0).toUpperCase() + statusStr.slice(1);
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200",
        getStatusClass(status),
        className
      )}
    >
      {getDisplayLabel(status)}
    </span>
  );
}
