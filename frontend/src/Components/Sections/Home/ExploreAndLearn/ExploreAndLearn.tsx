import React from "react";
import styles from "./ExploreAndLearn.module.scss";
import { translations } from "./translations";
import { MOCK_TEXTBOOKS_EN, MOCK_TEXTBOOKS_BG } from "./mockData";
import { MOCK_NEWS_EN, MOCK_NEWS_BG } from "../Hero/LatestNews/mockData";
import { LearningMaterials } from "./LearningMaterials/LearningMaterials";
import { PopularInsights } from "./PopularInsights/PopularInsights";
import { SectionTitle } from '../../../UI/SectionTitle/SectionTitle';

interface ExploreAndLearnProps {
  lang: string;
}

export const ExploreAndLearn = ({ lang }: ExploreAndLearnProps) => {
  const t = translations[lang] || translations.en;
  
  // Mock API fetching for textbooks
  const textbooks = lang === 'bg' ? MOCK_TEXTBOOKS_BG : MOCK_TEXTBOOKS_EN;
  const formattedTextbooks = textbooks
    .map((item, idx) => ({
      ...item,
      id: `textbook-${idx + 1}`
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Mock API fetching for blogs
  const blogs = lang === 'bg' ? MOCK_NEWS_BG : MOCK_NEWS_EN;
  const formattedBlogs = blogs
    .map((item: any, idx: number) => ({
      ...item,
      id: `blog-${idx + 1}`,
      authorId: `author-${idx + 1}`,
      authorName: item.authorName || "Andrey Nikolov"
    }))
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <section className={styles.exploreSection}>
      <div className={styles.exploreContainer}>
        <div className={styles.titleWrapper}>
          <SectionTitle title={t.sectionTitle} />
        </div>
        
        <div className={styles.contentGrid}>
          <div className={styles.leftColumn}>
            <LearningMaterials materials={formattedTextbooks} lang={lang} />
          </div>
          
          <div className={styles.rightColumn}>
            <PopularInsights news={formattedBlogs} lang={lang} />
          </div>
        </div>
      </div>
    </section>
  );
};
