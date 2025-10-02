import { API_CONFIG, apiRequest } from '@/config/api';

// ========== ERROR TYPES ==========
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface FormErrors {
  [key: string]: string | string[];
}

// ========== LOADING STATE MANAGEMENT ==========
export interface LoadingState {
  [key: string]: boolean;
}

class LoadingManager {
  private loadingStates: LoadingState = {};
  private subscribers: ((states: LoadingState) => void)[] = [];

  setLoading(key: string, isLoading: boolean) {
    this.loadingStates[key] = isLoading;
    this.notifySubscribers();
  }

  getLoading(key: string): boolean {
    return this.loadingStates[key] || false;
  }

  getAllLoadingStates(): LoadingState {
    return { ...this.loadingStates };
  }

  subscribe(callback: (states: LoadingState) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.getAllLoadingStates()));
  }
}

export const loadingManager = new LoadingManager();

// ========== ERROR HANDLING UTILITIES ==========
export class ApiErrorHandler {
  static createError(error: any, context?: string): ApiError {
    const timestamp = new Date().toISOString();
    
    if (error?.response) {
      // HTTP error response
      return {
        message: error.response.data?.message || error.message || 'API request failed',
        status: error.response.status,
        code: error.response.data?.code || `HTTP_${error.response.status}`,
        details: error.response.data,
        timestamp
      };
    } else if (error?.request) {
      // Network error
      return {
        message: 'Network error - please check your connection',
        status: 0,
        code: 'NETWORK_ERROR',
        details: { context },
        timestamp
      };
    } else {
      // Other error
      return {
        message: error?.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        details: { context, originalError: error },
        timestamp
      };
    }
  }

  static handleError(error: any, context?: string): void {
    const apiError = this.createError(error, context);
    console.error('API Error:', apiError);
    
    // You can extend this to send errors to monitoring service
    // Example: errorReportingService.reportError(apiError);
    
    // Show user-friendly error message
    this.showUserFriendlyError(apiError);
  }

  static showUserFriendlyError(error: ApiError): void {
    let userMessage = '';
    
    switch (error.status) {
      case 400:
        userMessage = 'Invalid request. Please check your input and try again.';
        break;
      case 401:
        userMessage = 'Authentication required. Please log in and try again.';
        break;
      case 403:
        userMessage = 'Access denied. You don\'t have permission to perform this action.';
        break;
      case 404:
        userMessage = 'The requested resource was not found.';
        break;
      case 409:
        userMessage = 'Conflict detected. The resource already exists or has been modified.';
        break;
      case 422:
        userMessage = 'Validation failed. Please check your input.';
        break;
      case 429:
        userMessage = 'Too many requests. Please wait a moment and try again.';
        break;
      case 500:
        userMessage = 'Server error. Please try again later.';
        break;
      case 503:
        userMessage = 'Service temporarily unavailable. Please try again later.';
        break;
      default:
        userMessage = error.message || 'An unexpected error occurred.';
    }

    // You can integrate with your toast/notification system here
    // Example: toast.error(userMessage);
    console.warn('User Error Message:', userMessage);
  }
}

// ========== INPUT VALIDATION ==========
export class InputValidator {
  static isRequired(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }

  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isPhone(phone: string): boolean {
    // Indian phone number validation (10 digits, optionally with +91)
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }

  static isValidLength(value: string, min: number, max: number): boolean {
    return value.length >= min && value.length <= max;
  }

  static isPositiveNumber(value: any): boolean {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }

  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isValidGST(gst: string): boolean {
    // GST format: 15 characters (2 state code + 10 PAN + 1 entity code + Z + 1 checksum)
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  }

  static isValidPAN(pan: string): boolean {
    // PAN format: 5 letters + 4 digits + 1 letter
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  }

  static validateBuyerData(data: any): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!this.isRequired(data.businessName)) {
      errors.push({ field: 'businessName', message: 'Business name is required' });
    } else if (!this.isValidLength(data.businessName, 2, 100)) {
      errors.push({ field: 'businessName', message: 'Business name must be between 2 and 100 characters' });
    }

    if (!this.isRequired(data.email)) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!this.isEmail(data.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    if (!this.isRequired(data.phone)) {
      errors.push({ field: 'phone', message: 'Phone number is required' });
    } else if (!this.isPhone(data.phone)) {
      errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
    }

    if (!this.isRequired(data.contactPersonName)) {
      errors.push({ field: 'contactPersonName', message: 'Contact person name is required' });
    }

    return errors;
  }

  static validateVendorData(data: any): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!this.isRequired(data.vendorName)) {
      errors.push({ field: 'vendorName', message: 'Vendor name is required' });
    }

    if (!this.isRequired(data.businessName)) {
      errors.push({ field: 'businessName', message: 'Business name is required' });
    }

    if (!this.isRequired(data.email)) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!this.isEmail(data.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    if (!this.isRequired(data.phone)) {
      errors.push({ field: 'phone', message: 'Phone number is required' });
    } else if (!this.isPhone(data.phone)) {
      errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
    }

    if (data.establishedYear && !this.isPositiveNumber(data.establishedYear)) {
      errors.push({ field: 'establishedYear', message: 'Please enter a valid established year' });
    }

    if (data.website && !this.isValidUrl(data.website)) {
      errors.push({ field: 'website', message: 'Please enter a valid website URL' });
    }

    return errors;
  }

  static validateUserData(data: any): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!this.isRequired(data.name)) {
      errors.push({ field: 'name', message: 'Name is required' });
    } else if (!this.isValidLength(data.name, 2, 50)) {
      errors.push({ field: 'name', message: 'Name must be between 2 and 50 characters' });
    }

    if (!this.isRequired(data.email)) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!this.isEmail(data.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    if (data.phone && !this.isPhone(data.phone)) {
      errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
    }

    return errors;
  }

  static convertToFormErrors(validationErrors: ValidationError[]): FormErrors {
    const formErrors: FormErrors = {};
    validationErrors.forEach(error => {
      if (formErrors[error.field]) {
        if (Array.isArray(formErrors[error.field])) {
          (formErrors[error.field] as string[]).push(error.message);
        } else {
          formErrors[error.field] = [formErrors[error.field] as string, error.message];
        }
      } else {
        formErrors[error.field] = error.message;
      }
    });
    return formErrors;
  }
}

// ========== ENHANCED API WRAPPER ==========
export interface ApiCallOptions {
  loadingKey?: string;
  skipErrorHandling?: boolean;
  validateInput?: (data: any) => ValidationError[];
  retries?: number;
  retryDelay?: number;
}

export class EnhancedApiService {
  static async makeApiCall<T>(
    apiFunction: () => Promise<T>,
    options: ApiCallOptions = {}
  ): Promise<T> {
    const {
      loadingKey,
      skipErrorHandling = false,
      validateInput,
      retries = 0,
      retryDelay = 1000
    } = options;

    // Set loading state
    if (loadingKey) {
      loadingManager.setLoading(loadingKey, true);
    }

    let lastError: any;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await apiFunction();
        
        // Clear loading state on success
        if (loadingKey) {
          loadingManager.setLoading(loadingKey, false);
        }
        
        return result;
      } catch (error) {
        lastError = error;
        
        // If this is not the last attempt, wait before retrying
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
        
        // Handle error on final attempt
        if (!skipErrorHandling) {
          ApiErrorHandler.handleError(error, loadingKey);
        }
        
        // Clear loading state on error
        if (loadingKey) {
          loadingManager.setLoading(loadingKey, false);
        }
        
        throw lastError;
      }
    }

    throw lastError;
  }

  static async validateAndCall<T>(
    data: any,
    validator: (data: any) => ValidationError[],
    apiFunction: () => Promise<T>,
    options: ApiCallOptions = {}
  ): Promise<T> {
    // Validate input
    const validationErrors = validator(data);
    if (validationErrors.length > 0) {
      const formErrors = InputValidator.convertToFormErrors(validationErrors);
      throw new Error(`Validation failed: ${JSON.stringify(formErrors)}`);
    }

    return this.makeApiCall(apiFunction, options);
  }
}

// ========== HEALTH CHECK UTILITIES ==========
export class HealthCheckService {
  static async checkBackendHealth(): Promise<{ healthy: boolean; message: string; latency?: number }> {
    const startTime = Date.now();
    
    try {
      const response = await apiRequest<any>(API_CONFIG.ENDPOINTS.HEALTH, {
        method: 'GET'
      }, false);
      
      const latency = Date.now() - startTime;
      
      return {
        healthy: true,
        message: 'Backend is healthy',
        latency
      };
    } catch (error: any) {
      console.error('Health check failed:', error);
      
      let message = 'Backend is not responding';
      if (error.message?.includes('ECONNREFUSED')) {
        message = `Backend server is not running on ${API_CONFIG.BASE_URL}`;
      } else if (error.message?.includes('timeout')) {
        message = 'Backend response timeout';
      }
      
      return {
        healthy: false,
        message,
        latency: Date.now() - startTime
      };
    }
  }

  static async checkAllServicesHealth(): Promise<{
    backend: boolean;
    auth: boolean;
    services: Record<string, boolean>;
    overallHealth: boolean;
  }> {
    const results = {
      backend: false,
      auth: false,
      services: {} as Record<string, boolean>,
      overallHealth: false
    };

    try {
      // Check backend health
      const backendHealth = await this.checkBackendHealth();
      results.backend = backendHealth.healthy;
      results.auth = backendHealth.healthy;

      // Check individual services if backend is healthy
      if (results.backend) {
        const serviceChecks = [
          { name: 'users', endpoint: '/api/users/count' },
          { name: 'vendors', endpoint: '/api/v1/vendors/statistics/count' },
          { name: 'categories', endpoint: '/api/categories' },
          { name: 'cities', endpoint: '/api/cities' }
        ];

        await Promise.all(
          serviceChecks.map(async (service) => {
            try {
              await apiRequest(service.endpoint, { method: 'GET' }, true);
              results.services[service.name] = true;
            } catch (error) {
              console.warn(`Service ${service.name} health check failed:`, error);
              results.services[service.name] = false;
            }
          })
        );
      }

      // Calculate overall health
      const serviceHealthValues = Object.values(results.services);
      const allServicesHealthy = serviceHealthValues.every(healthy => healthy);
      results.overallHealth = results.backend && results.auth && allServicesHealthy;

    } catch (error) {
      console.error('Health check failed:', error);
    }

    return results;
  }
}

// ========== UTILITY FUNCTIONS ==========
export const apiUtils = {
  // Format validation errors for display
  formatValidationErrors: (errors: ValidationError[]): string => {
    return errors.map(error => `${error.field}: ${error.message}`).join(', ');
  },

  // Check if error is a specific HTTP status
  isHttpError: (error: any, status: number): boolean => {
    return error?.response?.status === status;
  },

  // Extract error message from various error formats
  extractErrorMessage: (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;
    return 'An unexpected error occurred';
  },

  // Create loading key for consistent naming
  createLoadingKey: (...parts: (string | number)[]): string => {
    return parts.filter(Boolean).join('_');
  },

  // Debounce function for API calls
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  // Throttle function for API calls
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Export all utilities
export {
  ApiErrorHandler as errorHandler,
  InputValidator as validator,
  EnhancedApiService as apiService,
  HealthCheckService as healthCheck,
  LoadingManager
};
