"use client";

import React, { useState } from 'react';
import styles from './Community.module.scss';
import { CommunityHeader } from './CommunityHeader/CommunityHeader';
import { CommunityFilters } from './CommunityFilters/CommunityFilters';
import { CommunityEventsList } from './CommunityEventsList/CommunityEventsList';
import { CommunityEvent } from '../../../../Types/community';

interface CommunityInteractiveProps {
  lang: string;
  events: CommunityEvent[];
}

export const CommunityInteractive: React.FC<CommunityInteractiveProps> = ({ lang, events }) => {
  const [activeTag, setActiveTag] = useState<string>('on_site');
  const scrollRef = React.useRef<HTMLDivElement | null>(null) as React.RefObject<HTMLDivElement>;

  const scrollUp = () => {
    scrollRef.current?.scrollBy({ top: -400, behavior: 'smooth' });
  };

  const scrollDown = () => {
    scrollRef.current?.scrollBy({ top: 400, behavior: 'smooth' });
  };

  const now = new Date();

  // Filter events: only upcoming AND matching the active tag
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const isUpcoming = eventDate >= now;
    const hasTag = event.tags.includes(activeTag);
    return isUpcoming && hasTag;
  }).map(event => ({
    ...event,
    title: lang === 'bg' && event.titleBg ? event.titleBg : event.title,
    description: lang === 'bg' && event.descriptionBg ? event.descriptionBg : event.description,
    displayDate: lang === 'bg' && event.displayDateBg ? event.displayDateBg : event.displayDate,
    location: lang === 'bg' && event.locationBg ? event.locationBg : event.location,
  }));

  return (
    <>
      <CommunityHeader lang={lang} onScrollUp={scrollUp} onScrollDown={scrollDown} />
      
      <div className={styles.filtersAndEventsRow}>
        <CommunityFilters activeTag={activeTag} onTagChange={setActiveTag} lang={lang} />
        
        <CommunityEventsList events={filteredEvents} lang={lang} scrollRef={scrollRef} />
        
        <div className={styles.sidebarColumn}>
          <div className={styles.sidebarPlaceholder}></div>
        </div>
      </div>
    </>
  );
};
