"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

type ScrollAxis = 'horizontal' | 'vertical';
type ScrollAmount = number | 'container';

interface UseScrollProgressOptions {
  axis: ScrollAxis;
  scrollAmount: ScrollAmount;
}

export const useScrollProgress = <T extends HTMLElement>({ axis, scrollAmount }: UseScrollProgressOptions) => {
  const scrollRef = useRef<T>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) {
      return;
    }

    const element = scrollRef.current;
    const currentScroll = axis === 'vertical' ? element.scrollTop : element.scrollLeft;
    const maxScroll = axis === 'vertical'
      ? element.scrollHeight - element.clientHeight
      : element.scrollWidth - element.clientWidth;

    setScrollProgress(maxScroll > 0 ? currentScroll / maxScroll : 0);
  }, [axis]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);

    return () => window.removeEventListener('resize', handleScroll);
  }, [handleScroll]);

  const getScrollDistance = useCallback(() => {
    if (!scrollRef.current) {
      return 0;
    }

    if (scrollAmount === 'container') {
      return axis === 'vertical' ? scrollRef.current.clientHeight : scrollRef.current.clientWidth;
    }

    return scrollAmount;
  }, [axis, scrollAmount]);

  const scrollPrev = useCallback(() => {
    const distance = getScrollDistance();

    if (!scrollRef.current || distance === 0) {
      return;
    }

    scrollRef.current.scrollBy(axis === 'vertical'
      ? { top: -distance, behavior: 'smooth' }
      : { left: -distance, behavior: 'smooth' });
  }, [axis, getScrollDistance]);

  const scrollNext = useCallback(() => {
    const distance = getScrollDistance();

    if (!scrollRef.current || distance === 0) {
      return;
    }

    scrollRef.current.scrollBy(axis === 'vertical'
      ? { top: distance, behavior: 'smooth' }
      : { left: distance, behavior: 'smooth' });
  }, [axis, getScrollDistance]);

  return {
    scrollRef,
    scrollProgress,
    handleScroll,
    scrollPrev,
    scrollNext,
  };
};
