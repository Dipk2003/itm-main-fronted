// Master API Services Export
// This file provides easy access to all API services

// ========== AUTHENTICATION & USER MANAGEMENT ==========
export * from './authService';
export * from './userService';
export { userManagementService, UserManagementService } from './userManagementService';
export * from './buyerService';

// ========== CORE BUSINESS LOGIC ==========
export * from './productService';
export * from './vendorService';
export * from './categoryService';
export * from './cityService';

// ========== EXISTING SERVICES ==========
// Re-export aiRecommendationService with explicit aliases to avoid conflicts
export { aiRecommendationService } from './aiRecommendationService';
export type {
  UserProfile as AIUserProfile,
  ProductRecommendation,
  VendorRecommendation,
  PriceOptimization,
  SmartInsights,
  MLModelMetrics
} from './aiRecommendationService';
export * from './i18nService';
export * from './paymentService';
export * from './searchService';
export * from './shippingService';
export * from './supportingServices';

// ========== SERVICE INSTANCES ==========
// Import all service instances for centralized access
import { authService } from './authService';
import { userService } from './userService';
import { userManagementService } from './userManagementService';
import { buyerService } from './buyerService';
import { productService } from './productService';
import { vendorService } from './vendorService';
import { categoryService } from './categoryService';
import { cityService } from './cityService';
import {
  analyticsService,
  adminService,
  fileService,
  supportService,
  contentService,
  leadService,
  chatbotService
} from './supportingServices';

// Create a centralized API services object
export const apiServices = {
  auth: authService,
  user: userService,
  userManagement: userManagementService,
  buyer: buyerService,
  product: productService,
  vendor: vendorService,
  category: categoryService,
  city: cityService,
  analytics: analyticsService,
  admin: adminService,
  file: fileService,
  support: supportService,
  content: contentService,
  lead: leadService,
  chatbot: chatbotService,
};

// ========== API HEALTH CHECK ==========
export const checkAllServicesHealth = async () => {
  const results = {
    backend: false,
    auth: false,
    services: {} as Record<string, boolean>
  };

  try {
    // Check backend health
    const backendHealth = await authService.checkBackendHealth();
    results.backend = backendHealth.healthy;
    results.auth = backendHealth.healthy;

    // Check individual services
    const serviceChecks = [
      { name: 'products', check: () => productService.getFeaturedProducts(1) },
      { name: 'categories', check: () => categoryService.getActiveCategories() },
      { name: 'cities', check: () => cityService.getMajorCities() },
      { name: 'vendors', check: () => vendorService.getVendors({ size: 1 }) }
    ];

    for (const service of serviceChecks) {
      try {
        await service.check();
        results.services[service.name] = true;
      } catch (error) {
        console.warn(`Service ${service.name} health check failed:`, error);
        results.services[service.name] = false;
      }
    }

  } catch (error) {
    console.error('Health check failed:', error);
  }

  return results;
};

// ========== COMMON API PATTERNS ==========

/**
 * Generic search function that works across services
 */
export const searchAcrossServices = async (query: string, options: {
  includeProducts?: boolean;
  includeVendors?: boolean;
  includeCategories?: boolean;
  includeCities?: boolean;
  limit?: number;
} = {}) => {
  const {
    includeProducts = true,
    includeVendors = true,
    includeCategories = true,
    includeCities = true,
    limit = 10
  } = options;

  const results = {
    products: [] as any[],
    vendors: [] as any[],
    categories: [] as any[],
    cities: [] as any[]
  };

  const searchPromises = [];

  if (includeProducts) {
    searchPromises.push(
      productService.searchProducts({ query, size: limit })
        .then(response => results.products = response.content)
        .catch(error => console.warn('Product search failed:', error))
    );
  }

  if (includeVendors) {
    searchPromises.push(
      vendorService.searchVendors({ searchTerm: query, size: limit })
        .then(response => results.vendors = response.content)
        .catch(error => console.warn('Vendor search failed:', error))
    );
  }

  if (includeCategories) {
    searchPromises.push(
      categoryService.searchCategories(query, { size: limit })
        .then(categories => results.categories = categories)
        .catch(error => console.warn('Category search failed:', error))
    );
  }

  if (includeCities) {
    searchPromises.push(
      cityService.findCitiesByName(query)
        .then(cities => results.cities = cities.slice(0, limit))
        .catch(error => console.warn('City search failed:', error))
    );
  }

  await Promise.all(searchPromises);
  return results;
};

/**
 * Get dashboard data for different user types
 */
export const getDashboardData = async (userRole: string, userId?: string) => {
  const dashboardData: any = {
    userRole,
    timestamp: new Date().toISOString()
  };

  try {
    switch (userRole.toLowerCase()) {
      case 'vendor':
        if (userId) {
          dashboardData.vendor = await vendorService.getVendorDashboard(userId);
          dashboardData.analytics = await vendorService.getVendorAnalytics(userId);
        }
        break;

      case 'admin':
        dashboardData.statistics = {
          users: await userService.getUserCount(),
          products: (await productService.getProducts({ size: 1 })).totalElements,
          vendors: (await vendorService.getVendors({ size: 1 })).totalElements,
          cities: (await cityService.getCities({ size: 1 })).totalElements
        };
        break;

      default:
        // Regular user dashboard
        dashboardData.featuredProducts = await productService.getFeaturedProducts(8);
        dashboardData.categories = await categoryService.getActiveCategories();
        break;
    }
  } catch (error) {
    console.error('Dashboard data fetch failed:', error);
    dashboardData.error = 'Failed to load dashboard data';
  }

  return dashboardData;
};

/**
 * Batch operations helper
 */
export const batchOperations = {
  /**
   * Get multiple products by IDs
   */
  async getProductsByIds(productIds: (string | number)[]): Promise<any[]> {
    const promises = productIds.map(id => 
      productService.getProductById(id).catch(error => {
        console.warn(`Failed to fetch product ${id}:`, error);
        return null;
      })
    );
    const results = await Promise.all(promises);
    return results.filter(Boolean);
  },

  /**
   * Get multiple vendors by IDs
   */
  async getVendorsByIds(vendorIds: (string | number)[]): Promise<any[]> {
    const promises = vendorIds.map(id => 
      vendorService.getVendorById(id).catch(error => {
        console.warn(`Failed to fetch vendor ${id}:`, error);
        return null;
      })
    );
    const results = await Promise.all(promises);
    return results.filter(Boolean);
  },

  /**
   * Get multiple cities by IDs
   */
  async getCitiesByIds(cityIds: (string | number)[]): Promise<any[]> {
    const promises = cityIds.map(id => 
      cityService.getCityById(id).catch(error => {
        console.warn(`Failed to fetch city ${id}:`, error);
        return null;
      })
    );
    const results = await Promise.all(promises);
    return results.filter(Boolean);
  }
};

// ========== ERROR HANDLING UTILITIES ==========

/**
 * Retry wrapper for API calls
 */
export const withRetry = async <T>(
  apiCall: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: any;

  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      console.warn(`API call attempt ${i + 1} failed:`, error);
      
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
};

/**
 * Cache wrapper for API calls
 */
const cache = new Map<string, { data: any; expiry: number }>();

export const withCache = async <T>(
  key: string,
  apiCall: () => Promise<T>,
  ttlMs = 5 * 60 * 1000 // 5 minutes
): Promise<T> => {
  const cached = cache.get(key);
  const now = Date.now();

  if (cached && cached.expiry > now) {
    return cached.data;
  }

  const data = await apiCall();
  cache.set(key, { data, expiry: now + ttlMs });
  return data;
};

// Default export for the centralized services object
export default apiServices;
