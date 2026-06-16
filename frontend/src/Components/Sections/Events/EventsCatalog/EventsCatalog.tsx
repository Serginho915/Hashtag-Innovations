"use client";

import React, { useState } from 'react';
import styles from './EventsCatalog.module.scss';
import { CommunityEvent } from '../../../../Types/community.ts';
import { CommunityEventCard } from '../../Home/Community/CommunityEventCard/CommunityEventCard.tsx';
import { UpcomingEventsWidget } from '../UpcomingEventsWidget/UpcomingEventsWidget.tsx';
import { DropdownFilter } from '../../../UI/DropdownFilter/DropdownFilter.tsx';
import { translations } from '../../Home/Community/translations.ts';

interface EventsCatalogProps {
  events: CommunityEvent[];
  lang: string;
}

export const EventsCatalog: React.FC<EventsCatalogProps> = ({ events, lang }) => {
  const [activeTag, setActiveTag] = useState('all');
  const t = translations[lang] || translations.bg;

  const TAGS = [
    { key: 'all', label: t.all },
    { key: 'business', label: t.tags.business },
    { key: 'ai', label: t.tags.ai },
    { key: 'entertainment', label: t.tags.entertainment }
  ];

  // Logic to separate events for demonstration
  // Top 2 events go to the horizontal list
  const horizontalEvents = events.slice(0, 2);
  // Next 3 events go to the vertical list
  const verticalEvents = events.slice(2, 5);
  // Widget events
  const widgetEvents = events.slice(0, 4);

  return (
    <div className={styles.catalogContainer}>
      <div className={styles.headerSection}>
        <div className={styles.titleWrapper}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{t.eventsCalendar}</h1>
          </div>
          <div className={styles.subtitleBlock}>
            <div className={styles.subtitle}>
              {t.eventsSubtitle}
            </div>
          </div>
        </div>

        <div className={styles.filtersRow}>
          <div className={styles.filterItem}>
            <DropdownFilter label={t.location} options={['Sofia', 'Plovdiv', 'Varna', 'Online']} />
          </div>
          <div className={styles.filterItem}>
            <DropdownFilter label={t.priceRange} options={['Free', 'Under €50', 'Over €50']} />
          </div>
          <div className={styles.filterItem}>
            <DropdownFilter label={t.format} options={['Live', 'Online', 'Hybrid']} />
          </div>
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.tagsColumn}>
          {TAGS.map((tag) => (
            <div 
              key={tag.key} 
              className={styles.tagItem}
              onClick={() => setActiveTag(tag.key)}
            >
              {activeTag === tag.key && <div className={styles.tagDot}></div>}
              <div className={`${styles.tagText} ${activeTag !== tag.key ? styles.inactive : ''}`}>
                {tag.label}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.mainColumn}>
          <div className={styles.topSection}>
            <div className={styles.horizontalList}>
              {horizontalEvents.map(event => (
                <CommunityEventCard
                  key={event.id}
                  {...event}
                  eventId={event.id}
                  lang={lang}
                  variant="horizontal"
                />
              ))}
            </div>
            <UpcomingEventsWidget events={widgetEvents} lang={lang} />
          </div>

          <div className={styles.bottomSection}>
            <div className={styles.verticalList}>
              {verticalEvents.map(event => (
                <div key={event.id} className={styles.verticalCardWrapper}>
                  <CommunityEventCard
                    {...event}
                    eventId={event.id}
                    lang={lang}
                    variant="vertical"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
