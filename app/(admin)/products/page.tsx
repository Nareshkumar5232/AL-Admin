"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import EmptyState from '@/components/shared/EmptyState';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import ProductForm from '@/components/products/ProductForm';
import ProductFilters from '@/components/products/ProductFilters';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { formatCurrency, getCategoryLabel } from '@/lib/utils';
import { Plus, Edit, Trash2, Box, Package, ShieldCheck } from 'lucide-react';
import { Product } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch Data
  const { data: products = [], isLoading } = useProducts({
    category: category || undefined,
    status: status || undefined,
    search: searchQuery || undefined,
  });

  // Mutations
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Toast HUD Alert State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Read URL query parameter for quick actions
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add') {
      // Clear query param and open form
      setIsFormOpen(true);
      setEditingProduct(null);
      // Replace URL without reloading page
      router.replace('/products');
    }
  }, [searchParams, router]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, category, status, sortBy]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category) {
      result = result.filter((p) => p.category === category);
    }

    // Status filter
    if (status) {
      result = result.filter((p) => p.status === status);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'stock-low':
        result.sort((a, b) => a.stock - b.stock);
        break;
      case 'stock-high':
        result.sort((a, b) => b.stock - a.stock);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [products, searchQuery, category, status, sortBy]);

  // Paginated Products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Handlers
  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      if (editingProduct) {
        await updateProductMutation.mutateAsync({ id: editingProduct.id, data: productData });
        showToast(`Product "${productData.name}" updated successfully.`);
      } else {
        await createProductMutation.mutateAsync(productData);
        showToast(`Product "${productData.name}" provisioned successfully.`);
      }
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      showToast('Operation failed. Please try again.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      const prod = products.find((p) => p.id === deleteTargetId);
      try {
        await deleteProductMutation.mutateAsync(deleteTargetId);
        showToast(`Product "${prod?.name}" deleted from systems.`, 'success');
      } catch (error) {
        showToast('Delete operation failed.', 'error');
      }
      setDeleteTargetId(null);
    }
  };

  const columns = [
    { header: 'Item Info' },
    { header: 'Category' },
    { header: 'Price (INR)' },
    { header: 'Stock Status' },
    { header: 'Security Status' },
    { header: 'Actions', className: 'text-right' },
  ];

  return (
    <div className="space-y-6 relative">
      {/* HUD Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-6 right-6 z-50 glass-card-static p-4 border flex items-center gap-3 bg-[#1A1A1A]/95 text-xs font-bold uppercase shadow-2xl"
            style={{ 
              borderColor: toast.type === 'success' ? '#9EFF00/30' : 'red/30',
              boxShadow: toast.type === 'success' ? '0 0 20px rgba(158, 255, 0, 0.1)' : '0 0 20px rgba(255, 0, 0, 0.1)'
            }}
          >
            <ShieldCheck size={18} className={toast.type === 'success' ? 'text-[#9EFF00]' : 'text-red-400'} />
            <span className="text-white">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <PageHeader
        title="Server Inventory Registry"
        description="Provision, modify, and audit all electronics & appliance database records."
        actions={
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className="px-4 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider text-black bg-[#9EFF00] hover:bg-[#9EFF00]/90 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} /> Provision Entry
          </button>
        }
      />

      {/* Filters HUD */}
      <ProductFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Product List */}
      <DataTable
        data={paginatedProducts}
        columns={columns}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredProducts.length}
        emptyState={
          <EmptyState
            title="Registry is Empty"
            description={
              searchQuery || category || status
                ? "No products match current administrative search query."
                : "No products exist on database server. Get started by provisioning an item."
            }
            type={searchQuery ? 'search' : 'database'}
            action={
              !searchQuery && !category && !status ? (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-black bg-[#9EFF00] hover:bg-[#9EFF00]/80 transition-colors cursor-pointer"
                >
                  Provision First Entry
                </button>
              ) : undefined
            }
          />
        }
        renderRow={(product) => (
          <tr key={product.id} className="hover:bg-white/5 transition-colors">
            {/* Info */}
            <td>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {product.images && product.images.length > 0 && product.images[0] !== '/images/placeholder-product.svg' ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Box size={20} className="text-gray-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-sm truncate max-w-[200px] md:max-w-[280px]">
                    {product.name}
                  </h4>
                  <span className="text-[10px] font-mono tracking-wider font-semibold opacity-60 text-gray-400">
                    ID: {product.id} | Brand: {product.brand}
                  </span>
                </div>
              </div>
            </td>

            {/* Category */}
            <td className="text-xs uppercase font-bold text-gray-400">
              {getCategoryLabel(product.category)}
            </td>

            {/* Price */}
            <td className="font-extrabold text-white text-sm">
              {formatCurrency(product.price)}
              {product.originalPrice && (
                <span className="block text-[10px] text-gray-500 line-through font-semibold">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </td>

            {/* Stock */}
            <td>
              <div className="flex flex-col gap-1">
                <span className={`text-xs font-bold ${product.stock <= 30 ? 'text-red-400' : 'text-white'}`}>
                  {product.stock} units
                </span>
                {product.stock <= 30 ? (
                  <span className="text-[9px] uppercase tracking-wider text-red-500/80 font-bold flex items-center gap-0.5">
                    Critical stock alert
                  </span>
                ) : (
                  <span className="text-[9px] uppercase tracking-wider text-green-500/80 font-bold">
                    Stock secure
                  </span>
                )}
              </div>
            </td>

            {/* Status */}
            <td>
              <StatusBadge status={product.status} />
            </td>

            {/* Actions */}
            <td className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setIsFormOpen(true);
                  }}
                  className="p-1.5 rounded-lg border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all text-[#00BFFF] cursor-pointer"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => setDeleteTargetId(product.id)}
                  className="p-1.5 rounded-lg border border-red-500/10 hover:border-red-500/20 hover:bg-red-500/10 transition-all text-red-400 cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSave={handleSaveProduct}
        isSaving={createProductMutation.isPending || updateProductMutation.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        isConfirming={deleteProductMutation.isPending}
        title="Purge Catalog Item"
        description="Are you absolutely sure you want to purge this inventory entry? This action is irreversible and will delete it from the live database."
        confirmText="Purge Record"
        cancelText="Cancel"
      />
    </div>
  );
}
