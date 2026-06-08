"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./LatestNews.module.scss";
import { NewsCard } from "../NewsCard/NewsCard";
import { translations } from "./translations";
import { ScrollArrows } from "../../../../UI/ScrollArrows/ScrollArrows";

export const LatestNews = ({ lang }: { lang: string }) => {
  const t = translations[lang] || translations.en;
  const listRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  // Initial check in case content doesn't fill the container
  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

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
      <div className={styles.newsList} ref={listRef} onScroll={handleScroll}>
        {t.newsItems.map((item: { title: string; excerpt: string; authorLabel: string }, index: number) => (
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
      <ScrollArrows 
        progress={scrollProgress} 
        onPrev={scrollUp} 
        onNext={scrollDown} 
        direction="vertical" 
      />
    </div>
  );
};
