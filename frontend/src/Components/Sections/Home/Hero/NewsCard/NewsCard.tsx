import React from "react";
import styles from "./NewsCard.module.scss";
import { translations } from "./translations";
import { ReadButton } from "../../../../Common/Buttons/ReadButton/ReadButton";

interface NewsCardProps {
  title: string;
  excerpt: string;
  authorLabel: string;
  lang: string;
}

export const NewsCard = ({ title, excerpt, authorLabel, lang }: NewsCardProps) => {
  const t = translations[lang] || translations.en;

  return (
    <div className={styles.newsCard}>
      <div className={styles.newsCardContent}>
        <div className={styles.newsCardTitle}>{title}</div>
        <div className={styles.newsCardExcerpt}>{excerpt}</div>
        <div className={styles.newsCardFooter}>
          <div className={styles.newsCardAuthor}>
            <div className={styles.newsCardAuthorLabel}>{authorLabel}</div>
            <div className={styles.authorAvatar}></div>
          </div>
          <ReadButton text={t.read} />
        </div>
      </div>
    </div>
  );
};
