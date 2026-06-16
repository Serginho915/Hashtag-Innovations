import React from 'react';
import { Expert } from '../../../../Types/expert';
import styles from '../ExpertProfile.module.scss';

interface Props {
  sessions: Expert['sessions'];
  t: Record<string, string>;
}

export const ExpertSessions: React.FC<Props> = ({ sessions, t }) => {
  if (!sessions || sessions.length === 0) return null;

  return (
    <div className={styles.sessionsBlock}>
      <div className={styles.sessionsHeader}>
        <div className={styles.headerDot}></div>
        <h2 className={styles.sectionTitle}>{t.availableSessions}</h2>
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
              <button className={styles.bookBtn}>{t.bookNow}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
