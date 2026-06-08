import React from "react";
import styles from "./Header.module.scss";
import { RightSection } from "./RightSection";
import logoImage from "../../../../public/images/Logo.svg";
import Image from "next/image";


export const Header = () => {
  return (
    <header className={styles.header} data-size="XL" data-state="Default">
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <Image
              src={logoImage}
              alt="Logo"
              width={20}
              height={24}
              className={styles.logoImage}
            />
            <div className={styles.text}>innovations</div>
          </div>
        </div>
        <RightSection />
      </div>
    </header>
  );
};
