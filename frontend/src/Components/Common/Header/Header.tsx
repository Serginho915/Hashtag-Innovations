import React from "react";
import styles from "./Header.module.scss";
import { RightSection } from "./RightSection";
import logoImage from "../../../../public/images/Logo.svg";
import Image from "next/image";
import Link from "next/link";


export const Header = ({ lang = 'bg' }: { lang?: string }) => {
  return (
    <header className={styles.header} data-size="XL" data-state="Default">
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Link href={`/${lang}`} className={styles.logo}>
            <Image
              src={logoImage}
              alt="Logo"
              width={20}
              height={24}
              className={styles.logoImage}
            />
            <div className={styles.text}>innovations</div>
          </Link>
        </div>
        <RightSection />
      </div>
    </header>
  );
};
