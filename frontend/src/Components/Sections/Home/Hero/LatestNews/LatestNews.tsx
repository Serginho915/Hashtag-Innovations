"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./LatestNews.module.scss";
import { NewsCard } from "../NewsCard/NewsCard";
import { translations } from "./translations";
import { ScrollArrows } from "../../../../UI/ScrollArrows/ScrollArrows";

import { MOCK_NEWS_EN, MOCK_NEWS_BG } from './mockData';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  authorLabel: string;
  authorId: string;
}

export const LatestNews = ({ lang }: { lang: string }) => {
  const t = translations[lang] || translations.en;
  const listRef = useRef<HTMLUListElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock API fetch function
  const fetchNewsFromApi = async (language: string): Promise<NewsItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Fallback to mock data if no real API
        const items = language === 'bg' ? MOCK_NEWS_BG : MOCK_NEWS_EN;
        const formattedItems = items.map((item: any, idx: number) => ({
          ...item,
          id: `news-${idx + 1}`,
          authorId: `author-${idx + 1}`
        }));
        resolve(formattedItems);
      }, 500); // simulate network delay
    });
  };

  useEffect(() => {
    setIsLoading(true);
    fetchNewsFromApi(lang).then((data) => {
      setNews(data);
      setIsLoading(false);
    });
  }, [lang]);

  const handleScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll <= 0) {
        setScrollProgress(0);
      } else {
        setScrollProgress(scrollTop / maxScroll);
      }
    }
  };

  useEffect(() => {
    if (!isLoading) {
      handleScroll();
      window.addEventListener('resize', handleScroll);
      return () => window.removeEventListener('resize', handleScroll);
    }
  }, [isLoading]);

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const locale = lang === 'bg' ? 'bg-BG' : 'en-GB';
    setCurrentDate(today.toLocaleDateString(locale, options).toLowerCase());
  }, [lang]);

  const scrollUp = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: -300, behavior: "smooth" });
    }
  };

  const scrollDown = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: 300, behavior: "smooth" });
    }
  };

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

      {/* News Cards */}
      <ul className={styles.newsList} ref={listRef} onScroll={handleScroll}>
        {isLoading ? (
          <div className={styles.loadingContainer}>Loading...</div>
        ) : (
          news.map((item) => (
            <NewsCard
              key={item.id}
              id={item.id}
              title={item.title}
              excerpt={item.excerpt}
              authorLabel={item.authorLabel}
              authorId={item.authorId}
              lang={lang}
            />
          ))
        )}
      </ul>

      {/* Scroll Arrows */}
      <ScrollArrows 
        progress={scrollProgress} 
        onPrev={scrollUp} 
        onNext={scrollDown} 
        direction="vertical" 
      />
    </div>
  );
};
