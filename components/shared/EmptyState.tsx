"use client";

import React from 'react';
import { Database, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title: string;
  description: string;
  type?: 'search' | 'database';
  action?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  type = 'database',
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center glass-card-static border"
      style={{ borderColor: 'var(--border-color)' }}
    >
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 relative"
        style={{ background: 'rgba(255, 255, 255, 0.03)' }}
      >
        <div className="absolute inset-0 rounded-full border border-dashed animate-spin"
          style={{ borderColor: 'var(--border-color)', animationDuration: '20s' }}
        />
        {type === 'search' ? (
          <Search size={28} className="text-[#00BFFF]" />
        ) : (
          <Database size={28} className="text-[#9EFF00]" />
        )}
      </div>
      <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p className="text-sm max-w-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </motion.div>
  );
}
