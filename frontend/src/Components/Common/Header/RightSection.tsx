"use client";

import React, { useState } from "react";
import { LanguageSelector } from "./LanguageSelector.tsx";
import styles from "./Header.module.scss";
import { HeaderNav } from "./HeaderNav.tsx";
import { useLanguage } from "../../../Hooks/useLanguage.ts";
import { useNavigation } from "../../../Context/NavigationContext.tsx";
import { usePathname } from "next/navigation";
import { translations } from "./HeaderNavTranslations.ts";
import Link from "next/link";

export const RightSection = () => {
  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { isHeroTabsVisible } = useNavigation();
  const pathname = usePathname() || '';
  
  // Match /, /en, /bg, /ru with or without trailing slash
  const isHomePage = pathname === '/' || /^\/(en|bg|ru)\/?$/.test(pathname);

  const toggleBurgerMenu = () => {
    setBurgerMenuOpen(!burgerMenuOpen);
  };

  const t = translations[language] || translations.en;
  
  const navLinks = [
    { label: t.findExperts, href: `/${language}/experts` },
    { label: t.events, href: `/${language}/events` },
    { label: t.learn, href: `/${language}/learn` },
    { label: t.projects, href: `/${language}/projects` },
    { label: t.insights, href: `/${language}/insights` }
  ];

  return (
    <div className={styles.rightSection}>
      <div className={styles.desktopContent}>
        {(isHeroTabsVisible && isHomePage) ? (
          <div className={styles.slogan}>
            Your all-in-one platform to empower your expertise
          </div>
        ) : (
          <HeaderNav />
        )}
        <LanguageSelector />
      </div>

      <button className={styles.burgerButton} onClick={toggleBurgerMenu}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {burgerMenuOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </>
          )}
        </svg>
      </button>

      {burgerMenuOpen && (
        <div className={styles.mobileMenu}>
          <LanguageSelector isMobile />

          <div className={styles.mobileNavWrapper}>
            {navLinks.map((link) => (
              <Link href={link.href} key={link.label} className={styles.navLink} onClick={() => setBurgerMenuOpen(false)}>
                <div className={styles.mobileNavItem}>
                  <div className={styles.mobileNavText}>{link.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
