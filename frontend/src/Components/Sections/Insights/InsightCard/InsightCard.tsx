import React from 'react';
import Link from 'next/link';
import { NewsItem } from '../../../../Types/news.ts';
import styles from './InsightCard.module.scss';

interface InsightCardProps {
  article: NewsItem;
  lang: string;
  variant?: 'featured' | 'side' | 'grid';
}

export const InsightCard: React.FC<InsightCardProps> = ({ article, lang, variant = 'grid' }) => {
  const href = `/${lang}/insights/${article.id}`;
  const hasAuthor = Boolean(article.authorName || article.authorExpertId);

  return (
    <article className={`${styles.card} ${styles[variant]}`}>
      <Link href={href} className={styles.imageLink} aria-label={article.title}>
        <div className={styles.imageWrap}>
          <img src={article.imageUrl} alt={article.title} className={styles.image} />
        </div>
      </Link>
      <div className={styles.content}>
        <Link href={href} className={styles.titleLink}>
          <h2 className={styles.title}>{article.title}</h2>
        </Link>
        {article.excerpt && <p className={styles.excerpt}>{article.excerpt}</p>}
        {hasAuthor && (
          <div className={styles.authorRow}>
            <span>{article.authorLabel || 'by'}</span>
            <Link href={article.authorExpertId ? `/${lang}/experts/${article.authorExpertId}` : href} className={styles.authorName}>
              {article.authorName}
            </Link>
          </div>
        )}
      </div>
    </article>
  );
};
