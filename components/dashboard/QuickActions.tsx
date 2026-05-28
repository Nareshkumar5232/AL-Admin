"use client";

import React from 'react';
import Link from 'next/link';
import { PlusCircle, ShoppingBag, FolderTree, Settings, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuickActions() {
  const actions = [
    {
      title: 'Provision Product',
      description: 'Inject new inventory item into catalog.',
      icon: PlusCircle,
      href: '/products?action=add',
      color: '#9EFF00',
      glow: 'glow-green-hover',
    },
    {
      title: 'Review Orders',
      description: 'Audit pending and active transactions.',
      icon: ShoppingBag,
      href: '/orders',
      color: '#00BFFF',
      glow: 'glow-blue-hover',
    },
    {
      title: 'Configure Categories',
      description: 'Structure catalog groups and slugs.',
      icon: FolderTree,
      href: '/categories',
      color: '#845EF7',
      glow: '',
    },
    {
      title: 'Security Settings',
      description: 'Tune gateway firewalls & passwords.',
      icon: Settings,
      href: '/settings',
      color: '#FF922B',
      glow: '',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {actions.map((act, idx) => {
        const Icon = act.icon;

        return (
          <Link key={idx} href={act.href} className="group">
            <div 
              className={`glass-card p-5 border h-full flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${act.glow}`}
              style={{ borderColor: 'var(--border-color)' }}
            >
              {/* Top Row */}
              <div className="flex justify-between items-start">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                  style={{ 
                    borderColor: `${act.color}15`, 
                    background: `${act.color}08`,
                    color: act.color 
                  }}
                >
                  <Icon size={20} />
                </div>
                <ArrowRight 
                  size={16} 
                  className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                  style={{ color: act.color }}
                />
              </div>

              {/* Text */}
              <div className="mt-4">
                <h4 className="text-sm font-bold text-white uppercase group-hover:text-[#9EFF00] transition-colors">
                  {act.title}
                </h4>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {act.description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
