"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Category, ProductCategory } from '@/types';

const categorySchema = z.object({
  name: z.string().min(3, 'Category name must be at least 3 characters'),
  slug: z.string().min(1, 'Category slug is required'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  icon: z.string().min(1, 'Please select an icon representation'),
  color: z.string().min(4, 'HEX Color code is required'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSave: (categoryData: Partial<Category>) => void;
}

const ICONS_LIST = [
  { value: 'Monitor', label: 'Monitor (Electronics)' },
  { value: 'Zap', label: 'Zap (Appliances)' },
  { value: 'Smartphone', label: 'Smartphone (Mobile)' },
  { value: 'Laptop', label: 'Laptop (Computers)' },
  { value: 'BatteryCharging', label: 'Battery/Chargers' },
  { value: 'Headphones', label: 'Headphones/Audio' },
  { value: 'Watch', label: 'Watch (Smart)' },
  { value: 'Box', label: 'Box (General)' },
];

export default function CategoryForm({ isOpen, onClose, category, onSave }: CategoryFormProps) {
  const isEdit = !!category;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      icon: 'Box',
      color: '#9EFF00',
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        color: category.color,
      });
    } else {
      reset({
        name: '',
        slug: '',
        description: '',
        icon: 'Box',
        color: '#9EFF00',
      });
    }
  }, [category, reset, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const onSubmit = (data: CategoryFormValues) => {
    onSave({
      ...data,
      slug: data.slug as ProductCategory,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="w-full max-w-md glass-card-static border shadow-2xl z-10 flex flex-col"
            style={{ 
              borderColor: 'var(--border-color)',
              background: 'var(--bg-secondary)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <h3 className="text-lg font-bold text-gradient-green">
                  {isEdit ? 'Modify Catalog Classification' : 'Inject Catalog Classification'}
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Set parameters to map inventory sub-folders.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Category Name</label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. Electrical Appliances"
                  className="admin-input"
                />
                {errors.name && (
                  <span className="text-red-400 text-xs font-semibold">{errors.name.message}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Category Slug</label>
                <input
                  type="text"
                  {...register('slug')}
                  placeholder="e.g. electrical-appliances"
                  className="admin-input font-mono"
                  disabled={isEdit} // Prevent changing slug on edit
                />
                {errors.slug && (
                  <span className="text-red-400 text-xs font-semibold">{errors.slug.message}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Description</label>
                <textarea
                  rows={2}
                  {...register('description')}
                  placeholder="e.g. LED bulbs, extensions, switches..."
                  className="admin-input resize-none"
                />
                {errors.description && (
                  <span className="text-red-400 text-xs font-semibold">{errors.description.message}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Lucide Icon</label>
                  <select
                    {...register('icon')}
                    className="admin-input bg-[#222] appearance-none"
                    style={{ background: 'var(--bg-tertiary)' }}
                  >
                    {ICONS_LIST.map((ico) => (
                      <option key={ico.value} value={ico.value}>
                        {ico.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Brand Color Accent</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      {...register('color')}
                      className="w-10 h-10 border rounded-lg bg-transparent cursor-pointer p-0.5"
                      style={{ borderColor: 'var(--border-color)' }}
                    />
                    <input
                      type="text"
                      {...register('color')}
                      placeholder="#FFFFFF"
                      className="admin-input font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider border hover:bg-white/5 transition-colors cursor-pointer"
                  style={{ 
                    borderColor: 'var(--border-color)', 
                    color: 'var(--text-primary)',
                    background: 'var(--bg-tertiary)'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider text-black bg-[#9EFF00] hover:bg-[#9EFF00]/90 active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  {isEdit ? 'Sync Changes' : 'Inject Classification'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
