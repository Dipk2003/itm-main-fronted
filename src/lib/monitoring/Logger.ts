/**
 * Enterprise Production Logger
 * 
 * Multi-transport logging system with structured logging, context,
 * performance tracking, and production-grade features
 */

import { EventEmitter } from 'events';

// ========== LOGGING TYPES ==========
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: any;
  metadata: {
    environment: string;
    service: string;
    version?: string;
    sessionId?: string;
    userId?: string;
    requestId?: string;
    traceId?: string;
    component?: string;
    action?: string;
    duration?: number;
    tags?: string[];
    fingerprint?: string;
    url?: string;
    userAgent?: string;
    ip?: string;
  };
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
}

export interface LogTransport {
  name: string;
  level: LogLevel;
  enabled: boolean;
  log(entry: LogEntry): Promise<void>;
  flush?(): Promise<void>;
}

export interface LogFormatter {
  format(entry: LogEntry): string | object;
}

export interface LogFilter {
  shouldLog(entry: LogEntry): boolean;
}

export interface LoggerConfig {
  level: LogLevel;
  transports: LogTransport[];
  formatter?: LogFormatter;
  filters?: LogFilter[];
  context?: Record<string, any>;
  enablePerformanceTracking?: boolean;
  enableSampling?: boolean;
  sampleRate?: number;
  bufferSize?: number;
  flushInterval?: number;
  environment?: string;
  service?: string;
  version?: string;
}

// ========== BUILT-IN FORMATTERS ==========
export class JSONFormatter implements LogFormatter {
  format(entry: LogEntry): object {
    return {
      '@timestamp': entry.timestamp.toISOString(),
      level: entry.level,
      message: entry.message,
      ...entry.metadata,
      context: entry.context,
      error: entry.error
    };
  }
}

export class TextFormatter implements LogFormatter {
  private colors = {
    debug: '\x1b[36m', // cyan
    info: '\x1b[32m',  // green
    warn: '\x1b[33m',  // yellow
    error: '\x1b[31m', // red
    fatal: '\x1b[35m', // magenta
    reset: '\x1b[0m'
  };

  format(entry: LogEntry): string {
    const color = this.colors[entry.level] || this.colors.reset;
    const timestamp = entry.timestamp.toISOString();
    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    const metaStr = this.formatMetadata(entry.metadata);
    
    return `${color}[${timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${contextStr}${metaStr}${this.colors.reset}`;
  }

  private formatMetadata(metadata: LogEntry['metadata']): string {
    const relevant = [];
    if (metadata.requestId) relevant.push(`req:${metadata.requestId}`);
    if (metadata.userId) relevant.push(`user:${metadata.userId}`);
    if (metadata.component) relevant.push(`comp:${metadata.component}`);
    if (metadata.duration) relevant.push(`dur:${metadata.duration}ms`);
    
    return relevant.length > 0 ? ` [${relevant.join(' ')}]` : '';
  }
}

// ========== BUILT-IN TRANSPORTS ==========
export class ConsoleTransport implements LogTransport {
  name = 'console';
  level: LogLevel;
  enabled = true;
  private formatter: LogFormatter;

  constructor(config: { level?: LogLevel; formatter?: LogFormatter } = {}) {
    this.level = config.level || 'debug';
    this.formatter = config.formatter || new TextFormatter();
  }

  async log(entry: LogEntry): Promise<void> {
    const formatted = this.formatter.format(entry);
    
    switch (entry.level) {
      case 'debug':
        console.debug(formatted);
        break;
      case 'info':
        console.info(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
      case 'fatal':
        console.error(formatted);
        break;
    }
  }
}

export class BufferedTransport implements LogTransport {
  name: string;
  level: LogLevel;
  enabled = true;
  private buffer: LogEntry[] = [];
  private maxSize: number;
  private flushCallback?: (entries: LogEntry[]) => Promise<void>;

  constructor(config: {
    name: string;
    level?: LogLevel;
    maxSize?: number;
    flushCallback?: (entries: LogEntry[]) => Promise<void>;
  }) {
    this.name = config.name;
    this.level = config.level || 'debug';
    this.maxSize = config.maxSize || 1000;
    this.flushCallback = config.flushCallback;
  }

  async log(entry: LogEntry): Promise<void> {
    this.buffer.push(entry);
    
    if (this.buffer.length >= this.maxSize) {
      await this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;
    
    const entries = this.buffer.slice();
    this.buffer = [];
    
    if (this.flushCallback) {
      await this.flushCallback(entries);
    }
  }

  getBuffer(): LogEntry[] {
    return this.buffer.slice();
  }
}

export class HTTPTransport implements LogTransport {
  name = 'http';
  level: LogLevel;
  enabled = true;
  private endpoint: string;
  private headers: Record<string, string>;
  private formatter: LogFormatter;
  private buffer: LogEntry[] = [];
  private batchSize: number;

  constructor(config: {
    endpoint: string;
    level?: LogLevel;
    headers?: Record<string, string>;
    formatter?: LogFormatter;
    batchSize?: number;
  }) {
    this.endpoint = config.endpoint;
    this.level = config.level || 'info';
    this.headers = config.headers || {};
    this.formatter = config.formatter || new JSONFormatter();
    this.batchSize = config.batchSize || 10;
  }

  async log(entry: LogEntry): Promise<void> {
    this.buffer.push(entry);
    
    if (this.buffer.length >= this.batchSize) {
      await this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;
    
    const entries = this.buffer.slice();
    this.buffer = [];
    
    try {
      const payload = entries.map(entry => this.formatter.format(entry));
      
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.headers
        },
        body: JSON.stringify({ logs: payload })
      });
    } catch (error) {
      // Fallback: add entries back to buffer
      this.buffer.unshift(...entries);
      throw error;
    }
  }
}

// ========== BUILT-IN FILTERS ==========
export class LevelFilter implements LogFilter {
  private levelOrder = { debug: 0, info: 1, warn: 2, error: 3, fatal: 4 };
  private minLevel: LogLevel;

  constructor(minLevel: LogLevel) {
    this.minLevel = minLevel;
  }

  shouldLog(entry: LogEntry): boolean {
    return this.levelOrder[entry.level] >= this.levelOrder[this.minLevel];
  }
}

export class SamplingFilter implements LogFilter {
  private rate: number;

  constructor(rate: number) {
    this.rate = Math.max(0, Math.min(1, rate));
  }

  shouldLog(entry: LogEntry): boolean {
    return Math.random() <= this.rate;
  }
}

export class ComponentFilter implements LogFilter {
  private allowedComponents: Set<string>;
  private blockedComponents: Set<string>;

  constructor(config: { allow?: string[]; block?: string[] }) {
    this.allowedComponents = new Set(config.allow || []);
    this.blockedComponents = new Set(config.block || []);
  }

  shouldLog(entry: LogEntry): boolean {
    const component = entry.metadata.component;
    
    if (this.blockedComponents.size > 0 && component && this.blockedComponents.has(component)) {
      return false;
    }
    
    if (this.allowedComponents.size > 0 && component) {
      return this.allowedComponents.has(component);
    }
    
    return true;
  }
}

// ========== PERFORMANCE TRACKER ==========
export class PerformanceTracker {
  private timers = new Map<string, { start: number; metadata?: any }>();

  start(operation: string, metadata?: any): void {
    this.timers.set(operation, {
      start: performance.now(),
      metadata
    });
  }

  end(operation: string): { duration: number; metadata?: any } | null {
    const timer = this.timers.get(operation);
    if (!timer) return null;
    
    this.timers.delete(operation);
    
    return {
      duration: Math.round(performance.now() - timer.start),
      metadata: timer.metadata
    };
  }

  measure<T>(operation: string, fn: () => T | Promise<T>, metadata?: any): T | Promise<T> {
    this.start(operation, metadata);
    
    try {
      const result = fn();
      
      if (result instanceof Promise) {
        return result.finally(() => this.end(operation)) as Promise<T>;
      } else {
        this.end(operation);
        return result;
      }
    } catch (error) {
      this.end(operation);
      throw error;
    }
  }
}

// ========== ENTERPRISE LOGGER ==========
export class EnterpriseLogger extends EventEmitter {
  private config: LoggerConfig;
  private transports: Map<string, LogTransport> = new Map();
  private filters: LogFilter[] = [];
  private formatter: LogFormatter;
  private context: Record<string, any> = {};
  private performanceTracker: PerformanceTracker;
  private buffer: LogEntry[] = [];
  private flushTimer?: NodeJS.Timeout;
  private levelOrder = { debug: 0, info: 1, warn: 2, error: 3, fatal: 4 };

  constructor(config: Partial<LoggerConfig> = {}) {
    super();

    this.config = {
      level: 'info',
      transports: [new ConsoleTransport()],
      formatter: new JSONFormatter(),
      filters: [],
      context: {},
      enablePerformanceTracking: true,
      enableSampling: false,
      sampleRate: 1.0,
      bufferSize: 100,
      flushInterval: 5000,
      environment: 'development',
      service: 'frontend',
      version: process.env.NEXT_PUBLIC_BUILD_VERSION || '1.0.0',
      ...config
    };

    this.formatter = this.config.formatter!;
    this.context = { ...this.config.context };
    this.performanceTracker = new PerformanceTracker();

    // Setup transports
    this.config.transports.forEach(transport => {
      this.addTransport(transport);
    });

    // Setup filters
    this.filters.push(new LevelFilter(this.config.level));
    
    if (this.config.filters) {
      this.filters.push(...this.config.filters);
    }

    if (this.config.enableSampling && this.config.sampleRate! < 1.0) {
      this.filters.push(new SamplingFilter(this.config.sampleRate!));
    }

    // Setup periodic flush
    this.setupPeriodicFlush();

    // Setup graceful shutdown
    this.setupGracefulShutdown();
  }

  // ========== CORE LOGGING METHODS ==========
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
    this.log('error', message, context, error);
  }

  fatal(message: string, context?: any, error?: Error): void {
    this.log('fatal', message, context, error);
  }

  private log(level: LogLevel, message: string, context?: any, error?: Error): void {
    const entry = this.createLogEntry(level, message, context, error);
    
    // Apply filters
    for (const filter of this.filters) {
      if (!filter.shouldLog(entry)) {
        return;
      }
    }

    // Emit event
    this.emit('log', entry);

    // Buffer entry
    this.buffer.push(entry);
    
    // Check if immediate flush is needed
    if (level === 'error' || level === 'fatal' || this.buffer.length >= this.config.bufferSize!) {
      this.flushLogs();
    }
  }

  private createLogEntry(level: LogLevel, message: string, context?: any, error?: Error): LogEntry {
    return {
      id: this.generateId(),
      timestamp: new Date(),
      level,
      message,
      context,
      metadata: {
        environment: this.config.environment!,
        service: this.config.service!,
        version: this.config.version,
        sessionId: this.context.sessionId,
        userId: this.context.userId,
        requestId: this.context.requestId,
        traceId: this.context.traceId,
        component: this.context.component,
        action: this.context.action,
        tags: this.context.tags,
        fingerprint: this.context.fingerprint,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        ip: this.context.ip
      },
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: (error as any).code
      } : undefined
    };
  }

  // ========== STRUCTURED LOGGING ==========
  logOperation(operation: string, result: 'success' | 'failure' | 'warning', data?: any, duration?: number): void {
    const level = result === 'failure' ? 'error' : result === 'warning' ? 'warn' : 'info';
    
    this.withContext({ 
      component: 'operation',
      action: operation,
      duration 
    }).log(level, `Operation ${operation} ${result}`, data);
  }

  logPerformance(operation: string, duration: number, metadata?: any): void {
    this.withContext({
      component: 'performance',
      action: operation,
      duration
    }).info(`Performance: ${operation}`, metadata);
  }

  logSecurity(event: string, severity: 'low' | 'medium' | 'high' | 'critical', data?: any): void {
    const level = severity === 'critical' ? 'fatal' : severity === 'high' ? 'error' : 'warn';
    
    this.withContext({
      component: 'security',
      action: event,
      tags: ['security', severity]
    }).log(level, `Security: ${event}`, data);
  }

  logUserAction(userId: string, action: string, data?: any, duration?: number): void {
    this.withContext({
      userId,
      component: 'user-action',
      action,
      duration
    }).info(`User action: ${action}`, data);
  }

  logAPICall(method: string, url: string, status: number, duration: number, data?: any): void {
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
    
    this.withContext({
      component: 'api-call',
      action: `${method} ${url}`,
      duration,
      tags: [`status:${status}`, `method:${method}`]
    }).log(level, `API call: ${method} ${url} (${status})`, data);
  }

  // ========== PERFORMANCE TRACKING ==========
  startTimer(operation: string, metadata?: any): void {
    if (this.config.enablePerformanceTracking) {
      this.performanceTracker.start(operation, metadata);
    }
  }

  endTimer(operation: string): number | null {
    if (!this.config.enablePerformanceTracking) return null;
    
    const result = this.performanceTracker.end(operation);
    if (result) {
      this.logPerformance(operation, result.duration, result.metadata);
      return result.duration;
    }
    return null;
  }

  measureSync<T>(operation: string, fn: () => T, metadata?: any): T {
    if (!this.config.enablePerformanceTracking) {
      return fn();
    }
    
    return this.performanceTracker.measure(operation, fn, metadata) as T;
  }

  async measureAsync<T>(operation: string, fn: () => Promise<T>, metadata?: any): Promise<T> {
    if (!this.config.enablePerformanceTracking) {
      return fn();
    }
    
    return this.performanceTracker.measure(operation, fn, metadata) as Promise<T>;
  }

  // ========== CONTEXT MANAGEMENT ==========
  withContext(context: Record<string, any>): EnterpriseLogger {
    const newLogger = Object.create(this);
    newLogger.context = { ...this.context, ...context };
    return newLogger;
  }

  setContext(context: Record<string, any>): void {
    this.context = { ...this.context, ...context };
  }

  clearContext(): void {
    this.context = {};
  }

  getContext(): Record<string, any> {
    return { ...this.context };
  }

  // ========== TRANSPORT MANAGEMENT ==========
  addTransport(transport: LogTransport): void {
    this.transports.set(transport.name, transport);
  }

  removeTransport(name: string): void {
    this.transports.delete(name);
  }

  getTransport(name: string): LogTransport | undefined {
    return this.transports.get(name);
  }

  enableTransport(name: string): void {
    const transport = this.transports.get(name);
    if (transport) {
      transport.enabled = true;
    }
  }

  disableTransport(name: string): void {
    const transport = this.transports.get(name);
    if (transport) {
      transport.enabled = false;
    }
  }

  // ========== FILTER MANAGEMENT ==========
  addFilter(filter: LogFilter): void {
    this.filters.push(filter);
  }

  removeFilter(filter: LogFilter): void {
    const index = this.filters.indexOf(filter);
    if (index > -1) {
      this.filters.splice(index, 1);
    }
  }

  setLevel(level: LogLevel): void {
    this.config.level = level;
    
    // Update level filter
    const levelFilterIndex = this.filters.findIndex(f => f instanceof LevelFilter);
    if (levelFilterIndex > -1) {
      this.filters[levelFilterIndex] = new LevelFilter(level);
    }
  }

  // ========== LOG FLUSHING ==========
  private setupPeriodicFlush(): void {
    if (this.config.flushInterval! > 0) {
      this.flushTimer = setInterval(() => {
        this.flushLogs();
      }, this.config.flushInterval);
    }
  }

  private async flushLogs(): Promise<void> {
    if (this.buffer.length === 0) return;

    const entries = this.buffer.splice(0);
    
    // Process entries through transports
    await Promise.allSettled(
      Array.from(this.transports.values())
        .filter(transport => transport.enabled)
        .map(async transport => {
          const relevantEntries = entries.filter(entry => 
            this.levelOrder[entry.level] >= this.levelOrder[transport.level]
          );
          
          for (const entry of relevantEntries) {
            try {
              await transport.log(entry);
            } catch (error) {
              console.error(`Transport ${transport.name} failed:`, error);
              this.emit('transport-error', { transport: transport.name, error });
            }
          }
        })
    );
  }

  async flush(): Promise<void> {
    await this.flushLogs();
    
    // Flush individual transports
    await Promise.allSettled(
      Array.from(this.transports.values())
        .filter(transport => transport.enabled && transport.flush)
        .map(transport => transport.flush!())
    );
  }

  // ========== SHUTDOWN ==========
  private setupGracefulShutdown(): void {
    const shutdown = async () => {
      await this.flush();
      if (this.flushTimer) {
        clearInterval(this.flushTimer);
      }
    };

    // Skip process handlers completely to avoid Edge Runtime issues
    // Only setup process handlers on Node.js server-side (not Edge Runtime)
    /*
    if (this.isNodeJSRuntime()) {
      try {
        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
        process.on('beforeExit', shutdown);
      } catch (error) {
        // Ignore process event setup errors
        console.warn('Failed to setup process handlers:', error);
      }
    }
    */

    // Browser-specific cleanup
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        // Synchronous flush for browser
        this.flushLogs();
      });
    }
  }

  async destroy(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    await this.flush();
    
    this.removeAllListeners();
    this.transports.clear();
    this.filters = [];
  }

  // ========== UTILITY METHODS ==========
  private generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private isNodeJSRuntime(): boolean {
    try {
      // Check if we're in a Node.js environment (not Edge Runtime or browser)
      return typeof process !== 'undefined' && 
             typeof window === 'undefined' &&
             typeof process.env !== 'undefined' &&
             process.env.NEXT_RUNTIME !== 'edge'; // Not in Next.js Edge Runtime
    } catch {
      return false;
    }
  }

  getStats(): {
    totalLogs: number;
    logsByLevel: Record<LogLevel, number>;
    transports: string[];
    filters: number;
    bufferSize: number;
  } {
    // This would normally track stats
    return {
      totalLogs: 0,
      logsByLevel: {
        debug: 0,
        info: 0,
        warn: 0,
        error: 0,
        fatal: 0
      },
      transports: Array.from(this.transports.keys()),
      filters: this.filters.length,
      bufferSize: this.buffer.length
    };
  }
}

// ========== FACTORY FUNCTIONS ==========
export function createLogger(config?: Partial<LoggerConfig>): EnterpriseLogger {
  return new EnterpriseLogger(config);
}

export function createProductionLogger(): EnterpriseLogger {
  return new EnterpriseLogger({
    level: 'info',
    environment: 'production',
    enableSampling: true,
    sampleRate: 0.1, // Sample 10% in production
    transports: [
      new ConsoleTransport({ 
        level: 'error', 
        formatter: new JSONFormatter() 
      }),
      new BufferedTransport({
        name: 'buffer',
        level: 'info',
        maxSize: 1000,
        flushCallback: async (entries) => {
          // Send to external logging service
          console.log(`Flushing ${entries.length} log entries`);
        }
      })
    ]
  });
}

export function createDevelopmentLogger(): EnterpriseLogger {
  return new EnterpriseLogger({
    level: 'debug',
    environment: 'development',
    enablePerformanceTracking: true,
    transports: [
      new ConsoleTransport({ 
        level: 'debug',
        formatter: new TextFormatter()
      })
    ]
  });
}

// ========== GLOBAL SINGLETON ==========
let globalLogger: EnterpriseLogger | null = null;

export function getGlobalLogger(): EnterpriseLogger {
  if (!globalLogger) {
    let isDevelopment = false;
    try {
      isDevelopment = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';
    } catch {
      // Default to production logger in Edge Runtime or other environments
    }
    globalLogger = isDevelopment ? createDevelopmentLogger() : createProductionLogger();
  }
  return globalLogger;
}

export function setGlobalLogger(logger: EnterpriseLogger): void {
  globalLogger = logger;
}

export default EnterpriseLogger;
