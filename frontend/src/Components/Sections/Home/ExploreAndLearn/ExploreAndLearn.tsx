import React from "react";
import styles from "./ExploreAndLearn.module.scss";
import { translations } from "./translations";
import { LearningMaterials } from "./LearningMaterials/LearningMaterials";
import { PopularInsights } from "./PopularInsights/PopularInsights";
import { SectionTitle } from '../../../UI/SectionTitle/SectionTitle';
import { TextbookItem } from "../../../../Types/textbook";
import { NewsItem } from "../../../../Types/news";

interface ExploreAndLearnProps {
  lang: string;
  textbooks: TextbookItem[];
  popularInsights: NewsItem[];
}

export const ExploreAndLearn = ({ lang, textbooks, popularInsights }: ExploreAndLearnProps) => {
  const t = translations[lang] || translations.en;
  
  const formattedTextbooks = textbooks.map((item, idx) => ({
    ...item,
    id: `textbook-${idx + 1}`
  })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const formattedBlogs = popularInsights.map((item: any, idx: number) => ({
    ...item,
    id: `blog-${idx + 1}`,
    authorId: `author-${idx + 1}`,
    authorName: item.authorName || "Andrey Nikolov"
  })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
