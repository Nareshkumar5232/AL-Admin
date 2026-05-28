"use client";

import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import SalesChart from '@/components/dashboard/SalesChart';
import RevenueChart from '@/components/dashboard/RevenueChart';
import RecentOrders from '@/components/dashboard/RecentOrders';
import QuickActions from '@/components/dashboard/QuickActions';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { mockAnalytics } from '@/data/mock-analytics';
import { useOrderStore } from '@/store/orderStore';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { orders } = useOrderStore();

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb */}
      <PageHeader 
        title="Admin Control Center" 
        description="AL HIKMATH ENTERPRISES operational overview and metrics terminal."
      />

      {/* KPI Cards */}
      <StatsCards analytics={mockAnalytics} />

      {/* Quick Action Hub */}
      <QuickActions />

      {/* Operational Data Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SalesChart data={mockAnalytics.monthlySales} />
        <RevenueChart data={mockAnalytics.monthlyRevenue} />
      </div>

      {/* Tables and Logging Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentOrders orders={orders} />
        </div>
        <div>
          <ActivityFeed activities={mockAnalytics.recentActivities} />
        </div>
      </div>
    </div>
  );
}
