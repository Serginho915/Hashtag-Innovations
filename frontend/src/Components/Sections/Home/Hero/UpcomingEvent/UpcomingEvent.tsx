import React from "react";
import styles from "./UpcomingEvent.module.scss";
import Image from "next/image";
import { translations } from "./translations";

export const UpcomingEvent = ({ lang }: { lang: string }) => {
  const t = translations[lang] || translations.en;

  return (
    <div className={styles.upcomingEvent}>
      {/* Brand + Image */}
      <div className={styles.eventBrandRow}>
        <div className={styles.brandLogo}>
          <span className={styles.brandHash}>#</span>
          <span className={styles.brandName}>innovations</span>
        </div>
        <div className={styles.eventImageWrapper}>
          <Image
            src="https://placehold.co/346x169"
            alt="Event cover"
            width={346}
            height={169}
            className={styles.eventImage}
          />
          <div className={styles.eventImageBadge}></div>
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
              {t.title}
            </div>

            <div className={styles.eventSpeakerRow}>
              <div className={styles.eventSpeakerLabel}>{t.speakerLabel}</div>
              <div className={styles.eventSpeakerName}>{t.speakerName}</div>
            </div>

            {/* Discover More Button */}
            <button className={styles.discoverButton}>
              <span className={styles.discoverText}>{t.discoverMore}</span>
              <div className={styles.discoverArrow}>
                <div className={styles.discoverArrowIcon}></div>
              </div>
            </button>

            <div className={styles.eventDescription}>
              {t.description}
            </div>

            {/* Date + Location */}
            <div className={styles.eventMetaRow}>
              <div className={styles.eventMetaItem}>
                <svg className={styles.eventMetaIcon} viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="1.33" width="12" height="13.33" rx="1" stroke="#C0C0D2" strokeWidth="1.5" fill="none" />
                  <line x1="2" y1="5.33" x2="14" y2="5.33" stroke="#C0C0D2" strokeWidth="1.5" />
                </svg>
                <div className={styles.eventMetaText}>{t.date}</div>
              </div>
              <div className={styles.eventMetaItem}>
                <svg className={styles.eventMetaIcon} viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.33C5.05 1.33 2.67 3.72 2.67 6.67C2.67 10.67 8 14.67 8 14.67C8 14.67 13.33 10.67 13.33 6.67C13.33 3.72 10.95 1.33 8 1.33Z" stroke="#C0C0D2" strokeWidth="1.5" fill="none" />
                  <circle cx="8" cy="6.67" r="2" stroke="#C0C0D2" strokeWidth="1.5" fill="none" />
                </svg>
                <div className={styles.eventMetaText}>{t.location}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
