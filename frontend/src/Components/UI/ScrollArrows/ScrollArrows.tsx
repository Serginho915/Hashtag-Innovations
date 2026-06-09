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
          <svg 
            style={{ transform: direction === "vertical" ? "rotate(0deg)" : "rotate(-90deg)" }} 
            xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none"
          >
            <path d="M5.575 2.37502L9.475 6.27502C9.65833 6.45835 9.89167 6.55002 10.175 6.55002C10.4583 6.55002 10.6917 6.45835 10.875 6.27502C11.0583 6.09168 11.15 5.85835 11.15 5.57502C11.15 5.29168 11.0583 5.05835 10.875 4.87502L6.275 0.275016C6.175 0.175016 6.06667 0.104016 5.95 0.0620159C5.83333 0.0200159 5.70833 -0.000651042 5.575 1.56248e-05C5.44167 0.000682291 5.31667 0.0213492 5.2 0.0620159C5.08333 0.102683 4.975 0.173683 4.875 0.275016L0.275002 4.87502C0.0916682 5.05835 0 5.29168 0 5.57502C0 5.85835 0.0916682 6.09168 0.275002 6.27502C0.458335 6.45835 0.691667 6.55002 0.975 6.55002C1.25833 6.55002 1.49167 6.45835 1.675 6.27502L5.575 2.37502Z" fill="black"/>
          </svg>
        </button>
        <button className={styles.arrowButton} aria-label="Next" onClick={onNext}>
          <svg 
            style={{ transform: direction === "vertical" ? "rotate(180deg)" : "rotate(90deg)" }} 
            xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none"
          >
            <path d="M5.575 2.37502L9.475 6.27502C9.65833 6.45835 9.89167 6.55002 10.175 6.55002C10.4583 6.55002 10.6917 6.45835 10.875 6.27502C11.0583 6.09168 11.15 5.85835 11.15 5.57502C11.15 5.29168 11.0583 5.05835 10.875 4.87502L6.275 0.275016C6.175 0.175016 6.06667 0.104016 5.95 0.0620159C5.83333 0.0200159 5.70833 -0.000651042 5.575 1.56248e-05C5.44167 0.000682291 5.31667 0.0213492 5.2 0.0620159C5.08333 0.102683 4.975 0.173683 4.875 0.275016L0.275002 4.87502C0.0916682 5.05835 0 5.29168 0 5.57502C0 5.85835 0.0916682 6.09168 0.275002 6.27502C0.458335 6.45835 0.691667 6.55002 0.975 6.55002C1.25833 6.55002 1.49167 6.45835 1.675 6.27502L5.575 2.37502Z" fill="black"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
