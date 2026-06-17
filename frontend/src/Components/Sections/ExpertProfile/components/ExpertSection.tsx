import React from 'react';
import styles from '../ExpertProfile.module.scss';

interface ExpertSectionProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const ExpertSection: React.FC<ExpertSectionProps> = ({ title, action, children }) => (
  <section className={styles.section}>
    <div className={styles.sectionHeader}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {action}
    </div>
    {children}
  </section>
);
