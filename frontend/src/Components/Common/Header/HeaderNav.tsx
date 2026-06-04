"use client";

import React from 'react'
import Link from 'next/link'
import styles from './Header.module.scss'
import { useNavigation } from '../../../Context/NavigationContext'
import { useLanguage } from '../../../Context/LanguageContext'
import { translations } from './HeaderNavTranslations'

export const HeaderNav = () => {
  const { isHeroTabsVisible } = useNavigation();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  if (isHeroTabsVisible) {
    return null;
  }

  return (
    <nav className={styles.navContainer}>
      <Link href="/experts" className={styles.navLink}>
        <div className={styles.navItemWrapper}>
          <span className={styles.navText}>{t.findExperts}</span>
        </div>
      </Link>
      <Link href="/events" className={styles.navLink}>
        <div className={styles.navItemWrapper}>
          <span className={styles.navText}>{t.events}</span>
        </div>
      </Link>
      <Link href="/learn" className={styles.navLink}>
        <div className={styles.navItemWrapper}>
          <span className={styles.navText}>{t.learn}</span>
        </div>
      </Link>
      <Link href="/projects" className={styles.navLink}>
        <div className={styles.navItemWrapper}>
          <span className={styles.navText}>{t.projects}</span>
        </div>
      </Link>
      <Link href="/insights" className={styles.navLink}>
        <div className={styles.navItemWrapper}>
          <span className={styles.navText}>{t.insights}</span>
        </div>
      </Link>
    </nav>
  )
}
