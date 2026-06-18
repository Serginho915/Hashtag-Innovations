"use client";

import React from 'react';
import styles from '../../../../app/[lang]/experts/ExpertsPage.module.scss';
import { CatalogExpertCard } from '../CatalogExpertCard/CatalogExpertCard.tsx';
import { Expert } from '../../../../Types/expert.ts';
import { useScrollProgress } from '../../../../Hooks/useScrollProgress.ts';

interface TopRatedSliderProps {
  experts: Expert[];
  lang: string;
}

export const TopRatedSlider: React.FC<TopRatedSliderProps> = ({ experts, lang }) => {
  const { scrollRef, scrollPrev, scrollNext } = useScrollProgress<HTMLDivElement>({
    axis: 'horizontal',
    scrollAmount: 336.5,
  });

  if (experts.length === 0) {
    return (
      <div style={{ padding: '24px 0', color: '#7e7e7e' }}>
        {lang === 'bg' ? 'Няма намерени експерти.' : lang === 'ru' ? 'Эксперты не найдены.' : 'No experts found.'}
      </div>
    );
  }

  return (
    <div className={styles.sliderWrapper}>
      {experts.length > 4 && (
        <button 
          className={`${styles.arrowBtn} ${styles.leftArrow}`} 
          onClick={scrollPrev}
          aria-label="Scroll left"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      <div className={styles.cardsContainer} ref={scrollRef}>
        {experts.map((expert) => (
          <CatalogExpertCard 
            key={expert.id} 
            expert={expert} 
            lang={lang} 
            availableForLabel={lang === 'bg' ? 'Свободен за:' : 'Available for:'} 
          />
        ))}
      </div>

      {experts.length > 4 && (
        <button 
          className={`${styles.arrowBtn} ${styles.rightArrow}`} 
          onClick={scrollNext}
          aria-label="Scroll right"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
};
