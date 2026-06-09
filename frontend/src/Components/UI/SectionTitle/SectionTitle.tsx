import React from "react";
import styles from "./SectionTitle.module.scss";

interface SectionTitleProps {
  title: string;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, className = "" }) => {
  return (
    <div className={`${styles.sectionTitleContainer} ${className}`}>
      <h2 className={styles.sectionTitleText}>{title}</h2>
    </div>
  );
};
