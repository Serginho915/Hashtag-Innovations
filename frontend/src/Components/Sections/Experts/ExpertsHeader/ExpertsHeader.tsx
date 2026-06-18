import React from 'react';
import styles from './ExpertsHeader.module.scss';
import { SectionTitle } from '../../../UI/SectionTitle/SectionTitle.tsx';
import { ExpertsFilters } from '../ExpertsFilters/ExpertsFilters.tsx';
import type { ExpertsTranslations } from '../../../../app/[lang]/experts/translations.ts';

interface ExpertsHeaderProps {
  t: ExpertsTranslations;
}

export const ExpertsHeader: React.FC<ExpertsHeaderProps> = ({ t }) => {
  return (
    <div className={styles.mainHeaderContent}>
      <div className={styles.titleRow}>
        <SectionTitle title={t.expertsTitle} hideBorder={true} />
      </div>
      
      <ExpertsFilters t={t} />
    </div>
  );
};
