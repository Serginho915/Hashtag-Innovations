import React from 'react';
import Image from 'next/image';
import { Expert } from '../../../../Types/expert.ts';
import styles from '../ExpertProfile.module.scss';
import type { ExpertsTranslations } from '../../../../app/[lang]/experts/translations.ts';

interface Props {
  expert: Expert;
  t: ExpertsTranslations;
}

export const ExpertProfileHeader: React.FC<Props> = ({ expert, t }) => {
  const roleWithCompany = [expert.role, expert.company].filter(Boolean).join("\u00A0");

  return (
    <div className={styles.headerBlock}>
      <div className={styles.imageWrapper}>
        <Image src={expert.imageUrl} alt={expert.name} fill className={styles.expertImage} />
      </div>
      <div className={styles.headerInfo}>
        <div className={styles.headerTopRow}>
          <div className={styles.titleGroup}>
            <h1 className={styles.expertName}>{expert.name}</h1>
            <div className={styles.expertRole}>
              {roleWithCompany}
            </div>
          </div>
          <div className={styles.quoteBlock}>
            <div className={styles.quoteIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" viewBox="0 0 23 20" fill="none">
                <path d="M6.35 20C4.64333 20 3.20833 19.4611 2.045 18.3833C0.881667 17.3056 0.35 15.9389 0.45 14.2833C0.55 12.6278 1.125 11.0333 2.175 9.5C3.225 7.96667 4.56667 6.55556 6.2 5.26667L7.95 6.7C6.81667 7.73333 5.925 8.84444 5.275 10.0333C4.625 11.2222 4.31667 12.3778 4.35 13.5H9.2V20H6.35ZM18.45 20C16.7433 20 15.3083 19.4611 14.145 18.3833C12.9817 17.3056 12.45 15.9389 12.55 14.2833C12.65 12.6278 13.225 11.0333 14.275 9.5C15.325 7.96667 16.6667 6.55556 18.3 5.26667L20.05 6.7C18.9167 7.73333 18.025 8.84444 17.375 10.0333C16.725 11.2222 16.4167 12.3778 16.45 13.5H21.3V20H18.45Z" fill="#C0C0D2"/>
              </svg>
            </div>
            <p className={styles.quoteText}>{expert.quote}</p>
          </div>
        </div>
        
        <div className={styles.headerBottomRow}>
          {expert.expertise && expert.expertise.length > 0 && (
            <div className={styles.tagsBlock}>
              <div className={styles.tagsLabel}>{t.expertiseLabel}</div>
              <ul className={styles.tagsList}>
                {expert.expertise.map(item => (
                  <li key={item} className={styles.tagItem}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {expert.industries && expert.industries.length > 0 && (
            <div className={styles.industriesRow}>
              <div className={styles.tagsLabel}>{t.industriesLabel}</div>
              <ul className={styles.industriesList}>
                {expert.industries.map(item => (
                  <li key={item} className={styles.industryItem}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
