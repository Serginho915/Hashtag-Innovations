import React from "react";
import styles from "./Hero.module.scss";
import { NewsCard } from "./NewsCard";

const newsItems = [
  {
    title: "Hashtag Innovations hosting a business networking event",
    excerpt:
      "Networking is getting more popular in Bulgaria. We decided to take part and help young professionals become more flexible and adaptive to social communication",
    authorLabel: "by",
  },
  {
    title: "Hashtag Innovations hosting a business networking event",
    excerpt:
      "Networking is getting more popular in Bulgaria. We decided to take part and help young professionals become more flexible and adaptive to social communication",
    authorLabel: "by",
  },
  {
    title: "Hashtag Innovations hosting a business networking event",
    excerpt:
      "Networking is getting more popular in Bulgaria. We decided to take part and help young professionals become more flexible and adaptive to social communication",
    authorLabel: "from",
  },
];

export const LatestNews = () => {
  return (
    <div className={styles.latestNews}>
      {/* Header */}
      <div className={styles.newsHeader}>
        <div className={styles.newsHeaderRow}>
          <div className={styles.newsLabelGroup}>
            <div className={styles.dotRed}></div>
            <div className={styles.labelText}>Latest News</div>
          </div>
          <div className={styles.newsDateGroup}>
            <div className={styles.newsDateText}>thursday, 14 May</div>
            <div className={styles.newsDateDot}></div>
            <div className={styles.newsDateText}>sofia, bulgaria</div>
          </div>
        </div>
      </div>

      {/* News Cards */}
      <div className={styles.newsList}>
        {newsItems.map((item, index) => (
          <NewsCard
            key={index}
            title={item.title}
            excerpt={item.excerpt}
            authorLabel={item.authorLabel}
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
