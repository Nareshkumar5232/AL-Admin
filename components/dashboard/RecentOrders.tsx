"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import StatusBadge from '@/components/shared/StatusBadge';
import { Order } from '@/types';

interface RecentOrdersProps {
  orders: Order[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const recentOrders = orders.slice(0, 5);

  return (
    <div 
      className="glass-card-static p-5 border flex flex-col gap-4"
      style={{ borderColor: 'var(--border-color)' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Recent Transactions
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Real-time display of the latest customer purchases.
          </p>
        </div>
        <Link 
          href="/orders"
          className="text-xs font-bold uppercase tracking-wider text-[#9EFF00] hover:text-[#9EFF00]/80 flex items-center gap-1 transition-colors"
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td className="font-mono text-xs text-[#00BFFF] font-bold">
                  {order.id}
                </td>
                <td className="font-medium text-white">
                  {order.customerName}
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>
                  {formatDate(order.createdAt)}
                </td>
                <td className="font-extrabold text-white">
                  {formatCurrency(order.total)}
                </td>
                <td>
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
