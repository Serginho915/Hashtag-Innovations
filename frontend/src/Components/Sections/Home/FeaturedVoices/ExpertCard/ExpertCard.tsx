import React from 'react';
import styles from './ExpertCard.module.scss';
import { ButtonView } from '../../../../Common/Buttons/ButtonView/ButtonView.tsx';
import Link from 'next/link';

interface ExpertCardProps {
  id: string;
  name: string;
  role: string;
  company: string;
  imageUrl: string;
  quote: string;
  viewText: string;
  lang: string;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({
  id,
  name,
  role,
  company,
  imageUrl,
  quote,
  viewText,
  lang
}) => {
  return (
    <Link href={`/${lang}/experts/${id}`} className={styles.card}>
      <div className={styles.cardContent}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.name}>{name}</div>
          <div className={styles.roleRow}>
            <div className={styles.roleText}>{role}</div>
            <div className={styles.companyText}>{company}</div>
          </div>
        </div>

        {/* Body */}
        <div className={styles.bodyRow}>
          <div className={styles.imageWrapper}>
            <img className={styles.image} src={imageUrl} alt={name} />
          </div>
          
          <div className={styles.textColumn}>
            <div className={styles.quote}>{quote}</div>
            
            <div className={styles.buttonWrapper}>
              <ButtonView text={viewText} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
