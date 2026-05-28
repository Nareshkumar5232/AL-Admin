"use client";

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlyData } from '@/types';

interface SalesChartProps {
  data: MonthlyData[];
}

export default function SalesChart({ data }: SalesChartProps) {
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
            <div className="w-2.5 h-2.5 rounded-full bg-[#9EFF00]" />
            <span style={{ color: 'var(--text-secondary)' }}>Current:</span>
            <span className="font-extrabold text-white">{payload[0].value} sales</span>
          </div>
          {payload[1] && (
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span style={{ color: 'var(--text-secondary)' }}>Previous:</span>
              <span className="font-extrabold text-white/60">{payload[1].value} sales</span>
            </div>
          )}
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
          Order Sales Velocity
        </h3>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Monthly transaction volume compared with previous year performance metrics.
        </p>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9EFF00" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#9EFF00" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
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
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.05)' }} />
            
            {/* Previous Year */}
            <Area
              type="monotone"
              dataKey="previousValue"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="none"
            />
            {/* Current Year */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#9EFF00"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#salesColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
