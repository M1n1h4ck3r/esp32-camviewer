// ESP32 CamViewer - Performance Monitoring Utilities
// Generated: 2025-10-19

/**
 * Performance monitoring utilities for development
 */

export class PerformanceMonitor {
  private static marks = new Map<string, number>();

  /**
   * Start timing an operation
   */
  static start(label: string) {
    if (typeof window === 'undefined') return;

    const timestamp = performance.now();
    this.marks.set(label, timestamp);

    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ [Performance] Started: ${label}`);
    }
  }

  /**
   * End timing and log duration
   */
  static end(label: string) {
    if (typeof window === 'undefined') return;

    const startTime = this.marks.get(label);
    if (!startTime) {
      console.warn(`⚠️ [Performance] No start time for: ${label}`);
      return;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(label);

    if (process.env.NODE_ENV === 'development') {
      const emoji = duration < 100 ? '✅' : duration < 500 ? '⚠️' : '❌';
      console.log(`${emoji} [Performance] ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  /**
   * Measure React component render time
   */
  static measureRender(componentName: string, callback: () => void) {
    this.start(`Render: ${componentName}`);
    callback();
    this.end(`Render: ${componentName}`);
  }

  /**
   * Log Core Web Vitals
   */
  static logWebVitals() {
    if (typeof window === 'undefined') return;

    // First Contentful Paint (FCP)
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint');

    if (fcp && process.env.NODE_ENV === 'development') {
      console.log(`🎨 [Web Vitals] FCP: ${fcp.startTime.toFixed(2)}ms`);
    }

    // Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      try {
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean };
            if (entry.entryType === 'layout-shift' && !layoutShiftEntry.hadRecentInput) {
              console.log(`📐 [Web Vitals] Layout Shift detected:`, entry);
            }
          }
        });

        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch {
        // PerformanceObserver not supported
      }
    }
  }

  /**
   * Get bundle size estimate
   */
  static async getBundleSize() {
    if (typeof window === 'undefined') return;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsResources = resources.filter((r) => r.name.endsWith('.js'));

    const totalSize = jsResources.reduce((acc, r) => {
      return acc + (r.transferSize || 0);
    }, 0);

    const sizeInKB = (totalSize / 1024).toFixed(2);

    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 [Bundle Size] Total JS: ${sizeInKB} KB`);
    }

    return { totalSize, sizeInKB };
  }

  /**
   * Measure image loading performance
   */
  static measureImageLoad(src: string, onComplete?: (duration: number) => void) {
    const label = `Image Load: ${src.split('/').pop()}`;
    this.start(label);

    const img = new Image();
    img.onload = () => {
      const duration = this.end(label);
      if (duration && onComplete) {
        onComplete(duration);
      }
    };
    img.onerror = () => {
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ [Performance] Image failed to load: ${src}`);
      }
    };
    img.src = src;
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: never[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Log performance metrics on page load
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      PerformanceMonitor.logWebVitals();
      PerformanceMonitor.getBundleSize();
    }, 1000);
  });
}
