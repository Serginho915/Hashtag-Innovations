import React from 'react';
import styles from './SubTitle.module.scss';

interface SubTitleProps {
  title: string;
  className?: string;
}

export const SubTitle: React.FC<SubTitleProps> = ({ title, className = "" }) => {
  return (
    <div className={`${styles.subTitleContainer} ${className}`}>
      <h3>{title}</h3>
    </div>
  );
};
