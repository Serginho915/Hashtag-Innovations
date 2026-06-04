"use client";

import React, { useState } from "react";
import { LanguageSelector } from "./LanguageSelector";
import styles from "./Header.module.scss";
import { HeaderNav } from "./HeaderNav";

export const RightSection = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className={styles.rightSection}>
      <div className={styles.sloganContainer}>
        {!isNavOpen && (
          <div className={styles.slogan}>
            Your all-in-one platform to empower your expertise
          </div>
        )}
        {isNavOpen && (
          <HeaderNav />
        )}
        <LanguageSelector />
      </div>
    </div>
  );
};
