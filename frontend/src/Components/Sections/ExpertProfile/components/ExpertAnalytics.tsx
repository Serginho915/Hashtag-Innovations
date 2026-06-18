import React from 'react';
import { Expert } from '../../../../Types/expert.ts';
import styles from '../ExpertProfile.module.scss';
import type { ExpertsTranslations } from '../../../../app/[lang]/experts/translations.ts';

interface Props {
  analytics: Expert['analytics'];
  t: ExpertsTranslations;
}

export const ExpertAnalytics: React.FC<Props> = ({ analytics, t }) => {
  if (!analytics) return null;

  return (
    <div className={`${styles.section} ${styles.analyticsSection}`}>
      <div className={styles.analyticsHeader}>
        <div className={styles.analyticsIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16 20V13H20V20H16ZM10 20V4H14V20H10ZM4 20V9H8V20H4Z" fill="#C7C5C5"/>
          </svg>
        </div>
        <h2 className={styles.analyticsTitle}>{t.profileAnalytics}</h2>
      </div>
      <ul className={styles.analyticsList}>
        <li className={styles.analyticsCard}>
          <div className={styles.analyticsValue}>{analytics.consultations}</div>
          <div className={styles.analyticsLabel}>{t.consultationsCompleted}</div>
        </li>
        <li className={styles.analyticsCard}>
          <div className={styles.analyticsValue}>{analytics.attendance}</div>
          <div className={styles.analyticsLabel}>{t.sessionAttendance}</div>
        </li>
        <li className={styles.analyticsCardRow}>
          <div className={styles.analyticsValue}>{analytics.experienceYears}</div>
          <div className={styles.analyticsLabel}>{t.yearsOfExperience}</div>
        </li>
      </ul>
    </div>
  );
};
