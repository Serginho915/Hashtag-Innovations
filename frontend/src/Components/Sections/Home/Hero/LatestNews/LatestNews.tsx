import React from "react";
import styles from "./LatestNews.module.scss";
import { NewsCard } from "../NewsCard/NewsCard";
import { translations } from "./translations";

export const LatestNews = ({ lang }: { lang: string }) => {
  const t = translations[lang] || translations.en;

  return (
    <div className={styles.latestNews}>
      {/* Header */}
      <div className={styles.newsHeader}>
        <div className={styles.newsHeaderRow}>
          <div className={styles.newsLabelGroup}>
            <div className={styles.dotRed}></div>
            <div className={styles.labelText}>{t.latestNews}</div>
          </div>
          <div className={styles.newsDateGroup}>
            <div className={styles.newsDateText}>{t.date}</div>
            <div className={styles.newsDateDot}></div>
            <div className={styles.newsDateText}>{t.location}</div>
          </div>
        </div>
      </div>

      {/* News Cards */}
      <div className={styles.newsList}>
        {t.newsItems.map((item: any, index: number) => (
          <NewsCard
            key={index}
            title={item.title}
            excerpt={item.excerpt}
            authorLabel={item.authorLabel}
            lang={lang}
          />
        ))}
      </div>

      {/* Scroll Arrows */}
      <div className={styles.newsArrowsRow}>
        <div className={styles.arrowsGroup}>
          <button className={styles.arrowButton} aria-label="Scroll up">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
          <button className={styles.arrowButton} aria-label="Scroll down">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
