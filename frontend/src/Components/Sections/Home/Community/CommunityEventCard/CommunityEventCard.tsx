import React from 'react';
import styles from './CommunityEventCard.module.scss';
import { DiscoverButton } from '../../../../Common/Buttons/DiscoverButton/DiscoverButton';
import { CommunitySpeaker } from '../../../../../Types/community';
import Link from 'next/link';
import { translations } from '../translations';

interface CommunityEventCardProps {
  eventId: string;
  title: string;
  speaker: CommunitySpeaker;
  description: string;
  date: string;
  location: string;
  imageSrc?: string;
  lang: string;
  price?: string;
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
  price,
}) => {
  const eventUrl = `/${lang}/events/${eventId}`;
  const speakerUrl = `/${lang}/experts/${speaker.id}`;
  const t = translations[lang] || translations.bg;

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
            <span className={styles.speakerLabel}>{t.speaker}:</span>
            {speaker.expertId ? (
              <Link href={`/${lang}/voices/${speaker.expertId}`} className={styles.speakerLink}>
                <span className={`${styles.speakerName} ${styles.expertBlue}`}>{speaker.name}</span>
              </Link>
            ) : (
              <span className={`${styles.speakerName} ${styles.expertBlack}`}>{speaker.name}</span>
            )}
          </div>
          
          {/* Meta (Date / Location / Price) */}
          <div className={styles.metaRow}>
            <div className={styles.metaLeft}>
              <div className={styles.metaItem}>
                <div className={styles.metaIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14" fill="none">
                    <path d="M1.33333 13.3333C0.966667 13.3333 0.652889 13.2029 0.392 12.942C0.131111 12.6811 0.000444444 12.3671 0 12V2.66667C0 2.3 0.130667 1.98622 0.392 1.72533C0.653333 1.46444 0.967111 1.33378 1.33333 1.33333H2V0H3.33333V1.33333H8.66667V0H10V1.33333H10.6667C11.0333 1.33333 11.3473 1.464 11.6087 1.72533C11.87 1.98667 12.0004 2.30044 12 2.66667V12C12 12.3667 11.8696 12.6807 11.6087 12.942C11.3478 13.2033 11.0338 13.3338 10.6667 13.3333H1.33333ZM1.33333 12H10.6667V5.33333H1.33333V12Z" fill="#C0C0D2"/>
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
            
            {/* Price section - conditionally rendered */}
            {price && (
              <div className={styles.priceContainer}>
                <div className={styles.priceItem}>
                  <div className={styles.priceIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                      <path d="M13.3333 1.33333V9.33333C13.3333 9.7 13.2029 10.014 12.942 10.2753C12.6811 10.5367 12.3671 10.6671 12 10.6667H1.33333C0.966667 10.6667 0.652889 10.5362 0.392 10.2753C0.131111 10.0144 0.000444444 9.70045 0 9.33333V1.33333C0 0.966667 0.130667 0.652889 0.392 0.392C0.653333 0.131111 0.967111 0.000444444 1.33333 0H12C12.3667 0 12.6807 0.130667 12.942 0.392C13.2033 0.653333 13.3338 0.967111 13.3333 1.33333ZM1.33333 2.66667H12V1.33333H1.33333V2.66667ZM1.33333 5.33333V9.33333H12V5.33333H1.33333Z" fill="#363636"/>
                    </svg>
                  </div>
                  <span className={styles.priceText}>{price}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Button */}
          <div className={styles.buttonRow}>
            <Link href={eventUrl} className={styles.buttonLink}>
              <DiscoverButton text={t.viewDetails} />
            </Link>
          </div>
          
          {/* Description */}
          <div className={styles.descriptionRow}>
            <p className={styles.description}>{description}</p>
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
