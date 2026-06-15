"use client";

import React from 'react'
import Link from 'next/link'
import styles from './Header.module.scss'
import { useLanguage } from '../../../Context/LanguageContext'
import { translations } from './HeaderNavTranslations'

export const HeaderNav = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  return (
    <nav className={styles.navContainer}>
      <Link href={`/${language}/experts`} className={styles.navLink}>
        <div className={styles.navItemWrapper}>
          <span className={styles.navText}>{t.findExperts}</span>
        </div>
      </Link>
      <Link href={`/${language}/events`} className={styles.navLink}>
        <div className={styles.navItemWrapper}>
          <span className={styles.navText}>{t.events}</span>
        </div>
      </Link>
      <Link href={`/${language}/learn`} className={styles.navLink}>
        <div className={styles.navItemWrapper}>
          <span className={styles.navText}>{t.learn}</span>
        </div>
      </Link>
      <Link href={`/${language}/projects`} className={styles.navLink}>
        <div className={styles.navItemWrapper}>
          <span className={styles.navText}>{t.projects}</span>
        </div>
      </Link>
      <Link href={`/${language}/insights`} className={styles.navLink}>
        <div className={styles.navItemWrapper}>
          <span className={styles.navText}>{t.insights}</span>
        </div>
      </Link>
    </nav>
  )
}
