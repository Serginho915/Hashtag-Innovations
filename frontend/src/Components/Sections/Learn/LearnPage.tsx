'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from '../../UI/Breadcrumbs/Breadcrumbs.tsx';
import { DropdownFilter, DropdownOption } from '../../UI/DropdownFilter/DropdownFilter.tsx';
import { ViewAllLink } from '../../UI/ViewAllLink/ViewAllLink.tsx';
import { ArticleTeaserCard } from '../../UI/ArticleTeaserCard/ArticleTeaserCard.tsx';
import { TextbookItem } from '../../../Types/textbook.ts';
import { NewsItem } from '../../../Types/news.ts';
import { Expert } from '../../../Types/expert.ts';
import { MaterialCard } from './MaterialCard/MaterialCard.tsx';
import { TrendingMaterials } from './TrendingMaterials/TrendingMaterials.tsx';
import { TopAuthorsBlock } from './TopAuthorsBlock/TopAuthorsBlock.tsx';
import styles from './LearnPage.module.scss';

interface LearnPageProps {
  textbooks: TextbookItem[];
  popularInsights: NewsItem[];
  experts: Expert[];
  lang: string;
}

const translations = {
  en: {
    title: 'Learning Materials',
    subtitle: 'Explore expert-built reports, business models, papers, guides, and practical learning materials created for ambitious professionals.',
    search: 'Search',
    topic: 'Topic',
    format: 'Format',
    all: 'All',
    get: 'Get',
    preview: 'Preview',
    trending: 'Trending',
    showMore: 'show more',
    readAlso: 'Read Also',
    viewAll: 'VIEW ALL',
    topAuthors: 'Top Authors',
    newsletterTitle: 'Stay Ahead',
    newsletterText: 'Get curated learning materials, event updates, and expert insights delivered every Monday.',
    emailPlaceholder: 'Enter your email',
    subscribe: 'Subscribe',
    read: 'Read',
  },
  bg: {
    title: 'Учебни материали',
    subtitle: 'Разгледайте експертни доклади, бизнес модели, научни статии, ръководства и практически обучителни материали за амбициозни професионалисти.',
    search: 'Търсене',
    topic: 'Тема',
    format: 'Формат',
    all: 'Всички',
    get: 'Вземи',
    preview: 'Преглед',
    trending: 'Набира популярност',
    showMore: 'покажи повече',
    readAlso: 'Прочетете още',
    viewAll: 'Виж всички',
    topAuthors: 'Топ автори',
    newsletterTitle: 'Бъдете напред',
    newsletterText: 'Получавайте подбрани учебни материали, събития и експертни мнения всяка седмица.',
    emailPlaceholder: 'Въведете вашия email',
    subscribe: 'Абонирай се',
    read: 'Прочети',
  },
};

const normalize = (value: string) => value.trim().toLowerCase();

const toOptions = (values: string[], allLabel: string): DropdownOption[] => [
  { label: allLabel, value: null },
  ...Array.from(new Set(values.filter(Boolean))).map((value) => ({
    label: value,
    value,
  })),
];

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M10.75 18.5a7.75 7.75 0 1 1 0-15.5 7.75 7.75 0 0 1 0 15.5Zm0-2a5.75 5.75 0 1 0 0-11.5 5.75 5.75 0 0 0 0 11.5Zm5.41.07 4.13 4.13-1.42 1.42-4.13-4.13 1.42-1.42Z"
      fill="currentColor"
    />
  </svg>
);

export const LearnPage: React.FC<LearnPageProps> = ({ textbooks, popularInsights, experts, lang }) => {
  const t = translations[lang as keyof typeof translations] || translations.en;
  const [search, setSearch] = useState('');
  const [topic, setTopic] = useState<string | null>(null);
  const [format, setFormat] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);

  const topicOptions = useMemo(
    () => toOptions(textbooks.map((material) => material.category || ''), t.all),
    [textbooks, t.all]
  );
  const formatOptions = useMemo(
    () => toOptions(textbooks.map((material) => material.format || material.badge || ''), t.all),
    [textbooks, t.all]
  );

  const filteredMaterials = useMemo(() => {
    const query = normalize(search);

    return textbooks.filter((material) => {
      const materialTopic = material.category || '';
      const materialFormat = material.format || material.badge || '';
      const matchesTopic = !topic || materialTopic === topic;
      const matchesFormat = !format || materialFormat === format;
      const searchable = normalize([
        material.title,
        material.excerpt,
        material.authorName,
        materialTopic,
        materialFormat,
      ].join(' '));
      const matchesSearch = !query || searchable.includes(query);

      return matchesTopic && matchesFormat && matchesSearch;
    });
  }, [format, search, textbooks, topic]);

  const featuredMaterials = filteredMaterials.slice(0, 2);
  const listMaterials = filteredMaterials.slice(2, visibleCount);
  const hasMore = visibleCount < filteredMaterials.length;
  const relatedArticles = popularInsights.slice(0, 3);

  const handleShowMore = () => {
    setVisibleCount((count) => Math.min(count + 3, filteredMaterials.length));
  };

  const handleTopicSelect = (value: string | null) => {
    setTopic(value);
    setVisibleCount(8);
  };

  const handleFormatSelect = (value: string | null) => {
    setFormat(value);
    setVisibleCount(8);
  };

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
        <div className={styles.filtersRow}>
          <label className={styles.searchBox}>
            <SearchIcon />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setVisibleCount(8);
              }}
              placeholder={t.search}
              aria-label={t.search}
            />
          </label>
          <div className={styles.dropdownGroup}>
            <DropdownFilter label={t.topic} options={topicOptions} value={topic} variant="events" onSelect={handleTopicSelect} />
            <DropdownFilter label={t.format} options={formatOptions} value={format} variant="events" onSelect={handleFormatSelect} />
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.featuredRow}>
          <div className={styles.featuredGrid}>
            {featuredMaterials.map((material) => (
              <MaterialCard
                key={material.id || material.title}
                material={material}
                lang={lang}
                variant="featured"
                getText={t.get}
                previewText={t.preview}
              />
            ))}
          </div>
          <TrendingMaterials materials={filteredMaterials} lang={lang} title={t.trending} />
        </section>

        {listMaterials.length > 0 && (
          <section className={styles.materialsGrid} aria-label={t.title}>
            {listMaterials.map((material) => (
              <MaterialCard
                key={material.id || material.title}
                material={material}
                lang={lang}
                getText={t.get}
                previewText={t.preview}
              />
            ))}
          </section>
        )}

        {hasMore && (
          <button className={styles.showMore} type="button" onClick={handleShowMore}>
            <span>{t.showMore}</span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

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
      </div>
    </section>
  );
};
