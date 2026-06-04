import { create } from 'zustand';
import { Category, ProductCategory } from '@/types';

interface CategoryState {
  categories: Category[];
  addCategory: (categoryData: Partial<Category>) => void;
  updateCategory: (id: string, categoryData: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

const initialCategories: Category[] = [
  {
    id: 'cat-001',
    name: 'Electrical Appliances',
    slug: 'electrical-appliances',
    description: 'Home and kitchen electrical appliances.',
    productCount: 42,
    icon: 'Zap',
    color: '#FFD700',
  },
  {
    id: 'cat-002',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Consumer electronics and gadgets.',
    productCount: 156,
    icon: 'Monitor',
    color: '#00BFFF',
  },
  {
    id: 'cat-003',
    name: 'Mobile Accessories',
    slug: 'mobile-accessories',
    description: 'Accessories for smartphones and tablets.',
    productCount: 89,
    icon: 'Smartphone',
    color: '#FF69B4',
  },
  {
    id: 'cat-004',
    name: 'Computer Accessories',
    slug: 'computer-accessories',
    description: 'Peripherals and accessories for computers.',
    productCount: 64,
    icon: 'Laptop',
    color: '#9EFF00',
  }
];

export const useCategoryStore = create<CategoryState>()((set) => ({
  categories: initialCategories,
  
  addCategory: (categoryData: Partial<Category>) =>
    set((state) => {
      const newCategory: Category = {
        id: `cat-${String(state.categories.length + 1).padStart(3, '0')}`,
        name: categoryData.name || 'New Category',
        slug: (categoryData.slug || 'electronics') as ProductCategory,
        description: categoryData.description || '',
        productCount: 0,
        icon: categoryData.icon || 'Package',
        color: categoryData.color || '#9EFF00',
      };
      return { categories: [...state.categories, newCategory] };
    }),

  updateCategory: (id: string, categoryData: Partial<Category>) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, ...categoryData } : c
      ),
    })),

  deleteCategory: (id: string) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),
}));
