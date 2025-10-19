// ESP32 CamViewer - Lazy Image Loading Hook
// Generated: 2025-10-19

import { useEffect, useRef, useState } from 'react';

interface UseLazyImageOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useLazyImage(
  src: string,
  options: UseLazyImageOptions = {}
) {
  const { threshold = 0.1, rootMargin = '50px' } = options;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: load immediately
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(img);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return {
    imgRef,
    src: isInView ? src : undefined,
    isLoaded,
    isInView,
    onLoad: handleLoad,
  };
}
