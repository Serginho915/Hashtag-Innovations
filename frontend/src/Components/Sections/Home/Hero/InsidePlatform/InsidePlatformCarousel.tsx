"use client";

import React from "react";
import styles from "./InsidePlatform.module.scss";
import Image from "next/image";
import { ScrollArrows } from "../../../../UI/ScrollArrows/ScrollArrows.tsx";
import { useScrollProgress } from "../../../../../Hooks/useScrollProgress.ts";

interface SlideData {
  title: string;
}

interface InsidePlatformCarouselProps {
  slides: SlideData[];
  slideAlt: string;
}

export const InsidePlatformCarousel: React.FC<InsidePlatformCarouselProps> = ({ slides, slideAlt }) => {
  const { scrollRef, scrollProgress, handleScroll, scrollPrev, scrollNext } = useScrollProgress<HTMLDivElement>({
    axis: 'horizontal',
    scrollAmount: 'container',
  });

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselTrack} ref={scrollRef} onScroll={handleScroll}>
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
        onPrev={scrollPrev}
        onNext={scrollNext}
      />
    </div>
  );
};
