"use client";

import { Package, ShoppingCart, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardCardsProps {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
}

export default function DashboardCards({
  totalProducts,
  totalOrders,
  pendingOrders,
  totalCustomers,
}: DashboardCardsProps) {
  const cards = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "from-[#9EFF00] to-[#7FFF00]",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      color: "from-[#00BFFF] to-[#00CED1]",
      bg: "bg-cyan-500/10",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      color: "from-[#FFB700] to-[#FFA500]",
      bg: "bg-amber-500/10",
    },
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: Users,
      color: "from-[#FF6B9D] to-[#C44569]",
      bg: "bg-pink-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`glass-card p-6 border border-white/5 rounded-2xl group hover:border-white/10 transition-all duration-300 ${card.bg}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {card.title}
                </p>
                <h3
                  className="text-3xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {card.value.toLocaleString()}
                </h3>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                <Icon className="w-6 h-6 text-black" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
