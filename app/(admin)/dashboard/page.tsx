"use client";

import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import DashboardCards from '@/components/dashboard/DashboardCards';
import { useProductStore } from '@/store/productStore';
import { useOrderStore } from '@/store/orderStore';
import { useCustomerStore } from '@/store/customerStore';

export default function DashboardPage() {
  const { products } = useProductStore();
  const { orders } = useOrderStore();
  const { customers } = useCustomerStore();

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const totalCustomers = customers.length;

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb */}
      <PageHeader 
        title="Dashboard" 
        description="AL HIKMATH ENTERPRISES operational overview"
      />

      {/* Dashboard Stats Cards */}
      <DashboardCards
        totalProducts={totalProducts}
        totalOrders={totalOrders}
        pendingOrders={pendingOrders}
        totalCustomers={totalCustomers}
      />
    </div>
  );
}
