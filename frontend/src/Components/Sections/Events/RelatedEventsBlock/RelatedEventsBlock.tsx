import React from 'react';
import { CommunityEvent } from '../../../../Types/community.ts';
import { CommunityEventCard } from '../../Home/Community/CommunityEventCard/CommunityEventCard.tsx';
import { ViewAllLink } from '../../../UI/ViewAllLink/ViewAllLink.tsx';
import styles from './RelatedEventsBlock.module.scss';

interface RelatedEventsBlockProps {
  title: string;
  viewAllText: string;
  events: CommunityEvent[];
  lang: string;
  viewAllHref?: string;
}

export const RelatedEventsBlock: React.FC<RelatedEventsBlockProps> = ({
  title,
  viewAllText,
  events,
  lang,
  viewAllHref = `/${lang}/events`,
}) => {
  if (!events.length) {
    return null;
  }

  return (
    <section className={styles.relatedEvents}>
      <div className={styles.relatedHeader}>
        <h2>{title}</h2>
        <ViewAllLink href={viewAllHref} variant="arrow">{viewAllText}</ViewAllLink>
      </div>
      <ul className={styles.relatedEventsList}>
        {events.map((event) => (
          <li key={event.id}>
            <CommunityEventCard
              {...event}
              eventId={event.id}
              lang={lang}
              variant="horizontal"
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
