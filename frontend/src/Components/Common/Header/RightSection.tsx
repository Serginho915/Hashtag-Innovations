"use client";

import React, { useState } from "react";
import { LanguageSelector } from "./LanguageSelector";
import styles from "./Header.module.scss";
import { HeaderNav } from "./HeaderNav";
import { useLanguage } from "../../../Hooks/useLanguage";
import { useNavigation } from "../../../Context/NavigationContext";

export const RightSection = () => {
  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { isHeroTabsVisible } = useNavigation();

  const toggleBurgerMenu = () => {
    setBurgerMenuOpen(!burgerMenuOpen);
  };

  const navLinks = ["Find Experts", "Events", "Learn", "Insights"];

  return (
    <div className={styles.rightSection}>
      <div className={styles.desktopContent}>
        {isHeroTabsVisible ? (
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
              <div key={link} className={styles.mobileNavItem}>
                <div className={styles.mobileNavText}>{link}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
