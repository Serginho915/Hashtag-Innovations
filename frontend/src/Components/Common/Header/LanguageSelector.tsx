"use client";

import React from "react";
import styles from "./Header.module.scss";
import { useLanguage } from "../../../Context/LanguageContext";

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "bg" ? "en" : "bg");
  };

  return (
    <div
      className={styles.langSelector}
      data-property-1={language === "bg" ? "Bulgarian" : "English"}
      onClick={toggleLanguage}
    >
      {language === "bg" ? (
        <div className={styles.flag}>
          <div className={styles.white}></div>
          <div className={styles.green}></div>
          <div className={styles.red}></div>
        </div>
      ) : (
        <div className={styles.flag}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 30"
            preserveAspectRatio="xMidYMid slice"
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <clipPath id="s">
              <path d="M0,0 v30 h60 v-30 z" />
            </clipPath>
            <clipPath id="t">
              <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
            </clipPath>
            <g clipPath="url(#s)">
              <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
              <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
              <path
                d="M0,0 L60,30 M60,0 L0,30"
                clipPath="url(#t)"
                stroke="#C8102E"
                strokeWidth="4"
              />
              <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
              <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
            </g>
          </svg>
        </div>
      )}
      <div className={styles.langText}>{language === "bg" ? "BG" : "EN"}</div>
    </div>
  );
};
