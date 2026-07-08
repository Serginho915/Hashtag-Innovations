import React from 'react';
import { Expert } from '../../../Types/expert.ts';
import styles from './ExpertProfile.module.scss';
import { Breadcrumbs } from '../../UI/Breadcrumbs/Breadcrumbs.tsx';
import type { ExpertsTranslations } from '../../../app/[lang]/experts/translations.ts';

// Import sub-components
import { ExpertProfileHeader } from './components/ExpertProfileHeader.tsx';
import { ExpertBio } from './components/ExpertBio.tsx';
import { ExpertExperience } from './components/ExpertExperience.tsx';
import { ExpertLanguages } from './components/ExpertLanguages.tsx';
import { ExpertSessions } from './components/ExpertSessions.tsx';
import { ExpertAnalytics } from './components/ExpertAnalytics.tsx';
import { ExpertSimilar } from './components/ExpertSimilar.tsx';

interface ExpertProfileProps {
  expert: Expert;
  similarExperts: Expert[];
  t: ExpertsTranslations;
  lang: string;
}

const ExpertProfile: React.FC<ExpertProfileProps> = ({ expert, similarExperts, t, lang }) => {
  return (
    <div className={styles.profileWrapper}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        lang={lang}
        items={[
          { labelKey: 'home', href: `/${lang}` },
          { labelKey: 'experts', href: `/${lang}/experts` },
          { labelKey: expert.name }
        ]} 
      />

      {/* Header */}
      <ExpertProfileHeader expert={expert} t={t} lang={lang} />

      {/* Main Content Layout */}
      <div className={styles.mainContent}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <ExpertBio bio={expert.bio || []} t={t} />
          <ExpertExperience experienceList={expert.experienceList || []} t={t} />
          <ExpertLanguages languages={expert.languages || []} t={t} />
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <ExpertSessions expert={expert} sessions={expert.sessions || []} t={t} lang={lang} />
        </div>
      </div>

      {/* Analytics */}
      <ExpertAnalytics analytics={expert.analytics} t={t} />

      {/* Similar Experts */}
      <ExpertSimilar similarExperts={similarExperts} t={t} lang={lang} />
    </div>
  );
};

export default ExpertProfile;
