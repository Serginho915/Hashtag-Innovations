import React from "react";
import styles from "./Hero.module.scss";
import { HeroHeadline } from "./HeroHeadline/HeroHeadline.tsx";
import { InsidePlatform } from "./InsidePlatform/InsidePlatform.tsx";
import { UpcomingEvent } from "./UpcomingEvent/UpcomingEvent.tsx";
import { LatestNews } from "./LatestNews/LatestNews.tsx";

import { NewsItem } from "../../../../Types/news.ts";
import { UpcomingEventData } from "../../../../Types/event.ts";

interface HeroProps {
  lang: string;
  news: NewsItem[];
  upcomingEvents: UpcomingEventData[];
}

export const Hero = ({ lang, news, upcomingEvents }: HeroProps) => {
  return (
    <section className={styles.hero}>
      <HeroHeadline lang={lang} />

      <div className={styles.contentGrid}>
        <InsidePlatform lang={lang} />

        <div className={styles.rightColumnsWrapper}>
          <UpcomingEvent lang={lang} events={upcomingEvents} />
          <LatestNews lang={lang} news={news} />
        </div>
      </div>
    </section>
  );
};
