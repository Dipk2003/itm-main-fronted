import { api } from './api';

export interface DashboardAnalytics {
  totalUsers: number;
  totalVendors: number;
  verifiedVendors: number;
  totalProducts: number;
  activeProducts: number;
  approvedProducts: number;
  totalOrders: number;
  totalInquiries: number;
  resolvedInquiries: number;
  totalReviews: number;
  approvedReviews: number;
}

export interface VendorAnalytics {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalReviews: number;
}

export interface SystemMetrics {
  totalMemory: number;
  freeMemory: number;
  usedMemory: number;
  availableProcessors: number;
}

export const analyticsApi = {
  // Get dashboard analytics (Admin only)
  getDashboardAnalytics: async (): Promise<DashboardAnalytics> => {
    const response = await api.get('/api/analytics/dashboard');
    return response.data;
  },

  // Get vendor-specific analytics
  getVendorAnalytics: async (vendorId: number): Promise<VendorAnalytics> => {
    const response = await api.get(`/api/analytics/vendor/${vendorId}`);
    return response.data;
  },

  // Get system metrics (Admin only)
  getSystemMetrics: async (): Promise<SystemMetrics> => {
    const response = await api.get('/api/analytics/system-metrics');
    return response.data;
  },

  // Format memory size for display
  formatMemorySize: (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    const gb = mb / 1024;
    
    if (gb > 1) {
      return `${gb.toFixed(2)} GB`;
    } else {
      return `${mb.toFixed(2)} MB`;
    }
  },

  // Calculate memory usage percentage
  getMemoryUsagePercentage: (metrics: SystemMetrics): number => {
    return (metrics.usedMemory / metrics.totalMemory) * 100;
  }
};
