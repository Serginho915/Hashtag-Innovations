import React from "react";
import styles from "./Hero.module.scss";
import { HeroHeadline } from "./HeroHeadline";
import { InsidePlatform } from "./InsidePlatform";
import { UpcomingEvent } from "./UpcomingEvent";
import { LatestNews } from "./LatestNews";

export const Hero = () => {
  return (
    <section className={styles.hero}>
      <HeroHeadline />

      <div className={styles.contentGrid}>
        <InsidePlatform />

        <div className={styles.rightColumnsWrapper}>
          <UpcomingEvent />
          <LatestNews />
        </div>
      </div>
    </section>
  );
};
