"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import styles from '../ExpertsHeader/ExpertsHeader.module.scss';

export const ExpertsFilters = ({ t }: { t: any }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Local state for instant UI updates, synced to URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  // Update URL helper
  const updateUrlParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentSearch = searchParams.get('search') || '';
      if (searchQuery !== currentSearch) {
        updateUrlParams('search', searchQuery || null);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, searchParams]);

  const toggleFilter = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  // Current values from URL
  const selectedExpertise = searchParams.get('expertise');
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const selectedLanguage = searchParams.get('language');

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
            {/* EXPERTISE DROPDOWN */}
            <div className={`${styles.selectBox} ${activeFilter === 'expertise' ? styles.active : ''}`} onClick={() => toggleFilter('expertise')}>
              <div className={`${styles.selectText} ${(selectedExpertise || activeFilter === 'expertise') ? styles.hasValue : ''}`}>
                {selectedExpertise || t.expertise}
              </div>
              <svg className={`${styles.arrow} ${activeFilter === 'expertise' ? styles.open : ''}`} width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#7E7E7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {/* PRICE RANGE DROPDOWN */}
            <div className={`${styles.inlineDropdown} ${activeFilter === 'price' ? styles.active : ''}`}>
              <div 
                className={styles.inlineDropdownHeader} 
                onClick={() => toggleFilter('price')}
              >
                <div className={`${styles.selectText} ${(minPrice || maxPrice) ? styles.hasValue : ''}`}>
                  {(minPrice || maxPrice) ? `$${minPrice || '0'} - $${maxPrice || '∞'}` : t.priceRange}
                </div>
                <div className={styles.arrowIconWrapper}>
                  <svg className={`${styles.arrow} ${activeFilter === 'price' ? styles.open : ''}`} width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#7E7E7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              {activeFilter === 'price' && (
                <div className={styles.inlineDropdownList}>
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
                </div>
              )}
            </div>
            
            {/* LANGUAGES DROPDOWN */}
            <div className={`${styles.inlineDropdown} ${activeFilter === 'languages' ? styles.active : ''}`}>
              <div 
                className={styles.inlineDropdownHeader} 
                onClick={() => toggleFilter('languages')}
              >
                <div className={`${styles.selectText} ${selectedLanguage ? styles.hasValue : ''}`}>
                  {selectedLanguage || t.languages}
                </div>
                <div className={styles.arrowIconWrapper}>
                  <svg className={`${styles.arrow} ${activeFilter === 'languages' ? styles.open : ''}`} width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#7E7E7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              {activeFilter === 'languages' && (
                <div className={styles.inlineDropdownList}>
                  <div 
                    className={`${styles.inlineDropdownItem} ${selectedLanguage === null ? styles.selected : ''}`}
                    onClick={() => { updateUrlParams('language', null); setActiveFilter(null); }}
                  >
                    {selectedLanguage === null && <div className={styles.activeDot}></div>}
                    {t.allOption || 'All'}
                  </div>
                  {['English', 'Български', 'Русский', 'Українська'].map((langOpt) => {
                    const isSelected = selectedLanguage === langOpt;
                    return (
                      <div 
                        key={langOpt}
                        className={`${styles.inlineDropdownItem} ${isSelected ? styles.selected : ''}`}
                        onClick={() => { updateUrlParams('language', isSelected ? null : langOpt); setActiveFilter(null); }}
                      >
                        {isSelected && <div className={styles.activeDot}></div>}
                        {langOpt}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Options Row for Expertise */}
      {activeFilter === 'expertise' && t.expertiseOptions && (
        <div className={styles.optionsContainer}>
          <div className={styles.optionsRow}>
            <div 
              className={`${styles.optionItem} ${selectedExpertise === null ? styles.selected : ''}`}
              onClick={() => updateUrlParams('expertise', null)}
            >
              {selectedExpertise === null && <div className={styles.activeDot}></div>}
              {t.allOption || 'All'}
            </div>
            {t.expertiseOptions.map((opt: string) => {
              const isSelected = selectedExpertise === opt;
              return (
                <div 
                  key={opt} 
                  className={`${styles.optionItem} ${isSelected ? styles.selected : ''}`}
                  onClick={() => updateUrlParams('expertise', isSelected ? null : opt)}
                >
                  {isSelected && <div className={styles.activeDot}></div>}
                  {opt}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
