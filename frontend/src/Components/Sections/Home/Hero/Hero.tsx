import React from "react";
import styles from "./Hero.module.scss";
import { HeroHeadline } from "./HeroHeadline/HeroHeadline";
import { InsidePlatform } from "./InsidePlatform/InsidePlatform";
import { UpcomingEvent } from "./UpcomingEvent/UpcomingEvent";
import { LatestNews } from "./LatestNews/LatestNews";

export const Hero = ({ lang }: { lang: string }) => {
  return (
    <section className={styles.hero}>
      <HeroHeadline lang={lang} />

      <div className={styles.contentGrid}>
        <InsidePlatform lang={lang} />

        <div className={styles.rightColumnsWrapper}>
          <UpcomingEvent lang={lang} />
          <LatestNews lang={lang} />
        </div>
      </div>
    </section>
  );
};
