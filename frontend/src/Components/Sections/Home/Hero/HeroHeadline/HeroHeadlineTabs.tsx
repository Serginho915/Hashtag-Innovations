"use client";

import React, { useEffect, useRef } from "react";
import styles from "./HeroHeadline.module.scss";
import { useNavigation } from "../../../../../Context/NavigationContext";

interface HeroHeadlineTabsProps {
  tabs: string[];
}

export const HeroHeadlineTabs: React.FC<HeroHeadlineTabsProps> = ({ tabs }) => {
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
    <nav ref={navRef} className={styles.navContainer}>
      <ul className={styles.tabs}>
        {tabs.map((tab: string) => (
          <li key={tab} className={styles.tab}>
            {tab}
          </li>
        ))}
      </ul>
    </nav>
  );
};
