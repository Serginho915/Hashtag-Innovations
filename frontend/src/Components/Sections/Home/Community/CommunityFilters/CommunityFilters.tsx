import React from 'react';
import styles from './CommunityFilters.module.scss';
import { CommunityTag } from '../../../../../types/community';

export const filters: CommunityTag[] = [
  { id: 'on_site', label: 'On site' },
  { id: 'recommended', label: 'Recommended', showDot: true },
  { id: 'top_speakers', label: 'Top Speakers' },
  { id: 'free', label: 'Free' },
  { id: 'online', label: 'Online' },
  { id: 'business', label: 'Business' },
  { id: 'ai', label: 'AI' },
  { id: 'entertainment', label: 'Entertainment' }
];

interface CommunityFiltersProps {
  activeTag: string;
  onTagChange: (tagId: string) => void;
}

export const CommunityFilters: React.FC<CommunityFiltersProps> = ({ activeTag, onTagChange }) => {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersRow1}>
        {filters.slice(0, 5).map((filter) => (
          <div 
            key={filter.id} 
            className={`${styles.filterItem} ${activeTag === filter.id ? styles.active : ''}`}
            onClick={() => onTagChange(filter.id)}
          >
            {activeTag === filter.id && <div className={styles.blueDot}></div>}
            <div className={styles.filterLabel}>{filter.label}</div>
          </div>
        ))}
      </div>
      <div className={styles.filtersRow2}>
        {filters.slice(5).map((filter) => (
          <div 
            key={filter.id} 
            className={`${styles.filterItem} ${activeTag === filter.id ? styles.active : ''}`}
            onClick={() => onTagChange(filter.id)}
          >
            {activeTag === filter.id && <div className={styles.blueDot}></div>}
            <div className={styles.filterLabel}>{filter.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

