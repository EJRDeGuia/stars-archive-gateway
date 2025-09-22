/**
 * Performance monitoring and optimization utilities
 */

import { logger } from '@/services/logger';

// Bundle size analyzer
export const analyzeBundleSize = () => {
  if (import.meta.env.MODE === 'development') {
    logger.info('Bundle analysis available in development mode');
  }
};

// Performance monitoring
export class PerformanceMonitor {
  private static metrics = new Map<string, number>();

  static startTiming(label: string) {
    this.metrics.set(`${label}_start`, performance.now());
  }

  static endTiming(label: string) {
    const startTime = this.metrics.get(`${label}_start`);
    if (startTime) {
      const duration = performance.now() - startTime;
      logger.info(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` });
      this.metrics.delete(`${label}_start`);
      return duration;
    }
    return 0;
  }

  static markUserInteraction(action: string, elementId?: string) {
    const timestamp = performance.now();
    logger.userAction(action, { 
      timestamp, 
      elementId,
      url: window.location.pathname 
    });
  }
}

// Memory usage tracking
export const trackMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    logger.debug('Memory usage', {
      used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB`,
      total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)}MB`,
      limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`
    });
  }
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalPaths = [
    '/api/colleges',
    '/api/theses?limit=10'
  ];

  criticalPaths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = path;
    document.head.appendChild(link);
  });
};

// Image lazy loading with performance tracking
export const setupImageLazyLoading = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const start = performance.now();
          
          img.onload = () => {
            const loadTime = performance.now() - start;
            logger.info('Image loaded', { 
              src: img.src, 
              loadTime: `${loadTime.toFixed(2)}ms` 
            });
          };
          
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};