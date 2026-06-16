"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./InsidePlatform.module.scss";
import Image from "next/image";
import { ScrollArrows } from "../../../../UI/ScrollArrows/ScrollArrows.tsx";

interface SlideData {
  title: string;
}

interface InsidePlatformCarouselProps {
  slides: SlideData[];
  slideAlt: string;
}

export const InsidePlatformCarousel: React.FC<InsidePlatformCarouselProps> = ({ slides, slideAlt }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (listRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = listRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) {
        setScrollProgress(0);
      } else {
        setScrollProgress(scrollLeft / maxScroll);
      }
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  const scrollLeft = () => {
    if (listRef.current) {
      const width = listRef.current.clientWidth;
      listRef.current.scrollBy({ left: -width, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (listRef.current) {
      const width = listRef.current.clientWidth;
      listRef.current.scrollBy({ left: width, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselTrack} ref={listRef} onScroll={handleScroll}>
        {slides.map((slide, index) => {
          const slideImages = [
            "/images/platform/slide_events.png",
            "/images/platform/slide_connect.png",
            "/images/platform/slide_skills.png",
            "/images/platform/slide_jobs.png"
          ];
          const slideSrc = slideImages[index] || slideImages[0];

          return (
            <div key={index} className={styles.carouselSlide}>
              <div className={styles.slideImageWrapper}>
                <Image
                  src={slideSrc}
                  alt={slideAlt}
                  width={206}
                  height={201}
                  className={styles.slideImage}
                />
              </div>
              <div className={styles.slideContent}>
                <div className={styles.slideTextBlock}>
                  <div className={styles.slideNumber}>0{index + 1}/</div>
                  <div className={styles.slideTitle}>
                    {slide.title}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ScrollArrows
        progress={scrollProgress}
        direction="horizontal"
        onPrev={scrollLeft}
        onNext={scrollRight}
      />
    </div>
  );
};
