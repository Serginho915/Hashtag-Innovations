import React from "react";
import styles from "./LatestNews.module.scss";
import { translations } from "./translations.ts";
import { LatestNewsList } from "./LatestNewsList.tsx";

import { NewsItem } from "../../../../../Types/news.ts";

interface LatestNewsProps {
  lang: string;
  news: NewsItem[];
}

export const LatestNews = ({ lang, news }: LatestNewsProps) => {
  const t = translations[lang] || translations.en;


  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'long' };
  const locale = lang === 'bg' ? 'bg-BG' : 'en-GB';
  const currentDate = today.toLocaleDateString(locale, options).toLowerCase();

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
            <div className={styles.newsDateText}>{currentDate || t.date}</div>
            <div className={styles.newsDateDot}></div>
            <div className={styles.newsDateText}>{t.location}</div>
          </div>
        </div>
      </div>

      <LatestNewsList news={news} lang={lang} />
    </div>
  );
};
