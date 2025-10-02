/**
 * Enterprise-Grade API Client
 * 
 * Built with 50+ years of full-stack experience
 * Implements industry best practices for scalable, maintainable API integration
 */

import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError,
  InternalAxiosRequestConfig 
} from 'axios';

// Extend InternalAxiosRequestConfig to include our custom properties
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
  requestId?: string;
  metadata?: any;
}
import { EventEmitter } from 'events';

// ========== CORE TYPES ==========
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  enableCaching?: boolean;
  enableRequestDeduplication?: boolean;
  enableMetrics?: boolean;
  authTokenKey?: string;
  refreshTokenKey?: string;
  apiVersion?: string;
  environment?: 'development' | 'staging' | 'production';
}

export interface ApiRequest<T = any> {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  config?: AxiosRequestConfig;
  cacheKey?: string;
  cacheTTL?: number;
  skipAuth?: boolean;
  skipRetry?: boolean;
  skipDeduplication?: boolean;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: AxiosRequestConfig;
  cached?: boolean;
  requestId?: string;
  duration?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  requestId?: string;
  timestamp: Date;
  endpoint?: string;
  method?: string;
  stack?: string;
}

// ========== INTERCEPTOR TYPES ==========
export interface RequestInterceptor {
  name: string;
  priority: number;
  onRequest: (config: CustomInternalAxiosRequestConfig) => Promise<CustomInternalAxiosRequestConfig>;
  onError?: (error: any) => Promise<any>;
}

export interface ResponseInterceptor {
  name: string;
  priority: number;
  onResponse: (response: AxiosResponse) => Promise<AxiosResponse>;
  onError?: (error: AxiosError) => Promise<any>;
}

// ========== CACHE INTERFACE ==========
export interface CacheProvider {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
}

// ========== METRICS INTERFACE ==========
export interface MetricsCollector {
  recordRequest(endpoint: string, method: string, duration: number, status: number): void;
  recordError(error: ApiError): void;
  recordCacheHit(key: string): void;
  recordCacheMiss(key: string): void;
  getMetrics(): any;
}

// ========== DEFAULT IMPLEMENTATIONS ==========
class MemoryCache implements CacheProvider {
  private cache = new Map<string, { value: any; expires: number }>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  async set<T>(key: string, value: T, ttl = 300000): Promise<void> {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async has(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expires) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }
}

class DefaultMetricsCollector implements MetricsCollector {
  private metrics = {
    requests: new Map<string, { count: number; totalDuration: number; errors: number }>(),
    errors: [] as ApiError[],
    cacheHits: 0,
    cacheMisses: 0
  };

  recordRequest(endpoint: string, method: string, duration: number, status: number): void {
    const key = `${method} ${endpoint}`;
    const current = this.metrics.requests.get(key) || { count: 0, totalDuration: 0, errors: 0 };
    
    this.metrics.requests.set(key, {
      count: current.count + 1,
      totalDuration: current.totalDuration + duration,
      errors: status >= 400 ? current.errors + 1 : current.errors
    });
  }

  recordError(error: ApiError): void {
    this.metrics.errors.push(error);
    // Keep only last 100 errors
    if (this.metrics.errors.length > 100) {
      this.metrics.errors = this.metrics.errors.slice(-100);
    }
  }

  recordCacheHit(key: string): void {
    this.metrics.cacheHits++;
  }

  recordCacheMiss(key: string): void {
    this.metrics.cacheMisses++;
  }

  getMetrics() {
    const requestMetrics = Array.from(this.metrics.requests.entries()).map(([key, stats]) => ({
      endpoint: key,
      count: stats.count,
      averageLatency: stats.totalDuration / stats.count,
      errorRate: stats.errors / stats.count,
      ...stats
    }));

    return {
      requests: requestMetrics,
      totalRequests: requestMetrics.reduce((sum, r) => sum + r.count, 0),
      totalErrors: this.metrics.errors.length,
      cacheHitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses),
      recentErrors: this.metrics.errors.slice(-10)
    };
  }
}

// ========== ENTERPRISE API CLIENT ==========
export class EnterpriseApiClient extends EventEmitter {
  private axiosInstance: AxiosInstance;
  private config: Required<ApiClientConfig>;
  private requestInterceptors: Map<string, RequestInterceptor> = new Map();
  private responseInterceptors: Map<string, ResponseInterceptor> = new Map();
  private cache: CacheProvider;
  private metrics: MetricsCollector;
  private pendingRequests = new Map<string, Promise<any>>();
  private circuitBreaker = new Map<string, { failures: number; lastFailure: Date; isOpen: boolean }>();

  constructor(config: ApiClientConfig) {
    super();
    
    this.config = {
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      enableCaching: true,
      enableRequestDeduplication: true,
      enableMetrics: true,
      authTokenKey: 'authToken',
      refreshTokenKey: 'refreshToken',
      apiVersion: 'v1',
      environment: 'development',
      ...config
    };

    this.cache = new MemoryCache();
    this.metrics = new DefaultMetricsCollector();

    this.initializeAxiosInstance();
    this.setupDefaultInterceptors();
    this.setupCircuitBreaker();
  }

  private initializeAxiosInstance(): void {
    this.axiosInstance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Version': this.config.apiVersion,
        'X-Client-Type': 'enterprise-web',
        'X-Environment': this.config.environment
      }
    });

    // Add request ID generation
    this.axiosInstance.defaults.transformRequest = [
      (data, headers) => {
        headers['X-Request-ID'] = this.generateRequestId();
        return data;
      },
      ...axios.defaults.transformRequest as any[]
    ];
  }

  private setupDefaultInterceptors(): void {
    // Core request interceptors
    this.addRequestInterceptor({
      name: 'auth',
      priority: 100,
      onRequest: this.authInterceptor.bind(this)
    });

    this.addRequestInterceptor({
      name: 'security',
      priority: 90,
      onRequest: this.securityInterceptor.bind(this)
    });

    this.addRequestInterceptor({
      name: 'logging',
      priority: 10,
      onRequest: this.requestLoggingInterceptor.bind(this)
    });

    // Core response interceptors
    this.addResponseInterceptor({
      name: 'metrics',
      priority: 100,
      onResponse: this.metricsResponseInterceptor.bind(this),
      onError: this.metricsErrorInterceptor.bind(this)
    });

    this.addResponseInterceptor({
      name: 'error-handling',
      priority: 90,
      onResponse: (response) => Promise.resolve(response),
      onError: this.errorHandlingInterceptor.bind(this)
    });

    this.addResponseInterceptor({
      name: 'cache',
      priority: 80,
      onResponse: this.cacheResponseInterceptor.bind(this)
    });
  }

  private setupCircuitBreaker(): void {
    setInterval(() => {
      // Reset circuit breaker if enough time has passed
      const now = new Date();
      for (const [endpoint, state] of this.circuitBreaker.entries()) {
        if (state.isOpen && now.getTime() - state.lastFailure.getTime() > 60000) {
          state.failures = 0;
          state.isOpen = false;
          this.emit('circuit-breaker-closed', { endpoint });
        }
      }
    }, 30000);
  }

  // ========== INTERCEPTOR MANAGEMENT ==========
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.set(interceptor.name, interceptor);
    this.rebuildInterceptors();
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.set(interceptor.name, interceptor);
    this.rebuildInterceptors();
  }

  removeInterceptor(name: string): void {
    this.requestInterceptors.delete(name);
    this.responseInterceptors.delete(name);
    this.rebuildInterceptors();
  }

  private rebuildInterceptors(): void {
    // Clear existing interceptors
    this.axiosInstance.interceptors.request.clear();
    this.axiosInstance.interceptors.response.clear();

    // Sort and add request interceptors
    const sortedRequestInterceptors = Array.from(this.requestInterceptors.values())
      .sort((a, b) => b.priority - a.priority);

    for (const interceptor of sortedRequestInterceptors) {
      this.axiosInstance.interceptors.request.use(
        interceptor.onRequest,
        interceptor.onError
      );
    }

    // Sort and add response interceptors
    const sortedResponseInterceptors = Array.from(this.responseInterceptors.values())
      .sort((a, b) => b.priority - a.priority);

    for (const interceptor of sortedResponseInterceptors) {
      this.axiosInstance.interceptors.response.use(
        interceptor.onResponse,
        interceptor.onError
      );
    }
  }

  // ========== CORE INTERCEPTORS ==========
  private async authInterceptor(config: CustomInternalAxiosRequestConfig): Promise<CustomInternalAxiosRequestConfig> {
    if (config.skipAuth) return config;

    const token = localStorage.getItem(this.config.authTokenKey);
    if (token) {
      if (!config.headers) {
        config.headers = {} as any;
      }
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  }

  private async securityInterceptor(config: CustomInternalAxiosRequestConfig): Promise<CustomInternalAxiosRequestConfig> {
    if (!config.headers) {
      config.headers = {} as any;
    }
    
    // Add security headers
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.headers['Cache-Control'] = 'no-cache';
    
    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    return config;
  }

  private async requestLoggingInterceptor(config: CustomInternalAxiosRequestConfig): Promise<CustomInternalAxiosRequestConfig> {
    if (this.config.environment === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
        headers: config.headers
      });
    }
    
    this.emit('request-start', { config });
    return config;
  }

  private async metricsResponseInterceptor(response: AxiosResponse): Promise<AxiosResponse> {
    if (this.config.enableMetrics) {
      const duration = this.getRequestDuration(response.config);
      this.metrics.recordRequest(
        response.config.url || '',
        response.config.method?.toUpperCase() || 'GET',
        duration,
        response.status
      );
    }

    this.emit('request-success', { response });
    return response;
  }

  private async metricsErrorInterceptor(error: AxiosError): Promise<any> {
    if (this.config.enableMetrics && error.response) {
      const duration = this.getRequestDuration(error.config);
      this.metrics.recordRequest(
        error.config?.url || '',
        error.config?.method?.toUpperCase() || 'GET',
        duration,
        error.response.status
      );

      const apiError: ApiError = {
        message: error.message,
        status: error.response.status,
        code: error.code,
        details: error.response.data,
        requestId: error.config?.headers?.['X-Request-ID'] as string,
        timestamp: new Date(),
        endpoint: error.config?.url,
        method: error.config?.method?.toUpperCase()
      };

      this.metrics.recordError(apiError);
    }

    this.emit('request-error', { error });
    return Promise.reject(error);
  }

  private async errorHandlingInterceptor(error: AxiosError): Promise<any> {
    const endpoint = error.config?.url || '';
    
    // Circuit breaker logic
    const circuitState = this.circuitBreaker.get(endpoint) || { failures: 0, lastFailure: new Date(), isOpen: false };
    circuitState.failures++;
    circuitState.lastFailure = new Date();
    
    if (circuitState.failures >= 5) {
      circuitState.isOpen = true;
      this.emit('circuit-breaker-opened', { endpoint, failures: circuitState.failures });
    }
    
    this.circuitBreaker.set(endpoint, circuitState);

    // Handle specific error types
    if (error.response?.status === 401) {
      this.emit('auth-error', { error });
      await this.handleAuthError();
    } else if (error.response?.status === 429) {
      this.emit('rate-limit-error', { error });
      await this.handleRateLimitError(error);
    }

    return Promise.reject(this.transformError(error));
  }

  private async cacheResponseInterceptor(response: AxiosResponse): Promise<AxiosResponse> {
    const cacheKey = this.getCacheKey(response.config);
    if (cacheKey && response.config.method?.toLowerCase() === 'get') {
      const ttl = (response.config as any).cacheTTL || 300000; // 5 minutes default
      await this.cache.set(cacheKey, response.data, ttl);
    }
    return response;
  }

  // ========== MAIN API METHODS ==========
  async request<T = any>(request: ApiRequest): Promise<ApiResponse<T>> {
    const startTime = Date.now();
    
    // Check circuit breaker
    const circuitState = this.circuitBreaker.get(request.endpoint);
    if (circuitState?.isOpen) {
      throw new Error(`Circuit breaker is open for endpoint: ${request.endpoint}`);
    }

    // Check cache first
    if (this.config.enableCaching && request.method?.toLowerCase() === 'get') {
      const cacheKey = request.cacheKey || this.generateCacheKey(request);
      const cached = await this.cache.get<T>(cacheKey);
      
      if (cached) {
        this.metrics.recordCacheHit(cacheKey);
        return {
          data: cached,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
          cached: true,
          duration: Date.now() - startTime
        };
      } else {
        this.metrics.recordCacheMiss(cacheKey);
      }
    }

    // Request deduplication
    if (this.config.enableRequestDeduplication && !request.skipDeduplication) {
      const dedupeKey = this.generateDeduplicationKey(request);
      const existingRequest = this.pendingRequests.get(dedupeKey);
      
      if (existingRequest) {
        return existingRequest;
      }

      const requestPromise = this.executeRequest<T>(request, startTime);
      this.pendingRequests.set(dedupeKey, requestPromise);
      
      requestPromise.finally(() => {
        this.pendingRequests.delete(dedupeKey);
      });

      return requestPromise;
    }

    return this.executeRequest<T>(request, startTime);
  }

  private async executeRequest<T>(request: ApiRequest, startTime: number): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig & {
      skipAuth?: boolean;
      skipRetry?: boolean;
      cacheKey?: string;
      cacheTTL?: number;
    } = {
      method: request.method || 'GET',
      url: request.endpoint,
      data: request.data,
      params: request.params,
      headers: request.headers,
      timeout: request.timeout || this.config.timeout,
      skipAuth: request.skipAuth,
      skipRetry: request.skipRetry,
      cacheKey: request.cacheKey,
      cacheTTL: request.cacheTTL,
      ...request.config
    };

    const response = await this.executeWithRetry(config);
    
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
      config: response.config,
      requestId: response.headers['x-request-id'] || config.headers?.['X-Request-ID'],
      duration: Date.now() - startTime
    };
  }

  private async executeWithRetry(config: AxiosRequestConfig & { skipRetry?: boolean }, attempt = 1): Promise<AxiosResponse> {
    try {
      return await this.axiosInstance.request(config);
    } catch (error) {
      const shouldRetry = (
        !config.skipRetry &&
        attempt < this.config.retries &&
        this.isRetryableError(error as AxiosError)
      );

      if (shouldRetry) {
        const delay = this.calculateRetryDelay(attempt);
        await this.sleep(delay);
        return this.executeWithRetry(config, attempt + 1);
      }

      throw error;
    }
  }

  // ========== CONVENIENCE METHODS ==========
  async get<T = any>(endpoint: string, params?: any, config?: Partial<ApiRequest>): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, endpoint, method: 'GET', params });
  }

  async post<T = any>(endpoint: string, data?: any, config?: Partial<ApiRequest>): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, endpoint, method: 'POST', data });
  }

  async put<T = any>(endpoint: string, data?: any, config?: Partial<ApiRequest>): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, endpoint, method: 'PUT', data });
  }

  async patch<T = any>(endpoint: string, data?: any, config?: Partial<ApiRequest>): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, endpoint, method: 'PATCH', data });
  }

  async delete<T = any>(endpoint: string, config?: Partial<ApiRequest>): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, endpoint, method: 'DELETE' });
  }

  // ========== UTILITY METHODS ==========
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCacheKey(request: ApiRequest): string {
    const key = `${request.method || 'GET'}_${request.endpoint}`;
    if (request.params) {
      const sortedParams = Object.keys(request.params).sort().reduce((obj, key) => {
        obj[key] = request.params![key];
        return obj;
      }, {} as any);
      return `${key}_${JSON.stringify(sortedParams)}`;
    }
    return key;
  }

  private generateDeduplicationKey(request: ApiRequest): string {
    return this.generateCacheKey(request);
  }

  private getCacheKey(config: AxiosRequestConfig): string | null {
    if ((config as any).cacheKey) {
      return (config as any).cacheKey;
    }
    return null;
  }

  private getRequestDuration(config: any): number {
    const startTime = config._requestStartTime || Date.now();
    return Date.now() - startTime;
  }

  private isRetryableError(error: AxiosError): boolean {
    if (!error.response) return true; // Network errors are retryable
    
    const status = error.response.status;
    return status >= 500 || status === 429 || status === 408;
  }

  private calculateRetryDelay(attempt: number): number {
    // Exponential backoff with jitter
    const baseDelay = this.config.retryDelay;
    const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 0.1 * exponentialDelay;
    return exponentialDelay + jitter;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private transformError(error: AxiosError): ApiError {
    return {
      message: error.message,
      status: error.response?.status,
      code: error.code,
      details: error.response?.data,
      requestId: error.config?.headers?.['X-Request-ID'] as string,
      timestamp: new Date(),
      endpoint: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      stack: error.stack
    };
  }

  private async handleAuthError(): Promise<void> {
    // Attempt token refresh
    const refreshToken = localStorage.getItem(this.config.refreshTokenKey);
    if (refreshToken) {
      try {
        // Implementation would depend on your auth refresh endpoint
        // This is a placeholder
        this.emit('auth-refresh-attempted');
      } catch (error) {
        this.emit('auth-refresh-failed', { error });
        // Clear tokens and redirect to login
        localStorage.removeItem(this.config.authTokenKey);
        localStorage.removeItem(this.config.refreshTokenKey);
      }
    }
  }

  private async handleRateLimitError(error: AxiosError): Promise<void> {
    const retryAfter = error.response?.headers['retry-after'];
    if (retryAfter) {
      const delay = parseInt(retryAfter) * 1000;
      this.emit('rate-limit-delay', { delay });
      await this.sleep(delay);
    }
  }

  // ========== PUBLIC API ==========
  setCache(cache: CacheProvider): void {
    this.cache = cache;
  }

  setMetricsCollector(metrics: MetricsCollector): void {
    this.metrics = metrics;
  }

  getMetrics(): any {
    return this.metrics.getMetrics();
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCircuitBreakerState(): Map<string, any> {
    return new Map(this.circuitBreaker);
  }

  resetCircuitBreaker(endpoint?: string): void {
    if (endpoint) {
      this.circuitBreaker.delete(endpoint);
    } else {
      this.circuitBreaker.clear();
    }
  }
}

// ========== FACTORY FUNCTION ==========
export function createApiClient(config: ApiClientConfig): EnterpriseApiClient {
  return new EnterpriseApiClient(config);
}

export default EnterpriseApiClient;
