/**
 * Enterprise Monitored API Client
 * 
 * Production-grade API client with comprehensive monitoring,
 * circuit breakers, retry logic, and observability
 */

import { EnterpriseApiClient, ApiError } from '../core/ApiClient';
import { getGlobalMonitoringSystem } from '../../monitoring';
import { EventEmitter } from 'events';

// ========== ENHANCED TYPES ==========
export interface ApiMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  errorRate: number;
  circuitBreakerState: 'closed' | 'open' | 'half-open';
  retryAttempts: number;
  cacheHits: number;
  cacheMisses: number;
  rateLimitHits: number;
  slowQueries: number;
}

export interface RequestContext {
  endpoint: string;
  method: string;
  userId?: string;
  sessionId?: string;
  businessContext?: {
    operation: string;
    entityType: string;
    entityId?: string;
  };
  priority: 'low' | 'normal' | 'high' | 'critical';
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface ApiHealthStatus {
  overall: 'healthy' | 'degraded' | 'critical';
  score: number;
  endpoints: Array<{
    path: string;
    status: 'healthy' | 'degraded' | 'critical';
    responseTime: number;
    errorRate: number;
    lastChecked: Date;
  }>;
  circuitBreakers: Array<{
    endpoint: string;
    state: 'closed' | 'open' | 'half-open';
    failureCount: number;
    lastFailure?: Date;
  }>;
}

// ========== CIRCUIT BREAKER IMPLEMENTATION ==========
class CircuitBreaker extends EventEmitter {
  private failureCount = 0;
  private lastFailureTime?: Date;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private nextAttempt?: Date;

  constructor(
    private endpoint: string,
    private config: {
      failureThreshold: number;
      recoveryTimeout: number;
      monitorWindow: number;
    }
  ) {
    super();
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.state = 'half-open';
        this.emit('state-change', { endpoint: this.endpoint, state: 'half-open' });
      } else {
        const error = new Error('Circuit breaker is OPEN');
        (error as any).code = 'CIRCUIT_BREAKER_OPEN';
        throw error;
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    if (this.state === 'half-open') {
      this.reset();
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = new Date();

    if (this.failureCount >= this.config.failureThreshold) {
      this.trip();
    }
  }

  private trip(): void {
    this.state = 'open';
    this.nextAttempt = new Date(Date.now() + this.config.recoveryTimeout);
    this.emit('state-change', { endpoint: this.endpoint, state: 'open' });
  }

  private reset(): void {
    this.failureCount = 0;
    this.state = 'closed';
    this.lastFailureTime = undefined;
    this.nextAttempt = undefined;
    this.emit('state-change', { endpoint: this.endpoint, state: 'closed' });
  }

  private shouldAttemptReset(): boolean {
    return this.nextAttempt ? new Date() >= this.nextAttempt : false;
  }

  getState(): { 
    state: 'closed' | 'open' | 'half-open'; 
    failureCount: number; 
    lastFailure?: Date 
  } {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailure: this.lastFailureTime
    };
  }
}

// ========== RATE LIMITER ==========
class RateLimiter {
  private requests = new Map<string, Array<number>>();
  
  constructor(
    private config: {
      maxRequests: number;
      windowMs: number;
    }
  ) {}

  async checkLimit(key: string): Promise<boolean> {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(time => time > windowStart);
    
    if (validRequests.length >= this.config.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(time => time > windowStart);
    
    return Math.max(0, this.config.maxRequests - validRequests.length);
  }
}

// ========== ENHANCED CACHE MANAGER ==========
class EnhancedCacheManager {
  private cache = new Map<string, {
    data: any;
    timestamp: number;
    ttl: number;
    hits: number;
    tags: string[];
    etag?: string;
  }>();

  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    evictions: 0
  };

  constructor(
    private config: {
      maxSize: number;
      defaultTtl: number;
      cleanupInterval: number;
    }
  ) {
    // Periodic cleanup
    setInterval(() => this.cleanup(), this.config.cleanupInterval);
  }

  get(key: string): any {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    if (Date.now() > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    entry.hits++;
    this.stats.hits++;
    return entry.data;
  }

  set(key: string, data: any, options?: {
    ttl?: number;
    tags?: string[];
    etag?: string;
  }): void {
    // Evict if at capacity
    if (this.cache.size >= this.config.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: options?.ttl || this.config.defaultTtl,
      hits: 0,
      tags: options?.tags || [],
      etag: options?.etag
    });

    this.stats.sets++;
  }

  invalidateByTag(tag: string): void {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key);
      }
    }
  }

  invalidateByPattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
    };
  }

  private evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      const lastUsed = entry.timestamp - (entry.hits * 1000); // Approximate LRU
      if (lastUsed < oldestTime) {
        oldestTime = lastUsed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// ========== REQUEST QUEUE MANAGER ==========
class RequestQueueManager {
  private queues = new Map<string, Array<{
    request: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
    priority: number;
    timestamp: number;
    timeout?: number;
  }>>();

  private processing = new Set<string>();
  
  constructor(
    private config: {
      maxConcurrent: number;
      maxQueueSize: number;
      defaultTimeout: number;
    }
  ) {}

  async enqueue<T>(
    queue: string,
    request: () => Promise<T>,
    options: {
      priority?: number;
      timeout?: number;
    } = {}
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.queues.has(queue)) {
        this.queues.set(queue, []);
      }

      const queueArray = this.queues.get(queue)!;
      
      if (queueArray.length >= this.config.maxQueueSize) {
        reject(new Error('Queue is full'));
        return;
      }

      queueArray.push({
        request,
        resolve,
        reject,
        priority: options.priority || 0,
        timestamp: Date.now(),
        timeout: options.timeout || this.config.defaultTimeout
      });

      // Sort by priority (higher first)
      queueArray.sort((a, b) => b.priority - a.priority);

      this.processQueue(queue);
    });
  }

  private async processQueue(queue: string): Promise<void> {
    if (this.processing.has(queue)) {
      return;
    }

    this.processing.add(queue);

    try {
      const queueArray = this.queues.get(queue);
      if (!queueArray || queueArray.length === 0) {
        return;
      }

      // Process up to maxConcurrent requests
      const toProcess = queueArray.splice(0, this.config.maxConcurrent);
      
      await Promise.allSettled(
        toProcess.map(async (item) => {
          try {
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Request timeout')), item.timeout)
            );

            const result = await Promise.race([
              item.request(),
              timeoutPromise
            ]);

            item.resolve(result);
          } catch (error) {
            item.reject(error);
          }
        })
      );

      // Continue processing if there are more items
      if (queueArray.length > 0) {
        setImmediate(() => this.processQueue(queue));
      }
    } finally {
      this.processing.delete(queue);
    }
  }

  getQueueStats(queue: string) {
    const queueArray = this.queues.get(queue) || [];
    return {
      length: queueArray.length,
      processing: this.processing.has(queue),
      oldestRequest: queueArray.length > 0 ? Date.now() - queueArray[queueArray.length - 1].timestamp : 0
    };
  }
}

// ========== ENHANCED MONITORED API CLIENT ==========
export class EnterpriseMonitoredApiClient extends EventEmitter {
  private baseClient: EnterpriseApiClient;
  private monitoring = getGlobalMonitoringSystem();
  private circuitBreakers = new Map<string, CircuitBreaker>();
  private rateLimiter: RateLimiter;
  private cache: EnhancedCacheManager;
  private requestQueue: RequestQueueManager;
  
  private metrics: ApiMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    errorRate: 0,
    circuitBreakerState: 'closed',
    retryAttempts: 0,
    cacheHits: 0,
    cacheMisses: 0,
    rateLimitHits: 0,
    slowQueries: 0
  };

  private responseTimes: number[] = [];

  constructor(config: {
    baseURL: string;
    timeout?: number;
    retries?: number;
    circuitBreaker?: {
      failureThreshold: number;
      recoveryTimeout: number;
      monitorWindow: number;
    };
    rateLimit?: {
      maxRequests: number;
      windowMs: number;
    };
    cache?: {
      maxSize: number;
      defaultTtl: number;
      cleanupInterval: number;
    };
    queue?: {
      maxConcurrent: number;
      maxQueueSize: number;
      defaultTimeout: number;
    };
  }) {
    super();

    this.baseClient = new EnterpriseApiClient(config);
    
    this.rateLimiter = new RateLimiter(config.rateLimit || {
      maxRequests: 100,
      windowMs: 60000
    });

    this.cache = new EnhancedCacheManager(config.cache || {
      maxSize: 1000,
      defaultTtl: 300000,
      cleanupInterval: 60000
    });

    this.requestQueue = new RequestQueueManager(config.queue || {
      maxConcurrent: 10,
      maxQueueSize: 100,
      defaultTimeout: 30000
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // Circuit breaker events
    this.on('circuit-breaker-state-change', ({ endpoint, state }) => {
      this.monitoring.warn(`Circuit breaker state changed: ${endpoint} -> ${state}`, {
        component: 'api-client',
        endpoint,
        state
      });
    });

    // Performance monitoring
    setInterval(() => {
      this.emitMetrics();
    }, 30000); // Every 30 seconds
  }

  // ========== ENHANCED REQUEST METHODS ==========
  async get<T>(
    url: string, 
    context?: RequestContext,
    options?: {
      cache?: boolean;
      cacheTtl?: number;
      cacheTags?: string[];
      priority?: 'low' | 'normal' | 'high' | 'critical';
      timeout?: number;
    }
  ): Promise<T> {
    return this.executeRequest('GET', url, undefined, context, options);
  }

  async post<T>(
    url: string, 
    data?: any, 
    context?: RequestContext,
    options?: {
      priority?: 'low' | 'normal' | 'high' | 'critical';
      timeout?: number;
    }
  ): Promise<T> {
    return this.executeRequest('POST', url, data, context, options);
  }

  async put<T>(
    url: string, 
    data?: any, 
    context?: RequestContext,
    options?: {
      priority?: 'low' | 'normal' | 'high' | 'critical';
      timeout?: number;
    }
  ): Promise<T> {
    return this.executeRequest('PUT', url, data, context, options);
  }

  async delete<T>(
    url: string, 
    context?: RequestContext,
    options?: {
      priority?: 'low' | 'normal' | 'high' | 'critical';
      timeout?: number;
    }
  ): Promise<T> {
    return this.executeRequest('DELETE', url, undefined, context, options);
  }

  // ========== CORE REQUEST EXECUTION ==========
  private async executeRequest<T>(
    method: string,
    url: string,
    data?: any,
    context?: RequestContext,
    options?: any
  ): Promise<T> {
    const requestId = this.generateRequestId();
    const startTime = Date.now();
    const endpoint = this.getEndpointKey(method, url);

    // Set monitoring context
    this.monitoring.setContext({
      requestId,
      endpoint,
      method,
      ...context
    });

    try {
      // Rate limiting
      const rateLimitKey = context?.userId || 'anonymous';
      if (!await this.rateLimiter.checkLimit(rateLimitKey)) {
        this.metrics.rateLimitHits++;
        throw new Error('Rate limit exceeded');
      }

      // Cache check for GET requests
      if (method === 'GET' && options?.cache !== false) {
        const cacheKey = this.getCacheKey(method, url, data);
        const cached = this.cache.get(cacheKey);
        if (cached) {
          this.metrics.cacheHits++;
          this.monitoring.debug('Cache hit', { endpoint, cacheKey });
          return cached;
        }
        this.metrics.cacheMisses++;
      }

      // Queue management for non-critical requests
      const priority = this.getPriorityValue(options?.priority || context?.priority || 'normal');
      
      const result = await this.requestQueue.enqueue(
        endpoint,
        () => this.executeWithCircuitBreaker(endpoint, method, url, data, options),
        { priority, timeout: options?.timeout }
      );

      // Cache successful GET responses
      if (method === 'GET' && options?.cache !== false && result) {
        const cacheKey = this.getCacheKey(method, url, data);
        this.cache.set(cacheKey, result, {
          ttl: options?.cacheTtl,
          tags: options?.cacheTags
        });
      }

      // Record success metrics
      this.recordRequestMetrics(startTime, true);
      this.monitoring.debug('API request successful', {
        endpoint,
        duration: Date.now() - startTime,
        status: 'success'
      });

      return result as T;

    } catch (error) {
      this.recordRequestMetrics(startTime, false);
      this.monitoring.trackError(error as Error, {
        component: 'api-client',
        action: 'request',
        endpoint,
        method,
        ...context
      });

      throw error;
    }
  }

  private async executeWithCircuitBreaker<T>(
    endpoint: string,
    method: string,
    url: string,
    data?: any,
    options?: any
  ): Promise<T> {
    if (!this.circuitBreakers.has(endpoint)) {
      const breaker = new CircuitBreaker(endpoint, {
        failureThreshold: 5,
        recoveryTimeout: 30000,
        monitorWindow: 60000
      });
      
      breaker.on('state-change', (event) => {
        this.emit('circuit-breaker-state-change', event);
      });
      
      this.circuitBreakers.set(endpoint, breaker);
    }

    const circuitBreaker = this.circuitBreakers.get(endpoint)!;
    
    return circuitBreaker.execute(async () => {
      let response;
      switch (method.toLowerCase()) {
        case 'get':
          response = await this.baseClient.get<T>(url);
          break;
        case 'post':
          response = await this.baseClient.post<T>(url, data);
          break;
        case 'put':
          response = await this.baseClient.put<T>(url, data);
          break;
        case 'delete':
          response = await this.baseClient.delete<T>(url);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      return response.data as T;
    });
  }

  // ========== BUSINESS OPERATION WRAPPERS ==========
  async executeBuyerOperation<T>(
    operation: string,
    apiCall: () => Promise<T>,
    buyerId?: string
  ): Promise<T> {
    return this.monitoring.measureAsync(`buyer_operation_${operation}`, async () => {
      try {
        const result = await apiCall();
        
        this.monitoring.info(`Buyer operation completed: ${operation}`, {
          operation,
          buyerId,
          component: 'buyer-operations',
          status: 'success'
        });
        
        this.monitoring.recordMetric(`buyer_operations_${operation}_success`, 1, 'count');
        return result;

      } catch (error) {
        this.monitoring.error(`Buyer operation failed: ${operation}`, {
          operation,
          buyerId,
          component: 'buyer-operations'
        }, error as Error);
        
        this.monitoring.recordMetric(`buyer_operations_${operation}_failure`, 1, 'count');
        throw error;
      }
    });
  }

  async executeVendorOperation<T>(
    operation: string,
    apiCall: () => Promise<T>,
    vendorId?: string
  ): Promise<T> {
    return this.monitoring.measureAsync(`vendor_operation_${operation}`, async () => {
      try {
        const result = await apiCall();
        
        this.monitoring.info(`Vendor operation completed: ${operation}`, {
          operation,
          vendorId,
          component: 'vendor-operations',
          status: 'success'
        });
        
        this.monitoring.recordMetric(`vendor_operations_${operation}_success`, 1, 'count');
        return result;

      } catch (error) {
        this.monitoring.error(`Vendor operation failed: ${operation}`, {
          operation,
          vendorId,
          component: 'vendor-operations'
        }, error as Error);
        
        this.monitoring.recordMetric(`vendor_operations_${operation}_failure`, 1, 'count');
        throw error;
      }
    });
  }

  // ========== HEALTH AND DIAGNOSTICS ==========
  async healthCheck(): Promise<ApiHealthStatus> {
    const endpointHealth = await this.checkEndpointHealth();
    const circuitBreakerStates = this.getCircuitBreakerStates();
    
    const overallScore = this.calculateHealthScore(endpointHealth);
    const overallStatus = overallScore >= 80 ? 'healthy' : overallScore >= 50 ? 'degraded' : 'critical';

    return {
      overall: overallStatus,
      score: overallScore,
      endpoints: endpointHealth,
      circuitBreakers: circuitBreakerStates
    };
  }

  getMetrics(): ApiMetrics {
    const cacheStats = this.cache.getStats();
    
    return {
      ...this.metrics,
      averageResponseTime: this.responseTimes.length > 0 
        ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length 
        : 0,
      errorRate: this.metrics.totalRequests > 0 
        ? this.metrics.failedRequests / this.metrics.totalRequests 
        : 0,
      cacheHits: cacheStats.hits,
      cacheMisses: cacheStats.misses
    };
  }

  // ========== UTILITY METHODS ==========
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getEndpointKey(method: string, url: string): string {
    return `${method.toLowerCase()}_${url.replace(/\/\d+/g, '/:id')}`;
  }

  private getCacheKey(method: string, url: string, data?: any): string {
    const dataHash = data ? this.hashObject(data) : '';
    return `${method}_${url}_${dataHash}`;
  }

  private hashObject(obj: any): string {
    const str = JSON.stringify(obj);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private getPriorityValue(priority: string): number {
    switch (priority) {
      case 'critical': return 4;
      case 'high': return 3;
      case 'normal': return 2;
      case 'low': return 1;
      default: return 2;
    }
  }

  private recordRequestMetrics(startTime: number, success: boolean): void {
    const duration = Date.now() - startTime;
    
    this.metrics.totalRequests++;
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }

    this.responseTimes.push(duration);
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift();
    }

    if (duration > 2000) {
      this.metrics.slowQueries++;
    }

    this.monitoring.recordMetric('api_request_duration', duration, 'ms');
    this.monitoring.recordMetric('api_requests_total', 1, 'count');
    
    if (success) {
      this.monitoring.recordMetric('api_requests_success', 1, 'count');
    } else {
      this.monitoring.recordMetric('api_requests_error', 1, 'count');
    }
  }

  private async checkEndpointHealth(): Promise<Array<{
    path: string;
    status: 'healthy' | 'degraded' | 'critical';
    responseTime: number;
    errorRate: number;
    lastChecked: Date;
  }>> {
    // This would typically check critical endpoints
    const criticalEndpoints = ['/health', '/api/buyers', '/api/vendors'];
    const results = [];

    for (const endpoint of criticalEndpoints) {
      try {
        const start = Date.now();
        await this.baseClient.get(endpoint);
        const responseTime = Date.now() - start;

        results.push({
          path: endpoint,
          status: responseTime < 1000 ? 'healthy' as const : 'degraded' as const,
          responseTime,
          errorRate: 0,
          lastChecked: new Date()
        });
      } catch (error) {
        results.push({
          path: endpoint,
          status: 'critical' as const,
          responseTime: -1,
          errorRate: 1,
          lastChecked: new Date()
        });
      }
    }

    return results;
  }

  private getCircuitBreakerStates() {
    return Array.from(this.circuitBreakers.entries()).map(([endpoint, breaker]) => ({
      endpoint,
      ...breaker.getState()
    }));
  }

  private calculateHealthScore(endpointHealth: Array<any>): number {
    if (endpointHealth.length === 0) return 100;

    const scores = endpointHealth.map(endpoint => {
      switch (endpoint.status) {
        case 'healthy': return 100;
        case 'degraded': return 50;
        case 'critical': return 0;
        default: return 50;
      }
    });

    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  private emitMetrics(): void {
    const metrics = this.getMetrics();
    this.emit('metrics', metrics);
    
    this.monitoring.recordMetric('api_total_requests', metrics.totalRequests, 'count');
    this.monitoring.recordMetric('api_error_rate', metrics.errorRate, 'percent');
    this.monitoring.recordMetric('api_avg_response_time', metrics.averageResponseTime, 'ms');
  }

  // ========== CACHE MANAGEMENT ==========
  invalidateCache(pattern?: string): void {
    if (pattern) {
      this.cache.invalidateByPattern(new RegExp(pattern));
    } else {
      this.cache.invalidateByTag('all');
    }
    
    this.monitoring.info('Cache invalidated', { pattern });
  }

  async warmupCache(requests: Array<{ method: string; url: string; data?: any }>): Promise<void[]> {
    const results = await Promise.allSettled(
      requests.map(async ({ method, url, data }) => {
        try {
          await this.executeRequest(method, url, data, {
            endpoint: url,
            method,
            priority: 'low'
          }, { cache: true });
        } catch (error) {
          // Ignore warmup errors
        }
      })
    );
    return results.map(() => undefined);
  }
}

// ========== FACTORY FUNCTION ==========
export function createEnterpriseApiClient(config: {
  baseURL: string;
  timeout?: number;
  environment?: 'development' | 'production';
}): EnterpriseMonitoredApiClient {
  const isProduction = config.environment === 'production';
  
  return new EnterpriseMonitoredApiClient({
    baseURL: config.baseURL,
    timeout: config.timeout || 30000,
    circuitBreaker: {
      failureThreshold: isProduction ? 3 : 10,
      recoveryTimeout: isProduction ? 30000 : 10000,
      monitorWindow: 60000
    },
    rateLimit: {
      maxRequests: isProduction ? 100 : 1000,
      windowMs: 60000
    },
    cache: {
      maxSize: isProduction ? 5000 : 1000,
      defaultTtl: 300000,
      cleanupInterval: 60000
    },
    queue: {
      maxConcurrent: isProduction ? 5 : 10,
      maxQueueSize: isProduction ? 50 : 100,
      defaultTimeout: 30000
    }
  });
}

export default EnterpriseMonitoredApiClient;
