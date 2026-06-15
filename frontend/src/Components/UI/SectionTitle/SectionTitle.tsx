import React from "react";
import styles from "./SectionTitle.module.scss";

interface SectionTitleProps {
  title: string;
  className?: string;
  hideBorder?: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, className = "", hideBorder = false }) => {
  return (
    <div 
      className={`${styles.sectionTitleContainer} ${className}`}
      style={hideBorder ? { borderBottom: 'none' } : undefined}
    >
      <h2 className={styles.sectionTitleText}>{title}</h2>
    </div>
  );
};
