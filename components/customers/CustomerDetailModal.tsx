"use client";

import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Calendar, ShoppingBag, DollarSign, Clock } from 'lucide-react';
import { Customer, Order } from '@/types';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import StatusBadge from '@/components/shared/StatusBadge';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  orders: Order[];
}

export default function CustomerDetailModal({
  isOpen,
  onClose,
  customer,
  orders,
}: CustomerDetailModalProps) {
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

  // Find all orders belonging to this customer
  const customerOrders = useMemo(() => {
    if (!customer) return [];
    return orders
      .filter((o) => o.customerId === customer.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [customer, orders]);

  if (!customer) return null;

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

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="w-full max-w-xl glass-card-static border shadow-2xl z-10 flex flex-col max-h-[90vh]"
            style={{ 
              borderColor: 'var(--border-color)',
              background: 'var(--bg-secondary)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <span className="text-[10px] font-mono tracking-widest font-bold text-[#00BFFF] uppercase">
                  User Intelligence profile
                </span>
                <h3 className="text-lg font-bold text-white uppercase">
                  Client Record
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              
              {/* Profile Card */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/5 text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#9EFF00] shrink-0 font-extrabold text-2xl">
                  {customer.name.charAt(0)}
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-extrabold text-white text-base leading-none">
                      {customer.name}
                    </h4>
                    <div className="self-center">
                      <StatusBadge status={customer.status} />
                    </div>
                  </div>
                  <p className="text-gray-400 font-semibold font-mono tracking-wider text-[10px]">
                    ID: {customer.id}
                  </p>
                  <p className="text-gray-400" style={{ color: 'var(--text-secondary)' }}>
                    Home Address: {customer.address}
                  </p>
                </div>
              </div>

              {/* Contact & Registration Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card-static border p-4 space-y-2.5" style={{ borderColor: 'var(--border-color)' }}>
                  <h5 className="font-bold text-gradient-green uppercase tracking-wider text-[9px]">Contact Data</h5>
                  <div className="space-y-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
                    <p className="flex items-center gap-2">
                      <Mail size={13} className="text-[#00BFFF]" /> {customer.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={13} className="text-[#00BFFF]" /> {customer.phone}
                    </p>
                  </div>
                </div>

                <div className="glass-card-static border p-4 space-y-2.5" style={{ borderColor: 'var(--border-color)' }}>
                  <h5 className="font-bold text-gradient-green uppercase tracking-wider text-[9px]">Account Meta</h5>
                  <div className="space-y-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
                    <p className="flex items-center gap-2">
                      <Calendar size={13} className="text-[#9EFF00]" /> Registered: {formatDate(customer.joinedAt)}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={13} className="text-[#9EFF00]" /> Last Active: {formatDateTime(customer.lastOrderAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Spent & Transaction KPI */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                  <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Total Revenue Injected</span>
                  <span className="text-xl md:text-2xl font-extrabold text-[#9EFF00] mt-1 block">
                    {formatCurrency(customer.totalSpent)}
                  </span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                  <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Transaction Audits</span>
                  <span className="text-xl md:text-2xl font-extrabold text-white mt-1 block">
                    {customer.ordersCount} orders
                  </span>
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-3">
                <h4 className="font-bold text-gradient-green uppercase tracking-wider text-[10px]">
                  Recent Order History
                </h4>
                {customerOrders.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-500 border border-dashed rounded-xl" style={{ borderColor: 'var(--border-color)' }}>
                    No order records found for this client.
                  </div>
                ) : (
                  <div className="glass-card-static border overflow-hidden max-h-[220px] overflow-y-auto" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="divide-y divide-white/5">
                      {customerOrders.map((o) => (
                        <div key={o.id} className="p-3 flex justify-between items-center hover:bg-white/5 transition-colors">
                          <div className="space-y-0.5">
                            <span className="font-mono font-bold text-[#00BFFF] block">{o.id}</span>
                            <span className="text-gray-400 font-semibold">{formatDate(o.createdAt)}</span>
                          </div>
                          <div className="text-right space-y-0.5">
                            <span className="font-extrabold text-white block">{formatCurrency(o.total)}</span>
                            <StatusBadge status={o.status} className="text-[9px] px-1.5 py-0" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Close */}
            <div className="flex justify-end p-5 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider text-black bg-[#9EFF00] hover:bg-[#9EFF00]/95 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
