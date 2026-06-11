"use client";

import React from "react";
import styles from "./PopularInsights.module.scss";
import { PopularInsightCard } from "./PopularInsightCard/PopularInsightCard";
import Image from "next/image";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  authorLabel: string;
  authorId: string;
  authorName?: string;
}

interface PopularInsightsProps {
  news: NewsItem[];
  lang: string;
}

export const PopularInsights: React.FC<PopularInsightsProps> = ({ news, lang }) => {
  const featuredArticle = news[0];
  const listArticles = news.slice(1, 4); // Take next 3 articles

  return (
    <div className={styles.popularInsights}>
      <div className={styles.header}>
        <div className={styles.headerGroup}>
          <div className={styles.indexNumber}>04/</div>
          <div className={styles.titleText}>POPULAR INSIGHTS</div>
        </div>
      </div>

      <div className={styles.articlesContainer}>
        {/* Featured Article */}
        {featuredArticle && (
          <div className={styles.featuredArticle}>
            <div className={styles.featuredImageWrapper}>
              {/* Fallback gray box matching the HTML */}
              <div className={styles.featuredImageFallback}></div>
            </div>
            <div className={styles.featuredContent}>
              <div className={styles.featuredTitleGroup}>
                <div className={styles.featuredTitle}>{featuredArticle.title}</div>
                <div className={styles.featuredExcerpt}>{featuredArticle.excerpt}</div>
              </div>
              <div className={styles.featuredFooter}>
                <div className={styles.featuredAuthorGroup}>
                  <div className={styles.featuredAuthorLabel}>by</div>
                  <div className={styles.featuredAuthorName}>Andrew Nikolov</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* List Articles */}
        <div className={styles.listContainer}>
          {listArticles.map((article) => (
            <PopularInsightCard
              key={article.id}
              id={article.id}
              title={article.title}
              excerpt={article.excerpt}
              authorName={article.authorName || 'Andrew Nikolov'}
              authorLabel={article.authorLabel || 'by'}
            />
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div className={styles.bottomRow}>
        {/* Browse Topics */}
        <div className={styles.browseTopics}>
          <div className={styles.topicsHeader}>
            <div className={styles.topicsTitle}>Browse Topics</div>
          </div>
          <div className={styles.topicsList}>
            <div className={styles.topicItem}>
              <div className={styles.topicTextGroup}>
                <span className={styles.topicName}>All</span>
                <span className={styles.topicCount}> (200)</span>
              </div>
              <div className={styles.topicCheckboxActive}>
                <div className={styles.checkboxInner}></div>
              </div>
            </div>
            <div className={styles.topicItem}>
              <div className={styles.topicTextGroup}>
                <span className={styles.topicName}>Business </span>
                <span className={styles.topicCount}>(27)</span>
              </div>
            </div>
            <div className={styles.topicItem}>
              <div className={styles.topicTextGroup}>
                <span className={styles.topicName}>AI </span>
                <span className={styles.topicCount}>(128)</span>
              </div>
            </div>
            <div className={styles.topicItem}>
              <div className={styles.topicTextGroup}>
                <span className={styles.topicName}>Entertainment </span>
                <span className={styles.topicCount}>(32)</span>
              </div>
            </div>
            <div className={styles.topicItem}>
              <div className={styles.topicTextGroup}>
                <span className={styles.topicName}>Strategy </span>
                <span className={styles.topicCount}>(7)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className={styles.newsletterBox}>
          <div className={styles.newsletterHeaderRow}>
            <div className={styles.newsletterHashtag}>#</div>
            <div className={styles.newsletterTitle}>Будьте Впереди</div>
          </div>
          <div className={styles.newsletterDescRow}>
            <div className={styles.newsletterDesc}>Get curated business content, event updates, and expert insights delivered every Monday.</div>
          </div>
          <div className={styles.newsletterInputBox}>
            <div className={styles.newsletterInputText}>Enter your email</div>
            <div className={styles.newsletterSubmitBtn}>
              <div className={styles.submitIcon}>
                <div className={styles.submitIconInner}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
