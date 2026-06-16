import React from 'react';
import styles from './ExpertsHeader.module.scss';
import { SectionTitle } from '../../../UI/SectionTitle/SectionTitle.tsx';
import { ExpertsFilters } from '../ExpertsFilters/ExpertsFilters.tsx';

interface ExpertsHeaderProps {
  t: any;
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
