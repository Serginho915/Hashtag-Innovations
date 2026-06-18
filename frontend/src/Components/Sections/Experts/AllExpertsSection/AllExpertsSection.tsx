import React from 'react';
import styles from './AllExpertsSection.module.scss';
import { CatalogExpertCard } from '../CatalogExpertCard/CatalogExpertCard.tsx';
import { Expert } from '../../../../Types/expert.ts';
import { PromoBanner } from '../../../UI/PromoBanner/PromoBanner.tsx';
import type { ExpertsTranslations } from '../../../../app/[lang]/experts/translations.ts';

interface AllExpertsSectionProps {
  t: ExpertsTranslations;
  lang: string;
  experts: Expert[];
}

export const AllExpertsSection: React.FC<AllExpertsSectionProps> = ({ t, lang, experts }) => {
  // Create an array of 6 experts to match the layout (2 top left + 4 bottom)
  const displayExperts = Array.from({ length: 6 }).map((_, i) => experts[i % experts.length]).filter(Boolean);

  const topGridExperts = displayExperts.slice(0, 2);
  const bottomRowExperts = displayExperts.slice(2, 6);

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.topSection}>
        <div className={styles.expertsColumn}>
          <div className={styles.title}>
            {t.allExpertsTitle ? t.allExpertsTitle.replace('{count}', experts.length.toString()) : ''}
          </div>
          <div className={styles.topCardsGrid}>
            {topGridExperts.map((expert, index) => (
              <CatalogExpertCard 
                key={`top-${expert.id}-${index}`} 
                expert={expert} 
                lang={lang} 
                availableForLabel={lang === 'bg' ? 'Свободен за:' : 'Available for:'} 
              />
            ))}
          </div>
        </div>
        
        <PromoBanner 
          className={styles.bannerColumn}
          title={t.viewAlso}
          subtitle="(feed/related topics/banner)"
          content={t.becomeExpertBanner}
        />
      </div>

      <div className={styles.bottomRow}>
        {bottomRowExperts.map((expert, index) => (
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
