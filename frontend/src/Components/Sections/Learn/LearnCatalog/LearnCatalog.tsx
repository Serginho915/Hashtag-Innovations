'use client';

import React, { useMemo, useState } from 'react';
import { DropdownFilter } from '../../../UI/DropdownFilter/DropdownFilter.tsx';
import type { DropdownOption } from '../../../UI/DropdownFilter/DropdownFilter.tsx';
import type { TextbookItem } from '../../../../Types/textbook.ts';
import { MaterialCard } from '../MaterialCard/MaterialCard.tsx';
import { TrendingMaterials } from '../TrendingMaterials/TrendingMaterials.tsx';
import type { LearnTranslations } from '../translations.ts';
import styles from '../LearnPage.module.scss';

interface LearnCatalogProps {
  materials: TextbookItem[];
  lang: string;
  t: LearnTranslations;
}

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

export const LearnCatalog: React.FC<LearnCatalogProps> = ({ materials, lang, t }) => {
  const [search, setSearch] = useState('');
  const [topic, setTopic] = useState<string | null>(null);
  const [format, setFormat] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);

  const topicOptions = useMemo(
    () => toOptions(materials.map((material) => material.category || ''), t.all),
    [materials, t.all]
  );
  const formatOptions = useMemo(
    () => toOptions(materials.map((material) => material.format || material.badge || ''), t.all),
    [materials, t.all]
  );

  const filteredMaterials = useMemo(() => {
    const query = normalize(search);

    return materials.filter((material) => {
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
  }, [format, materials, search, topic]);

  const featuredMaterials = filteredMaterials.slice(0, 2);
  const listMaterials = filteredMaterials.slice(2, visibleCount);
  const hasMore = visibleCount < filteredMaterials.length;

  const resetVisibleCount = () => setVisibleCount(8);

  return (
    <>
      <div className={styles.filtersRow}>
        <label className={styles.searchBox}>
          <SearchIcon />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              resetVisibleCount();
            }}
            placeholder={t.search}
            aria-label={t.search}
          />
        </label>
        <div className={styles.dropdownGroup}>
          <DropdownFilter
            label={t.topic}
            options={topicOptions}
            value={topic}
            variant="events"
            onSelect={(value) => {
              setTopic(value);
              resetVisibleCount();
            }}
          />
          <DropdownFilter
            label={t.format}
            options={formatOptions}
            value={format}
            variant="events"
            onSelect={(value) => {
              setFormat(value);
              resetVisibleCount();
            }}
          />
        </div>
      </div>

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
          <button
            className={styles.showMore}
            type="button"
            onClick={() => setVisibleCount((count) => Math.min(count + 3, filteredMaterials.length))}
          >
            <span>{t.showMore}</span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
};
