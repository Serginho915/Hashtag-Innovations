import React from 'react';
import { NewsItem } from '../../../../Types/news.ts';
import { ArticleTeaserCard } from '../../../UI/ArticleTeaserCard/ArticleTeaserCard.tsx';
import styles from './RelevantArticlesBlock.module.scss';

interface RelevantArticlesBlockProps {
  title: string;
  readText: string;
  articles: NewsItem[];
  lang: string;
}

export const RelevantArticlesBlock: React.FC<RelevantArticlesBlockProps> = ({
  title,
  readText,
  articles,
  lang,
}) => {
  if (!articles.length) {
    return null;
  }

  return (
    <section className={styles.relatedArticles}>
      <div className={styles.relatedHeader}>
        <h2>{title}</h2>
      </div>
      <ul className={styles.articlesList}>
        {articles.map((article) => (
          <ArticleTeaserCard
            key={article.id}
            as="li"
            className={styles.articleCard}
            title={article.title}
            excerpt={article.excerpt || ''}
            authorLabel={article.authorLabel || 'by'}
            readText={readText}
            readHref={`/${lang}/insights/${article.id}`}
          />
        ))}
      </ul>
    </section>
  );
};
