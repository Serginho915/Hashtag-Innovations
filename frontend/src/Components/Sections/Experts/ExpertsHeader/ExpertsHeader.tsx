"use client";

import React, { useState } from 'react';
import styles from './ExpertsHeader.module.scss';
import { SectionTitle } from '../../../UI/SectionTitle/SectionTitle';

interface ExpertsHeaderProps {
  t: any;
  selectedExpertise: string | null;
  onSelectExpertise: (val: string | null) => void;
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;
}

export const ExpertsHeader: React.FC<ExpertsHeaderProps> = ({ 
  t, 
  selectedExpertise, 
  onSelectExpertise,
  searchQuery,
  onSearchQueryChange
}) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const toggleFilter = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  const handleSelectExpertise = (option: string | null) => {
    if (option === null) {
      onSelectExpertise(null);
    } else {
      onSelectExpertise(selectedExpertise === option ? null : option);
    }
    // Do not close the filter automatically if it's a multi-select or if the user wants to keep it open
    // setActiveFilter(null);
  };

  return (
    <div className={styles.mainHeaderContent}>
      <div className={styles.titleRow}>
        <SectionTitle title={t.expertsTitle} hideBorder={true} />
      </div>
      
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
                onChange={(e) => onSearchQueryChange(e.target.value)}
              />
            </div>
          </div>
          
          <div className={styles.selectsRow}>
            <div className={`${styles.selectBox} ${activeFilter === 'expertise' ? styles.active : ''}`} onClick={() => toggleFilter('expertise')}>
              <div className={`${styles.selectText} ${(selectedExpertise || activeFilter === 'expertise') ? styles.hasValue : ''}`}>
                {selectedExpertise || t.expertise}
              </div>
              <svg className={`${styles.arrow} ${activeFilter === 'expertise' ? styles.open : ''}`} width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#7E7E7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className={styles.selectBox}>
              <div className={styles.selectText}>{t.priceRange}</div>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#7E7E7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className={styles.selectBox}>
              <div className={styles.selectText}>{t.languages}</div>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#7E7E7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Options Row */}
      {activeFilter === 'expertise' && t.expertiseOptions && (
        <div className={styles.optionsContainer}>
          <div className={styles.optionsRow}>
            <div 
              className={`${styles.optionItem} ${selectedExpertise === null ? styles.selected : ''}`}
              onClick={() => handleSelectExpertise(null)}
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
                  onClick={() => handleSelectExpertise(opt)}
                >
                  {isSelected && <div className={styles.activeDot}></div>}
                  {opt}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
