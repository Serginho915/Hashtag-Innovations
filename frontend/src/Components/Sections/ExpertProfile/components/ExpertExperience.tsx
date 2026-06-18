'use client';

import React, { useState } from 'react';
import { Expert } from '../../../../Types/expert.ts';
import styles from '../ExpertProfile.module.scss';
import { ExpertSection } from './ExpertSection.tsx';
import type { ExpertsTranslations } from '../../../../app/[lang]/experts/translations.ts';

interface Props {
  experienceList: Expert['experienceList'];
  t: ExpertsTranslations;
}

export const ExpertExperience: React.FC<Props> = ({ experienceList, t }) => {
  const [isExperienceExpanded, setIsExperienceExpanded] = useState(false);

  if (!experienceList || experienceList.length === 0) return null;

  return (
    <ExpertSection
      title={t.experienceLabel}
      action={experienceList.length > 1 && (
        <span
          className={styles.viewAllText}
          onClick={() => setIsExperienceExpanded(!isExperienceExpanded)}
        >
          {isExperienceExpanded ? (t.hideText || 'скрыть') : t.allText || 'все'}
        </span>
      )}
    >
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
    </ExpertSection>
  );
};
