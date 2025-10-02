/**
 * Enterprise Monitoring System - Usage Examples
 * 
 * This file demonstrates how to integrate and use the comprehensive
 * monitoring system in your Next.js application
 */

import { 
  initializeMonitoring,
  getGlobalMonitoringSystem,
  IntegratedMonitoringSystem,
  MonitoringConfig
} from './index';

// ========== INITIALIZATION EXAMPLES ==========

/**
 * Initialize monitoring for development
 */
export function initializeDevelopmentMonitoring(): IntegratedMonitoringSystem {
  const monitoring = initializeMonitoring({
    environment: 'development',
    service: 'indiantrademart-frontend',
    version: '1.0.0',
    
    errorTracking: {
      enabled: true,
      sampleRate: 1.0, // Track all errors in development
      maxErrors: 1000,
      retentionDays: 1,
      enableAlerts: false // Don't spam alerts in development
    },
    
    logging: {
      enabled: true,
      level: 'debug', // Show all logs in development
      enablePerformanceTracking: true,
      sampleRate: 1.0
    },
    
    performance: {
      enabled: true,
      enableWebVitals: true,
      enableMemoryMonitoring: true,
      enableBudgets: true
    }
  });

  // Add custom performance budgets for development
  const performanceMonitor = monitoring['performanceMonitor'];
  if (performanceMonitor) {
    performanceMonitor.addPerformanceBudget({
      metric: 'bundle_size',
      threshold: 5 * 1024 * 1024, // 5MB
      operator: 'lte',
      severity: 'warning'
    });

    performanceMonitor.addPerformanceBudget({
      metric: 'api_response_time',
      threshold: 1000, // 1 second
      operator: 'lte',
      severity: 'warning'
    });
  }

  return monitoring;
}

/**
 * Initialize monitoring for production
 */
export function initializeProductionMonitoring(): IntegratedMonitoringSystem {
  const monitoring = initializeMonitoring({
    environment: 'production',
    service: 'indiantrademart-frontend',
    version: process.env.NEXT_PUBLIC_BUILD_VERSION || '1.0.0',
    
    errorTracking: {
      enabled: true,
      sampleRate: 0.1, // Sample 10% of errors to reduce load
      maxErrors: 10000,
      retentionDays: 30,
      enableAlerts: true
    },
    
    logging: {
      enabled: true,
      level: 'warn', // Only log warnings and above in production
      enablePerformanceTracking: false, // Disable to reduce overhead
      sampleRate: 0.05 // Sample 5% of logs
    },
    
    performance: {
      enabled: true,
      enableWebVitals: true,
      enableMemoryMonitoring: true,
      enableBudgets: true
    }
  });

  // Add production performance budgets
  const performanceMonitor = monitoring['performanceMonitor'];
  if (performanceMonitor) {
    // Stricter budgets for production
    performanceMonitor.addPerformanceBudget({
      metric: 'LCP',
      threshold: 2500, // 2.5 seconds
      operator: 'lte',
      severity: 'error'
    });

    performanceMonitor.addPerformanceBudget({
      metric: 'FID',
      threshold: 100, // 100ms
      operator: 'lte',
      severity: 'error'
    });

    performanceMonitor.addPerformanceBudget({
      metric: 'CLS',
      threshold: 0.1,
      operator: 'lte',
      severity: 'error'
    });
  }

  return monitoring;
}

// ========== USAGE IN COMPONENTS ==========

/**
 * Example: Using monitoring in a React component
 */
export class MonitoredComponent {
  private monitoring = getGlobalMonitoringSystem();

  async loadData(userId: string) {
    // Set user context
    this.monitoring.setUser(userId);
    
    // Measure API call performance
    try {
      const data = await this.monitoring.measureAsync('api_user_data', async () => {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error(`API call failed: ${response.status}`);
        }
        return response.json();
      });

      this.monitoring.info('User data loaded successfully', {
        userId,
        recordCount: data.length
      });

      return data;

    } catch (error) {
      // Error is automatically tracked due to integration
      this.monitoring.error('Failed to load user data', { userId }, error as Error);
      throw error;
    }
  }

  handleUserAction(action: string, data?: any) {
    // Track user actions for analytics
    this.monitoring.info(`User action: ${action}`, {
      component: 'MonitoredComponent',
      action,
      data
    });

    // Record custom metric
    this.monitoring.recordMetric('user_actions', 1, 'count');
  }

  onComponentMount() {
    this.monitoring.debug('Component mounted', {
      component: 'MonitoredComponent'
    });

    // Record component mount time
    this.monitoring.recordMetric('component_mount_time', performance.now(), 'ms');
  }

  onComponentError(error: Error) {
    // Track component-specific errors
    this.monitoring.trackError(error, {
      component: 'MonitoredComponent',
      action: 'render'
    });
  }
}

// ========== API INTEGRATION EXAMPLE ==========

/**
 * Example: Monitoring API calls with the existing API client
 */
export function createMonitoredApiCall<T>(
  apiCall: () => Promise<T>,
  operation: string
): () => Promise<T> {
  const monitoring = getGlobalMonitoringSystem();

  return async () => {
    const startTime = Date.now();
    
    try {
      const result = await monitoring.measureAsync(`api_${operation}`, apiCall);
      
      const duration = Date.now() - startTime;
      monitoring.recordMetric(`api_${operation}_success`, 1, 'count');
      monitoring.recordMetric(`api_${operation}_duration`, duration, 'ms');
      
      monitoring.debug(`API call succeeded: ${operation}`, {
        operation,
        duration,
        status: 'success'
      });
      
      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      
      monitoring.recordMetric(`api_${operation}_error`, 1, 'count');
      monitoring.recordMetric(`api_${operation}_duration`, duration, 'ms');
      
      // Error context will be automatically enriched
      monitoring.trackError(error as Error, {
        component: 'api-client',
        action: operation,
        duration
      });
      
      throw error;
    }
  };
}

// ========== BUSINESS LOGIC MONITORING ==========

/**
 * Example: Monitoring business operations
 */
export class BuyerOperationsMonitor {
  private monitoring = getGlobalMonitoringSystem();

  async createBuyer(buyerData: any) {
    return this.monitoring.measureAsync('buyer_creation', async () => {
      try {
        // Validate data
        if (!buyerData.email) {
          throw new Error('Email is required');
        }

        // Create buyer
        const buyer = await this.createBuyerInDatabase(buyerData);
        
        // Track success
        this.monitoring.info('Buyer created successfully', {
          buyerId: buyer.id,
          email: buyer.email,
          component: 'buyer-operations'
        });

        this.monitoring.recordMetric('buyers_created', 1, 'count');
        
        return buyer;

      } catch (error) {
        this.monitoring.error('Buyer creation failed', {
          email: buyerData?.email,
          component: 'buyer-operations'
        }, error as Error);

        this.monitoring.recordMetric('buyer_creation_failures', 1, 'count');
        throw error;
      }
    });
  }

  async searchBuyers(query: string) {
    return this.monitoring.measureAsync('buyer_search', async () => {
      const results = await this.performBuyerSearch(query);
      
      this.monitoring.info('Buyer search completed', {
        query,
        resultCount: results.length,
        component: 'buyer-operations'
      });

      this.monitoring.recordMetric('buyer_searches', 1, 'count');
      this.monitoring.recordMetric('search_results', results.length, 'count');
      
      return results;
    });
  }

  private async createBuyerInDatabase(data: any) {
    // Simulate database operation
    return { id: 'buyer_123', ...data };
  }

  private async performBuyerSearch(query: string) {
    // Simulate search operation
    return [{ id: 'buyer_1', name: 'Test Buyer' }];
  }
}

// ========== ERROR BOUNDARY INTEGRATION ==========

/**
 * Example: React Error Boundary with monitoring
 */
export class MonitoredErrorBoundary {
  private monitoring = getGlobalMonitoringSystem();

  componentDidCatch(error: Error, errorInfo: any) {
    // Track React component errors
    this.monitoring.trackError(error, {
      component: 'error-boundary',
      action: 'component-error',
      metadata: {
        errorInfo,
        stack: errorInfo.componentStack
      }
    });

    this.monitoring.fatal('React component error caught', {
      errorMessage: error.message,
      componentStack: errorInfo.componentStack
    }, error);
  }
}

// ========== PERFORMANCE OPTIMIZATION MONITORING ==========

/**
 * Example: Monitoring performance optimizations
 */
export class PerformanceOptimizationMonitor {
  private monitoring = getGlobalMonitoringSystem();

  measureCodeSplitting(chunkName: string) {
    const startTime = performance.now();
    
    return (loadedModule: any) => {
      const loadTime = performance.now() - startTime;
      
      this.monitoring.recordMetric(`chunk_load_${chunkName}`, loadTime, 'ms');
      this.monitoring.debug(`Code chunk loaded: ${chunkName}`, {
        chunkName,
        loadTime,
        component: 'code-splitting'
      });
      
      return loadedModule;
    };
  }

  measureImageLoading(imageSrc: string) {
    const startTime = performance.now();
    
    return () => {
      const loadTime = performance.now() - startTime;
      
      this.monitoring.recordMetric('image_load_time', loadTime, 'ms');
      this.monitoring.debug('Image loaded', {
        src: imageSrc,
        loadTime,
        component: 'image-loading'
      });
    };
  }

  measureDatabaseQuery(queryType: string) {
    return <T>(queryFn: () => Promise<T>): Promise<T> => {
      return this.monitoring.measureAsync(`db_query_${queryType}`, async () => {
        const result = await queryFn();
        
        this.monitoring.recordMetric(`db_queries_${queryType}`, 1, 'count');
        
        return result;
      });
    };
  }
}

// ========== HEALTH CHECK INTEGRATION ==========

/**
 * Example: Health check endpoint with monitoring data
 */
export function createHealthCheckHandler() {
  const monitoring = getGlobalMonitoringSystem();

  return async () => {
    const report = monitoring.generateReport();
    const health = monitoring.analyzeHealth();
    const insights = monitoring.getInsights();

    return {
      status: health.status,
      score: health.score,
      timestamp: new Date().toISOString(),
      
      summary: {
        errors: report.errors.total,
        performanceScore: report.performance.score,
        memoryUsage: report.performance.memoryUsage,
        sessionDuration: report.session.duration
      },
      
      issues: health.recommendations,
      
      metrics: {
        webVitals: report.performance.webVitals,
        topErrors: insights.topErrors.slice(0, 5),
        performanceIssues: insights.performanceIssues.slice(0, 5)
      },
      
      recommendations: insights.recommendations.slice(0, 10)
    };
  };
}

// ========== MONITORING DASHBOARD DATA ==========

/**
 * Example: Preparing data for a monitoring dashboard
 */
export class MonitoringDashboard {
  private monitoring = getGlobalMonitoringSystem();

  getDashboardData() {
    const report = this.monitoring.generateReport();
    const insights = this.monitoring.getInsights();
    const webVitals = report.performance.webVitals || [];
    const resourceTimings = [];

    return {
      overview: {
        healthScore: report.health.score,
        healthStatus: report.health.status,
        totalErrors: report.errors.total,
        performanceScore: report.performance.score,
        sessionDuration: report.session.duration
      },

      webVitals: webVitals.map(vital => ({
        name: vital.name,
        value: vital.value,
        rating: vital.rating
      })),

      errors: {
        byType: Object.entries(report.errors.byType).map(([type, count]) => ({
          type,
          count
        })),
        
        bySeverity: Object.entries(report.errors.bySeverity).map(([severity, count]) => ({
          severity,
          count
        })),
        
        topErrors: insights.topErrors.slice(0, 10)
      },

      performance: {
        resourceLoadTimes: resourceTimings
          .filter(r => r.duration > 100)
          .map(r => ({
            name: r.name.split('/').pop() || r.name,
            duration: r.duration,
            size: r.transferSize
          }))
          .slice(0, 20),
          
        memoryUsage: report.performance.memoryUsage,
        
        alerts: insights.performanceIssues
      },

      recommendations: insights.recommendations,
      
      trends: {
        // This would be populated with historical data
        errorTrends: [],
        performanceTrends: [],
        memoryTrends: []
      }
    };
  }
}

// ========== EXPORT FOR EASY USAGE ==========

export const MonitoringExamples = {
  initializeDevelopmentMonitoring,
  initializeProductionMonitoring,
  MonitoredComponent,
  createMonitoredApiCall,
  BuyerOperationsMonitor,
  MonitoredErrorBoundary,
  PerformanceOptimizationMonitor,
  createHealthCheckHandler,
  MonitoringDashboard
};

export default MonitoringExamples;
