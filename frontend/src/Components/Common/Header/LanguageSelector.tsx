"use client";

import React from "react";
import styles from "./Header.module.scss";
import { useLanguage } from "../../../Hooks/useLanguage";

export const LanguageSelector = ({ isMobile }: { isMobile?: boolean }) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "bg" ? "en" : "bg");
  };

  if (isMobile) {
    return (
      <div className={styles.mobileLangContainer}>
        <div className={styles.mobileLangWrapper}>
          {/* ENG Selector */}
          <div
            className={`${styles.mobileLangOption} ${language === 'en' ? styles.activeLang : styles.inactiveLang}`}
            onClick={() => setLanguage('en')}
          >
            <div className={styles.flag}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 60 30"
                preserveAspectRatio="xMidYMid slice"
                style={{ width: "100%", height: "100%", display: "block" }}
              >
                <clipPath id="s-mob">
                  <path d="M0,0 v30 h60 v-30 z" />
                </clipPath>
                <clipPath id="t-mob">
                  <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
                </clipPath>
                <g clipPath="url(#s-mob)">
                  <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                  <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t-mob)" stroke="#C8102E" strokeWidth="4" />
                  <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
                  <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
                </g>
              </svg>
            </div>
            <div className={styles.mobileLangText}>ENG</div>
          </div>

          {/* BG Selector */}
          <div
            className={`${styles.mobileLangOption} ${language === 'bg' ? styles.activeLang : styles.inactiveLang}`}
            onClick={() => setLanguage('bg')}
          >
            <div className={styles.flag}>
              <div className={styles.white}></div>
              <div className={styles.green}></div>
              <div className={styles.red}></div>
            </div>
            <div className={styles.mobileLangText}>BG</div>
          </div>
        </div>
      </div>
    );
  }

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
