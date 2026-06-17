'use client';

import React, { useState } from 'react';
import styles from '../ExpertProfile.module.scss';
import { ExpertSection } from './ExpertSection.tsx';

interface Props {
  bio: string[];
  t: Record<string, string>;
}

export const ExpertBio: React.FC<Props> = ({ bio, t }) => {
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  if (!bio || bio.length === 0) return null;

  return (
    <ExpertSection title={t.background}>
      <div className={styles.bioContent}>
        {bio.slice(0, isBioExpanded ? undefined : 1).map((paragraph, idx) => (
          <p key={idx} className={styles.bioParagraph}>
            {paragraph}
            {!isBioExpanded && idx === 0 && bio.length > 1 && '...'}
          </p>
        ))}
        {bio.length > 1 && (
          <button className={styles.showAllBtn} onClick={() => setIsBioExpanded(!isBioExpanded)}>
            {isBioExpanded ? (t.hideText || 'скрыть') : t.showAll || 'показать все'}
            <div className={`${styles.caret} ${isBioExpanded ? styles.caretUp : ''}`}></div>
          </button>
        )}
      </div>
    </ExpertSection>
  );
};
