/**
 * Metrics API Endpoint
 * 
 * Exposes Prometheus-compatible metrics from the monitoring system
 */

import { NextRequest, NextResponse } from 'next/server';

// Conditional monitoring import to avoid browser issues
let getGlobalMonitoringSystem: any = null;

try {
  if (typeof window === 'undefined') {
    // Only import on server-side
    const monitoringModule = require('@/lib/monitoring');
    getGlobalMonitoringSystem = monitoringModule.getGlobalMonitoringSystem;
  }
} catch (error) {
  console.warn('Could not import monitoring system for metrics:', error);
}

export async function GET(request: NextRequest) {
  try {
    const metrics: string[] = [
      '# HELP indiantrademart_frontend_info Application information',
      '# TYPE indiantrademart_frontend_info gauge',
      `indiantrademart_frontend_info{version="${process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}",environment="${process.env.NODE_ENV || 'development'}"} 1`,
      ''
    ];

    // Process metrics (if available)
    if (typeof process !== 'undefined') {
      const memUsage = process.memoryUsage();
      
      metrics.push(
        '# HELP nodejs_memory_usage_bytes Process memory usage in bytes',
        '# TYPE nodejs_memory_usage_bytes gauge',
        `nodejs_memory_usage_bytes{type="rss"} ${memUsage.rss}`,
        `nodejs_memory_usage_bytes{type="heapTotal"} ${memUsage.heapTotal}`,
        `nodejs_memory_usage_bytes{type="heapUsed"} ${memUsage.heapUsed}`,
        `nodejs_memory_usage_bytes{type="external"} ${memUsage.external}`,
        '',
        '# HELP nodejs_process_uptime_seconds Process uptime in seconds',
        '# TYPE nodejs_process_uptime_seconds counter',
        `nodejs_process_uptime_seconds ${process.uptime()}`,
        ''
      );
    }

    // Monitoring system metrics (if available)
    if (getGlobalMonitoringSystem) {
      try {
        const monitoring = getGlobalMonitoringSystem();
        const systemMetrics = monitoring.getMetrics();
        const webVitals = monitoring.getWebVitals?.() || [];
        
        // Error metrics
        metrics.push(
          '# HELP indiantrademart_errors_total Total number of errors',
          '# TYPE indiantrademart_errors_total counter',
          `indiantrademart_errors_total ${systemMetrics.totalErrors || 0}`,
          '',
          '# HELP indiantrademart_error_rate Error rate percentage',
          '# TYPE indiantrademart_error_rate gauge',
          `indiantrademart_error_rate ${(systemMetrics.errorRate || 0) * 100}`,
          ''
        );

        // Performance metrics
        if (systemMetrics.averageResponseTime) {
          metrics.push(
            '# HELP indiantrademart_response_time_ms Average response time in milliseconds',
            '# TYPE indiantrademart_response_time_ms gauge',
            `indiantrademart_response_time_ms ${systemMetrics.averageResponseTime}`,
            ''
          );
        }

        // Web Vitals metrics
        if (webVitals.length > 0) {
          metrics.push(
            '# HELP indiantrademart_web_vitals Web Vitals metrics',
            '# TYPE indiantrademart_web_vitals gauge'
          );
          
          webVitals.forEach(vital => {
            metrics.push(
              `indiantrademart_web_vitals{metric="${vital.name.toLowerCase()}",rating="${vital.rating}"} ${vital.value}`
            );
          });
          
          metrics.push('');
        }

        // Cache metrics (if available)
        if (systemMetrics.cacheHits !== undefined) {
          metrics.push(
            '# HELP indiantrademart_cache_operations_total Cache operations',
            '# TYPE indiantrademart_cache_operations_total counter',
            `indiantrademart_cache_operations_total{type="hits"} ${systemMetrics.cacheHits}`,
            `indiantrademart_cache_operations_total{type="misses"} ${systemMetrics.cacheMisses}`,
            ''
          );
        }

      } catch (monitoringError) {
        console.warn('Could not get monitoring metrics:', monitoringError);
        metrics.push(
          '# HELP indiantrademart_monitoring_error Monitoring system error',
          '# TYPE indiantrademart_monitoring_error gauge',
          'indiantrademart_monitoring_error 1',
          ''
        );
      }
    }

    // HTTP request metrics (basic)
    const timestamp = Date.now();
    metrics.push(
      '# HELP indiantrademart_http_requests_total Total HTTP requests',
      '# TYPE indiantrademart_http_requests_total counter',
      `indiantrademart_http_requests_total{method="GET",endpoint="/api/metrics"} 1`,
      '',
      '# HELP indiantrademart_last_scrape_timestamp_seconds Last metrics scrape timestamp',
      '# TYPE indiantrademart_last_scrape_timestamp_seconds gauge',
      `indiantrademart_last_scrape_timestamp_seconds ${Math.floor(timestamp / 1000)}`,
      ''
    );

    const response = metrics.join('\n');
    
    return new NextResponse(response, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('Metrics endpoint error:', error);
    
    const errorMetrics = [
      '# HELP indiantrademart_metrics_error Metrics endpoint error',
      '# TYPE indiantrademart_metrics_error gauge',
      'indiantrademart_metrics_error 1',
      ''
    ].join('\n');

    return new NextResponse(errorMetrics, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
      },
    });
  }
}
