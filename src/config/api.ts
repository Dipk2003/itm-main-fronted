// API Configuration for connecting to Spring Boot backend
export type ApiEndpointsConfig = typeof API_CONFIG.ENDPOINTS;

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://indiantradebackend.onrender.com',
  ENDPOINTS: {
    // Health check
    HEALTH: '/health',
    API_HEALTH: '/api/health',
    ACTUATOR_HEALTH: '/actuator/health',
    ROOT: '/',
    STATUS: '/status',
    
    // Authentication endpoints (Updated to match backend exactly)
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
      VERIFY_OTP: '/auth/verify-otp',
      LOGIN_OTP: '/auth/login-otp',
      VERIFY: '/auth/verify',
      SET_PASSWORD: '/auth/set-password',
      VERIFY_FORGOT_PASSWORD_OTP: '/auth/verify-forgot-password-otp',
      CHECK_EMAIL_ROLE: '/auth/check-email-role',
      CHANGE_PASSWORD: '/auth/change-password',
      // Role-specific auth endpoints
      ADMIN: {
        LOGIN: '/auth/admin/login',
        REGISTER: '/auth/admin/register'
      },
      VENDOR: {
        LOGIN: '/auth/seller/login', // Backend uses 'seller' not 'vendor'
        REGISTER: '/auth/vendor/register'
      },
      SELLER: {
        LOGIN: '/auth/seller/login',
        REGISTER: '/auth/vendor/register'
      },
      USER: {
        LOGIN: '/auth/login' // Backend doesn't have /auth/user/login, use general login
      },
      BUYER: {
        LOGIN: '/auth/buyer/login',
        REGISTER: '/auth/buyer/register'
      },
      EMPLOYEE: {
        LOGIN: '/auth/employee/login',
        REGISTER: '/auth/employee/register'
      },
      SUPPORT: {
        LOGIN: '/auth/support/login',
        REGISTER: '/auth/support/register'
      },
      CTO: {
        LOGIN: '/auth/cto/login',
        REGISTER: '/auth/cto/register'
      },
      DATA_ENTRY: {
        LOGIN: '/auth/data-entry/login',
        REGISTER: '/auth/data-entry/register'
      }
    },
    
    // User Management endpoints
    USERS: {
      BASE: '/api/users',
      BY_ROLE: '/api/users/role',
      BY_ID: '/api/users',
      BY_EMAIL: '/api/users/email',
      BY_PHONE: '/api/users/phone',
      VERIFIED: '/api/users/verified',
      UNVERIFIED: '/api/users/unverified',
      ACTIVE: '/api/users/active',
      INACTIVE: '/api/users/inactive',
      ACTIVATE: '/api/users',
      DEACTIVATE: '/api/users',
      COUNT: '/api/users/count',
      COUNT_BY_ROLE: '/api/users/count/role',
      EXISTS_EMAIL: '/api/users/exists/email',
      EXISTS_PHONE: '/api/users/exists/phone',
      REGULAR: '/api/users/regular'
    },
    COMPANIES: '/api/companies',
    
    // Buyer Module endpoints
    BUYERS: {
      BASE: '/api/buyers',
      PROFILE: '/api/buyers/profile',
      ORDERS: '/api/buyers/orders',
      CART: '/api/buyers/cart',
      WISHLIST: '/api/buyers/wishlist',
      INQUIRIES: '/api/buyers/inquiries',
      QUOTES: '/api/buyers/quotes',
      REVIEWS: '/api/buyers/reviews'
    },
    
    // Vendor Module endpoints
    VENDORS: {
      BASE: '/api/v1/vendors',
      PROFILE: '/api/vendors/profile',
      PRODUCTS: '/api/vendors/products',
      ORDERS: '/api/vendors/orders',
      ANALYTICS: '/api/vendors/analytics',
      LEADS: '/api/vendors/leads',
      DASHBOARD: '/api/vendors/dashboard',
      SEARCH: '/api/v1/vendors/search',
      FILTER: '/api/v1/vendors/filter',
      VERIFY: '/api/v1/vendors/verify',
      KYC: '/api/v1/vendors',
      KYC_PENDING: '/api/v1/vendors/kyc/pending',
      APPROVAL_PENDING: '/api/v1/vendors/approval/pending',
      BY_STATUS: '/api/v1/vendors/status',
      UPDATE_STATUS: '/api/v1/vendors',
      ACTIVATE: '/api/v1/vendors',
      DEACTIVATE: '/api/v1/vendors',
      SUSPEND: '/api/v1/vendors'
    },
    
    // Product Management endpoints
    PRODUCTS: {
      BASE: '/api/products',
      SEARCH: '/api/products/search',
      SEARCH_SUGGESTIONS: '/api/products/search/suggestions',
      CATEGORIES: '/api/products/categories',
      BY_VENDOR: '/api/products/vendor',
      BY_CATEGORY: '/api/products/category',
      FEATURED: '/api/products/featured',
      TRENDING: '/api/products/trending',
      DATA_ENTRY: '/api/products/data-entry'
    },
    
    // Category Management endpoints
    CATEGORIES: {
      BASE: '/api/categories',
      ACTIVE: '/api/categories/active',
      ROOT: '/api/categories/root',
      VENDOR_VISIBLE: '/api/categories/vendor-visible',
      CUSTOMER_VISIBLE: '/api/categories/customer-visible',
      HIERARCHY: '/api/categories/hierarchy',
      SUBCATEGORIES: '/api/categories', // /{parentId}/subcategories
      SEARCH: '/api/categories/search',
      STATISTICS: '/api/categories/statistics',
      POPULAR: '/api/categories/popular',
      PATH: '/api/categories', // /{id}/path
      VISIBILITY: '/api/categories', // /{id}/visibility
      TOGGLE_STATUS: '/api/categories', // /{id}/toggle-status
      BULK_VISIBILITY: '/api/categories/bulk/visibility',
      STATS: '/api/categories/stats',
      MICROCATEGORIES: '/api/categories/microcategories'
    },
    
    // Data Entry API endpoints (Employee module)
    DATA_ENTRY: {
      CATEGORIES: '/api/dataentry/categories',
      SUBCATEGORIES: '/api/dataentry/subcategories',
      MICROCATEGORIES: '/api/dataentry/microcategories',
      PRODUCTS: '/api/dataentry/products',
      ANALYTICS: '/api/dataentry/analytics',
      CATEGORY_STATS: '/api/dataentry/categories/stats'
    },
    
    // Cart endpoints
    CART: {
      BASE: '/api/cart',
      ADD: '/api/cart/add',
      ITEM: '/api/cart/item', // For update/remove item by ID
      CLEAR: '/api/cart/clear'
    },
    
    // Order Management endpoints
    ORDERS: {
      BASE: '/api/orders',
      CHECKOUT: '/api/orders/checkout',
      VERIFY_PAYMENT: '/api/orders/verify-payment',
      MY_ORDERS: '/api/orders/my-orders',
      MY_ORDERS_PAGINATED: '/api/orders/my-orders/paginated',
      BY_NUMBER: '/api/orders/number',
      VENDOR_ORDERS: '/api/orders/vendor/my-orders',
      VENDOR_ORDERS_PAGINATED: '/api/orders/vendor/my-orders/paginated',
      BY_BUYER: '/api/orders/buyer',
      BY_VENDOR: '/api/orders/vendor',
      STATUS_UPDATE: '/api/orders',
      TRACKING: '/api/orders/tracking'
    },
    
    // Payment endpoints
    PAYMENTS: {
      BASE: '/api/payments',
      RAZORPAY: '/api/payments/razorpay',
      WEBHOOK: '/api/payments/webhook',
      SUBSCRIPTION_PLANS: '/api/payments/subscription-plans',
      BY_VENDOR: '/api/payments/vendor', // /api/payments/vendor/{vendorId}
      SUBSCRIPTIONS: '/api/payments/subscriptions',
      INVOICES: '/api/payments/invoices'
    },
    
    // Support endpoints
    SUPPORT: {
      TICKETS: '/api/support/tickets',
      CHAT: '/api/support/chat',
      CHATBOT: '/api/support/chatbot',
      KNOWLEDGE_BASE: '/api/support/knowledge-base'
    },
    
    // Analytics endpoints
    ANALYTICS: {
      DASHBOARD: '/api/analytics/dashboard',
      ADMIN: '/api/analytics/admin',
      VENDOR: '/api/analytics/vendor',
      BUYER: '/api/analytics/buyer',
      DASHBOARD_ANALYTICS: '/api/analytics/dashboard-analytics',
      CATEGORY_STATS: '/api/analytics/category-stats',
      // Admin Analytics
      ADMIN_DASHBOARD: '/api/admin/analytics/dashboard',
      ADMIN_GROWTH: '/api/admin/analytics/growth',
      ADMIN_REVENUE: '/api/admin/analytics/revenue',
      ADMIN_USERS: '/api/admin/analytics/users',
      ADMIN_VENDORS: '/api/admin/analytics/vendors',
      ADMIN_PRODUCTS: '/api/admin/analytics/products'
    },
    
    // Admin endpoints
    ADMIN: {
      USERS: '/api/admin/users',
      VENDORS: '/api/admin/vendors',
      BUYERS: '/api/admin/buyers',
      PRODUCTS: '/api/admin/products',
      ORDERS: '/api/admin/orders',
      ANALYTICS: '/api/admin/analytics',
      CONTENT: '/api/admin/content',
      SETTINGS: '/api/admin/settings',
      KYC: '/api/admin/kyc',
      LEADS: '/api/admin/leads'
    },
    
    // File Upload endpoints
    FILES: {
      UPLOAD: '/api/files/upload',
      DELETE: '/api/files/delete',
      DOWNLOAD: '/api/files/download'
    },
    
    // Directory/Service Provider endpoints
    DIRECTORY: {
      PROVIDERS: '/api/directory/providers',
      SEARCH: '/api/directory/search',
      INQUIRIES: '/api/directory/inquiries'
    },
    
    // City/Location endpoints
    CITIES: {
      BASE: '/api/cities',
      PUBLIC: '/api/public/cities',
      DATA_ENTRY: '/api/dataentry/cities',
      SEARCH: '/api/cities/search',
      DROPDOWN: '/api/cities/dropdown',
      COUNTRIES: '/api/cities/countries',
      STATES: '/api/cities/states',
      NEARBY: '/api/cities/nearby',
      STATISTICS: '/api/cities/statistics',
      TOGGLE_ACTIVE: '/api/cities'
    },
    
    // Lead Management endpoints
    LEADS: {
      BASE: '/api/leads',
      BY_VENDOR: '/api/leads/vendor',
      BY_VENDOR_STATUS: '/api/leads/vendor',
      BY_VENDOR_PRIORITY: '/api/leads/vendor',
      UPDATE_STATUS: '/api/leads',
      UPDATE_PRIORITY: '/api/leads',
      ADD_NOTES: '/api/leads',
      OVERDUE: '/api/leads/vendor',
      RECENT: '/api/leads/vendor',
      STATS: '/api/leads/vendor',
      SEARCH: '/api/leads/vendor',
      DUPLICATES: '/api/leads/duplicates',
      STATUSES: '/api/leads/statuses',
      PRIORITIES: '/api/leads/priorities'
    },
    
    // Content Management endpoints
    CONTENT: {
      BANNERS: '/api/content/banners',
      SEO_KEYWORDS: '/api/content/seo-keywords',
      CAMPAIGNS: '/api/content/campaigns',
      COUPONS: '/api/content/coupons',
      VALIDATE_COUPON: '/api/content/coupons/validate'
    },
    
    // Admins endpoints
    ADMINS: {
      BASE: '/api/admins',
      BY_EMAIL: '/api/admins/email',
      BY_PHONE: '/api/admins/phone',
      ACTIVE: '/api/admins/active',
      INACTIVE: '/api/admins/inactive',
      VERIFIED: '/api/admins/verified',
      UNVERIFIED: '/api/admins/unverified',
      BY_DEPARTMENT: '/api/admins/department',
      ACTIVATE: '/api/admins',
      DEACTIVATE: '/api/admins',
      COUNT: '/api/admins/count',
      EXISTS_EMAIL: '/api/admins/exists/email',
      EXISTS_PHONE: '/api/admins/exists/phone'
    },
    
    // Chatbot endpoints
    CHATBOT: {
      ANALYTICS: '/admin/chatbot/analytics',
      CONVERSATIONS: '/admin/chatbot/conversations',
      CONVERSATION: '/admin/chatbot/conversation',
      RECENT_QUERIES: '/admin/chatbot/recent-queries'
    },
    
    // Location endpoints (legacy compatibility)
    LOCATIONS: {
      CITIES: '/api/locations/cities',
      STATES: '/api/locations/states',
      COUNTRIES: '/api/locations/countries'
    },
    
    // Excel Import endpoints
    EXCEL: {
      IMPORT: '/api/excel/import',
      TEMPLATE: '/api/excel/template',
      STATUS: '/api/excel/status'
    }
  }
};

// Helper function to build full URLs
export const buildApiUrl = (endpoint: string, params?: Record<string, any>): string => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return url;
};

// Common request headers
export const getHeaders = (includeAuth: boolean = false): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (includeAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// API request helper with intelligent HTTPS/HTTP fallback
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth: boolean = false,
  setJsonHeaders: boolean = true
): Promise<T> => {
  const baseUrl = API_CONFIG.BASE_URL;
  const fullEndpoint = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
  
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...(setJsonHeaders ? getHeaders(includeAuth) : includeAuth ? { 'Authorization': getHeaders(true)['Authorization'] } : {}),
      ...options.headers,
    },
    signal: controller.signal,
  };
  
  // Try HTTPS first, then fallback to HTTP
  const urlsToTry = [
    fullEndpoint, // Try configured URL first
    fullEndpoint.replace('https://', 'http://'), // Fallback to HTTP if HTTPS fails
  ];
  
  let lastError: Error;
  
  for (const url of urlsToTry) {
    try {
      console.log(`🌐 Attempting API call to: ${url}`);
      
      const response = await fetch(url, config);
      
      // Check if backend is returning 502 Bad Gateway
      if (response.status === 502) {
        console.warn(`⚠️ Backend returning 502 Bad Gateway from: ${url}`);
        throw new Error(`Backend service unavailable (502 Bad Gateway)`);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} from ${url}`);
      }
      console.log(`\u2705 API call successful to: ${url}`);
      clearTimeout(timeoutId); // Clear timeout on successful response
      
      // Handle empty responses (like 204 No Content from DELETE operations)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return undefined as T;
      }
      
      // Try to parse JSON, but handle empty responses gracefully
      const text = await response.text();
      if (!text) {
        return undefined as T;
      }
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.warn('Could not parse response as JSON:', text);
        return text as T;
      }
      
    } catch (error) {
      console.error(`❌ API call failed to ${url}:`, error);
      lastError = error as Error;
      continue; // Try next URL
    }
  }
  
  // If all URLs failed, throw the last error
  throw new Error(`All API endpoints failed. Last error: ${lastError?.message || 'Unknown error'}. Please check if your backend server is running.`);
};
