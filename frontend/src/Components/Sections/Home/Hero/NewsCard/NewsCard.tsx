import React from "react";
import styles from "./NewsCard.module.scss";
import { translations } from "./translations.ts";
import { ReadButton } from "../../../../Common/Buttons/ReadButton/ReadButton.tsx";
import Link from 'next/link';

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  authorLabel: string;
  authorId: string;
  authorName?: string;
  authorExpertId?: string;
  lang: string;
}

export const NewsCard = ({ id, title, excerpt, authorLabel, authorId, authorName, authorExpertId, lang }: NewsCardProps) => {
  const t = translations[lang] || translations.en;
  const articleUrl = `/${lang}/news/${id}`;

  return (
    <li className={styles.newsCard}>
      <div className={styles.newsCardContent}>
        <div className={styles.newsCardTitle}>{title}</div>
        <div className={styles.newsCardExcerpt}>{excerpt}</div>
        <div className={styles.newsCardFooter}>
          <div className={styles.authorLink}>
            <div className={styles.newsCardAuthor}>
              <div className={styles.newsCardAuthorLabel}>{authorLabel}</div>
              {authorExpertId ? (
                <Link href={`/${lang}/experts/${authorExpertId}`}>
                  <div className={styles.authorAvatar}></div>
                </Link>
              ) : (
                <div className={styles.authorAvatar}></div>
              )}
            </div>
          </div>
          <Link href={articleUrl} className={styles.readLink}>
            <ReadButton text={t.read} />
          </Link>
        </div>
      </div>
    </li>
  );
};
