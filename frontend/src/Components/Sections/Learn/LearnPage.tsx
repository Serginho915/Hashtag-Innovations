import React from 'react';
import { Breadcrumbs } from '../../UI/Breadcrumbs/Breadcrumbs.tsx';
import { ViewAllLink } from '../../UI/ViewAllLink/ViewAllLink.tsx';
import { ArticleTeaserCard } from '../../UI/ArticleTeaserCard/ArticleTeaserCard.tsx';
import type { TextbookItem } from '../../../Types/textbook.ts';
import type { NewsItem } from '../../../Types/news.ts';
import type { Expert } from '../../../Types/expert.ts';
import { LearnCatalog } from './LearnCatalog/LearnCatalog.tsx';
import { TopAuthorsBlock } from './TopAuthorsBlock/TopAuthorsBlock.tsx';
import { getLearnTranslations } from './translations.ts';
import styles from './LearnPage.module.scss';

interface LearnPageProps {
  textbooks: TextbookItem[];
  popularInsights: NewsItem[];
  experts: Expert[];
  lang: string;
}

export const LearnPage: React.FC<LearnPageProps> = ({ textbooks, popularInsights, experts, lang }) => {
  const t = getLearnTranslations(lang);
  const relatedArticles = popularInsights.slice(0, 3);

  return (
    <section className={styles.learnPage}>
      <header className={styles.header}>
        <Breadcrumbs
          lang={lang}
          items={[
            { labelKey: 'home', href: `/${lang}` },
            { labelKey: 'learn' },
          ]}
        />
        <div className={styles.titleRow}>
          <div className={styles.titleLine}>
            <h1>{t.title}</h1>
          </div>
          <p>{t.subtitle}</p>
        </div>
      </header>

      <LearnCatalog materials={textbooks} lang={lang} t={t} />

      <section className={styles.lowerGrid}>
        <div className={styles.readAlso}>
          <div className={styles.sectionHead}>
            <h2>{t.readAlso}</h2>
            <ViewAllLink href={`/${lang}/insights`} variant="arrow">
              {t.viewAll}
            </ViewAllLink>
          </div>
          <div className={styles.articleList}>
            {relatedArticles.map((article) => (
              <ArticleTeaserCard
                key={article.id}
                title={article.title}
                excerpt={article.excerpt || article.lead || ''}
                authorLabel={article.authorLabel || (lang === 'bg' ? 'от' : 'by')}
                readText={t.read}
                readHref={`/${lang}/insights/${article.id}`}
                authorHref={article.authorExpertId ? `/${lang}/experts/${article.authorExpertId}` : undefined}
                authorAvatarUrl={article.authorAvatarUrl}
                className={styles.articleCard}
              />
            ))}
          </div>
        </div>

        <aside className={styles.sideColumn}>
          <TopAuthorsBlock experts={experts} lang={lang} title={t.topAuthors} />
          <form className={styles.newsletter}>
            <h2><span>#</span> {t.newsletterTitle}</h2>
            <p>{t.newsletterText}</p>
            <div className={styles.emailRow}>
              <input type="email" placeholder={t.emailPlaceholder} aria-label={t.emailPlaceholder} />
              <button type="submit">{t.subscribe}</button>
            </div>
          </form>
        </aside>
      </section>
    </section>
  );
};
