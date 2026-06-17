import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.scss';
import { translations } from './translations.ts';
import logoImage from '../../../../public/images/Logo.svg';

interface FooterProps {
  lang: string;
}

export const Footer = ({ lang }: FooterProps) => {
  const t = translations[lang] || translations.bg;

  const browseLinks = [
    { label: t.experts, href: `/${lang}/experts` },
    { label: t.events, href: `/${lang}/events` },
    { label: t.materials, href: `/${lang}/materials` },
    { label: t.insights, href: `/${lang}/insights` },
  ];

  const platformLinks = [
    { label: t.becomeExpert, href: `/${lang}/become-expert` },
    { label: t.projects, href: `/${lang}/projects` },
    { label: t.contact, href: `/${lang}/contact` },
    { label: t.help, href: `/${lang}/help` },
  ];

  const legalLinks = [
    { label: t.euProject, href: `/${lang}/eu-project` },
    { label: t.privacy, href: `/${lang}/privacy` },
    { label: t.terms, href: `/${lang}/terms` },
    { label: t.cookies, href: `/${lang}/cookies` },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Top row: Brand + Nav Columns */}
        <div className={styles.topRow}>
          <div className={styles.brandSection}>
            <div className={styles.brandLogo}>
              <div className={styles.logoInner}>
                <Image
                  src={logoImage}
                  alt="Logo"
                  width={20}
                  height={24}
                  className={styles.logoHashImage}
                />
                <span className={styles.logoText}>innovations</span>
              </div>
            </div>
            <div className={styles.brandTagline}>{t.tagline}</div>
          </div>

          <div className={styles.navColumns}>
            {/* Browse column */}
            <div className={styles.navColumn}>
              <div className={styles.navColumnTitle}>
                <div className={styles.navColumnTitleText}>{t.browse}</div>
              </div>
              <ul className={styles.navList}>
                {browseLinks.map((link) => (
                  <li key={link.href} className={styles.navItem}>
                    <Link href={link.href} className={styles.navLink}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform column */}
            <div className={styles.navColumn}>
              <div className={styles.navColumnTitle}>
                <div className={styles.navColumnTitleText}>{t.platform}</div>
              </div>
              <ul className={styles.navList}>
                {platformLinks.map((link) => (
                  <li key={link.href} className={styles.navItem}>
                    <Link href={link.href} className={styles.navLink}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div className={styles.socialRow}>
          {/* Instagram */}
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.socialInstagram}`} aria-label="Instagram">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="28" height="28" rx="7" fill="url(#ig1)"/>
              <rect x="4" y="4" width="28" height="28" rx="7" fill="url(#ig2)"/>
              <rect x="4" y="4" width="28" height="28" rx="7" fill="url(#ig3)"/>
              <rect x="11" y="11" width="14" height="14" rx="4" stroke="white" strokeWidth="2"/>
              <circle cx="18" cy="18" r="4" stroke="white" strokeWidth="2"/>
              <circle cx="25.5" cy="10.5" r="1.5" fill="white"/>
              <defs>
                <radialGradient id="ig1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(14.857 27) rotate(-55.376) scale(25.519)">
                  <stop stopColor="#B13589"/><stop offset="0.79" stopColor="#C62F94"/><stop offset="1" stopColor="#8A3AC8"/>
                </radialGradient>
                <radialGradient id="ig2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(13.571 33) rotate(-65) scale(22.594)">
                  <stop stopColor="#E0E8B7"/><stop offset="0.44" stopColor="#FB8A2E"/><stop offset="0.71" stopColor="#E2425C"/><stop offset="1" stopColor="#E2425C" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="ig3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(2.107 5.286) rotate(77.692) scale(38.891 8.318)">
                  <stop offset="0.16" stopColor="#406ADC"/><stop offset="0.47" stopColor="#6A45BE"/><stop offset="1" stopColor="#6A45BE" stopOpacity="0"/>
                </radialGradient>
              </defs>
            </svg>
          </a>

          {/* Facebook */}
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.socialFacebook}`} aria-label="Facebook">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="28" height="28" rx="4" fill="white" filter="drop-shadow(0px 0.622 1.244 rgba(0,0,0,0.25))"/>
              <path d="M25 18.05H21.5V15.5C21.5 14.6 22.1 14.4 22.5 14.4H24.9V10.6L21.6 10.6C18 10.6 17.2 13.3 17.2 15.1V18.05H15V22H17.2V32H21.5V22H24.6L25 18.05Z" fill="#0083FF"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.socialLinkedIn}`} aria-label="LinkedIn">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="28" height="28" rx="4" fill="#0A66C2"/>
              <path d="M13.5 15.5H10.5V26H13.5V15.5ZM12 14.2C13 14.2 13.8 13.4 13.8 12.4C13.8 11.4 13 10.6 12 10.6C11 10.6 10.2 11.4 10.2 12.4C10.2 13.4 11 14.2 12 14.2ZM26 26H23V20.9C23 19.7 23 18.2 21.3 18.2C19.6 18.2 19.3 19.5 19.3 20.8V26H16.3V15.5H19.2V16.9H19.2C19.6 16.1 20.7 15.2 22.2 15.2C25.2 15.2 26 17.2 26 19.8V26Z" fill="white"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Bottom row: Copyright + Legal */}
      <div className={styles.footerContent}>
        <div className={styles.bottomRow}>
          <div className={styles.copyright}>{t.copyright}</div>
          <div className={styles.legalLinks}>
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.legalLink}>{link.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
