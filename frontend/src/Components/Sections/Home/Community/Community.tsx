import React from 'react';
import styles from './Community.module.scss';
import { SectionTitle } from '../../../UI/SectionTitle/SectionTitle';
import { translations } from './translations';
import { CommunityInteractive } from './CommunityInteractive';

import { CommunityEvent } from '../../../../Types/community';

interface CommunityProps {
  lang: string;
  events: CommunityEvent[];
}

export const Community = async ({ lang, events }: CommunityProps) => {
  const t = translations[lang] || translations.bg;

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
