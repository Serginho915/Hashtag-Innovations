'use client';
import React, { useState } from 'react';
import { Expert } from '../../../../Types/expert.ts';
import styles from '../ExpertProfile.module.scss';
import type { ExpertsTranslations } from '../../../../app/[lang]/experts/translations.ts';

import { BookSessionButton } from './BookSessionButton/BookSessionButton.tsx';

interface Props {
  expert: Expert;
  sessions: Expert['sessions'];
  t: ExpertsTranslations;
  lang: string;
}

export const ExpertSessions: React.FC<Props> = ({ expert, sessions, t, lang }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sessionsTitle = lang === 'bg' ? 'Консултации' : lang === 'ru' ? 'Консультации' : 'Consultations';

  if (!sessions || sessions.length === 0) return null;

  return (
    <div className={`${styles.sessionsBlock} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.sessionsHeader}>
        <div className={styles.sessionsHeaderLeft}>
          <div className={styles.headerDot}></div>
          <h2 className={styles.sectionTitle}>{sessionsTitle || t.availableSessions}</h2>
        </div>
        <button 
          className={styles.mobileViewButton}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <div className={styles.arrowIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: 'rotate(90deg)' }}>
                <path d="M4.5 10.5L8 7L11.5 10.5L12.5 9.5L8 5L3.5 9.5L4.5 10.5Z" fill="black"/>
              </svg>
            </div>
          ) : (
            <span className={styles.viewText}>{t.view || (lang === 'ru' ? 'Посмотреть' : 'View')}</span>
          )}
        </button>
      </div>
      <div className={styles.sessionsList}>
        {sessions.map(session => (
          <div key={session.id} className={styles.sessionCard}>
            <div className={styles.sessionInfo}>
              <h3 className={styles.sessionTitle}>{session.title}</h3>
              <div className={styles.sessionBody}>
                <div className={styles.sessionSubtitle}>{session.subtitle}</div>
                <p className={styles.sessionDesc}>{session.description}</p>
              </div>
            </div>
            <div className={styles.sessionFooter}>
              <div className={styles.sessionPrice}>€{session.price}</div>
              <BookSessionButton expert={expert} session={session} t={t} lang={lang} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
