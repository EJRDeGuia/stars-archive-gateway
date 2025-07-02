/**
 * Performance optimization utilities for the application
 */

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Intersection Observer for lazy loading
export class LazyLoadManager {
  private static observer: IntersectionObserver | null = null;
  
  static init() {
    if (!this.observer && typeof window !== 'undefined') {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLElement;
              target.dispatchEvent(new CustomEvent('lazyload'));
              this.observer?.unobserve(target);
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1,
        }
      );
    }
    return this.observer;
  }
  
  static observe(element: HTMLElement) {
    const observer = this.init();
    if (observer) {
      observer.observe(element);
    }
  }
  
  static unobserve(element: HTMLElement) {
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }
  
  static disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private static marks = new Map<string, number>();
  
  static start(label: string) {
    this.marks.set(label, performance.now());
    if (typeof window !== 'undefined' && window.performance?.mark) {
      performance.mark(`${label}-start`);
    }
  }
  
  static end(label: string): number {
    const endTime = performance.now();
    const startTime = this.marks.get(label);
    
    if (typeof window !== 'undefined' && window.performance?.mark) {
      performance.mark(`${label}-end`);
    }
    
    if (startTime) {
      const duration = endTime - startTime;
      console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
      this.marks.delete(label);
      return duration;
    }
    
    return 0;
  }
  
  static measure(label: string, startMark: string, endMark: string) {
    if (typeof window !== 'undefined' && window.performance?.measure) {
      try {
        performance.measure(label, startMark, endMark);
      } catch (error) {
        console.warn('Performance measurement failed:', error);
      }
    }
  }
}

// Memory usage utilities
export class MemoryOptimizer {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  static set(key: string, data: any, ttlMs: number = 5 * 60 * 1000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }
  
  static get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  static clear() {
    this.cache.clear();
  }
  
  static cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
  
  static getSize() {
    return this.cache.size;
  }
}

// Auto cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    MemoryOptimizer.cleanup();
  }, 5 * 60 * 1000);
}