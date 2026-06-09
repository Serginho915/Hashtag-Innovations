import React from 'react';
import styles from './CommunityEventCard.module.scss';
import { DiscoverButton } from '../../../../Common/Buttons/DiscoverButton/DiscoverButton';
import { CommunitySpeaker } from '../../../../../types/community';
import Link from 'next/link';

interface CommunityEventCardProps {
  eventId: string;
  title: string;
  speaker: CommunitySpeaker;
  description: string;
  date: string;
  location: string;
  imageSrc?: string;
  lang: string;
}

export const CommunityEventCard: React.FC<CommunityEventCardProps> = ({
  eventId,
  title,
  speaker,
  description,
  date,
  location,
  imageSrc,
  lang,
}) => {
  const eventUrl = `/${lang}/events/${eventId}`;
  const speakerUrl = `/${lang}/experts/${speaker.id}`;

  return (
    <div className={styles.cardContainer}>
      <div className={styles.textContainer}>
        <div className={styles.contentStack}>
          {/* Title */}
          <div className={styles.titleRow}>
            <Link href={eventUrl} className={styles.titleLink}>
              <h3 className={styles.title}>{title}</h3>
            </Link>
          </div>
          
          {/* Speaker */}
          <div className={styles.speakerRow}>
            <span className={styles.speakerLabel}>speaker:</span>
            <Link href={speakerUrl} className={styles.speakerLink}>
              <span className={styles.speakerName}>{speaker.name}</span>
            </Link>
          </div>
          
          {/* Button */}
          <div className={styles.buttonRow}>
            <Link href={eventUrl} className={styles.buttonLink}>
              <DiscoverButton text="View Details" />
            </Link>
          </div>
          
          {/* Description */}
          <div className={styles.descriptionRow}>
            <p className={styles.description}>{description}</p>
          </div>
          
          {/* Meta (Date / Location) */}
          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <div className={styles.metaIcon}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="3" width="12" height="11" rx="2" fill="#C0C0D2"/>
                  <path d="M4 1V5M12 1V5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className={styles.metaText}>{date}</span>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaIcon}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 1C5.238 1 3 3.238 3 6c0 3.5 5 9 5 9s5-5.5 5-9c0-2.762-2.238-5-5-5z" fill="#C0C0D2"/>
                  <circle cx="8" cy="6" r="2" fill="white"/>
                </svg>
              </div>
              <span className={styles.metaText}>{location}</span>
            </div>
          </div>
        </div>
      </div>

      {imageSrc && (
        <div className={styles.imageWrapper}>
          <img src={imageSrc} alt={title} className={styles.image} />
        </div>
      )}
    </div>
  );
};
