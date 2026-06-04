"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isConfirming?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isConfirming = false,
}: ConfirmDialogProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getConfirmButtonStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20';
      case 'warning':
        return 'bg-[#FFD43B] hover:bg-[#FFD43B]/80 text-black shadow-yellow-500/20';
      case 'info':
      default:
        return 'bg-[#00BFFF] hover:bg-[#00BFFF]/80 text-black shadow-blue-500/20';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="w-full max-w-md glass-card-static p-6 relative overflow-hidden z-10 border"
            style={{ 
              borderColor: 'var(--border-color)',
              background: 'var(--bg-secondary)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X size={18} className="hover:text-white transition-colors" />
            </button>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10 text-red-500">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </h3>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {description}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
                style={{ 
                  borderColor: 'var(--border-color)', 
                  color: 'var(--text-primary)',
                  background: 'var(--bg-tertiary)'
                }}
              >
                {cancelText}
              </button>
              <button
                type="button"
                disabled={isConfirming}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${getConfirmButtonStyles()}`}
              >
                {isConfirming ? 'Processing...' : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
