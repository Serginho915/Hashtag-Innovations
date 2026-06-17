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
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [activeFormat, setActiveFormat] = useState<string | null>(null);
  const t = translations[lang] || translations.bg;
  const allLabel = t.all;

  const locationOptions = [allLabel, 'Sofia', 'Plovdiv', 'Varna', 'Online'];
  const formatOptions = [allLabel, 'Live', 'Online', 'Hybrid'];
  const priceLabel = (minPrice || maxPrice) ? `€${minPrice || '0'} - €${maxPrice || '∞'}` : null;

  const TAGS = [
    { key: 'all', label: t.all },
    { key: 'business', label: t.tags.business },
    { key: 'ai', label: t.tags.ai },
    { key: 'entertainment', label: t.tags.entertainment }
  ];

  const filteredEvents = events.filter((event) => {
    const locationValue = `${event.location} ${event.locationBg ?? ''}`.toLowerCase();
    const priceValue = event.price ? Number(event.price.replace(/[^0-9.]/g, '')) : 0;

    const matchesTag = activeTag === 'all' || event.tags.includes(activeTag);
    const matchesLocation = !activeLocation || activeLocation === allLabel || locationValue.includes(activeLocation.toLowerCase());
    const minPriceValue = minPrice ? Number(minPrice) : null;
    const maxPriceValue = maxPrice ? Number(maxPrice) : null;
    const matchesPrice = (minPriceValue === null || priceValue >= minPriceValue)
      && (maxPriceValue === null || priceValue <= maxPriceValue);
    const matchesFormat = !activeFormat || activeFormat === allLabel
      || (activeFormat === 'Live' && (event.tags.includes('on_site') || locationValue.includes('live') || locationValue.includes('на живо')))
      || (activeFormat === 'Online' && (event.tags.includes('online') || locationValue.includes('online') || locationValue.includes('онлайн')))
      || (activeFormat === 'Hybrid' && (event.tags.includes('hybrid') || locationValue.includes('hybrid') || locationValue.includes('хибрид')));

    return matchesTag && matchesLocation && matchesPrice && matchesFormat;
  });

  const horizontalEvents = filteredEvents.slice(0, 2);
  const verticalEvents = filteredEvents.slice(2, 5);
  const widgetEvents = filteredEvents;

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

        <ul className={styles.filtersRow}>
          <li className={styles.filterItem}>
            <DropdownFilter
              label={t.location}
              options={locationOptions}
              value={activeLocation}
              variant="events"
              onSelect={(option) => setActiveLocation(option === allLabel ? null : option)}
            />
          </li>
          <li className={styles.filterItem}>
            <DropdownFilter
              label={t.priceRange}
              value={priceLabel}
              variant="events"
            >
              <div className={styles.dropdownInputItem}>
                <input
                  type="number"
                  placeholder="min"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  className={styles.priceInput}
                />
              </div>
              <div className={styles.dropdownInputItem}>
                <input
                  type="number"
                  placeholder="max"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  className={styles.priceInput}
                />
              </div>
            </DropdownFilter>
          </li>
          <li className={styles.filterItem}>
            <DropdownFilter
              label={t.format}
              options={formatOptions}
              value={activeFormat}
              variant="events"
              onSelect={(option) => setActiveFormat(option === allLabel ? null : option)}
            />
          </li>
        </ul>
      </div>

      <div className={styles.contentSection}>
        <ul className={styles.tagsColumn}>
          {TAGS.map((tag) => (
            <li
              key={tag.key} 
              className={styles.tagItem}
              onClick={() => setActiveTag(tag.key)}
            >
              {activeTag === tag.key && <div className={styles.tagDot}></div>}
              <div className={`${styles.tagText} ${activeTag !== tag.key ? styles.inactive : ''}`}>
                {tag.label}
              </div>
            </li>
          ))}
        </ul>

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
