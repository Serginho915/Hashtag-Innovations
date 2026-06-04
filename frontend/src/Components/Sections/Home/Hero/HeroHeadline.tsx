import React from "react";
import styles from "./Hero.module.scss";

const tabs = ["Events", "Mentors", "Experts", "Resources", "Insights"];

export const HeroHeadline = () => {
  return (
    <div className={styles.headlineWrapper}>
      <div className={styles.headline}>
        Headline exmpl. Learn, Connect, Grow
      </div>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <div key={tab} className={styles.tab}>
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
};
