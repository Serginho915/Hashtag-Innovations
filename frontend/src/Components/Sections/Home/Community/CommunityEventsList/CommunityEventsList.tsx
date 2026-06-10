import React from 'react';
import styles from './CommunityEventsList.module.scss';
import { CommunityEventCard } from '../CommunityEventCard/CommunityEventCard';
import { CommunityEvent } from '../../../../../Types/community';

interface CommunityEventsListProps {
  events: CommunityEvent[];
  lang: string;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

export const CommunityEventsList: React.FC<CommunityEventsListProps> = ({ events, lang, scrollRef }) => {
  const topEvent = events[0];
  const gridEvents = events.slice(1);

  if (!events || events.length === 0) {
    return <div className={styles.noEvents}>No events found for this category.</div>;
  }

  return (
    <div id="community-events-scroll" ref={scrollRef} className={styles.eventsListContainer}>
      {topEvent && (
        <CommunityEventCard
          eventId={topEvent.id}
          title={topEvent.title}
          speaker={topEvent.speaker}
          description={topEvent.description}
          date={topEvent.displayDate}
          location={topEvent.location}
          imageSrc={topEvent.imageSrc}
          lang={lang}
          price={topEvent.price}
        />
      )}

      {gridEvents.length > 0 && (
        <div className={styles.eventsGrid}>
          {gridEvents.map((event, index) => (
            <CommunityEventCard
              key={event.id || index}
              eventId={event.id}
              title={event.title}
              speaker={event.speaker}
              description={event.description}
              date={event.displayDate}
              location={event.location}
              imageSrc={gridEvents.length === 1 ? event.imageSrc : undefined}
              lang={lang}
              price={event.price}
            />
          ))}
        </div>
      )}
    </div>
  );
};
