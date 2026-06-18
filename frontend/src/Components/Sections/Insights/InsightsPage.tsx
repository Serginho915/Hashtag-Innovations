'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from '../../UI/Breadcrumbs/Breadcrumbs.tsx';
import { ArticleTeaserCard } from '../../UI/ArticleTeaserCard/ArticleTeaserCard.tsx';
import { RelatedEventsBlock } from '../Events/RelatedEventsBlock/RelatedEventsBlock.tsx';
import { CommunityEvent } from '../../../Types/community.ts';
import { NewsItem } from '../../../Types/news.ts';
import { InsightCard } from './InsightCard/InsightCard.tsx';
import styles from './InsightsPage.module.scss';

interface InsightsPageProps {
  insights: NewsItem[];
  relatedEvents: CommunityEvent[];
  lang: string;
}

const categoryIds = ['business', 'ai', 'innovations', 'technology', 'events', 'ecology', 'education'] as const;

type CategoryId = typeof categoryIds[number];

const translations = {
  en: {
    title: 'Insights',
    categories: {
      business: 'Business',
      ai: 'Artificial Intelligence',
      innovations: 'Innovations',
      technology: 'Technology',
      events: 'Events',
      ecology: 'Ecology',
      education: 'Education',
    },
    showMore: 'show more',
    relatedEvents: 'Relevant Events',
    viewAll: 'VIEW ALL',
    popular: 'Popular Now',
    newsletterTitle: 'Stay Ahead',
    newsletterText: 'Get curated business content, event updates, and expert insights delivered every Monday.',
    emailPlaceholder: 'Enter your email',
    subscribe: 'Subscribe',
    read: 'Read',
  },
  bg: {
    title: 'Инсайти',
    categories: {
      business: 'Бизнес',
      ai: 'Изкуствен интелект',
      innovations: 'Иновации',
      technology: 'Технологии',
      events: 'Събития',
      ecology: 'Екология',
      education: 'Образование',
    },
    showMore: 'покажи повече',
    relatedEvents: 'Релевантни събития',
    viewAll: 'Виж всички',
    popular: 'Популярно сега',
    newsletterTitle: 'Бъдете напред',
    newsletterText: 'Получавайте подбрано бизнес съдържание, актуализации за събития и експертни мнения всяка седмица.',
    emailPlaceholder: 'Въведете вашия email',
    subscribe: 'Абонирай се',
    read: 'Прочети',
  },
};

const categoryMatchers: Record<CategoryId, string[]> = {
  business: ['business', 'strategy'],
  ai: ['ai', 'artificial intelligence', 'изкуствен интелект', 'искуствен интелект'],
  innovations: ['innovation', 'innovations', 'инновации', 'strategy'],
  technology: ['technology', 'tech', 'технологии'],
  events: ['events', 'event', 'meetup', 'summit', 'entertainment', 'събития', 'события'],
  ecology: ['ecology', 'sustainability', 'еко', 'экология'],
  education: ['education', 'learn', 'learning', 'образование'],
};

const normalizeFilterValue = (value: string) => value.toLowerCase().trim();

const articleMatchesCategory = (article: NewsItem, category: CategoryId) => {
  const matchers = categoryMatchers[category];
  const searchableValues = [
    article.category,
    article.title,
    ...(article.tags || []),
  ].map(normalizeFilterValue);

  return searchableValues.some((value) => matchers.some((matcher) => value.includes(matcher)));
};

export const InsightsPage: React.FC<InsightsPageProps> = ({ insights, relatedEvents, lang }) => {
  const t = translations[lang as keyof typeof translations] || translations.en;
  const [activeCategory, setActiveCategory] = useState<CategoryId>('business');
  const filteredInsights = useMemo(
    () => insights.filter((article) => articleMatchesCategory(article, activeCategory)),
    [activeCategory, insights]
  );
  const [featured, side, ...rest] = filteredInsights;
  const gridArticles = rest.slice(0, 3);
  const hasMoreArticles = rest.length > gridArticles.length;
  const popularArticles = insights.slice(0, 4);
  const newsletterId = 'insights-newsletter-email';

  return (
    <section className={styles.insightsPage}>
      <header className={styles.header}>
        <Breadcrumbs
          lang={lang}
          items={[
            { labelKey: 'home', href: `/${lang}` },
            { labelKey: t.title },
          ]}
        />
        <div className={styles.titleBlock}>
          <div className={styles.titleLine}>
            <h1>{t.title}</h1>
          </div>
          <ul className={styles.categories} aria-label={t.title}>
            {categoryIds.map((categoryId, index) => {
              const isBeforeActive = categoryIds[index + 1] === activeCategory;

              return (
                <li key={categoryId} className={isBeforeActive ? styles.beforeActiveCategory : undefined}>
                  <button
                    className={`${styles.categoryButton} ${activeCategory === categoryId ? styles.activeCategory : ''}`}
                    type="button"
                    onClick={() => setActiveCategory(categoryId)}
                    aria-pressed={activeCategory === categoryId}
                  >
                    {activeCategory === categoryId && <span className={styles.categoryDot} aria-hidden="true" />}
                    <span>{t.categories[categoryId]}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </header>

      <div className={styles.contentStack}>
        <section className={styles.featuredRow}>
          {featured && <InsightCard article={featured} lang={lang} variant="featured" />}
          {side && <InsightCard article={side} lang={lang} variant="side" />}
        </section>

        <section className={styles.middleRow}>
          <div className={styles.articlesColumn}>
            <ul className={styles.gridArticles}>
              {gridArticles.map((article) => (
                <li key={article.id}>
                  <InsightCard article={article} lang={lang} />
                </li>
              ))}
            </ul>
            {hasMoreArticles && (
              <button className={styles.showMoreButton} type="button">
                <span>{t.showMore}</span>
                <span className={styles.chevron} aria-hidden="true" />
              </button>
            )}
          </div>
          <aside className={styles.banner} aria-label="banner">
            <span>banner</span>
            <span className={styles.bannerIcon} aria-hidden="true" />
          </aside>
        </section>
      </div>

      <section className={styles.bottomGrid}>
        <RelatedEventsBlock
          title={t.relatedEvents}
          viewAllText={t.viewAll}
          events={relatedEvents}
          lang={lang}
          layout="grid"
        />

        <aside className={styles.sidebar}>
          <div className={styles.popularHeader}>
            <span className={styles.redDot} aria-hidden="true" />
            <h2>{t.popular}</h2>
          </div>
          <ul className={styles.popularList}>
            {popularArticles.map((article) => (
              <ArticleTeaserCard
                key={article.id}
                as="li"
                title={article.title}
                excerpt={article.excerpt || ''}
                authorLabel={article.authorLabel || 'by'}
                authorHref={article.authorExpertId ? `/${lang}/experts/${article.authorExpertId}` : undefined}
                authorAvatarUrl={article.authorAvatarUrl}
                readText={t.read}
                readHref={`/${lang}/insights/${article.id}`}
              />
            ))}
          </ul>

          <form className={styles.newsletter}>
            <div className={styles.newsletterHeader}>
              <div className={styles.newsletterBrand}>
                <span>#</span>
                <h2>{t.newsletterTitle}</h2>
              </div>
              <p>{t.newsletterText}</p>
            </div>
            <label className={styles.newsletterField} htmlFor={newsletterId}>
              <span className={styles.visuallyHidden}>{t.emailPlaceholder}</span>
              <input id={newsletterId} type="email" placeholder={t.emailPlaceholder} />
              <button type="submit">{t.subscribe}<span aria-hidden="true" /></button>
            </label>
          </form>
        </aside>
      </section>
    </section>
  );
};
