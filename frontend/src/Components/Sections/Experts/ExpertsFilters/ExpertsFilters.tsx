"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import styles from '../ExpertsHeader/ExpertsHeader.module.scss';
import { DropdownFilter } from '../../../UI/DropdownFilter/DropdownFilter.tsx';
import type { ExpertsTranslations } from '../../../../app/[lang]/experts/translations.ts';

export const ExpertsFilters = ({ t }: { t: ExpertsTranslations }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for instant UI updates, synced to URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  // Update URL helper
  const updateUrlParams = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentSearch = searchParams.get('search') || '';
      if (searchQuery !== currentSearch) {
        updateUrlParams('search', searchQuery || null);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, searchParams, updateUrlParams]);

  // Current values from URL
  const selectedExpertise = searchParams.get('expertise');
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const selectedLanguage = searchParams.get('language');
  const priceLabel = (minPrice || maxPrice) ? `$${minPrice || '0'} - $${maxPrice || '∞'}` : null;
  const allOption = t.allOption || 'All';

  return (
    <>
      <div className={styles.controlsRow}>
        <div className={styles.descriptionWrapper}>
          <div className={styles.descriptionText}>{t.expertsDesc}</div>
        </div>
        
        <div className={styles.filtersColumn}>
          <div className={styles.searchBox}>
            <div className={styles.searchInner}>
              <div className={styles.searchIconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7E7E7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input 
                type="text" 
                className={styles.searchInput} 
                placeholder={t.searchPlaceholder} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className={styles.selectsRow}>
            <DropdownFilter
              label={t.expertise}
              value={selectedExpertise}
              options={[
                { label: allOption, value: null },
                ...(t.expertiseOptions || []).map((opt: string) => ({ label: opt, value: opt }))
              ]}
              onSelect={(value) => updateUrlParams('expertise', value)}
            />

            <DropdownFilter label={t.priceRange} value={priceLabel}>
              <div className={styles.inlineDropdownItem}>
                <input
                  type="number"
                  placeholder="min"
                  value={minPrice}
                  onChange={(e) => updateUrlParams('minPrice', e.target.value)}
                  className={styles.priceInput}
                />
              </div>
              <div className={styles.inlineDropdownItem}>
                <input
                  type="number"
                  placeholder="max"
                  value={maxPrice}
                  onChange={(e) => updateUrlParams('maxPrice', e.target.value)}
                  className={styles.priceInput}
                />
              </div>
            </DropdownFilter>

            <DropdownFilter
              label={t.languages}
              value={selectedLanguage}
              options={[
                { label: allOption, value: null },
                ...['English', 'Български', 'Русский', 'Українська'].map((langOpt) => ({ label: langOpt, value: langOpt }))
              ]}
              onSelect={(value) => updateUrlParams('language', value)}
            />
          </div>
        </div>
      </div>
    </>
  );
};
