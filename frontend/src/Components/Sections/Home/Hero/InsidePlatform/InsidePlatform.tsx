"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./InsidePlatform.module.scss";
import Image from "next/image";
import { translations } from "./translations";
import { ScrollArrows } from "../../../../UI/ScrollArrows/ScrollArrows";

export const InsidePlatform = ({ lang }: { lang: string }) => {
  const t = translations[lang] || translations.en;
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
    <div className={styles.insidePlatform}>
      {/* Section Label */}
      <div className={styles.sectionLabel}>
        <div className={styles.labelRow}>
          <div className={styles.dotBlue}></div>
          <div className={styles.labelText}>{t.sectionLabel}</div>
        </div>

        {/* Description */}
        <div className={styles.descriptionBlock}>
          <div>
            <span className={styles.descriptionText}>
              {t.desc1}
            </span>
            <span className={styles.descriptionBold}>
              {t.descBold}
            </span>
            <span className={styles.descriptionText}>
              {t.desc2}
            </span>
          </div>

          {/* Trusted By */}
          <div className={styles.trustedRow}>
            <div className={styles.avatarGroup}>
              <Image
                src="/images/avatars/avatar_1.png"
                alt="User 1"
                width={32}
                height={32}
                className={styles.avatar}
              />
              <Image
                src="/images/avatars/avatar_2.png"
                alt="User 2"
                width={32}
                height={32}
                className={styles.avatar}
              />
              <Image
                src="/images/avatars/avatar_3.png"
                alt="User 3"
                width={32}
                height={32}
                className={styles.avatar}
              />
            </div>
            <div className={styles.trustedText}>
              {t.trusted}
            </div>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className={styles.carouselWrapper}>
        <div className={styles.carouselTrack} ref={listRef} onScroll={handleScroll}>
          {t.slides.map((slide: { title: string }, index: number) => {
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
                    alt={t.slideAlt}
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

        {/* Arrows */}
        <ScrollArrows
          progress={scrollProgress}
          direction="horizontal"
          onPrev={scrollLeft}
          onNext={scrollRight}
        />
      </div>
    </div>
  );
};
