import React from "react";
import styles from "./Hero.module.scss";

interface NewsCardProps {
  title: string;
  excerpt: string;
  authorLabel: string;
}

export const NewsCard = ({ title, excerpt, authorLabel }: NewsCardProps) => {
  return (
    <div className={styles.newsCard}>
      <div className={styles.newsCardContent}>
        <div className={styles.newsCardTitle}>{title}</div>
        <div className={styles.newsCardExcerpt}>{excerpt}</div>
        <div className={styles.newsCardFooter}>
          <div className={styles.newsCardAuthor}>
            <div className={styles.newsCardAuthorLabel}>{authorLabel}</div>
            <div className={styles.authorAvatar}></div>
          </div>
          <button className={styles.readButton}>
            <span className={styles.readText}>Read</span>
            <div className={styles.readArrow}>
              <div className={styles.readArrowIcon}></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
