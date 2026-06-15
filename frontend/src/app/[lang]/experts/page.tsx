import React from 'react';
import { Breadcrumbs } from '../../../Components/UI/Breadcrumbs/Breadcrumbs';
import { SectionTitle } from '../../../Components/UI/SectionTitle/SectionTitle';
import styles from './ExpertsPage.module.scss';
import { translations } from './translations';
import { MOCK_EXPERTS_EN, MOCK_EXPERTS_BG } from '../../../mockData/expertsMock';
import { CatalogExpertCard } from '../../../Components/Sections/Experts/CatalogExpertCard/CatalogExpertCard';
import { ExpertsHeader } from '../../../Components/Sections/Experts/ExpertsHeader/ExpertsHeader';
import { AllExpertsSection } from '../../../Components/Sections/Experts/AllExpertsSection/AllExpertsSection';

import { ExpertsCatalogClient } from '../../../Components/Sections/Experts/ExpertsCatalogClient/ExpertsCatalogClient';

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

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <ExpertsCatalogClient 
          t={t} 
          lang={lang} 
          initialExperts={experts}
          breadcrumbs={<Breadcrumbs items={breadcrumbItems} lang={lang} />}
        />
      </div>
    </div>
  );
}
