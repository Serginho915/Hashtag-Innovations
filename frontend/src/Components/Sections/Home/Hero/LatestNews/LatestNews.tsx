import React from "react";
import styles from "./LatestNews.module.scss";
import { translations } from "./translations";
import { LatestNewsList } from "./LatestNewsList";

import { MOCK_NEWS_EN, MOCK_NEWS_BG } from './mockData';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  authorLabel: string;
  authorId: string;
  authorName?: string;
  authorExpertId?: string;
}

const fetchNewsFromApi = async (language: string): Promise<NewsItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Fallback to mock data if no real API
      const items = language === 'bg' ? MOCK_NEWS_BG : MOCK_NEWS_EN;
      const formattedItems = items.map((item: any, idx: number) => ({
        ...item,
        id: `news-${idx + 1}`,
        authorId: `author-${idx + 1}`,
        authorName: item.authorName,
        authorExpertId: item.authorExpertId
      }));
      resolve(formattedItems);
    }, 100); // simulate network delay
  });
};

export const LatestNews = async ({ lang }: { lang: string }) => {
  const t = translations[lang] || translations.en;
  
  const news = await fetchNewsFromApi(lang);

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
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
