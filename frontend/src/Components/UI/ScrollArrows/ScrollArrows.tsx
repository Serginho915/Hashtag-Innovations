import React from "react";
import styles from "./ScrollArrows.module.scss";

export interface ScrollArrowsProps {
  progress?: number;
  onPrev?: () => void;
  onNext?: () => void;
  direction?: "horizontal" | "vertical";
}

export const ScrollArrows = ({
  progress = 0,
  onPrev,
  onNext,
  direction = "vertical",
}: ScrollArrowsProps) => {
  return (
    <div className={styles.scrollArrowsRow}>
      <div className={styles.scrollIndicator}>
        <div 
          className={styles.scrollThumb} 
          style={{ left: `calc(${progress * 100}% - ${progress * 80}px)` }}
        ></div>
      </div>
      <div className={styles.arrowsGroup}>
        <button className={styles.arrowButton} aria-label="Previous" onClick={onPrev}>
          {direction === "vertical" ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          )}
        </button>
        <button className={styles.arrowButton} aria-label="Next" onClick={onNext}>
          {direction === "vertical" ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
