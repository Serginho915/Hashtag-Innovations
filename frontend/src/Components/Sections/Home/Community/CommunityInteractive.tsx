"use client";

import React, { useMemo, useState } from 'react';
import styles from './Community.module.scss';
import { CommunityHeader } from './CommunityHeader/CommunityHeader.tsx';
import { CommunityFilters, filters } from './CommunityFilters/CommunityFilters.tsx';
import { CommunityEventsList } from './CommunityEventsList/CommunityEventsList.tsx';
import { CommunityEvent } from '../../../../Types/community.ts';

interface CommunityInteractiveProps {
  lang: string;
  events: CommunityEvent[];
}

export const CommunityInteractive: React.FC<CommunityInteractiveProps> = ({ lang, events }) => {
  const now = useMemo(() => new Date(), []);
  const upcomingEvents = useMemo(
    () => events.filter((event) => new Date(event.date) >= now),
    [events, now],
  );
  const availableTagIds = useMemo(() => {
    const upcomingTags = new Set(upcomingEvents.flatMap((event) => event.tags));

    return filters
      .map((filter) => filter.id)
      .filter((filterId) => upcomingTags.has(filterId));
  }, [upcomingEvents]);
  const [selectedTag, setSelectedTag] = useState('');
  const activeTag = availableTagIds.includes(selectedTag) ? selectedTag : (availableTagIds[0] ?? '');
  const scrollRef = React.useRef<HTMLDivElement | null>(null) as React.RefObject<HTMLDivElement>;

  const scrollUp = () => {
    scrollRef.current?.scrollBy({ top: -400, behavior: 'smooth' });
  };

  const scrollDown = () => {
    scrollRef.current?.scrollBy({ top: 400, behavior: 'smooth' });
  };

  // Filter events: only upcoming AND matching the active tag
  const filteredEvents = upcomingEvents.filter(event => {
    const hasTag = event.tags.includes(activeTag);
    return hasTag;
  }).map(event => ({
    ...event,
    title: lang === 'bg' && event.titleBg ? event.titleBg : event.title,
    description: lang === 'bg' && event.descriptionBg ? event.descriptionBg : event.description,
    displayDate: lang === 'bg' && event.displayDateBg ? event.displayDateBg : event.displayDate,
    location: lang === 'bg' && event.locationBg ? event.locationBg : event.location,
  }));

  return (
    <div className={styles.communityInteractiveWrapper}>
      <div className={styles.leftMainContent}>
        <CommunityHeader lang={lang} onScrollUp={scrollUp} onScrollDown={scrollDown} />
        
        <div className={styles.filtersAndEventsRow}>
          <CommunityFilters
            activeTag={activeTag}
            onTagChange={setSelectedTag}
            lang={lang}
            availableTagIds={availableTagIds}
          />
          
          <CommunityEventsList events={filteredEvents} lang={lang} scrollRef={scrollRef} />
        </div>
      </div>
      
      <div className={styles.sidebarColumn}>
        <div className={styles.sidebarPlaceholder}></div>
        {/* <div className={styles.bannerContent}>
          <span>banner</span>
          <div className={styles.bannerIcon}></div>
        </div> */}
      </div>
    </div>
  );
};
