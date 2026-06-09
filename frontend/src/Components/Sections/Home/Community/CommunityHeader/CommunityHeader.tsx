import React from 'react';
import styles from './CommunityHeader.module.scss';
import Link from 'next/link';

interface CommunityHeaderProps {
  lang: string;
  onScrollUp?: () => void;
  onScrollDown?: () => void;
}

export const CommunityHeader: React.FC<CommunityHeaderProps> = ({ lang, onScrollUp, onScrollDown }) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <div className={styles.titleNumber}>01/</div>
          <div className={styles.titleText}>EVENTS</div>
        </div>
        <div className={styles.actionsGroup}>
          <Link href={`/${lang}/events`} className={styles.viewAll}>
            VIEW ALL
          </Link>
          <div className={styles.arrowsGroup}>
            <div 
              className={styles.arrowIcon} 
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
              onClick={onScrollUp}
            >
              <svg style={{ transform: 'rotate(0deg)' }} xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
                <path d="M5.575 2.37502L9.475 6.27502C9.65833 6.45835 9.89167 6.55002 10.175 6.55002C10.4583 6.55002 10.6917 6.45835 10.875 6.27502C11.0583 6.09168 11.15 5.85835 11.15 5.57502C11.15 5.29168 11.0583 5.05835 10.875 4.87502L6.275 0.275016C6.175 0.175016 6.06667 0.104016 5.95 0.0620159C5.83333 0.0200159 5.70833 -0.000651042 5.575 1.56248e-05C5.44167 0.000682291 5.31667 0.0213492 5.2 0.0620159C5.08333 0.102683 4.975 0.173683 4.875 0.275016L0.275002 4.87502C0.0916682 5.05835 0 5.29168 0 5.57502C0 5.85835 0.0916682 6.09168 0.275002 6.27502C0.458335 6.45835 0.691667 6.55002 0.975 6.55002C1.25833 6.55002 1.49167 6.45835 1.675 6.27502L5.575 2.37502Z" fill="black"/>
              </svg>
            </div>
            <div 
              className={styles.arrowIcon} 
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
              onClick={onScrollDown}
            >
              <svg style={{ transform: 'rotate(180deg)' }} xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
                <path d="M5.575 2.37502L9.475 6.27502C9.65833 6.45835 9.89167 6.55002 10.175 6.55002C10.4583 6.55002 10.6917 6.45835 10.875 6.27502C11.0583 6.09168 11.15 5.85835 11.15 5.57502C11.15 5.29168 11.0583 5.05835 10.875 4.87502L6.275 0.275016C6.175 0.175016 6.06667 0.104016 5.95 0.0620159C5.83333 0.0200159 5.70833 -0.000651042 5.575 1.56248e-05C5.44167 0.000682291 5.31667 0.0213492 5.2 0.0620159C5.08333 0.102683 4.975 0.173683 4.875 0.275016L0.275002 4.87502C0.0916682 5.05835 0 5.29168 0 5.57502C0 5.85835 0.0916682 6.09168 0.275002 6.27502C0.458335 6.45835 0.691667 6.55002 0.975 6.55002C1.25833 6.55002 1.49167 6.45835 1.675 6.27502L5.575 2.37502Z" fill="black"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
