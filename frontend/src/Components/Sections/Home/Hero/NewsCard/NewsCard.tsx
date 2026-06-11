import React from "react";
import styles from "./NewsCard.module.scss";
import { translations } from "./translations";
import { ReadButton } from "../../../../Common/Buttons/ReadButton/ReadButton";
import Link from 'next/link';

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  authorLabel: string;
  authorId: string;
  lang: string;
}

export const NewsCard = ({ id, title, excerpt, authorLabel, authorId, lang }: NewsCardProps) => {
  const t = translations[lang] || translations.en;
  const authorUrl = `/${lang}/experts/${authorId}`;
  const articleUrl = `/${lang}/news/${id}`;

  return (
    <li className={styles.newsCard}>
      <div className={styles.newsCardContent}>
        <div className={styles.newsCardTitle}>{title}</div>
        <div className={styles.newsCardExcerpt}>{excerpt}</div>
        <div className={styles.newsCardFooter}>
          <Link href={authorUrl} className={styles.authorLink}>
            <div className={styles.newsCardAuthor}>
              <div className={styles.newsCardAuthorLabel}>{authorLabel}</div>
              <div className={styles.authorAvatar}></div>
            </div>
          </Link>
          <Link href={articleUrl} className={styles.readLink}>
            <ReadButton text={t.read} />
          </Link>
        </div>
      </div>
    </li>
  );
};
