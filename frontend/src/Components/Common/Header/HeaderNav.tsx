import React from 'react'
import Link from 'next/link'
import styles from './Header.module.scss'

export const HeaderNav = () => {
  return (
    <nav className={styles.navContainer}>
      <Link href="/experts" className={styles.navLink}>
        <div className={styles.navItemWrapper}>
          <span className={styles.navText}>Find Experts</span>
        </div>
      </Link>
      <Link href="/events" className={styles.navLink}>
        <div className={styles.navItemWrapper}>
          <span className={styles.navText}>Events</span>
        </div>
      </Link>
      <Link href="/learn" className={styles.navLink}>
        <div className={styles.navItemWrapper}>
          <span className={styles.navText}>Learn</span>
        </div>
      </Link>
      <Link href="/projects" className={styles.navLink}>
        <div className={styles.navItemWrapper}>
          <span className={styles.navText}>Projects</span>
        </div>
      </Link>
      <Link href="/insights" className={styles.navLink}>
        <div className={styles.navItemWrapper}>
          <span className={styles.navText}>Insights</span>
        </div>
      </Link>
    </nav>
  )
}
