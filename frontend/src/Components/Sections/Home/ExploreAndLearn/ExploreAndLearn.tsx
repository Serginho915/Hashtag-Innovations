import React from "react";
import styles from "./ExploreAndLearn.module.scss";
import { translations } from "./translations.ts";
import { LearningMaterials } from "./LearningMaterials/LearningMaterials.tsx";
import { PopularInsights } from "./PopularInsights/PopularInsights.tsx";
import { SectionTitle } from '../../../UI/SectionTitle/SectionTitle.tsx';
import { TextbookItem } from "../../../../Types/textbook.ts";
import { NewsItem } from "../../../../Types/news.ts";

interface ExploreAndLearnProps {
  lang: string;
  textbooks: TextbookItem[];
  popularInsights: NewsItem[];
}

export const ExploreAndLearn = ({ lang, textbooks, popularInsights }: ExploreAndLearnProps) => {
  const t = translations[lang] || translations.en;
  
  const formattedTextbooks = [...textbooks].sort((a, b) => (
    new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
  ));

  const formattedBlogs = [...popularInsights].sort((a, b) => (
    new Date(b.date || '').getTime() - new Date(a.date || '').getTime()
  ));

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
