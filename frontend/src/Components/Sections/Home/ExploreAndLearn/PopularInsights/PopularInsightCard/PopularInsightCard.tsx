import React from 'react';
import Image from 'next/image';
import { AuthorLink } from '../../../../../UI/AuthorLink/AuthorLink.tsx';
import styles from './PopularInsightCard.module.scss';
import { ReadButton } from '../../../../../Common/Buttons/ReadButton/ReadButton.tsx';
import { translations } from '../translations.ts';

interface PopularInsightCardProps {
  id: string;
  title: string;
  excerpt: string;
  authorName: string;
  authorLabel: string;
  authorExpertId?: string;
  lang?: string;
}

export const PopularInsightCard = ({
  id,
  title,
  excerpt,
  authorName,
  authorLabel,
  authorExpertId,
  lang = 'en'
}: PopularInsightCardProps) => {
  const t = translations[lang] || translations.en;

  return (
    <div className={styles.insightCard}>
      <div className={styles.cardContent}>
        <div className={styles.titleRow}>
          <div className={styles.title}>{title}</div>
        </div>
        <div className={styles.excerptRow}>
          <div className={styles.excerpt}>{excerpt}</div>
        </div>
        <div className={styles.footerRow}>
          <div className={styles.authorGroup}>
            <div className={styles.authorLabel}>{authorLabel}</div>
            <div className={styles.authorAvatar}>
              <Image src="/images/avatar-1.png" alt={authorName} fill style={{ objectFit: 'cover' }} />
            </div>
            <AuthorLink name={authorName} expertId={authorExpertId} lang={lang} />
          </div>
          <ReadButton text={t.read} href={`/${lang}/insights/${id}`} />
        </div>
      </div>
    </div>
  );
};
