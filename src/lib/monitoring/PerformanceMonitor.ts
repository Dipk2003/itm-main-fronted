/**
 * Enterprise Performance Monitoring System
 * 
 * Real-time performance tracking, metrics collection,
 * and optimization insights for production applications
 */

import { EventEmitter } from 'events';

// ========== PERFORMANCE TYPES ==========
export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percent' | 'score';
  timestamp: Date;
  category: 'navigation' | 'resource' | 'paint' | 'layout' | 'memory' | 'network' | 'custom';
  tags?: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface WebVitalsMetric {
  name: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'INP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: Date;
  navigationType?: 'navigate' | 'reload' | 'back_forward' | 'prerender';
}

export interface ResourceTiming {
  name: string;
  type: 'navigation' | 'resource';
  startTime: number;
  duration: number;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
  responseStart: number;
  responseEnd: number;
  connectStart?: number;
  connectEnd?: number;
  domainLookupStart?: number;
  domainLookupEnd?: number;
}

export interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  timestamp: Date;
}

export interface NavigationTiming {
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
  timeToInteractive?: number;
}

export interface PerformanceBudget {
  metric: string;
  threshold: number;
  operator: 'lt' | 'lte' | 'gt' | 'gte';
  severity: 'warning' | 'error';
}

export interface PerformanceAlert {
  id: string;
  metric: string;
  value: number;
  threshold: number;
  severity: 'warning' | 'error';
  timestamp: Date;
  message: string;
}

export interface PerformanceReport {
  timestamp: Date;
  webVitals: WebVitalsMetric[];
  navigationTiming: NavigationTiming;
  resourceTimings: ResourceTiming[];
  memoryInfo: MemoryInfo;
  customMetrics: PerformanceMetric[];
  alerts: PerformanceAlert[];
  score: {
    overall: number;
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  recommendations: string[];
}

// ========== WEB VITALS COLLECTOR ==========
export class WebVitalsCollector {
  private metrics = new Map<string, WebVitalsMetric>();
  private callbacks: Array<(metric: WebVitalsMetric) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupWebVitals();
    }
  }

  private setupWebVitals(): void {
    // First Contentful Paint (FCP)
    this.observePerformanceEntry('paint', (entry) => {
      if (entry.name === 'first-contentful-paint') {
        this.recordMetric('FCP', entry.startTime);
      }
    });

    // Largest Contentful Paint (LCP)
    this.observePerformanceEntry('largest-contentful-paint', (entry) => {
      this.recordMetric('LCP', entry.startTime);
    });

    // First Input Delay (FID)
    this.observePerformanceEntry('first-input', (entry) => {
      this.recordMetric('FID', entry.processingStart - entry.startTime);
    });

    // Interaction to Next Paint (INP)
    this.observePerformanceEntry('event', (entry: any) => {
      if (entry.name === 'keydown' || entry.name === 'pointerdown' || entry.name === 'click') {
        const inp = entry.processingEnd - entry.startTime;
        this.recordMetric('INP', inp);
      }
    });

    // Cumulative Layout Shift (CLS)
    this.observePerformanceEntry('layout-shift', (entry: any) => {
      if (!entry.hadRecentInput) {
        const existingCLS = this.metrics.get('CLS');
        const currentValue = existingCLS ? existingCLS.value : 0;
        this.recordMetric('CLS', currentValue + entry.value);
      }
    });

    // Time to First Byte (TTFB)
    this.observePerformanceEntry('navigation', (entry) => {
      const ttfb = entry.responseStart - entry.requestStart;
      this.recordMetric('TTFB', ttfb);
    });
  }

  private observePerformanceEntry(type: string, callback: (entry: any) => void): void {
    try {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach(callback);
        });
        observer.observe({ type, buffered: true });
      }
    } catch (error) {
      console.warn(`Failed to observe ${type}:`, error);
    }
  }

  private recordMetric(name: WebVitalsMetric['name'], value: number): void {
    const rating = this.getRating(name, value);
    
    const metric: WebVitalsMetric = {
      name,
      value,
      rating,
      timestamp: new Date(),
      navigationType: this.getNavigationType()
    };

    this.metrics.set(name, metric);
    this.callbacks.forEach(callback => callback(metric));
  }

  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      'FCP': { good: 1800, poor: 3000 },
      'LCP': { good: 2500, poor: 4000 },
      'FID': { good: 100, poor: 300 },
      'INP': { good: 200, poor: 500 },
      'CLS': { good: 0.1, poor: 0.25 },
      'TTFB': { good: 800, poor: 1800 }
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private getNavigationType(): WebVitalsMetric['navigationType'] {
    if (typeof window === 'undefined') return 'navigate';
    
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as any;
      return navigationEntry?.type || 'navigate';
    } catch {
      return 'navigate';
    }
  }

  onMetric(callback: (metric: WebVitalsMetric) => void): void {
    this.callbacks.push(callback);
  }

  getMetrics(): WebVitalsMetric[] {
    return Array.from(this.metrics.values());
  }

  getMetric(name: WebVitalsMetric['name']): WebVitalsMetric | undefined {
    return this.metrics.get(name);
  }
}

// ========== RESOURCE TIMING ANALYZER ==========
export class ResourceTimingAnalyzer {
  private resources: ResourceTiming[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.collectResourceTimings();
    }
  }

  private collectResourceTimings(): void {
    try {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      this.resources = entries.map(entry => ({
        name: entry.name,
        type: 'resource',
        startTime: entry.startTime,
        duration: entry.duration,
        transferSize: entry.transferSize || 0,
        encodedBodySize: entry.encodedBodySize || 0,
        decodedBodySize: entry.decodedBodySize || 0,
        responseStart: entry.responseStart,
        responseEnd: entry.responseEnd,
        connectStart: entry.connectStart,
        connectEnd: entry.connectEnd,
        domainLookupStart: entry.domainLookupStart,
        domainLookupEnd: entry.domainLookupEnd
      }));

      // Also collect navigation timing
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries.length > 0) {
        const entry = navEntries[0];
        this.resources.unshift({
          name: entry.name,
          type: 'navigation',
          startTime: entry.startTime,
          duration: entry.duration,
          transferSize: entry.transferSize || 0,
          encodedBodySize: entry.encodedBodySize || 0,
          decodedBodySize: entry.decodedBodySize || 0,
          responseStart: entry.responseStart,
          responseEnd: entry.responseEnd,
          connectStart: entry.connectStart,
          connectEnd: entry.connectEnd,
          domainLookupStart: entry.domainLookupStart,
          domainLookupEnd: entry.domainLookupEnd
        });
      }
    } catch (error) {
      console.warn('Failed to collect resource timings:', error);
    }
  }

  getSlowResources(threshold = 1000): ResourceTiming[] {
    return this.resources.filter(resource => resource.duration > threshold);
  }

  getLargeResources(threshold = 1024 * 1024): ResourceTiming[] {
    return this.resources.filter(resource => resource.transferSize > threshold);
  }

  getResourcesByType(type: string): ResourceTiming[] {
    return this.resources.filter(resource => {
      const url = new URL(resource.name, window.location.href);
      const extension = url.pathname.split('.').pop()?.toLowerCase() || '';
      
      switch (type) {
        case 'script':
          return extension === 'js' || resource.name.includes('javascript');
        case 'stylesheet':
          return extension === 'css';
        case 'image':
          return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension);
        case 'font':
          return ['woff', 'woff2', 'ttf', 'otf'].includes(extension);
        case 'document':
          return extension === 'html' || resource.type === 'navigation';
        default:
          return false;
      }
    });
  }

  getTotalTransferSize(): number {
    return this.resources.reduce((total, resource) => total + resource.transferSize, 0);
  }

  getAverageResponseTime(): number {
    if (this.resources.length === 0) return 0;
    
    const totalTime = this.resources.reduce((total, resource) => 
      total + (resource.responseEnd - resource.responseStart), 0);
    
    return totalTime / this.resources.length;
  }

  getResourceTimings(): ResourceTiming[] {
    return [...this.resources];
  }
}

// ========== MEMORY MONITOR ==========
export class MemoryMonitor {
  private measurements: MemoryInfo[] = [];
  private monitoring = false;
  private interval?: NodeJS.Timeout;

  startMonitoring(intervalMs = 5000): void {
    if (this.monitoring) return;
    
    this.monitoring = true;
    this.interval = setInterval(() => {
      this.collectMemoryInfo();
    }, intervalMs);
    
    // Initial measurement
    this.collectMemoryInfo();
  }

  stopMonitoring(): void {
    this.monitoring = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  private collectMemoryInfo(): void {
    // Check if we're in a browser environment with performance.memory support
    if (typeof window === 'undefined') return;
    
    try {
      // Chrome/Chromium-based browsers support performance.memory
      const memory = (performance as any).memory;
      if (memory) {
        const info: MemoryInfo = {
          usedJSHeapSize: memory.usedJSHeapSize || 0,
          totalJSHeapSize: memory.totalJSHeapSize || 0,
          jsHeapSizeLimit: memory.jsHeapSizeLimit || 0,
          timestamp: new Date()
        };
        
        this.measurements.push(info);
        
        // Keep only last 100 measurements
        if (this.measurements.length > 100) {
          this.measurements.shift();
        }
      } else {
        // Fallback for browsers without performance.memory
        const info: MemoryInfo = {
          usedJSHeapSize: 0,
          totalJSHeapSize: 0,
          jsHeapSizeLimit: 0,
          timestamp: new Date()
        };
        
        this.measurements.push(info);
        
        if (this.measurements.length > 100) {
          this.measurements.shift();
        }
      }
    } catch (error) {
      console.warn('Failed to collect memory info:', error);
    }
  }

  getCurrentMemoryInfo(): MemoryInfo | null {
    this.collectMemoryInfo();
    return this.measurements[this.measurements.length - 1] || null;
  }

  getMemoryHistory(): MemoryInfo[] {
    return [...this.measurements];
  }

  getMemoryTrend(): 'increasing' | 'decreasing' | 'stable' {
    if (this.measurements.length < 10) return 'stable';
    
    const recent = this.measurements.slice(-10);
    const older = this.measurements.slice(-20, -10);
    
    if (older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, m) => sum + m.usedJSHeapSize, 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + m.usedJSHeapSize, 0) / older.length;
    
    const threshold = olderAvg * 0.1; // 10% threshold
    
    if (recentAvg > olderAvg + threshold) return 'increasing';
    if (recentAvg < olderAvg - threshold) return 'decreasing';
    return 'stable';
  }

  isMemoryLeakDetected(): boolean {
    if (this.measurements.length < 20) return false;
    
    const trend = this.getMemoryTrend();
    const current = this.measurements[this.measurements.length - 1];
    const memoryUsagePercent = current.usedJSHeapSize / current.jsHeapSizeLimit;
    
    return trend === 'increasing' && memoryUsagePercent > 0.8;
  }
}

// ========== PERFORMANCE BUDGET MANAGER ==========
export class PerformanceBudgetManager {
  private budgets: PerformanceBudget[] = [];
  private alerts: PerformanceAlert[] = [];
  private callbacks: Array<(alert: PerformanceAlert) => void> = [];

  addBudget(budget: PerformanceBudget): void {
    this.budgets.push(budget);
  }

  removeBudget(metric: string): void {
    this.budgets = this.budgets.filter(b => b.metric !== metric);
  }

  checkBudgets(metrics: PerformanceMetric[]): PerformanceAlert[] {
    const newAlerts: PerformanceAlert[] = [];
    
    for (const budget of this.budgets) {
      const metric = metrics.find(m => m.name === budget.metric);
      if (!metric) continue;
      
      let violated = false;
      
      switch (budget.operator) {
        case 'lt':
          violated = metric.value >= budget.threshold;
          break;
        case 'lte':
          violated = metric.value > budget.threshold;
          break;
        case 'gt':
          violated = metric.value <= budget.threshold;
          break;
        case 'gte':
          violated = metric.value < budget.threshold;
          break;
      }
      
      if (violated) {
        const alert: PerformanceAlert = {
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          metric: budget.metric,
          value: metric.value,
          threshold: budget.threshold,
          severity: budget.severity,
          timestamp: new Date(),
          message: `${budget.metric} (${metric.value}${metric.unit}) ${budget.operator} ${budget.threshold}${metric.unit}`
        };
        
        newAlerts.push(alert);
        this.alerts.push(alert);
        this.callbacks.forEach(callback => callback(alert));
      }
    }
    
    return newAlerts;
  }

  onAlert(callback: (alert: PerformanceAlert) => void): void {
    this.callbacks.push(callback);
  }

  getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  clearAlerts(): void {
    this.alerts = [];
  }

  getBudgets(): PerformanceBudget[] {
    return [...this.budgets];
  }
}

// ========== ENTERPRISE PERFORMANCE MONITOR ==========
export class EnterprisePerformanceMonitor extends EventEmitter {
  private webVitals: WebVitalsCollector;
  private resourceAnalyzer: ResourceTimingAnalyzer;
  private memoryMonitor: MemoryMonitor;
  private budgetManager: PerformanceBudgetManager;
  private customMetrics: PerformanceMetric[] = [];
  private monitoring = false;
  private reportInterval?: NodeJS.Timeout;

  constructor() {
    super();
    
    this.webVitals = new WebVitalsCollector();
    this.resourceAnalyzer = new ResourceTimingAnalyzer();
    this.memoryMonitor = new MemoryMonitor();
    this.budgetManager = new PerformanceBudgetManager();
    
    this.setupEventHandlers();
    this.setupDefaultBudgets();
  }

  private setupEventHandlers(): void {
    this.webVitals.onMetric((metric) => {
      this.emit('web-vital', metric);
    });
    
    this.budgetManager.onAlert((alert) => {
      this.emit('performance-alert', alert);
    });
  }

  private setupDefaultBudgets(): void {
    // Default Web Vitals budgets
    this.budgetManager.addBudget({
      metric: 'FCP',
      threshold: 1800,
      operator: 'lte',
      severity: 'warning'
    });
    
    this.budgetManager.addBudget({
      metric: 'LCP',
      threshold: 2500,
      operator: 'lte',
      severity: 'warning'
    });
    
    this.budgetManager.addBudget({
      metric: 'FID',
      threshold: 100,
      operator: 'lte',
      severity: 'warning'
    });
    
    this.budgetManager.addBudget({
      metric: 'CLS',
      threshold: 0.1,
      operator: 'lte',
      severity: 'warning'
    });
  }

  // ========== MONITORING CONTROL ==========
  startMonitoring(): void {
    if (this.monitoring) return;
    
    this.monitoring = true;
    this.memoryMonitor.startMonitoring();
    
    // Generate performance reports periodically
    this.reportInterval = setInterval(() => {
      this.generateReport();
    }, 30000); // Every 30 seconds
    
    this.emit('monitoring-started');
  }

  stopMonitoring(): void {
    if (!this.monitoring) return;
    
    this.monitoring = false;
    this.memoryMonitor.stopMonitoring();
    
    if (this.reportInterval) {
      clearInterval(this.reportInterval);
      this.reportInterval = undefined;
    }
    
    this.emit('monitoring-stopped');
  }

  // ========== CUSTOM METRICS ==========
  recordMetric(name: string, value: number, unit: PerformanceMetric['unit'], options?: {
    category?: PerformanceMetric['category'];
    tags?: Record<string, string>;
    metadata?: Record<string, any>;
  }): void {
    const metric: PerformanceMetric = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      value,
      unit,
      timestamp: new Date(),
      category: options?.category || 'custom',
      tags: options?.tags,
      metadata: options?.metadata
    };
    
    this.customMetrics.push(metric);
    
    // Keep only last 1000 custom metrics
    if (this.customMetrics.length > 1000) {
      this.customMetrics.shift();
    }
    
    this.emit('custom-metric', metric);
    
    // Check budgets
    this.budgetManager.checkBudgets([metric]);
  }

  measureFunction<T>(name: string, fn: () => T, tags?: Record<string, string>): T {
    const start = performance.now();
    
    try {
      const result = fn();
      
      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = performance.now() - start;
          this.recordMetric(`${name}_duration`, duration, 'ms', {
            category: 'custom',
            tags: { ...tags, type: 'async' }
          });
        }) as T;
      } else {
        const duration = performance.now() - start;
        this.recordMetric(`${name}_duration`, duration, 'ms', {
          category: 'custom',
          tags: { ...tags, type: 'sync' }
        });
        return result;
      }
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(`${name}_duration`, duration, 'ms', {
        category: 'custom',
        tags: { ...tags, type: 'error' }
      });
      throw error;
    }
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>, tags?: Record<string, string>): Promise<T> {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      this.recordMetric(`${name}_duration`, duration, 'ms', {
        category: 'custom',
        tags: { ...tags, type: 'async' }
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(`${name}_duration`, duration, 'ms', {
        category: 'custom',
        tags: { ...tags, type: 'error' }
      });
      throw error;
    }
  }

  // ========== REPORTING ==========
  generateReport(): PerformanceReport {
    const report: PerformanceReport = {
      timestamp: new Date(),
      webVitals: this.webVitals.getMetrics(),
      navigationTiming: this.getNavigationTiming(),
      resourceTimings: this.resourceAnalyzer.getResourceTimings(),
      memoryInfo: this.memoryMonitor.getCurrentMemoryInfo() || {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0,
        timestamp: new Date()
      },
      customMetrics: [...this.customMetrics],
      alerts: this.budgetManager.getAlerts(),
      score: this.calculatePerformanceScore(),
      recommendations: this.generateRecommendations()
    };
    
    this.emit('performance-report', report);
    return report;
  }

  private getNavigationTiming(): NavigationTiming {
    if (typeof window === 'undefined' || !window.performance) {
      return {
        domContentLoaded: 0,
        loadComplete: 0,
        firstPaint: 0,
        firstContentfulPaint: 0
      };
    }
    
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.fetchStart : 0,
        loadComplete: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0,
        firstPaint: paintEntries.find(e => e.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paintEntries.find(e => e.name === 'first-contentful-paint')?.startTime || 0,
        timeToInteractive: this.calculateTTI()
      };
    } catch (error) {
      console.warn('Failed to get navigation timing:', error);
      return {
        domContentLoaded: 0,
        loadComplete: 0,
        firstPaint: 0,
        firstContentfulPaint: 0
      };
    }
  }

  private calculateTTI(): number | undefined {
    // Simplified TTI calculation
    // In a real implementation, this would be more sophisticated
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navigation ? navigation.domInteractive - navigation.fetchStart : undefined;
    } catch {
      return undefined;
    }
  }

  private calculatePerformanceScore(): PerformanceReport['score'] {
    const webVitals = this.webVitals.getMetrics();
    
    // Calculate performance score based on Web Vitals
    let performanceScore = 100;
    
    webVitals.forEach(vital => {
      const penalty = vital.rating === 'poor' ? 30 : vital.rating === 'needs-improvement' ? 15 : 0;
      performanceScore -= penalty;
    });
    
    performanceScore = Math.max(0, performanceScore);
    
    // For demonstration, other scores are simplified
    return {
      overall: Math.round((performanceScore + 80 + 85 + 75) / 4), // Average of all scores
      performance: performanceScore,
      accessibility: 80, // Would be calculated from accessibility audits
      bestPractices: 85, // Would be calculated from best practices audits
      seo: 75 // Would be calculated from SEO audits
    };
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const webVitals = this.webVitals.getMetrics();
    const slowResources = this.resourceAnalyzer.getSlowResources(2000);
    const largeResources = this.resourceAnalyzer.getLargeResources(1024 * 1024);
    const memoryTrend = this.memoryMonitor.getMemoryTrend();
    
    // Web Vitals recommendations
    webVitals.forEach(vital => {
      if (vital.rating === 'poor' || vital.rating === 'needs-improvement') {
        switch (vital.name) {
          case 'LCP':
            recommendations.push('Optimize Largest Contentful Paint by reducing server response times and optimizing resource loading');
            break;
          case 'FID':
            recommendations.push('Improve First Input Delay by reducing JavaScript execution time and splitting code');
            break;
          case 'CLS':
            recommendations.push('Reduce Cumulative Layout Shift by specifying dimensions for images and avoiding dynamic content insertion');
            break;
          case 'FCP':
            recommendations.push('Improve First Contentful Paint by optimizing server response times and eliminating render-blocking resources');
            break;
        }
      }
    });
    
    // Resource recommendations
    if (slowResources.length > 0) {
      recommendations.push(`Optimize ${slowResources.length} slow-loading resources (>2s load time)`);
    }
    
    if (largeResources.length > 0) {
      recommendations.push(`Compress or optimize ${largeResources.length} large resources (>1MB)`);
    }
    
    // Memory recommendations
    if (memoryTrend === 'increasing') {
      recommendations.push('Investigate potential memory leaks - memory usage is consistently increasing');
    }
    
    if (this.memoryMonitor.isMemoryLeakDetected()) {
      recommendations.push('Critical: Memory leak detected - immediate investigation required');
    }
    
    return recommendations;
  }

  // ========== PUBLIC API ==========
  getWebVitals(): WebVitalsMetric[] {
    return this.webVitals.getMetrics();
  }

  getResourceTimings(): ResourceTiming[] {
    return this.resourceAnalyzer.getResourceTimings();
  }

  getMemoryInfo(): MemoryInfo | null {
    return this.memoryMonitor.getCurrentMemoryInfo();
  }

  getCustomMetrics(): PerformanceMetric[] {
    return [...this.customMetrics];
  }

  addPerformanceBudget(budget: PerformanceBudget): void {
    this.budgetManager.addBudget(budget);
  }

  removePerformanceBudget(metric: string): void {
    this.budgetManager.removeBudget(metric);
  }

  getPerformanceAlerts(): PerformanceAlert[] {
    return this.budgetManager.getAlerts();
  }

  clearPerformanceAlerts(): void {
    this.budgetManager.clearAlerts();
  }

  // ========== ANALYSIS METHODS ==========
  analyzePage(): {
    critical: string[];
    warnings: string[];
    info: string[];
  } {
    const critical: string[] = [];
    const warnings: string[] = [];
    const info: string[] = [];
    
    const webVitals = this.webVitals.getMetrics();
    const slowResources = this.resourceAnalyzer.getSlowResources();
    const largeResources = this.resourceAnalyzer.getLargeResources();
    
    // Critical issues
    webVitals.forEach(vital => {
      if (vital.rating === 'poor') {
        critical.push(`${vital.name}: ${vital.value.toFixed(0)}ms is poor (needs < ${this.getThreshold(vital.name)?.good}ms)`);
      }
    });
    
    if (this.memoryMonitor.isMemoryLeakDetected()) {
      critical.push('Memory leak detected - memory usage is increasing consistently');
    }
    
    // Warnings
    webVitals.forEach(vital => {
      if (vital.rating === 'needs-improvement') {
        warnings.push(`${vital.name}: ${vital.value.toFixed(0)}ms needs improvement`);
      }
    });
    
    if (slowResources.length > 0) {
      warnings.push(`${slowResources.length} resources are loading slowly (>1s)`);
    }
    
    if (largeResources.length > 0) {
      warnings.push(`${largeResources.length} resources are large (>1MB) and may impact performance`);
    }
    
    // Info
    const totalSize = this.resourceAnalyzer.getTotalTransferSize();
    info.push(`Total transfer size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
    
    const avgResponseTime = this.resourceAnalyzer.getAverageResponseTime();
    info.push(`Average response time: ${avgResponseTime.toFixed(0)}ms`);
    
    return { critical, warnings, info };
  }

  private getThreshold(name: string) {
    const thresholds = {
      'FCP': { good: 1800, poor: 3000 },
      'LCP': { good: 2500, poor: 4000 },
      'FID': { good: 100, poor: 300 },
      'INP': { good: 200, poor: 500 },
      'CLS': { good: 0.1, poor: 0.25 },
      'TTFB': { good: 800, poor: 1800 }
    };
    
    return thresholds[name as keyof typeof thresholds];
  }

  destroy(): void {
    this.stopMonitoring();
    this.removeAllListeners();
  }
}

// ========== FACTORY FUNCTIONS ==========
export function createPerformanceMonitor(): EnterprisePerformanceMonitor {
  return new EnterprisePerformanceMonitor();
}

// ========== GLOBAL SINGLETON ==========
let globalPerformanceMonitor: EnterprisePerformanceMonitor | null = null;

export function getGlobalPerformanceMonitor(): EnterprisePerformanceMonitor {
  if (!globalPerformanceMonitor) {
    globalPerformanceMonitor = new EnterprisePerformanceMonitor();
  }
  return globalPerformanceMonitor;
}

export function setGlobalPerformanceMonitor(monitor: EnterprisePerformanceMonitor): void {
  globalPerformanceMonitor = monitor;
}

export default EnterprisePerformanceMonitor;
