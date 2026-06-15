"use client";

import React, { useState, useMemo, useRef } from 'react';
import styles from '../../../../app/[lang]/experts/ExpertsPage.module.scss';
import { ExpertsHeader } from '../ExpertsHeader/ExpertsHeader';
import { CatalogExpertCard } from '../CatalogExpertCard/CatalogExpertCard';
import { AllExpertsSection } from '../AllExpertsSection/AllExpertsSection';
import { Expert } from '../../../../Types/expert';

interface ExpertsCatalogClientProps {
  t: any;
  lang: string;
  initialExperts: Expert[];
  breadcrumbs: React.ReactNode;
}

export const ExpertsCatalogClient: React.FC<ExpertsCatalogClientProps> = ({ t, lang, initialExperts, breadcrumbs }) => {
  const [selectedExpertise, setSelectedExpertise] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter experts based on selected expertise and search query
  const filteredExperts = useMemo(() => {
    let filtered = initialExperts;

    if (selectedExpertise) {
      filtered = filtered.filter(expert => {
        if (!expert.expertise || expert.expertise.length === 0) return false;
        return expert.expertise.includes(selectedExpertise);
      });
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(expert => {
        const matchesName = expert.name?.toLowerCase().includes(q);
        const matchesCompany = expert.company?.toLowerCase().includes(q);
        const matchesExpertise = expert.expertise?.some(exp => exp.toLowerCase().includes(q));
        
        return matchesName || matchesCompany || matchesExpertise;
      });
    }

    return filtered;
  }, [initialExperts, selectedExpertise, searchQuery]);

  // Use the filtered experts for the Top Rated section (allowing more than 4 for scroll)
  const topExperts = filteredExperts.slice(0, 10);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      // Scroll by the width of one card + gap (324.5 + 12 = 336.5)
      const scrollAmount = 336.5; 
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className={styles.headerBlock}>
        {breadcrumbs}
        <ExpertsHeader 
          t={t} 
          selectedExpertise={selectedExpertise} 
          onSelectExpertise={setSelectedExpertise} 
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />
      </div>
      
      <div className={styles.topRatedSection}>
        <div className={styles.topRatedHeader}>
          <div className={styles.topRatedTitleGroup}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <g clipPath="url(#clip0_606_2170)">
                <path d="M8.00004 14.6668C4.31804 14.6668 1.33337 11.6822 1.33337 8.00016C1.33337 4.31816 4.31804 1.3335 8.00004 1.3335C11.682 1.3335 14.6667 4.31816 14.6667 8.00016C14.6667 11.6822 11.682 14.6668 8.00004 14.6668ZM5.33337 8.66683C5.33337 9.37407 5.61433 10.0524 6.11442 10.5524C6.61452 11.0525 7.2928 11.3335 8.00004 11.3335C8.70728 11.3335 9.38556 11.0525 9.88566 10.5524C10.3858 10.0524 10.6667 9.37407 10.6667 8.66683H5.33337ZM5.33337 7.3335C5.59859 7.3335 5.85294 7.22814 6.04048 7.0406C6.22802 6.85307 6.33337 6.59871 6.33337 6.3335C6.33337 6.06828 6.22802 5.81393 6.04048 5.62639C5.85294 5.43885 5.59859 5.3335 5.33337 5.3335C5.06816 5.3335 4.8138 5.43885 4.62627 5.62639C4.43873 5.81393 4.33337 6.06828 4.33337 6.3335C4.33337 6.59871 4.43873 6.85307 4.62627 7.0406C4.8138 7.22814 5.06816 7.3335 5.33337 7.3335V7.3335ZM10.6667 7.3335C10.9319 7.3335 11.1863 7.22814 11.3738 7.0406C11.5613 6.85307 11.6667 6.59871 11.6667 6.3335C11.6667 6.06828 11.5613 5.81393 11.3738 5.62639C11.1863 5.43885 10.9319 5.3335 10.6667 5.3335C10.4015 5.3335 10.1471 5.43885 9.9596 5.62639C9.77206 5.81393 9.66671 6.06828 9.66671 6.3335C9.66671 6.59871 9.77206 6.85307 9.9596 7.0406C10.1471 7.22814 10.4015 7.3335 10.6667 7.3335Z" fill="#D62612"/>
              </g>
              <defs>
                <clipPath id="clip0_606_2170">
                  <rect width="16" height="16" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <div className={styles.topRatedTitle}>TOP rated</div>
          </div>
        </div>
        
        {topExperts.length > 0 ? (
          <div className={styles.sliderWrapper}>
            {topExperts.length > 4 && (
              <button 
                className={`${styles.arrowBtn} ${styles.leftArrow}`} 
                onClick={() => scroll('left')}
                aria-label="Scroll left"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}

            <div className={styles.cardsContainer} ref={scrollContainerRef}>
              {topExperts.map((expert) => (
                <CatalogExpertCard 
                  key={expert.id} 
                  expert={expert} 
                  lang={lang} 
                  availableForLabel={lang === 'bg' ? 'Свободен за:' : 'Available for:'} 
                />
              ))}
            </div>

            {topExperts.length > 4 && (
              <button 
                className={`${styles.arrowBtn} ${styles.rightArrow}`} 
                onClick={() => scroll('right')}
                aria-label="Scroll right"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div style={{ padding: '24px 0', color: '#7e7e7e' }}>
            {lang === 'bg' ? 'Няма намерени експерти.' : lang === 'ru' ? 'Эксперты не найдены.' : 'No experts found.'}
          </div>
        )}
      </div>
      
      {filteredExperts.length > 0 && (
        <AllExpertsSection t={t} lang={lang} experts={filteredExperts} />
      )}
    </>
  );
};
