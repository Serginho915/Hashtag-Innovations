import React from "react";
import styles from "./HeroHeadline.module.scss";
import { translations } from "./translations";

export const HeroHeadline = ({ lang }: { lang: string }) => {
  const t = translations[lang] || translations.bg;

  return (
    <div className={styles.headlineWrapper}>
      <div className={styles.headline}>
        {t.headline}
      </div>
      <div className={styles.tabs}>
        {t.tabs.map((tab: string) => (
          <div key={tab} className={styles.tab}>
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
};
