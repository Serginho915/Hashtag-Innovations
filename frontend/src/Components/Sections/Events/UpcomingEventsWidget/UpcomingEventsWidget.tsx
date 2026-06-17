"use client";

import React, { useState } from 'react';
import styles from './UpcomingEventsWidget.module.scss';
import { CommunityEvent } from '../../../../Types/community.ts';
import Link from 'next/link';
import { translations } from '../../Home/Community/translations.ts';

interface UpcomingEventsWidgetProps {
  events: CommunityEvent[];
  lang: string;
}

export const UpcomingEventsWidget: React.FC<UpcomingEventsWidgetProps> = ({ events, lang }) => {
  const t = translations[lang] || translations.bg;
  const [isExpanded, setIsExpanded] = useState(false);

  const getLocationLabel = (location: string) => {
    const parts = location.split(',').map((part) => part.trim()).filter(Boolean);
    return parts[parts.length - 1] || location;
  };

  return (
    <div className={styles.widgetContainer}>
      <div className={styles.widgetHeader}>
        <div className={styles.headerLabel}>
          <div className={styles.headerDot}></div>
          <div className={styles.headerText}>{t.upcomingThisMonth}</div>
        </div>
        <button
          type="button"
          className={`${styles.mobileToggle} ${isExpanded ? styles.expanded : ''}`}
          aria-label={isExpanded ? 'Collapse upcoming events' : 'Expand upcoming events'}
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((current) => !current)}
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <ul className={`${styles.eventsList} ${isExpanded ? styles.expandedList : ''}`}>
        {events.map((event) => {
          const eventUrl = `/${lang}/events/${event.id}`;
          // e.g. "FRI, 20 May" -> split into "FRI," and "20 May"
          const displayDate = lang === 'bg' && event.displayDateBg ? event.displayDateBg : event.displayDate;
          const dateParts = displayDate.split(', ');
          const dayOfWeek = dateParts[0] ? dateParts[0] + ',' : '';
          const dayOfMonth = dateParts[1] || displayDate;
          
          const locationText = getLocationLabel(lang === 'bg' && event.locationBg ? event.locationBg : event.location);

          return (
            <li className={styles.eventListItem} key={event.id}>
              <Link href={eventUrl} className={styles.eventLink}>
                <div className={styles.eventItem}>
                  <div className={styles.dateBlock}>
                    <div className={styles.dateText}>
                      {dayOfWeek}<br />{dayOfMonth}
                    </div>
                  </div>
                  <div className={styles.infoBlock}>
                    <div className={styles.eventTitle}>{lang === 'bg' && event.titleBg ? event.titleBg : event.title}</div>
                    <div className={styles.locationRow}>
                      <div className={styles.locationItem}>
                        <div className={styles.locationIcon}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 1C5.238 1 3 3.238 3 6c0 3.5 5 9 5 9s5-5.5 5-9c0-2.762-2.238-5-5-5z" fill="#C0C0D2"/>
                            <circle cx="8" cy="6" r="2" fill="white"/>
                          </svg>
                        </div>
                        <div className={styles.locationText}>{locationText}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
