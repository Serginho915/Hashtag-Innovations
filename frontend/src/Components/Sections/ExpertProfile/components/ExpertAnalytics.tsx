import React from 'react';
import { Expert } from '../../../../Types/expert';
import styles from '../ExpertProfile.module.scss';

interface Props {
  analytics: Expert['analytics'];
  t: Record<string, string>;
}

export const ExpertAnalytics: React.FC<Props> = ({ analytics, t }) => {
  if (!analytics) return null;

  return (
    <div className={`${styles.section} ${styles.analyticsSection}`}>
      <div className={styles.analyticsHeader}>
        <span className={styles.analyticsIcon}></span>
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
