"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./HeroHeadline.module.scss";
import { useNavigation } from "../../../../../Context/NavigationContext.tsx";

interface HeroHeadlineTabsProps {
  tabs: string[];
  lang: string;
}

const tabPaths = ["experts", "events", "learn", "projects", "insights"];

export const HeroHeadlineTabs: React.FC<HeroHeadlineTabsProps> = ({ tabs, lang }) => {
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
        {tabs.map((tab: string, index: number) => {
          const path = tabPaths[index] || "experts"; // fallback to experts if out of bounds
          return (
            <li key={tab} className={styles.tab}>
              <Link href={`/${lang}/${path}`} className={styles.tabLink}>
                {tab}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
