import React from 'react';
import styles from '../ExpertProfile.module.scss';

interface Props {
  languages: string[];
  t: Record<string, string>;
}

const getFlagIcon = (language: string) => {
  const normalizedLang = language.toLowerCase();
  
  if (normalizedLang.includes('bulgarian') || normalizedLang.includes('български') || normalizedLang === 'bg') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <g clipPath="url(#clip0_447_1054)">
          <path d="M0 0H24V24H0V0Z" fill="white"/>
          <path d="M0 8H24V24H0V8Z" fill="#00966E"/>
          <path d="M0 16H24V24H0V16Z" fill="#D62612"/>
        </g>
        <defs>
          <clipPath id="clip0_447_1054">
            <rect width="24" height="24" rx="12" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    );
  }

  if (normalizedLang.includes('english') || normalizedLang.includes('английски') || normalizedLang.includes('английский') || normalizedLang === 'en') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <g clipPath="url(#clip0_447_1060)">
          <path d="M0 0H24V24H0V0Z" fill="#012169"/>
          <path d="M24 0V3L15.0938 12L24 20.7656V24H20.8594L11.9062 15.1875L3.1875 24H0V20.8125L8.71875 12.0469L0 3.46875V0H2.90625L11.9062 8.8125L20.625 0H24Z" fill="white"/>
          <path d="M8.625 15.1875L9.14062 16.7812L1.96875 24H0V23.8594L8.625 15.1875ZM14.4375 14.625L16.9688 15L24 21.8906V24L14.4375 14.625ZM24 0L15 9.1875L14.8125 7.125L21.8438 0H24ZM0 0.046875L9.04688 8.90625L6.28125 8.53125L0 2.29688V0.046875Z" fill="#C8102E"/>
          <path d="M8.25 0V24H15.75V0H8.25ZM0 8.25V15.75H24V8.25H0Z" fill="white"/>
          <path d="M0 9.75V14.25H24V9.75H0ZM9.75 0V24H14.25V0H9.75Z" fill="#C8102E"/>
        </g>
        <defs>
          <clipPath id="clip0_447_1060">
            <rect width="24" height="24" rx="12" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    );
  }

  if (normalizedLang.includes('ukrainian') || normalizedLang.includes('українська') || normalizedLang.includes('украинский') || normalizedLang === 'uk') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <g clipPath="url(#clip0_ukr)">
          <path d="M0 0H24V12H0V0Z" fill="#0057B7"/>
          <path d="M0 12H24V24H0V12Z" fill="#FFD700"/>
        </g>
        <defs>
          <clipPath id="clip0_ukr">
            <rect width="24" height="24" rx="12" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    );
  }

  if (normalizedLang.includes('russian') || normalizedLang.includes('русский') || normalizedLang === 'ru') {
    return (
      <div className={styles.ruFlagFallback}>
        RU
      </div>
    );
  }

  return <div className={styles.flagIcon}></div>;
};

export const ExpertLanguages: React.FC<Props> = ({ languages, t }) => {
  if (!languages || languages.length === 0) return null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{t.fluentIn}</h2>
      </div>
      <ul className={styles.languagesList}>
        {languages.map(langStr => (
          <li key={langStr} className={styles.languageItem}>
            {getFlagIcon(langStr)}
            <span className={styles.langName}>{langStr}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
