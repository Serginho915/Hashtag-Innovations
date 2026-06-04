import React from "react";
import styles from "./Hero.module.scss";
import Image from "next/image";

export const InsidePlatform = () => {
  return (
    <div className={styles.insidePlatform}>
      {/* Section Label */}
      <div className={styles.sectionLabel}>
        <div className={styles.labelRow}>
          <div className={styles.dotBlue}></div>
          <div className={styles.labelText}>Inside the platform</div>
        </div>

        {/* Description */}
        <div className={styles.descriptionBlock}>
          <div>
            <span className={styles.descriptionText}>
              Hashtag Innovations is a modern platform designed for{" "}
            </span>
            <span className={styles.descriptionBold}>
              business leaders, entrepreneurs, founders, and ambitious
              professionals
            </span>
            <span className={styles.descriptionText}>
              {" "}
              seeking expert knowledge, strategic insights, and meaningful
              industry connections.
            </span>
          </div>

          {/* Trusted By */}
          <div className={styles.trustedRow}>
            <div className={styles.avatarGroup}>
              <Image
                src="https://placehold.co/32x32"
                alt="User 1"
                width={32}
                height={32}
                className={styles.avatar}
              />
              <Image
                src="https://placehold.co/32x32"
                alt="User 2"
                width={32}
                height={32}
                className={styles.avatar}
              />
              <Image
                src="https://placehold.co/32x32"
                alt="User 3"
                width={32}
                height={32}
                className={styles.avatar}
              />
            </div>
            <div className={styles.trustedText}>
              Trusted by 3,000+ ambitious professionals in Bulgaria
            </div>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className={styles.carouselWrapper}>
        <div className={styles.carouselSlide}>
          <div className={styles.slideImageWrapper}>
            <Image
              src="https://placehold.co/206x201"
              alt="Feature slide"
              width={206}
              height={201}
              className={styles.slideImage}
            />
          </div>
          <div className={styles.slideContent}>
            <div className={styles.slideTextBlock}>
              <div className={styles.slideNumber}>01/</div>
              <div className={styles.slideTitle}>
                Explore upcoming business events.
              </div>
            </div>
          </div>
        </div>

        {/* Arrows */}
        <div className={styles.arrowsRow}>
          <div className={styles.arrowsGroup}>
            <button className={styles.arrowButton} aria-label="Previous slide">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className={styles.arrowButton} aria-label="Next slide">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
