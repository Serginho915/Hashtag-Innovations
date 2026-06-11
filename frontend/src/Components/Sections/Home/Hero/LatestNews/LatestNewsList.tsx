"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./LatestNews.module.scss";
import { NewsCard } from "../NewsCard/NewsCard";
import { ScrollArrows } from "../../../../UI/ScrollArrows/ScrollArrows";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  authorLabel: string;
  authorId: string;
  authorName?: string;
  authorExpertId?: string;
}

interface LatestNewsListProps {
  news: NewsItem[];
  lang: string;
}

export const LatestNewsList: React.FC<LatestNewsListProps> = ({ news, lang }) => {
  const listRef = useRef<HTMLUListElement>(null);
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

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

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
    <>
      <ul className={styles.newsList} ref={listRef} onScroll={handleScroll}>
        {news.map((item) => (
          <NewsCard
            key={item.id}
            id={item.id}
            title={item.title}
            excerpt={item.excerpt}
            authorLabel={item.authorLabel}
            authorId={item.authorId}
            authorName={item.authorName}
            authorExpertId={item.authorExpertId}
            lang={lang}
          />
        ))}
      </ul>

      <ScrollArrows 
        progress={scrollProgress} 
        onPrev={scrollUp} 
        onNext={scrollDown} 
        direction="vertical" 
      />
    </>
  );
};
