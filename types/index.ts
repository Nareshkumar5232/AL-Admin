// AL HIKMATH ENTERPRISES PVT LTD — Admin Panel Types

export type ProductCategory =
  | 'electrical-appliances'
  | 'electronics'
  | 'mobile-accessories'
  | 'computer-accessories'
  | 'chargers'
  | 'earphones'
  | 'smart-devices';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type CustomerStatus = 'active' | 'inactive';
export type PaymentMethod = 'upi' | 'card' | 'cod' | 'netbanking' | 'wallet';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  brand: string;
  rating: number;
  reviewCount: number;
  status: 'active' | 'inactive';
  isFeatured: boolean;
  specifications: Record<string, string>;
  tags: string[];
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  products: OrderProduct[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  ordersCount: number;
  totalSpent: number;
  status: CustomerStatus;
  joinedAt: string;
  lastOrderAt: string;
  address: string;
}

export interface Category {
  id: string;
  name: string;
  slug: ProductCategory;
  description: string;
  productCount: number;
  icon: string;
  color: string;
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface AnalyticsData {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  productsTrend: number;
  ordersTrend: number;
  revenueTrend: number;
  customersTrend: number;
  monthlySales: MonthlyData[];
  monthlyRevenue: MonthlyData[];
  recentActivities: Activity[];
}

export interface MonthlyData {
  month: string;
  value: number;
  previousValue?: number;
}

export interface Activity {
  id: string;
  type: 'order' | 'product' | 'customer' | 'review';
  message: string;
  timestamp: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}
