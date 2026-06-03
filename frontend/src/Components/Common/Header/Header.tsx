import React from "react";
import styles from "./Header.module.scss";
import { LanguageSelector } from "./LanguageSelector";

export const Header = () => {
  return (
    <header className={styles.header} data-size="XL" data-state="Default">
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <div className={styles.hash}>#</div>
            <div className={styles.text}>innovations</div>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.sloganContainer}>
            <div className={styles.slogan}>
              Your all-in-one platform to empower your expertise
            </div>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
};
