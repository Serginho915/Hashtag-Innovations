import React from 'react';
import styles from './AllExpertsSection.module.scss';
import { CatalogExpertCard } from '../CatalogExpertCard/CatalogExpertCard';
import { Expert } from '../../../../Types/expert';

interface AllExpertsSectionProps {
  t: any;
  lang: string;
  experts: Expert[];
}

export const AllExpertsSection: React.FC<AllExpertsSectionProps> = ({ t, lang, experts }) => {
  // Create an array of 5 experts to match the layout (2 + 3)
  // If we don't have enough, we'll just repeat the available ones for demonstration
  const displayExperts = [
    experts[0],
    experts[1 % experts.length],
    experts[2 % experts.length],
    experts[3 % experts.length],
    experts[4 % experts.length] || experts[0]
  ].filter(Boolean);

  const row1Experts = displayExperts.slice(0, 2);
  const row2Experts = displayExperts.slice(2, 5);

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.topRow}>
        <div className={styles.expertsColumn}>
          <div className={styles.title}>
            {t.allExpertsTitle ? t.allExpertsTitle.replace('{count}', experts.length.toString()) : ''}
          </div>
          <div className={styles.cardsRow}>
            {row1Experts.map((expert, index) => (
              <CatalogExpertCard 
                key={`top-${expert.id}-${index}`} 
                expert={expert} 
                lang={lang} 
                availableForLabel={lang === 'bg' ? 'Свободен за:' : 'Available for:'} 
              />
            ))}
          </div>
        </div>
        
        <div className={styles.bannerColumn}>
          <div className={styles.bannerHeader}>
            <div className={styles.bannerTitle}>{t.viewAlso}</div>
            <div className={styles.bannerSubtitle}>(feed/related topics/banner)</div>
          </div>
          <div className={styles.bannerContainer}>
            <div className={styles.bannerContent}>
              {t.becomeExpertBanner}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomRow}>
        {row2Experts.map((expert, index) => (
          <CatalogExpertCard 
            key={`bottom-${expert.id}-${index}`} 
            expert={expert} 
            lang={lang} 
            availableForLabel={lang === 'bg' ? 'Свободен за:' : 'Available for:'} 
          />
        ))}
      </div>
    </div>
  );
};
