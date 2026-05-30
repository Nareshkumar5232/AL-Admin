"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, ShieldAlert, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product, ProductCategory } from '@/types';
import { useCategoryStore } from '@/store/categoryStore';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  price: z.coerce.number().min(1, 'Price must be greater than 0'),
  originalPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  brand: z.string().min(1, 'Brand is required'),
  status: z.enum(['active', 'inactive']),
  isFeatured: z.boolean(),
  tags: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (productData: Partial<Product>) => void;
}

export default function ProductForm({ isOpen, onClose, product, onSave }: ProductFormProps) {
  const { categories } = useCategoryStore();
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const [imagesList, setImagesList] = useState<string[]>([]);
  const isEdit = !!product;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      category: '',
      price: 0,
      originalPrice: undefined,
      stock: 0,
      brand: '',
      status: 'active',
      isFeatured: false,
      tags: '',
    },
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        stock: product.stock,
        brand: product.brand,
        status: product.status,
        isFeatured: product.isFeatured || false,
        tags: product.tags ? product.tags.join(', ') : '',
      });
      // Set specifications
      if (product.specifications) {
        const specList = Object.entries(product.specifications).map(([key, value]) => ({
          key,
          value,
        }));
        setSpecs(specList);
      } else {
        setSpecs([]);
      }
      setImagesList(product.images || []);
    } else {
      reset({
        name: '',
        description: '',
        category: '',
        price: 0,
        originalPrice: undefined,
        stock: 0,
        brand: '',
        status: 'active',
        isFeatured: false,
        tags: '',
      });
      setSpecs([]);
      setImagesList([]);
    }
  }, [product, reset, isOpen]);

  // Prevent scroll when open
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

  const addSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const readPromises = filesArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readPromises).then((base64Images) => {
        setImagesList((prev) => [...prev, ...base64Images]);
      });
    }
  };

  const removeImage = (index: number) => {
    setImagesList((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: ProductFormValues) => {
    // Process specifications list back into record
    const specRecord: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specRecord[s.key.trim()] = s.value.trim();
      }
    });

    const tagsArray = data.tags 
      ? data.tags.split(',').map(t => t.trim()).filter(Boolean) 
      : [];

    onSave({
      ...data,
      category: data.category as ProductCategory,
      specifications: specRecord,
      tags: tagsArray,
      images: imagesList.length > 0 ? imagesList : ['/images/placeholder-product.svg'],
    });
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="w-full max-w-2xl glass-card-static border shadow-2xl z-10 flex flex-col max-h-[90vh] my-8"
            style={{ 
              borderColor: 'var(--border-color)',
              background: 'var(--bg-secondary)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <h3 className="text-lg font-bold text-gradient-green">
                  {isEdit ? 'Modify Server Inventory Item' : 'Provision New Catalog Entry'}
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Complete parameters to sync catalog updates.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Scrollable Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Product Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs uppercase font-bold text-gray-400">Product Name</label>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="e.g. Havells LED Bulb 9W"
                    className="admin-input"
                  />
                  {errors.name && (
                    <span className="text-red-400 text-xs font-semibold">{errors.name.message}</span>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs uppercase font-bold text-gray-400">Product Description</label>
                  <textarea
                    rows={3}
                    {...register('description')}
                    placeholder="e.g. Energy efficient long lasting smart LED bulb..."
                    className="admin-input resize-none"
                  />
                  {errors.description && (
                    <span className="text-red-400 text-xs font-semibold">{errors.description.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-gray-400">Brand</label>
                  <input
                    type="text"
                    {...register('brand')}
                    placeholder="e.g. Havells"
                    className="admin-input"
                  />
                  {errors.brand && (
                    <span className="text-red-400 text-xs font-semibold">{errors.brand.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-gray-400">Category</label>
                  <select
                    {...register('category')}
                    className="admin-input bg-[#222] appearance-none"
                    style={{ background: 'var(--bg-tertiary)' }}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className="text-red-400 text-xs font-semibold">{errors.category.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-gray-400">Price (INR)</label>
                  <input
                    type="number"
                    {...register('price')}
                    placeholder="e.g. 299"
                    className="admin-input"
                  />
                  {errors.price && (
                    <span className="text-red-400 text-xs font-semibold">{errors.price.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-gray-400">Original Price (INR)</label>
                  <input
                    type="number"
                    {...register('originalPrice')}
                    placeholder="e.g. 399"
                    className="admin-input"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-gray-400">Stock Count</label>
                  <input
                    type="number"
                    {...register('stock')}
                    placeholder="e.g. 150"
                    className="admin-input"
                  />
                  {errors.stock && (
                    <span className="text-red-400 text-xs font-semibold">{errors.stock.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-gray-400">Tags (comma separated)</label>
                  <input
                    type="text"
                    {...register('tags')}
                    placeholder="e.g. led, bulb, smart"
                    className="admin-input"
                  />
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('isFeatured')}
                      className="w-4 h-4 accent-[#9EFF00] cursor-pointer"
                    />
                    <span className="text-xs font-bold uppercase text-gray-400">Featured Item</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-gray-400">Status:</span>
                    <label className="inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={watch('status') !== 'inactive'}
                        onChange={(e) => {
                          setValue('status', e.target.checked ? 'active' : 'inactive');
                        }}
                      />
                      <div className="relative w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9EFF00]/30 peer-checked:after:bg-[#9EFF00]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="border-t pt-5" style={{ borderColor: 'var(--border-color)' }}>
                <div className="mb-4">
                  <label className="text-xs uppercase font-bold text-gray-300">Product Images</label>
                  <p className="text-[10px] text-gray-400">Upload product photos from your local storage to catalog repository.</p>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  {imagesList.map((img, index) => (
                    <div key={index} className="w-24 h-24 rounded-xl border relative group overflow-hidden bg-white/5 flex items-center justify-center animate-scale-in" style={{ borderColor: 'var(--border-color)' }}>
                      <img 
                        src={img} 
                        alt={`Product ${index + 1}`} 
                        className="w-full h-full object-contain p-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 rounded-md bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                      >
                        <X size={12} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-center text-[8px] text-gray-300 font-bold uppercase tracking-wider">
                        {index === 0 ? 'Cover' : `Img ${index + 1}`}
                      </div>
                    </div>
                  ))}

                  {/* Add Image Button */}
                  <label 
                    htmlFor="product-image-upload" 
                    className="w-24 h-24 rounded-xl border border-dashed flex flex-col items-center justify-center gap-1.5 hover:bg-white/5 cursor-pointer transition-all active:scale-95 shrink-0" 
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                  >
                    <Upload size={18} className="text-[#9EFF00]" />
                    <span className="text-[9px] uppercase font-bold text-center">Add Image</span>
                    <input
                      type="file"
                      id="product-image-upload"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Specifications */}
              <div className="border-t pt-5" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <label className="text-xs uppercase font-bold text-gray-300">Technical Specifications</label>
                    <p className="text-[10px] text-gray-400">Custom metadata key-values for device hardware specs.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addSpec}
                    className="py-1 px-2.5 rounded-lg border text-xs font-bold text-[#9EFF00] border-[#9EFF00]/30 hover:bg-[#9EFF00]/10 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} /> Add Spec
                  </button>
                </div>

                {specs.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-500 border border-dashed rounded-xl" style={{ borderColor: 'var(--border-color)' }}>
                    No technical specifications defined.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {specs.map((s, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Feature (e.g. Wattage)"
                          value={s.key}
                          onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                          className="admin-input flex-1"
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g. 9W)"
                          value={s.value}
                          onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                          className="admin-input flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpec(index)}
                          className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
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
                  {isEdit ? 'Sync Changes' : 'Publish Entry'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
