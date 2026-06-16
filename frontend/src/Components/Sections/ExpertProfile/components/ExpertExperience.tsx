'use client';

import React, { useState } from 'react';
import { Expert } from '../../../../Types/expert';
import styles from '../ExpertProfile.module.scss';

interface Props {
  experienceList: Expert['experienceList'];
  t: Record<string, string>;
}

export const ExpertExperience: React.FC<Props> = ({ experienceList, t }) => {
  const [isExperienceExpanded, setIsExperienceExpanded] = useState(false);

  if (!experienceList || experienceList.length === 0) return null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{t.experienceLabel}</h2>
        {experienceList.length > 1 && (
          <span 
            className={styles.viewAllText} 
            onClick={() => setIsExperienceExpanded(!isExperienceExpanded)}
          >
            {isExperienceExpanded ? (t.hideText || 'скрыть') : t.allText || 'все'}
          </span>
        )}
      </div>
      <div className={styles.experienceList}>
        {experienceList.slice(0, isExperienceExpanded ? undefined : 1).map(exp => (
          <div key={exp.id} className={styles.experienceItem}>
            <div className={styles.expRole}>{exp.role}</div>
            <div className={styles.expDetails}>
              <span className={styles.expCompany}>{exp.company}</span>
              <span className={styles.expPeriod}>{exp.period}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
