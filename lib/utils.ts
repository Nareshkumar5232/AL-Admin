import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getCategoryLabel(slug: string): string {
  const labels: Record<string, string> = {
    'electrical-appliances': 'Electrical Appliances',
    'electronics': 'Electronics',
    'mobile-accessories': 'Mobile Accessories',
    'computer-accessories': 'Computer Accessories',
    'chargers': 'Chargers',
    'earphones': 'Earphones',
    'smart-devices': 'Smart Devices',
  };
  return labels[slug] || slug;
}

export function getImageUrl(url?: string): string {
  if (!url) return '/images/placeholder-product.svg';
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url;
  
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://al-kimath-backend.onrender.com/api').replace(/\/api$/, '');
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  
  return `${baseUrl}${cleanUrl}`;
}
