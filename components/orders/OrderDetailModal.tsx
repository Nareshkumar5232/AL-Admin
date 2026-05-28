"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, MapPin, Calendar, Clock, ShoppingBag, User } from 'lucide-react';
import { Order } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import StatusBadge from '@/components/shared/StatusBadge';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
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

  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
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
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="w-full max-w-lg glass-card-static border shadow-2xl z-10 flex flex-col max-h-[90vh]"
            style={{ 
              borderColor: 'var(--border-color)',
              background: 'var(--bg-secondary)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <span className="text-[10px] font-mono tracking-widest font-bold text-[#00BFFF] uppercase">
                  Order Details Engine
                </span>
                <h3 className="text-lg font-bold text-white uppercase font-mono">
                  {order.id}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              
              {/* Status and Date */}
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="space-y-1">
                  <span className="text-gray-400 font-semibold block uppercase text-[9px] tracking-wider">Date Placed</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    <Calendar size={13} className="text-[#9EFF00]" />
                    {formatDateTime(order.createdAt)}
                  </span>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-gray-400 font-semibold block uppercase text-[9px] tracking-wider">Current Status</span>
                  <StatusBadge status={order.status} />
                </div>
              </div>

              {/* Customer details */}
              <div className="space-y-3">
                <h4 className="font-bold text-gradient-green uppercase tracking-wider text-[10px]">
                  Customer Profile
                </h4>
                <div className="glass-card-static border p-4 flex gap-3.5 items-start" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-300 border border-white/10 shrink-0">
                    <User size={16} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-white text-sm">{order.customerName}</p>
                    <p style={{ color: 'var(--text-secondary)' }}>Email: {order.customerEmail}</p>
                    <p style={{ color: 'var(--text-secondary)' }}>ID: {order.customerId}</p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="font-bold text-gradient-green uppercase tracking-wider text-[10px]">
                  Ordered Inventory Items ({order.products.reduce((acc, p) => acc + p.quantity, 0)})
                </h4>
                <div className="glass-card-static border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="divide-y divide-white/5">
                    {order.products.map((p, idx) => (
                      <div key={idx} className="p-3.5 flex justify-between items-center">
                        <div className="space-y-0.5">
                          <p className="font-bold text-white text-[13px]">{p.productName}</p>
                          <span className="text-gray-400 font-medium">
                            Quantity: <span className="text-white font-bold">{p.quantity}</span> @ {formatCurrency(p.price)}
                          </span>
                        </div>
                        <span className="font-extrabold text-white text-[13px]">
                          {formatCurrency(p.price * p.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Totals Summary */}
                  <div className="p-3.5 bg-white/5 border-t flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="font-bold text-white uppercase tracking-wider">Total Charge:</span>
                    <span className="text-base font-extrabold text-[#9EFF00]">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Logistics & Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Shipping */}
                <div className="space-y-2">
                  <h4 className="font-bold text-gradient-green uppercase tracking-wider text-[10px]">
                    Shipping Destination
                  </h4>
                  <div className="glass-card-static border p-3.5 h-full flex gap-2 items-start" style={{ borderColor: 'var(--border-color)' }}>
                    <MapPin size={15} className="text-red-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {order.shippingAddress}
                    </span>
                  </div>
                </div>

                {/* Payment */}
                <div className="space-y-2">
                  <h4 className="font-bold text-gradient-green uppercase tracking-wider text-[10px]">
                    Financial Gateway
                  </h4>
                  <div className="glass-card-static border p-3.5 h-full flex gap-2 items-start" style={{ borderColor: 'var(--border-color)' }}>
                    <CreditCard size={15} className="text-[#00BFFF] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-white uppercase">{order.paymentMethod}</p>
                      <p style={{ color: 'var(--text-secondary)' }}>Status: Authorized / Paid</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end p-5 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider text-black bg-[#9EFF00] hover:bg-[#9EFF00]/95 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
