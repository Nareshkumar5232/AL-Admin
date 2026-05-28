"use client";

import React, { useEffect, useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { mockAnalytics } from '@/data/mock-analytics';
import { mockCategories } from '@/data/mock-categories';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Sparkles, 
  ArrowUpRight,
  TrendingDown,
  RotateCcw
} from 'lucide-react';

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [timePeriod, setTimePeriod] = useState('12m');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Category breakdown mock data
  const categoryData = useMemo(() => {
    return mockCategories.map((c) => ({
      name: c.name,
      value: Math.floor(c.productCount * 12.5), // simulated sales
      color: c.color,
    })).sort((a, b) => b.value - a.value);
  }, []);

  // Simulated brand sales data
  const brandSalesData = [
    { name: 'Havells', sales: 412, revenue: 123000, color: '#9EFF00' },
    { name: 'Syska', sales: 320, revenue: 208000, color: '#00BFFF' },
    { name: 'Philips', sales: 245, revenue: 293000, color: '#845EF7' },
    { name: 'boAt', sales: 512, revenue: 767000, color: '#FF6B6B' },
    { name: 'Spigen', sales: 180, revenue: 269000, color: '#FFD43B' },
    { name: 'Samsung', sales: 154, revenue: 770000, color: '#FF922B' },
  ];

  if (!mounted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ background: 'var(--bg-primary)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#9EFF00] border-t-transparent animate-spin" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Powering analytics processors...
          </p>
        </div>
      </div>
    );
  }

  // Custom tool tip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="glass-card-static p-3 border shadow-xl text-xs flex flex-col gap-1 bg-[#1A1A1A]/95"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <p className="font-bold text-white mb-1 uppercase tracking-wider">{payload[0].payload.month || payload[0].payload.name}</p>
          {payload.map((pld: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pld.color || pld.fill }} />
              <span style={{ color: 'var(--text-secondary)' }}>{pld.name}:</span>
              <span className="font-extrabold text-white">
                {typeof pld.value === 'number' && pld.name.toLowerCase().includes('revenue') 
                  ? formatCurrency(pld.value) 
                  : pld.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Intelligence Engine"
        description="Comprehensive analytics dashboard for sales performance, categories, and brand revenue."
        actions={
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="admin-input min-w-[140px] bg-[#222] appearance-none cursor-pointer text-xs uppercase font-bold"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <option value="7d">Last 7 Cycles</option>
            <option value="30d">Last 30 Cycles</option>
            <option value="12m">Fiscal 12 Months</option>
          </select>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1 */}
        <div className="glass-card p-5 border relative overflow-hidden flex flex-col justify-between"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Conversion Efficiency</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-1">3.42%</h3>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#9EFF00]/10 text-[#9EFF00] border border-[#9EFF00]/20">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-bold text-[#9EFF00]">
            <ArrowUpRight size={14} /> +0.4% <span className="text-[10px] text-gray-500 font-semibold uppercase">vs last cycle</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-card p-5 border relative overflow-hidden flex flex-col justify-between"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Average Order Size</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-1">₹3,412</h3>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#00BFFF]/10 text-[#00BFFF] border border-[#00BFFF]/20">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-bold text-[#9EFF00]">
            <ArrowUpRight size={14} /> +1.2% <span className="text-[10px] text-gray-500 font-semibold uppercase">vs last cycle</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-card p-5 border relative overflow-hidden flex flex-col justify-between"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Catalog Return Ratio</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-1">1.18%</h3>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-500/10 text-red-400 border border-red-500/20">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-bold text-red-400">
            <TrendingDown size={14} /> -0.15% <span className="text-[10px] text-gray-500 font-semibold uppercase">vs last cycle</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unified Sales / Revenue Trend */}
        <div 
          className="glass-card-static p-5 border lg:col-span-2 flex flex-col gap-4"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Unified Income Trend</h3>
            <p className="text-xs text-gray-400 mt-0.5">Composite chart correlating monthly sales and net generated revenue.</p>
          </div>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={mockAnalytics.monthlySales.map((sales, index) => ({
                  month: sales.month,
                  sales: sales.value,
                  revenue: mockAnalytics.monthlyRevenue[index].value,
                }))}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Sales Volume (bars) */}
                <Bar dataKey="sales" name="Sales Count" fill="rgba(0, 191, 255, 0.4)" radius={[4, 4, 0, 0]} maxBarSize={30} />
                
                {/* Revenue (line) */}
                <Line type="monotone" dataKey="revenue" name="Total Revenue" stroke="#9EFF00" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 1.5, fill: '#0F0F0F' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown (Pie) */}
        <div 
          className="glass-card-static p-5 border flex flex-col gap-4"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Category Sales Share</h3>
            <p className="text-xs text-gray-400 mt-0.5">Proportional sales distribution across catalog slots.</p>
          </div>
          <div className="w-full h-80 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Absolute Center Labels */}
            <div className="absolute text-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase block tracking-wider">Top Slot</span>
              <span className="text-sm font-extrabold text-white block mt-0.5">Mobile Accs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Sales & Data Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Brand Sales Chart */}
        <div 
          className="glass-card-static p-5 border lg:col-span-1 flex flex-col gap-4"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Brand Sales Count</h3>
            <p className="text-xs text-gray-400 mt-0.5">Volume comparison of top selling vendor brands.</p>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={brandSalesData}
                layout="vertical"
                margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" name="Sales Count" radius={[0, 4, 4, 0]}>
                  {brandSalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Brand Revenue Performance Table */}
        <div 
          className="glass-card-static p-5 border lg:col-span-2 flex flex-col gap-4"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Brand Fiscal Audits</h3>
            <p className="text-xs text-gray-400 mt-0.5">Financial contribution and margins audited from top brands.</p>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Brand Name</th>
                  <th>Total Sold</th>
                  <th>Fiscal Revenue Generated</th>
                  <th>Platform Margin Share</th>
                </tr>
              </thead>
              <tbody>
                {brandSalesData.map((b, idx) => (
                  <tr key={idx}>
                    <td className="font-bold text-white flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                      {b.name}
                    </td>
                    <td className="text-white font-semibold">{b.sales} transactions</td>
                    <td className="font-extrabold text-[#9EFF00]">{formatCurrency(b.revenue)}</td>
                    <td className="text-gray-400 font-semibold font-mono">{(b.revenue * 0.15).toFixed(0)} INR (15%)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
