"use client";

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { MonthlyData } from '@/types';

interface RevenueChartProps {
  data: MonthlyData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className="w-full h-80 glass-card-static border flex items-center justify-center text-xs"
        style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
      >
        Loading analytics engine...
      </div>
    );
  }

  // Custom tool tip component for premium UI styling
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="glass-card-static p-3 border shadow-xl text-xs flex flex-col gap-1 bg-[#1A1A1A]/95"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <p className="font-bold text-white mb-1 uppercase tracking-wider">{payload[0].payload.month}</p>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00BFFF]" />
            <span style={{ color: 'var(--text-secondary)' }}>Revenue:</span>
            <span className="font-extrabold text-white">{formatCurrency(payload[0].value)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="glass-card-static p-5 border flex flex-col gap-4"
      style={{ borderColor: 'var(--border-color)' }}
    >
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Revenue Optimization Chart
        </h3>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Monthly revenue generation breakdown in INR (₹) across the financial period.
        </p>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `₹${val / 1000}k`}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar 
              dataKey="value" 
              fill="#00BFFF" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
