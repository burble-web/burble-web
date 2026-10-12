'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useLocale } from '@/lib/i18n/context';

interface UseCarouselOptions {
  /** If 'half', scrolls by half the container width (useful for 2-card carousels). Defaults to 1. */
  scrollRatio?: number;
  /** Whether to scroll by exactly one child item at a time. Defaults to true. */
  stepByItem?: boolean;
}

export function useCarousel(options: UseCarouselOptions = {}) {
  const { scrollRatio = 1, stepByItem = true } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const { isRtl } = useLocale();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const getStepDistance = useCallback(
    (el: HTMLDivElement) => {
      if (stepByItem) {
        const firstChild = el.firstElementChild as HTMLElement | null;
        if (firstChild && firstChild.offsetWidth > 0) {
          const gap = parseFloat(window.getComputedStyle(el).gap || '12') || 12;
          return firstChild.offsetWidth + gap;
        }
      }
      return el.clientWidth * scrollRatio;
    },
    [stepByItem, scrollRatio]
  );

  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = Math.max(0, scrollWidth - clientWidth);
    const currentScroll = Math.abs(scrollLeft);

    setCanScrollPrev(currentScroll > 6);
    setCanScrollNext(currentScroll < maxScroll - 6);

    const stepDist = getStepDistance(el);
    if (stepDist > 0) {
      const idx = Math.round(currentScroll / stepDist);
      setActiveIndex(idx);
    }
  }, [getStepDistance]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkScroll();

    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    const timer = setTimeout(checkScroll, 150);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      clearTimeout(timer);
    };
  }, [checkScroll]);

  const scrollPrev = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const distance = getStepDistance(el);
    const delta = isRtl ? distance : -distance;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  }, [isRtl, getStepDistance]);

  const scrollNext = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const distance = getStepDistance(el);
    const delta = isRtl ? -distance : distance;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  }, [isRtl, getStepDistance]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = containerRef.current;
      if (!el) return;
      const distance = getStepDistance(el);
      const target = (isRtl ? -1 : 1) * index * distance;
      el.scrollTo({ left: target, behavior: 'smooth' });
    },
    [isRtl, getStepDistance]
  );

  return {
    containerRef,
    canScrollPrev,
    canScrollNext,
    activeIndex,
    scrollPrev,
    scrollNext,
    scrollToIndex,
    checkScroll,
  };
}
