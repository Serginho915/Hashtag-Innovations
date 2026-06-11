import React from 'react';
import styles from './Community.module.scss';
import { SectionTitle } from '../../../UI/SectionTitle/SectionTitle';
import { translations } from './translations';
import { CommunityInteractive } from './CommunityInteractive';

interface CommunityProps {
  lang: string;
}

import { MOCK_EVENTS } from './mockData';

export const Community = async ({ lang }: CommunityProps) => {
  const t = translations[lang] || translations.bg;

  // In a real app, this would be an API call
  const events = MOCK_EVENTS;

  return (
    <section className={styles.communitySection}>
      <div className={styles.communityContainer}>
        <SectionTitle title={t.title} />
        
        <div className={styles.mainContentRow}>
          <div className={styles.eventsColumn}>
            <CommunityInteractive lang={lang} events={events} />
          </div>
        </div>
      </div>
    </section>
  );
};
