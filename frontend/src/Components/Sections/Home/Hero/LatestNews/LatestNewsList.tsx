"use client";

import React from "react";
import styles from "./LatestNews.module.scss";
import { NewsCard } from "../NewsCard/NewsCard.tsx";
import { ScrollArrows } from "../../../../UI/ScrollArrows/ScrollArrows.tsx";
import { useScrollProgress } from "../../../../../Hooks/useScrollProgress.ts";

import { NewsItem } from "../../../../../Types/news.ts";

interface LatestNewsListProps {
  news: NewsItem[];
  lang: string;
}

export const LatestNewsList: React.FC<LatestNewsListProps> = ({ news, lang }) => {
  const { scrollRef, scrollProgress, handleScroll, scrollPrev, scrollNext } = useScrollProgress<HTMLUListElement>({
    axis: 'vertical',
    scrollAmount: 300,
  });

  return (
    <>
      <ul className={styles.newsList} ref={scrollRef} onScroll={handleScroll}>
        {news.map((item) => (
          <NewsCard
            key={item.id}
            id={item.id}
            title={item.title}
            excerpt={item.excerpt || ''}
            authorLabel={item.authorLabel || ''}
            authorAvatarUrl={item.authorAvatarUrl}
            authorExpertId={item.authorExpertId}
            lang={lang}
          />
        ))}
      </ul>

      <ScrollArrows 
        progress={scrollProgress} 
        onPrev={scrollPrev}
        onNext={scrollNext}
        direction="vertical" 
      />
    </>
  );
};
