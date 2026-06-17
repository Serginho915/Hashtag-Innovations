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
  layout?: 'column' | 'grid';
}

export const RelatedEventsBlock: React.FC<RelatedEventsBlockProps> = ({
  title,
  viewAllText,
  events,
  lang,
  viewAllHref = `/${lang}/events`,
  layout = 'column',
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
      <ul className={`${styles.relatedEventsList} ${styles[layout]}`}>
        {events.map((event, index) => {
          const isFeaturedGridEvent = layout === 'grid' && index === 0;

          return (
            <li key={event.id} className={isFeaturedGridEvent ? styles.featuredGridItem : undefined}>
              <CommunityEventCard
                {...event}
                eventId={event.id}
                lang={lang}
                variant={isFeaturedGridEvent || layout !== 'grid' ? 'horizontal' : 'vertical'}
                compact={layout === 'grid'}
                useLocalizedContent={layout !== 'grid'}
                showPrice={layout !== 'grid'}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
};
