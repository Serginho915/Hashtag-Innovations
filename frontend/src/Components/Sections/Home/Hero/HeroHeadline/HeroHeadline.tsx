import React from "react";
import styles from "./HeroHeadline.module.scss";
import { translations } from "./translations";
import { HeroHeadlineTabs } from "./HeroHeadlineTabs";

export const HeroHeadline = ({ lang }: { lang: string }) => {
  const t = translations[lang] || translations.bg;

  return (
    <div className={styles.headlineWrapper}>
      <div className={styles.headline}>
        {t.headline}
      </div>
      <HeroHeadlineTabs tabs={t.tabs} />
    </div>
  );
};

