"use client";

import React, { useState, useEffect } from "react";
import styles from "./UpcomingEvent.module.scss";
import { translations } from "./translations";
import { DiscoverButton } from "../../../../Common/Buttons/DiscoverButton/DiscoverButton";
import { CustomVideoPlayer } from "../../../../UI/CustomVideoPlayer/CustomVideoPlayer";

export interface EventData {
  id: number;
  title: string;
  speakerName: string;
  description: string;
  dateIso: string;
  location: string;
}

export const UpcomingEvent = ({ lang }: { lang: string }) => {
  const t = translations[lang] || translations.en;

  const [nearestEvent, setNearestEvent] = useState<EventData | null>(null);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const now = new Date();
    
    // Find future events
    const futureEvents = t.events.filter((e: EventData) => new Date(e.dateIso) >= now);
    
    // Sort by closest date
    futureEvents.sort((a: EventData, b: EventData) => new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime());

    // Fallback to the last event in array if no future events
    const selectedEvent = futureEvents.length > 0 ? futureEvents[0] : t.events[t.events.length - 1];
    setNearestEvent(selectedEvent);

    if (selectedEvent) {
      const dateObj = new Date(selectedEvent.dateIso);
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
      const locale = lang === 'bg' ? 'bg-BG' : 'en-GB';
      setFormattedDate(dateObj.toLocaleDateString(locale, options));
    }
  }, [t.events, lang]);

  if (!nearestEvent) {
    return null; // Or a loading skeleton
  }

  return (
    <div className={styles.upcomingEvent}>
      {/* Brand + Image */}
      <div className={styles.eventBrandRow}>
        <div className={styles.brandLogo}>
          <span className={styles.brandHash}>#</span>
          <span className={styles.brandName}>innovations</span>
        </div>
        <div className={styles.eventImageWrapper}>
          <CustomVideoPlayer 
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            poster="https://placehold.co/346x169/000000/FFFFFF?text=Innovations+Video"
          />
        </div>
      </div>

      {/* Upcoming Event Label */}
      <div className={styles.eventLabelRow}>
        <div className={styles.dotBlue}></div>
        <div className={styles.labelText}>{t.eventLabel}</div>
      </div>

      {/* Event Card */}
      <div className={styles.eventCard}>
        <div className={styles.eventCardInner}>
          <div className={styles.eventCardContent}>
            <div className={styles.eventTitle}>
              {nearestEvent.title}
            </div>

            <div className={styles.eventSpeakerRow}>
              <div className={styles.eventSpeakerLabel}>{t.speakerLabel}</div>
              <div className={styles.eventSpeakerName}>{nearestEvent.speakerName}</div>
            </div>

            {/* Discover More Button */}
            <DiscoverButton text={t.discoverMore} />

            <div className={styles.eventDescription}>
              {nearestEvent.description}
            </div>

            {/* Date + Location */}
            <div className={styles.eventMetaRow}>
              <div className={styles.eventMetaItem}>
                <svg className={styles.eventMetaIcon} viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="1.33" width="12" height="13.33" rx="1" stroke="#C0C0D2" strokeWidth="1.5" fill="none" />
                  <line x1="2" y1="5.33" x2="14" y2="5.33" stroke="#C0C0D2" strokeWidth="1.5" />
                </svg>
                <div className={styles.eventMetaText}>{formattedDate}</div>
              </div>
              <div className={styles.eventMetaItem}>
                <svg className={styles.eventMetaIcon} viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.33C5.05 1.33 2.67 3.72 2.67 6.67C2.67 10.67 8 14.67 8 14.67C8 14.67 13.33 10.67 13.33 6.67C13.33 3.72 10.95 1.33 8 1.33Z" stroke="#C0C0D2" strokeWidth="1.5" fill="none" />
                  <circle cx="8" cy="6.67" r="2" stroke="#C0C0D2" strokeWidth="1.5" fill="none" />
                </svg>
                <div className={styles.eventMetaText}>{nearestEvent.location}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
