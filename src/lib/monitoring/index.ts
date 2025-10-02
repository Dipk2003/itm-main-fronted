/**
 * Enterprise Monitoring System - Central Hub
 * 
 * Complete monitoring solution integrating error tracking,
 * logging, performance monitoring, and alerting
 */

// ========== CORE EXPORTS ==========
export { 
  EnterpriseErrorTracker,
  createErrorTracker,
  getGlobalErrorTracker,
  initializeGlobalErrorTracker
} from './ErrorTracker';

export type {
  ErrorContext,
  TrackedError,
  ErrorMetrics,
  AlertRule,
  Logger as ErrorLogger,
  MetricsCollector,
  AlertManager
} from './ErrorTracker';

export {
  EnterpriseLogger,
  createLogger,
  createProductionLogger,
  createDevelopmentLogger,
  getGlobalLogger,
  setGlobalLogger
} from './Logger';

export {
  ConsoleTransport,
  BufferedTransport,
  HTTPTransport,
  JSONFormatter,
  TextFormatter,
  LevelFilter,
  SamplingFilter,
  ComponentFilter,
  PerformanceTracker
} from './Logger';

export type {
  LogLevel,
  LogEntry,
  LogTransport,
  LogFormatter,
  LogFilter,
  LoggerConfig
} from './Logger';

export {
  EnterprisePerformanceMonitor,
  createPerformanceMonitor,
  getGlobalPerformanceMonitor,
  setGlobalPerformanceMonitor
} from './PerformanceMonitor';

export {
  WebVitalsCollector,
  ResourceTimingAnalyzer,
  MemoryMonitor,
  PerformanceBudgetManager
} from './PerformanceMonitor';

export type {
  PerformanceMetric,
  WebVitalsMetric,
  ResourceTiming,
  MemoryInfo,
  NavigationTiming,
  PerformanceBudget,
  PerformanceAlert,
  PerformanceReport
} from './PerformanceMonitor';

// ========== INTEGRATED MONITORING SYSTEM ==========
import { EnterpriseErrorTracker, getGlobalErrorTracker } from './ErrorTracker';
import { EnterpriseLogger, getGlobalLogger } from './Logger';
import { EnterprisePerformanceMonitor, getGlobalPerformanceMonitor } from './PerformanceMonitor';
import { EventEmitter } from 'events';

export interface MonitoringConfig {
  errorTracking?: {
    enabled: boolean;
    sampleRate?: number;
    maxErrors?: number;
    retentionDays?: number;
    enableAlerts?: boolean;
  };
  logging?: {
    enabled: boolean;
    level?: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    enablePerformanceTracking?: boolean;
    sampleRate?: number;
  };
  performance?: {
    enabled: boolean;
    enableWebVitals?: boolean;
    enableMemoryMonitoring?: boolean;
    enableBudgets?: boolean;
  };
  environment?: 'development' | 'staging' | 'production';
  service?: string;
  version?: string;
  userId?: string;
  sessionId?: string;
}

export interface MonitoringReport {
  timestamp: Date;
  environment: string;
  service: string;
  version?: string;
  session: {
    id: string;
    duration: number;
    userId?: string;
  };
  errors: {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    topErrors: Array<{ message: string; count: number }>;
  };
  performance: {
    webVitals: Array<{ name: string; value: number; rating: string }>;
    score: number;
    memoryUsage?: number;
    resourceCount: number;
  };
  logs: {
    total: number;
    byLevel: Record<string, number>;
  };
  health: {
    score: number;
    status: 'healthy' | 'degraded' | 'critical';
    issues: string[];
  };
}

export class IntegratedMonitoringSystem extends EventEmitter {
  private errorTracker: EnterpriseErrorTracker;
  private logger: EnterpriseLogger;
  private performanceMonitor: EnterprisePerformanceMonitor;
  private config: MonitoringConfig;
  private sessionStart: Date;
  private reportInterval?: NodeJS.Timeout;
  private initialized = false;

  constructor(config: MonitoringConfig = {}) {
    super();

    this.config = {
      errorTracking: { enabled: true, sampleRate: 1.0, ...config.errorTracking },
      logging: { enabled: true, level: 'info', enablePerformanceTracking: true, ...config.logging },
      performance: { enabled: true, enableWebVitals: true, enableMemoryMonitoring: true, ...config.performance },
      environment: config.environment || 'development',
      service: config.service || 'frontend',
      version: config.version || process.env.NEXT_PUBLIC_BUILD_VERSION || '1.0.0',
      userId: config.userId,
      sessionId: config.sessionId || this.generateSessionId()
    };

    this.sessionStart = new Date();
    
    // Initialize components
    this.initializeComponents();
    this.setupIntegration();
    this.setupGlobalHandlers();
  }

  private initializeComponents(): void {
    // Initialize error tracker
    if (this.config.errorTracking?.enabled) {
      this.errorTracker = getGlobalErrorTracker();
      this.errorTracker.setContext({
        sessionId: this.config.sessionId,
        userId: this.config.userId,
        environment: this.config.environment,
        service: this.config.service,
        version: this.config.version
      });
    }

    // Initialize logger
    if (this.config.logging?.enabled) {
      this.logger = getGlobalLogger();
      this.logger.setContext({
        sessionId: this.config.sessionId,
        userId: this.config.userId,
        service: this.config.service,
        version: this.config.version
      });
    }

    // Initialize performance monitor
    if (this.config.performance?.enabled) {
      this.performanceMonitor = getGlobalPerformanceMonitor();
    }
  }

  private setupIntegration(): void {
    // Error Tracker -> Logger integration
    if (this.errorTracker && this.logger) {
      this.errorTracker.on('error-new', (error) => {
        this.logger.error(`New error tracked: ${error.message}`, {
          errorId: error.id,
          type: error.type,
          severity: error.severity
        });
      });

      this.errorTracker.on('alert-triggered', ({ rule, error }) => {
        this.logger.warn(`Error alert triggered: ${rule.name}`, {
          errorId: error.id,
          errorCount: error.count,
          ruleName: rule.name
        });
      });
    }

    // Performance Monitor -> Logger integration
    if (this.performanceMonitor && this.logger) {
      this.performanceMonitor.on('web-vital', (vital) => {
        if (vital.rating === 'poor') {
          this.logger.warn(`Poor Web Vital: ${vital.name}`, {
            value: vital.value,
            rating: vital.rating
          });
        }
      });

      this.performanceMonitor.on('performance-alert', (alert) => {
        this.logger.warn(`Performance budget exceeded: ${alert.metric}`, {
          value: alert.value,
          threshold: alert.threshold,
          severity: alert.severity
        });
      });
    }

    // Performance Monitor -> Error Tracker integration
    if (this.performanceMonitor && this.errorTracker) {
      this.performanceMonitor.on('performance-alert', (alert) => {
        if (alert.severity === 'error') {
          const error = new Error(`Performance budget violation: ${alert.message}`);
          (error as any).severity = 'high';
          this.errorTracker.trackError(error, {
            component: 'performance-monitor',
            action: 'budget-violation',
            metadata: { alert }
          });
        }
      });
    }

    // Logger -> Error Tracker integration for log errors
    if (this.logger && this.errorTracker) {
      this.logger.on('log', (entry) => {
        if (entry.level === 'error' || entry.level === 'fatal') {
          if (entry.error) {
            this.errorTracker.trackError(entry.error, {
              component: entry.metadata.component,
              action: entry.metadata.action,
              userId: entry.metadata.userId
            });
          }
        }
      });
    }
  }

  private setupGlobalHandlers(): void {
    if (typeof window !== 'undefined') {
      // Track page visibility for session management
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.logger?.debug('Page became hidden');
          this.emit('session-paused');
        } else {
          this.logger?.debug('Page became visible');
          this.emit('session-resumed');
        }
      });

      // Track before unload for session cleanup
      window.addEventListener('beforeunload', () => {
        this.generateReport();
        this.emit('session-ended');
      });
    }
  }

  // ========== PUBLIC API ==========
  initialize(): void {
    if (this.initialized) return;

    this.initialized = true;

    // Start monitoring components
    if (this.performanceMonitor && this.config.performance?.enabled) {
      this.performanceMonitor.startMonitoring();
    }

    // Setup periodic reporting
    this.reportInterval = setInterval(() => {
      this.generateReport();
    }, 60000); // Every minute

    this.logger?.info('Integrated monitoring system initialized', {
      config: this.config,
      sessionId: this.config.sessionId
    });

    this.emit('initialized');
  }

  setUser(userId: string): void {
    this.config.userId = userId;
    
    this.errorTracker?.setContext({ userId });
    this.logger?.setContext({ userId });
    
    this.logger?.info('User context updated', { userId });
  }

  setContext(context: Record<string, any>): void {
    this.errorTracker?.setContext(context);
    this.logger?.setContext(context);
    
    this.logger?.debug('Context updated', context);
  }

  // ========== ERROR TRACKING ==========
  trackError(error: Error, context?: any): void {
    if (!this.errorTracker || !this.config.errorTracking?.enabled) return;
    
    this.errorTracker.trackError(error, context);
  }

  // ========== LOGGING ==========
  log(level: 'debug' | 'info' | 'warn' | 'error' | 'fatal', message: string, context?: any): void {
    if (!this.logger || !this.config.logging?.enabled) return;
    
    this.logger[level](message, context);
  }

  debug(message: string, context?: any): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: any): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: any): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: any, error?: Error): void {
    this.logger?.error(message, context, error);
  }

  fatal(message: string, context?: any, error?: Error): void {
    this.logger?.fatal(message, context, error);
  }

  // ========== PERFORMANCE TRACKING ==========
  recordMetric(name: string, value: number, unit: 'ms' | 'bytes' | 'count' | 'percent' | 'score'): void {
    if (!this.performanceMonitor || !this.config.performance?.enabled) return;
    
    this.performanceMonitor.recordMetric(name, value, unit);
  }

  measureFunction<T>(name: string, fn: () => T): T {
    if (!this.performanceMonitor || !this.config.performance?.enabled) {
      return fn();
    }
    
    return this.performanceMonitor.measureFunction(name, fn);
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (!this.performanceMonitor || !this.config.performance?.enabled) {
      return fn();
    }
    
    return this.performanceMonitor.measureAsync(name, fn);
  }

  // ========== REPORTING ==========
  generateReport(): MonitoringReport {
    const now = new Date();
    const sessionDuration = now.getTime() - this.sessionStart.getTime();

    // Gather error metrics
    const errorMetrics = this.errorTracker?.getMetrics() || {
      totalErrors: 0,
      errorsByType: {},
      errorsBySeverity: {},
      topErrors: []
    };

    // Gather performance metrics
    const webVitals = this.performanceMonitor?.getWebVitals() || [];
    const memoryInfo = this.performanceMonitor?.getMemoryInfo();
    const resourceTimings = this.performanceMonitor?.getResourceTimings() || [];

    // Calculate performance score
    const performanceScore = webVitals.length > 0 
      ? webVitals.reduce((score, vital) => {
          const penalty = vital.rating === 'poor' ? 30 : vital.rating === 'needs-improvement' ? 15 : 0;
          return score - penalty;
        }, 100)
      : 100;

    // Gather logging stats (simplified)
    const logStats = {
      total: 0,
      byLevel: {
        debug: 0,
        info: 0,
        warn: 0,
        error: 0,
        fatal: 0
      }
    };

    // Calculate overall health
    const healthScore = Math.min(
      performanceScore,
      errorMetrics.totalErrors > 10 ? 50 : 100,
      memoryInfo && (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) > 0.9 ? 30 : 100
    );

    const healthStatus = healthScore >= 80 ? 'healthy' : healthScore >= 50 ? 'degraded' : 'critical';
    const healthIssues: string[] = [];

    if (performanceScore < 80) {
      healthIssues.push('Poor performance metrics detected');
    }
    if (errorMetrics.totalErrors > 10) {
      healthIssues.push('High error count detected');
    }
    if (memoryInfo && (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) > 0.9) {
      healthIssues.push('High memory usage detected');
    }

    const report: MonitoringReport = {
      timestamp: now,
      environment: this.config.environment!,
      service: this.config.service!,
      version: this.config.version,
      session: {
        id: this.config.sessionId!,
        duration: sessionDuration,
        userId: this.config.userId
      },
      errors: {
        total: errorMetrics.totalErrors,
        byType: errorMetrics.errorsByType,
        bySeverity: errorMetrics.errorsBySeverity,
        topErrors: errorMetrics.topErrors.map(e => ({
          message: e.message,
          count: e.count
        }))
      },
      performance: {
        webVitals: webVitals.map(v => ({
          name: v.name,
          value: v.value,
          rating: v.rating
        })),
        score: Math.max(0, performanceScore),
        memoryUsage: memoryInfo ? memoryInfo.usedJSHeapSize : undefined,
        resourceCount: resourceTimings.length
      },
      logs: logStats,
      health: {
        score: Math.max(0, healthScore),
        status: healthStatus,
        issues: healthIssues
      }
    };

    this.emit('report-generated', report);
    this.logger?.debug('Monitoring report generated', {
      healthScore: report.health.score,
      healthStatus: report.health.status
    });

    return report;
  }

  // ========== ANALYSIS ==========
  analyzeHealth(): {
    score: number;
    status: 'healthy' | 'degraded' | 'critical';
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let score = 100;

    // Check error rates
    const errorMetrics = this.errorTracker?.getMetrics();
    if (errorMetrics && errorMetrics.totalErrors > 50) {
      score -= 30;
      recommendations.push('High error count detected - investigate and fix critical issues');
    }

    // Check performance
    const webVitals = this.performanceMonitor?.getWebVitals() || [];
    const poorVitals = webVitals.filter(v => v.rating === 'poor');
    if (poorVitals.length > 0) {
      score -= poorVitals.length * 20;
      recommendations.push(`${poorVitals.length} Web Vitals metrics are poor - optimize performance`);
    }

    // Check memory usage
    const memoryInfo = this.performanceMonitor?.getMemoryInfo();
    if (memoryInfo && (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) > 0.8) {
      score -= 25;
      recommendations.push('High memory usage detected - investigate potential memory leaks');
    }

    // Check resource loading
    const slowResources = this.performanceMonitor?.getResourceTimings()?.filter(r => r.duration > 2000) || [];
    if (slowResources.length > 5) {
      score -= 15;
      recommendations.push(`${slowResources.length} slow-loading resources detected - optimize resource loading`);
    }

    const finalScore = Math.max(0, score);
    const status = finalScore >= 80 ? 'healthy' : finalScore >= 50 ? 'degraded' : 'critical';

    return { score: finalScore, status, recommendations };
  }

  getInsights(): {
    topErrors: Array<{ message: string; count: number; trend: 'increasing' | 'decreasing' | 'stable' }>;
    performanceIssues: Array<{ metric: string; value: number; threshold: number; severity: 'warning' | 'error' }>;
    resourceBottlenecks: Array<{ name: string; duration: number; size: number; type: string }>;
    recommendations: string[];
  } {
    const insights = {
      topErrors: [],
      performanceIssues: [],
      resourceBottlenecks: [],
      recommendations: []
    };

    // Analyze errors
    const errorMetrics = this.errorTracker?.getMetrics();
    if (errorMetrics?.topErrors) {
      insights.topErrors = errorMetrics.topErrors.map(error => ({
        message: error.message,
        count: error.count,
        trend: 'stable' as const // Would calculate actual trend
      }));
    }

    // Analyze performance
    const performanceAlerts = this.performanceMonitor?.getPerformanceAlerts() || [];
    insights.performanceIssues = performanceAlerts.map(alert => ({
      metric: alert.metric,
      value: alert.value,
      threshold: alert.threshold,
      severity: alert.severity
    }));

    // Analyze resource bottlenecks
    const slowResources = this.performanceMonitor?.getResourceTimings()?.filter(r => r.duration > 1000) || [];
    insights.resourceBottlenecks = slowResources.map(resource => ({
      name: resource.name,
      duration: resource.duration,
      size: resource.transferSize,
      type: this.getResourceType(resource.name)
    }));

    // Generate recommendations
    const health = this.analyzeHealth();
    insights.recommendations = health.recommendations;

    return insights;
  }

  private getResourceType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase() || '';
    
    if (['js', 'mjs'].includes(extension)) return 'script';
    if (extension === 'css') return 'stylesheet';
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) return 'image';
    if (['woff', 'woff2', 'ttf', 'otf'].includes(extension)) return 'font';
    if (extension === 'html') return 'document';
    
    return 'other';
  }

  // ========== LIFECYCLE ==========
  destroy(): void {
    if (this.reportInterval) {
      clearInterval(this.reportInterval);
      this.reportInterval = undefined;
    }

    this.performanceMonitor?.stopMonitoring();
    
    // Generate final report
    this.generateReport();
    
    this.removeAllListeners();
    this.initialized = false;

    this.logger?.info('Integrated monitoring system destroyed');
  }

  // ========== UTILITIES ==========
  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ========== FACTORY FUNCTIONS ==========
export function createMonitoringSystem(config?: MonitoringConfig): IntegratedMonitoringSystem {
  return new IntegratedMonitoringSystem(config);
}

export function createProductionMonitoring(): IntegratedMonitoringSystem {
  return new IntegratedMonitoringSystem({
    environment: 'production',
    errorTracking: {
      enabled: true,
      sampleRate: 0.1, // Sample 10% of errors in production
      maxErrors: 5000,
      retentionDays: 7,
      enableAlerts: true
    },
    logging: {
      enabled: true,
      level: 'warn', // Only log warnings and above in production
      enablePerformanceTracking: false, // Disable to reduce overhead
      sampleRate: 0.05 // Sample 5% of logs in production
    },
    performance: {
      enabled: true,
      enableWebVitals: true,
      enableMemoryMonitoring: true,
      enableBudgets: true
    }
  });
}

export function createDevelopmentMonitoring(): IntegratedMonitoringSystem {
  return new IntegratedMonitoringSystem({
    environment: 'development',
    errorTracking: {
      enabled: true,
      sampleRate: 1.0, // Track all errors in development
      maxErrors: 1000,
      retentionDays: 1,
      enableAlerts: false
    },
    logging: {
      enabled: true,
      level: 'debug', // Log everything in development
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
}

// ========== GLOBAL SINGLETON ==========
let globalMonitoringSystem: IntegratedMonitoringSystem | null = null;

export function getGlobalMonitoringSystem(): IntegratedMonitoringSystem {
  if (!globalMonitoringSystem) {
    const isProduction = process.env.NODE_ENV === 'production';
    globalMonitoringSystem = isProduction ? createProductionMonitoring() : createDevelopmentMonitoring();
  }
  return globalMonitoringSystem;
}

export function setGlobalMonitoringSystem(system: IntegratedMonitoringSystem): void {
  globalMonitoringSystem = system;
}

export function initializeMonitoring(config?: MonitoringConfig): IntegratedMonitoringSystem {
  if (globalMonitoringSystem) {
    globalMonitoringSystem.destroy();
  }
  
  globalMonitoringSystem = new IntegratedMonitoringSystem(config);
  globalMonitoringSystem.initialize();
  
  return globalMonitoringSystem;
}

export default IntegratedMonitoringSystem;
