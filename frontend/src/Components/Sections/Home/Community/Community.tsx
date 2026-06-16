import React from 'react';
import styles from './Community.module.scss';
import { SectionTitle } from '../../../UI/SectionTitle/SectionTitle.tsx';
import { translations } from './translations.ts';
import { CommunityInteractive } from './CommunityInteractive.tsx';

import { CommunityEvent } from '../../../../Types/community.ts';

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
