import React from 'react';
import { Expert } from '../../../Types/expert';
import styles from './ExpertProfile.module.scss';
import { Breadcrumbs } from '../../UI/Breadcrumbs/Breadcrumbs';

// Import sub-components
import { ExpertProfileHeader } from './components/ExpertProfileHeader';
import { ExpertBio } from './components/ExpertBio';
import { ExpertExperience } from './components/ExpertExperience';
import { ExpertLanguages } from './components/ExpertLanguages';
import { ExpertSessions } from './components/ExpertSessions';
import { ExpertAnalytics } from './components/ExpertAnalytics';
import { ExpertSimilar } from './components/ExpertSimilar';

interface ExpertProfileProps {
  expert: Expert;
  similarExperts: Expert[];
  t: Record<string, string>;
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
      <ExpertProfileHeader expert={expert} t={t} />

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
          <ExpertSessions sessions={expert.sessions || []} t={t} />
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
