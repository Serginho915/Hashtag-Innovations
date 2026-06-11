"use client";

import React from "react";
import styles from "./PopularInsights.module.scss";
import { PopularInsightCard } from "./PopularInsightCard/PopularInsightCard";
import Image from "next/image";
import { AuthorLink } from '../../../../UI/AuthorLink/AuthorLink';
import { translations } from "./translations";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  authorLabel: string;
  authorId: string;
  authorName?: string;
  authorExpertId?: string;
  tags?: string[];
}

interface PopularInsightsProps {
  news: NewsItem[];
  lang: string;
}

export const PopularInsights: React.FC<PopularInsightsProps> = ({ news, lang }) => {
  const [activeTopic, setActiveTopic] = React.useState("All");
  const [email, setEmail] = React.useState("");
  const [subscribeStatus, setSubscribeStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  const t = translations[lang] || translations.en;

  const categories = ['Business', 'AI', 'Entertainment', 'Strategy'];
  const topicsData = [
    { name: 'All', count: news.length },
    ...categories.map(cat => ({
      name: cat,
      count: news.filter(n => n.tags?.includes(cat)).length
    }))
  ];

  const displayNews = activeTopic === "All" 
    ? news 
    : news.filter(n => n.tags?.includes(activeTopic));
    
  const featuredArticle = displayNews[0];
  const listArticles = displayNews.slice(1); // Take all remaining articles

  const handleSubscribe = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubscribeStatus("error");
      return;
    }
    
    setSubscribeStatus("loading");
    // TODO: Replace with real API call
    setTimeout(() => {
      console.log('Subscribing email:', email);
      setSubscribeStatus("success");
      setEmail("");
      setTimeout(() => setSubscribeStatus("idle"), 3000);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  };

  return (
    <div className={styles.popularInsights}>
      <div className={styles.header}>
        <div className={styles.headerGroup}>
          <div className={styles.indexNumber}>04/</div>
          <div className={styles.titleText}>{t.sectionTitle}</div>
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
                  <div className={styles.featuredAuthorLabel}>{featuredArticle.authorLabel || t.by}</div>
                  <AuthorLink name={featuredArticle.authorName || 'Andrey Nikolov'} expertId={featuredArticle.authorExpertId} lang={lang} />
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
              authorName={article.authorName || 'Andrey Nikolov'}
              authorLabel={article.authorLabel || t.by}
              authorExpertId={article.authorExpertId}
              lang={lang}
            />
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div className={styles.bottomRow}>
        {/* Browse Topics */}
        <div className={styles.browseTopics}>
          <div className={styles.topicsHeader}>
            <div className={styles.topicsTitle}>{t.browseTopics}</div>
          </div>
          <div className={styles.topicsList}>
            {topicsData.map(topic => (
              <div 
                key={topic.name} 
                className={styles.topicItem}
                onClick={() => setActiveTopic(topic.name)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.topicTextGroup}>
                  <span className={styles.topicName}>{t.categories[topic.name] || topic.name}{topic.name !== 'All' ? ' ' : ''}</span>
                  <span className={styles.topicCount}>{topic.name === 'All' ? ' ' : ''}({topic.count})</span>
                </div>
                {activeTopic === topic.name && (
                  <div className={styles.topicCheckboxActive}>
                    <svg className={styles.checkboxInnerIcon} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M1.4 13L0 11.6L9.6 2H1V0H13V12H11V3.4L1.4 13Z" fill="#8C8C92"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className={styles.newsletterBox}>
          <div className={styles.newsletterHeaderRow}>
            <div className={styles.newsletterHashtag}>#</div>
            <div className={styles.newsletterTitle}>{t.newsletterTitle}</div>
          </div>
          <div className={styles.newsletterDescRow}>
            <div className={styles.newsletterDesc}>{t.newsletterDesc}</div>
          </div>
          <div className={styles.newsletterInputBox} style={{ borderColor: subscribeStatus === 'error' ? 'red' : undefined }}>
            <input 
              type="email" 
              placeholder={subscribeStatus === 'success' ? t.subscribed : t.enterEmail} 
              className={styles.newsletterInputText}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (subscribeStatus === 'error') setSubscribeStatus('idle');
              }}
              onKeyDown={handleKeyDown}
              disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
            />
            <div className={styles.newsletterSubmitBtn} onClick={handleSubscribe} style={{ opacity: subscribeStatus === 'loading' ? 0.7 : 1 }}>
              <div className={styles.submitIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M4.38333 2.26663V9.71663C4.38333 9.90552 4.44733 10.0637 4.57533 10.1913C4.70333 10.3189 4.86156 10.3829 5.05 10.3833C5.23844 10.3837 5.39689 10.3197 5.52533 10.1913C5.65378 10.0629 5.71756 9.90463 5.71667 9.71663V2.26663L8.98333 5.5333C9.11667 5.66663 9.27222 5.73063 9.45 5.7253C9.62778 5.71996 9.78333 5.65041 9.91667 5.51663C10.0389 5.3833 10.1027 5.22774 10.108 5.04996C10.1133 4.87219 10.0496 4.71663 9.91667 4.5833L5.51667 0.183298C5.45 0.116632 5.37778 0.0692978 5.3 0.0412979C5.22222 0.013298 5.13889 -0.000480652 5.05 -3.62396e-05C4.96111 0.000408173 4.87778 0.0141869 4.8 0.0412979C4.72222 0.068409 4.65 0.115743 4.58333 0.183298L0.183333 4.5833C0.0611109 4.70552 0 4.85819 0 5.0413C0 5.22441 0.0611109 5.38285 0.183333 5.51663C0.316666 5.64996 0.475111 5.71663 0.658667 5.71663C0.842222 5.71663 1.00044 5.64996 1.13333 5.51663L4.38333 2.26663Z" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
