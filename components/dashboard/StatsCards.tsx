"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { AnalyticsData } from '@/types';

interface StatsCardsProps {
  analytics: AnalyticsData;
}

export default function StatsCards({ analytics }: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(analytics.totalRevenue),
      trend: analytics.revenueTrend,
      icon: DollarSign,
      color: '#00BFFF', // electric-blue
      glow: 'glow-blue',
    },
    {
      title: 'Total Orders',
      value: formatNumber(analytics.totalOrders),
      trend: analytics.ordersTrend,
      icon: ShoppingCart,
      color: '#9EFF00', // neon-green
      glow: 'glow-green',
    },
    {
      title: 'Total Products',
      value: formatNumber(analytics.totalProducts),
      trend: analytics.productsTrend,
      icon: Package,
      color: '#845EF7', // purple
      glow: '',
    },
    {
      title: 'Total Customers',
      value: formatNumber(analytics.totalCustomers),
      trend: analytics.customersTrend,
      icon: Users,
      color: '#FF6B6B', // red
      glow: '',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80 } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        const isPositive = stat.trend >= 0;

        return (
          <motion.div
            key={idx}
            variants={item}
            className={`glass-card p-5 border relative overflow-hidden flex flex-col justify-between ${stat.glow}`}
            style={{ borderColor: 'var(--border-color)' }}
          >
            {/* Background decoration */}
            <div 
              className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 pointer-events-none"
              style={{ background: stat.color, filter: 'blur(30px)' }}
            />

            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                {stat.title}
              </span>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center border"
                style={{ 
                  borderColor: `${stat.color}15`, 
                  background: `${stat.color}08`,
                  color: stat.color 
                }}
              >
                <Icon size={20} />
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                {stat.value}
              </h3>
              
              <div className="flex items-center gap-1.5 mt-2">
                <span 
                  className={`flex items-center text-xs font-bold ${
                    isPositive ? 'text-[#9EFF00]' : 'text-red-400'
                  }`}
                >
                  {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {isPositive ? '+' : ''}{stat.trend}%
                </span>
                <span className="text-[10px] uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>
                  vs last month
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
