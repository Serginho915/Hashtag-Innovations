import React from 'react';
import styles from './CommunityFilters.module.scss';
import { CommunityTag } from '../../../../../Types/community';

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

import { translations } from '../translations';

interface CommunityFiltersProps {
  activeTag: string;
  onTagChange: (tagId: string) => void;
  lang: string;
}

export const CommunityFilters: React.FC<CommunityFiltersProps> = ({ activeTag, onTagChange, lang }) => {
  const t = translations[lang] || translations.bg;

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersList}>
        {filters.map((filter) => (
          <div 
            key={filter.id} 
            className={`${styles.filterItem} ${activeTag === filter.id ? styles.active : ''}`}
            onClick={() => onTagChange(filter.id)}
          >
            {activeTag === filter.id && <div className={styles.blueDot}></div>}
            <div className={styles.filterLabel}>{t.tags[filter.id] || filter.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

