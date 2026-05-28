import { create } from 'zustand';
import { Category, ProductCategory } from '@/types';
import { mockCategories } from '@/data/mock-categories';

interface CategoryState {
  categories: Category[];
  addCategory: (categoryData: Partial<Category>) => void;
  updateCategory: (id: string, categoryData: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>()((set) => ({
  categories: mockCategories,
  
  addCategory: (categoryData: Partial<Category>) =>
    set((state) => {
      const newCategory: Category = {
        id: `cat-${String(state.categories.length + 1).padStart(3, '0')}`,
        name: categoryData.name || 'New Category',
        slug: (categoryData.slug || 'electronics') as ProductCategory,
        description: categoryData.description || '',
        productCount: 0,
        icon: categoryData.icon || 'Box',
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
