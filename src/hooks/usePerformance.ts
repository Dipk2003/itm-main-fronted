'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  navigationStart: number;
  loadEventEnd: number;
  domContentLoadedEventEnd: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
}

export const usePerformance = (pageName: string) => {
  useEffect(() => {
    const measurePerformance = () => {
      if (typeof window === 'undefined' || !window.performance) {
        return;
      }

      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = window.performance.getEntriesByType('paint');

      const metrics: PerformanceMetrics = {
        navigationStart: navigation.navigationStart,
        loadEventEnd: navigation.loadEventEnd,
        domContentLoadedEventEnd: navigation.domContentLoadedEventEnd,
      };

      // Get paint metrics
      paintEntries.forEach(entry => {
        if (entry.name === 'first-paint') {
          metrics.firstPaint = entry.startTime;
        } else if (entry.name === 'first-contentful-paint') {
          metrics.firstContentfulPaint = entry.startTime;
        }
      });

      // Calculate meaningful metrics
      const totalLoadTime = navigation.loadEventEnd - navigation.navigationStart;
      const domLoadTime = navigation.domContentLoadedEventEnd - navigation.navigationStart;

      // Log performance metrics (in development)
      if (process.env.NODE_ENV === 'development') {
        console.group(`📊 Performance Metrics - ${pageName}`);
        console.log(`🕒 Total Load Time: ${totalLoadTime.toFixed(2)}ms`);
        console.log(`🏠 DOM Load Time: ${domLoadTime.toFixed(2)}ms`);
        if (metrics.firstPaint) {
          console.log(`🎨 First Paint: ${metrics.firstPaint.toFixed(2)}ms`);
        }
        if (metrics.firstContentfulPaint) {
          console.log(`📝 First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(2)}ms`);
        }
        console.groupEnd();
      }

      // Send to analytics in production (optional)
      if (process.env.NODE_ENV === 'production') {
        // You can integrate with analytics services here
        // Example: Google Analytics, Mixpanel, etc.
      }
    };

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    return () => {
      window.removeEventListener('load', measurePerformance);
    };
  }, [pageName]);
};

// Hook to measure component render time
export const useRenderTime = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  });
};

export default usePerformance;
