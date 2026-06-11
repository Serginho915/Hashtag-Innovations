"use client";

import React, { useEffect, useRef } from "react";
import styles from "./HeroHeadline.module.scss";
import { translations } from "./translations";
import { useNavigation } from "../../../../../Context/NavigationContext";

export const HeroHeadline = ({ lang }: { lang: string }) => {
  const t = translations[lang] || translations.bg;
  const navRef = useRef<HTMLElement>(null);
  const { setIsHeroTabsVisible } = useNavigation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroTabsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "-80px 0px 0px 0px",
        threshold: 0,
      }
    );

    if (navRef.current) {
      observer.observe(navRef.current);
    }

    return () => observer.disconnect();
  }, [setIsHeroTabsVisible]);

  return (
    <div className={styles.headlineWrapper}>
      <div className={styles.headline}>
        {t.headline}
      </div>
      <nav ref={navRef} className={styles.navContainer}>
        <ul className={styles.tabs}>
          {t.tabs.map((tab: string) => (
            <li key={tab} className={styles.tab}>
              {tab}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

