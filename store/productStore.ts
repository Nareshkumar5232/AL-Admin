import { create } from 'zustand';
import { Product } from '@/types';
import { mockProducts } from '@/data/mock-products';

interface ProductState {
  products: Product[];
  addProduct: (product: Partial<Product>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>()((set) => ({
  products: mockProducts,
  addProduct: (productData: Partial<Product>) =>
    set((state) => {
      const newProduct: Product = {
        id: `prod-${String(state.products.length + 1).padStart(3, '0')}`,
        name: productData.name || 'New Product',
        description: productData.description || '',
        category: productData.category || 'electronics',
        price: productData.price || 0,
        originalPrice: productData.originalPrice,
        stock: productData.stock || 0,
        images: productData.images || ['/images/placeholder-product.svg'],
        brand: productData.brand || 'Generic',
        rating: 5,
        reviewCount: 0,
        status: productData.status || 'active',
        isFeatured: productData.isFeatured || false,
        specifications: productData.specifications || {},
        tags: productData.tags || [],
        createdAt: new Date().toISOString(),
      };
      return { products: [newProduct, ...state.products] };
    }),
  updateProduct: (id: string, updates: Partial<Product>) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  deleteProduct: (id: string) =>
    set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
}));
