import React from "react";
import styles from "./InsidePlatform.module.scss";
import Image from "next/image";
import { translations } from "./translations";
import { InsidePlatformCarousel } from "./InsidePlatformCarousel";

export const InsidePlatform = ({ lang }: { lang: string }) => {
  const t = translations[lang] || translations.en;

  return (
    <div className={styles.insidePlatform}>
      {/* Section Label */}
      <div className={styles.sectionLabel}>
        <div className={styles.labelRow}>
          <div className={styles.dotBlue}></div>
          <div className={styles.labelText}>{t.sectionLabel}</div>
        </div>

        {/* Description */}
        <div className={styles.descriptionBlock}>
          <div>
            <span className={styles.descriptionText}>
              {t.desc1}
            </span>
            <span className={styles.descriptionBold}>
              {t.descBold}
            </span>
            <span className={styles.descriptionText}>
              {t.desc2}
            </span>
          </div>

          {/* Trusted By */}
          <div className={styles.trustedRow}>
            <div className={styles.avatarGroup}>
              <Image
                src="/images/avatars/avatar_1.png"
                alt="User 1"
                width={32}
                height={32}
                className={styles.avatar}
              />
              <Image
                src="/images/avatars/avatar_2.png"
                alt="User 2"
                width={32}
                height={32}
                className={styles.avatar}
              />
              <Image
                src="/images/avatars/avatar_3.png"
                alt="User 3"
                width={32}
                height={32}
                className={styles.avatar}
              />
            </div>
            <div className={styles.trustedText}>
              {t.trusted}
            </div>
          </div>
        </div>
      </div>

      <InsidePlatformCarousel slides={t.slides} slideAlt={t.slideAlt} />
    </div>
  );
};
