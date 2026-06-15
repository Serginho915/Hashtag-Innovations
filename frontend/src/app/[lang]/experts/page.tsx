import React from 'react';
import { Breadcrumbs } from '../../../Components/UI/Breadcrumbs/Breadcrumbs';
import { SectionTitle } from '../../../Components/UI/SectionTitle/SectionTitle';
import styles from './ExpertsPage.module.scss';
import { translations } from './translations';
import { MOCK_EXPERTS_EN, MOCK_EXPERTS_BG } from '../../../mockData/expertsMock';
import { CatalogExpertCard } from '../../../Components/Sections/Experts/CatalogExpertCard/CatalogExpertCard';
import { ExpertsHeader } from '../../../Components/Sections/Experts/ExpertsHeader/ExpertsHeader';

interface ExpertsPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function ExpertsPage({ params }: ExpertsPageProps) {
  const { lang } = await params;
  const t = translations[lang] || translations.en;
  
  const breadcrumbItems = [
    { labelKey: 'home', href: `/${lang}` },
    { labelKey: 'experts' }
  ];

  const experts = lang === 'bg' ? MOCK_EXPERTS_BG : MOCK_EXPERTS_EN;
  const topExperts = experts.slice(0, 4);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.headerBlock}>
          <Breadcrumbs items={breadcrumbItems} lang={lang} />
          
          <ExpertsHeader t={t} />
        </div>
        
        <div className={styles.topRatedSection}>
          <div className={styles.topRatedHeader}>
            <div className={styles.topRatedTitleGroup}>
              <div className={styles.topRatedIconWrapper}>
                <div className={styles.topRatedIconInner}></div>
              </div>
              <div className={styles.topRatedTitle}>TOP rated</div>
            </div>
          </div>
          
          <div className={styles.cardsContainer}>
            {topExperts.map((expert) => (
              <CatalogExpertCard 
                key={expert.id} 
                expert={expert} 
                lang={lang} 
                availableForLabel={lang === 'bg' ? 'Свободен за:' : 'Available for:'} 
              />
            ))}
          </div>
        </div>
        
        {/* Placeholder for the rest of the experts list */}
      </div>
    </div>
  );
}
