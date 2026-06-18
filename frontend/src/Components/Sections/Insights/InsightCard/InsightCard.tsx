import React from 'react';
import Link from 'next/link';
import { NewsItem } from '../../../../Types/news.ts';
import styles from './InsightCard.module.scss';

interface InsightCardProps {
  article: NewsItem;
  lang: string;
  variant?: 'featured' | 'side' | 'grid';
}

const ReadTimeBadge = ({ text }: { text?: string }) => (
  <div className={styles.readTimeBadge}>
    <svg className={styles.readIcon} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 0C10.8661 0 14 3.1339 14 7C14 10.8661 10.8661 14 7 14C3.1339 14 0 10.8661 0 7H1.4C1.4 10.0926 3.9074 12.6 7 12.6C10.0926 12.6 12.6 10.0926 12.6 7C12.6 3.9074 10.0926 1.4 7 1.4C5.075 1.4 3.3768 2.3709 2.3695 3.85H4.2V5.25H0V1.05H1.4V2.8C2.6768 1.099 4.7103 0 7 0ZM7.7 3.5V6.7095L9.9701 8.9796L8.9796 9.9701L6.3 7.2891V3.5H7.7Z" fill="currentColor" />
    </svg>
    <span>{text || '5 min read'}</span>
  </div>
);

export const InsightCard: React.FC<InsightCardProps> = ({ article, lang, variant = 'grid' }) => {
  const href = `/${lang}/insights/${article.id}`;
  const authorName = article.authorName || (lang === 'bg' ? 'Автор' : 'Author');

  return (
    <article className={`${styles.card} ${styles[variant]}`}>
      <Link href={href} className={styles.imageLink} aria-label={article.title}>
        <div className={styles.imageWrap}>
          <img src={article.imageUrl} alt={article.title} className={styles.image} />
          <ReadTimeBadge text={article.timeToRead || article.readTime} />
        </div>
      </Link>
      <div className={styles.content}>
        <Link href={href} className={styles.titleLink}>
          <h2 className={styles.title}>{article.title}</h2>
        </Link>
        {article.excerpt && <p className={styles.excerpt}>{article.excerpt}</p>}
        <div className={styles.authorRow}>
          <span>{article.authorLabel || 'by'}</span>
          <Link href={article.authorExpertId ? `/${lang}/experts/${article.authorExpertId}` : href} className={styles.authorName}>
            {authorName}
          </Link>
        </div>
      </div>
    </article>
  );
};
