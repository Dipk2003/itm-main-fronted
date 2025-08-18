// API Configuration for connecting to Spring Boot backend
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  ENDPOINTS: {
    // Data Entry API endpoints
    CATEGORIES: '/api/dataentry/categories',
    SUBCATEGORIES: '/api/dataentry/subcategories',
    MICROCATEGORIES: '/api/dataentry/microcategories',
    PRODUCTS: '/api/dataentry/products',
    DASHBOARD_ANALYTICS: '/api/dataentry/analytics',
    CATEGORY_STATS: '/api/dataentry/categories/stats',
    
    // Authentication endpoints
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout'
    },
    
    // Vendor endpoints
    VENDORS: '/api/vendors',
    
    // Product search endpoints
    SEARCH: '/api/search',
    PRODUCTS_SEARCH: '/api/products/search'
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
  includeAuth: boolean = false
): Promise<T> => {
  const baseUrl = API_CONFIG.BASE_URL;
  const fullEndpoint = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...getHeaders(includeAuth),
      ...options.headers,
    },
    timeout: 15000, // 15 second timeout
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
      
      console.log(`✅ API call successful to: ${url}`);
      
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
