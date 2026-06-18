import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs } from '../../UI/Breadcrumbs/Breadcrumbs.tsx';
import { ViewAllLink } from '../../UI/ViewAllLink/ViewAllLink.tsx';
import { ReadButton } from '../../Common/Buttons/ReadButton/ReadButton.tsx';
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
  const featuredArticle = relatedArticles[0];
  const compactArticles = relatedArticles.slice(1, 3);

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
            {featuredArticle && (
              <article className={styles.featuredArticle}>
                <Link href={`/${lang}/insights/${featuredArticle.id}`} className={styles.featuredArticleImage}>
                  <Image
                    src={featuredArticle.imageUrl}
                    alt={featuredArticle.title}
                    fill
                    className={styles.articleImage}
                    sizes="(max-width: 1023px) 100vw, 366px"
                  />
                </Link>
                <div className={styles.featuredArticleBody}>
                  <Link href={`/${lang}/insights/${featuredArticle.id}`} className={styles.articleTitleLink}>
                    <h3>{featuredArticle.title}</h3>
                  </Link>
                  <p>{featuredArticle.excerpt || featuredArticle.lead || ''}</p>
                  <div className={styles.featuredArticleAuthor}>
                    <span>{featuredArticle.authorLabel || (lang === 'bg' ? 'от' : 'by')}</span>
                    {featuredArticle.authorExpertId ? (
                      <Link href={`/${lang}/experts/${featuredArticle.authorExpertId}`}>
                        {featuredArticle.authorName}
                      </Link>
                    ) : (
                      <strong>{featuredArticle.authorName}</strong>
                    )}
                  </div>
                </div>
              </article>
            )}
            {compactArticles.map((article) => (
              <article className={styles.compactArticle} key={article.id}>
                <div className={styles.compactArticleInner}>
                  <Link href={`/${lang}/insights/${article.id}`} className={styles.articleTitleLink}>
                    <h3>{article.title}</h3>
                  </Link>
                  <p>{article.excerpt || article.lead || ''}</p>
                  <div className={styles.compactArticleFooter}>
                    <div className={styles.articleAvatarGroup}>
                      <span>{article.authorLabel || (lang === 'bg' ? 'от' : 'by')}</span>
                      {article.authorAvatarUrl ? (
                        <Link href={article.authorExpertId ? `/${lang}/experts/${article.authorExpertId}` : `/${lang}/insights/${article.id}`} className={styles.articleAvatar}>
                          <Image src={article.authorAvatarUrl} alt={article.authorName || article.authorLabel || article.title} fill className={styles.articleImage} sizes="32px" />
                        </Link>
                      ) : (
                        <span className={styles.articleAvatar} aria-hidden="true" />
                      )}
                    </div>
                    <ReadButton text={t.read} href={`/${lang}/insights/${article.id}`} />
                  </div>
                </div>
              </article>
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
