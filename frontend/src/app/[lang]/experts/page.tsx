import React from 'react';
import { Breadcrumbs } from '../../../Components/UI/Breadcrumbs/Breadcrumbs.tsx';
import styles from './ExpertsPage.module.scss';
import { translations } from './translations.ts';
import { MOCK_EXPERTS_EN, MOCK_EXPERTS_BG } from '../../../mockData/expertsMock.ts';
import { ExpertsHeader } from '../../../Components/Sections/Experts/ExpertsHeader/ExpertsHeader.tsx';
import { AllExpertsSection } from '../../../Components/Sections/Experts/AllExpertsSection/AllExpertsSection.tsx';
import { TopRatedSlider } from '../../../Components/Sections/Experts/TopRatedSlider/TopRatedSlider.tsx';

interface ExpertsPageProps {
  params: Promise<{
    lang: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ExpertsPage({ params, searchParams }: ExpertsPageProps) {
  const { lang } = await params;
  const sp = await searchParams;
  const t = translations[lang] || translations.en;
  
  const breadcrumbItems = [
    { labelKey: 'home', href: `/${lang}` },
    { labelKey: 'experts' }
  ];

  const initialExperts = lang === 'bg' ? MOCK_EXPERTS_BG : MOCK_EXPERTS_EN;

  // URL State
  const selectedExpertise = typeof sp.expertise === 'string' ? sp.expertise : null;
  const searchQuery = typeof sp.search === 'string' ? sp.search : '';
  const minPrice = typeof sp.minPrice === 'string' ? sp.minPrice : '';
  const maxPrice = typeof sp.maxPrice === 'string' ? sp.maxPrice : '';
  const selectedLanguage = typeof sp.language === 'string' ? sp.language : null;

  // Filter logic on the server
  let filteredExperts = initialExperts;

  if (selectedExpertise) {
    filteredExperts = filteredExperts.filter(expert => {
      if (!expert.expertise || expert.expertise.length === 0) return false;
      return expert.expertise.includes(selectedExpertise);
    });
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    filteredExperts = filteredExperts.filter(expert => {
      const matchesName = expert.name?.toLowerCase().includes(q);
      const matchesCompany = expert.company?.toLowerCase().includes(q);
      const matchesExpertise = expert.expertise?.some(exp => exp.toLowerCase().includes(q));
      return matchesName || matchesCompany || matchesExpertise;
    });
  }

  if (minPrice !== '') {
    const min = parseInt(minPrice, 10);
    if (!isNaN(min)) {
      filteredExperts = filteredExperts.filter(expert => expert.price !== undefined && expert.price >= min);
    }
  }

  if (maxPrice !== '') {
    const max = parseInt(maxPrice, 10);
    if (!isNaN(max)) {
      filteredExperts = filteredExperts.filter(expert => expert.price !== undefined && expert.price <= max);
    }
  }

  if (selectedLanguage) {
    filteredExperts = filteredExperts.filter(expert => {
      if (!expert.languages || expert.languages.length === 0) return false;
      return expert.languages.includes(selectedLanguage);
    });
  }

  // Use the filtered experts for the Top Rated section
  const topExperts = filteredExperts.slice(0, 10);

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
          
          <TopRatedSlider experts={topExperts} lang={lang} />
        </div>

        {filteredExperts.length > 0 && (
          <AllExpertsSection t={t} lang={lang} experts={filteredExperts} />
        )}
      </div>
    </div>
  );
}
