"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import CategoryForm from '@/components/categories/CategoryForm';
import { useCategoryStore } from '@/store/categoryStore';
import { Category } from '@/types';
import { 
  Monitor, 
  Zap, 
  Smartphone, 
  Laptop, 
  BatteryCharging, 
  Headphones, 
  Watch, 
  Box, 
  Plus, 
  Edit2, 
  Trash2, 
  FolderTree, 
  ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Map icon names to Lucide icon components
const ICONS_MAP: Record<string, React.ComponentType<any>> = {
  Monitor,
  Zap,
  Smartphone,
  Laptop,
  BatteryCharging,
  Headphones,
  Watch,
  Box,
};

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
      triggerToast(`Classification "${categoryData.name}" updated successfully.`);
    } else {
      addCategory(categoryData);
      triggerToast(`Classification "${categoryData.name}" injected successfully.`);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      const cat = categories.find((c) => c.id === deleteTargetId);
      deleteCategory(deleteTargetId);
      triggerToast(`Classification "${cat?.name}" purged from registries.`);
      setDeleteTargetId(null);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-6 right-6 z-50 glass-card-static p-4 border flex items-center gap-3 bg-[#1A1A1A]/95 text-xs font-bold uppercase shadow-2xl border-[#9EFF00]/30 shadow-[#9EFF00]/10"
          >
            <ShieldCheck size={18} className="text-[#9EFF00]" />
            <span className="text-white">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <PageHeader
        title="Catalog Architecture"
        description="Configure product classifications, navigation categories, and hierarchy layouts."
        actions={
          <button
            onClick={() => {
              setEditingCategory(null);
              setIsFormOpen(true);
            }}
            className="px-4 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider text-black bg-[#9EFF00] hover:bg-[#9EFF00]/90 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} /> New Classification
          </button>
        }
      />

      {/* Grid of Categories */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {categories.map((category) => {
          const IconComponent = ICONS_MAP[category.icon] || Box;

          return (
            <motion.div
              key={category.id}
              variants={item}
              className="glass-card p-5 border relative overflow-hidden flex flex-col justify-between group"
              style={{ borderColor: 'var(--border-color)' }}
            >
              {/* Color accent bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: category.color }}
              />

              {/* Background gradient blob on hover */}
              <div 
                className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none"
                style={{ background: category.color, filter: 'blur(30px)' }}
              />

              {/* Top Meta info */}
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center border"
                    style={{ 
                      borderColor: `${category.color}15`, 
                      background: `${category.color}08`,
                      color: category.color 
                    }}
                  >
                    <IconComponent size={20} />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-50">
                    {category.id}
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-white group-hover:text-[#9EFF00] transition-colors leading-tight">
                  {category.name}
                </h4>
                <span className="text-[10px] font-mono text-gray-500 block mt-0.5">
                  slug: {category.slug}
                </span>

                <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {category.description}
                </p>
              </div>

              {/* Bottom Actions and Stats */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <div className="text-xs font-semibold">
                  <span className="text-[#00BFFF] font-extrabold">{category.productCount}</span>{' '}
                  <span style={{ color: 'var(--text-secondary)' }}>items linked</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setIsFormOpen(true);
                    }}
                    className="p-1.5 rounded-lg border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all text-[#00BFFF] cursor-pointer"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(category.id)}
                    className="p-1.5 rounded-lg border border-red-500/10 hover:border-red-500/20 hover:bg-red-500/10 transition-all text-red-400 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Forms & Dialogs */}
      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSave={handleSaveCategory}
      />

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Purge Classification"
        description="Are you sure you want to purge this catalog grouping? The action is irreversible and products assigned to this slug may lose category mapping."
        confirmText="Purge Record"
        cancelText="Cancel"
      />
    </div>
  );
}
