/**
 * Enhanced API Client Integration
 * ==============================
 * 
 * This file integrates the enhanced API client with backward compatibility
 * for existing code while providing advanced features like retry logic,
 * monitoring, and improved error handling.
 */

import { api as enhancedApi, checkApiHealth } from '../config/enhanced-api-client';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '../types/api';

// Helper function to handle API errors (enhanced)
export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || error.response.data || 'An error occurred',
      status: error.response.status,
      data: error.response.data,
      timestamp: new Date().toISOString(),
      url: error.config?.url,
      method: error.config?.method
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Network error. Please check your internet connection.',
      status: 0,
      data: null,
      timestamp: new Date().toISOString(),
      url: error.config?.url,
      method: error.config?.method
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
      data: null,
      timestamp: new Date().toISOString()
    };
  }
};

// Enhanced API object with additional features
export const api = {
  // Core HTTP methods
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    enhancedApi.get<T>(url, config),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    enhancedApi.post<T>(url, data, config),
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    enhancedApi.put<T>(url, data, config),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    enhancedApi.delete<T>(url, config),
  
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    enhancedApi.patch<T>(url, data, config),

  // Enhanced features
  isOnline: () => enhancedApi.isOnline(),
  getMetrics: () => enhancedApi.getMetrics(),
  checkHealth: checkApiHealth,

  // Utility methods
  handleError: handleApiError,
  
  // Batch operations
  batch: async (requests: Array<() => Promise<any>>) => {
    try {
      return await Promise.allSettled(requests.map(req => req()));
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Timeout wrapper
  withTimeout: <T>(promise: Promise<T>, timeout: number = 30000): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  }
};

// Legacy compatibility - create axios-like instance
const apiClient = {
  get: api.get,
  post: api.post,
  put: api.put,
  delete: api.delete,
  patch: api.patch,
  interceptors: {
    request: {
      use: () => {} // No-op for compatibility
    },
    response: {
      use: () => {} // No-op for compatibility
    }
  }
};

// Health check utility
export const testConnection = async (): Promise<boolean> => {
  try {
    return await checkApiHealth();
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};

// Export for different import styles
export { enhancedApi };
export default apiClient;
