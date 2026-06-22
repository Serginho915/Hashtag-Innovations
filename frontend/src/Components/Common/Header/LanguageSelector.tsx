"use client";

import React, { useId } from "react";
import styles from "./Header.module.scss";
import { useLanguage } from "../../../Hooks/useLanguage.ts";
import { Language } from "../../../Types/Language.ts";

const LANGUAGES: Array<{ code: Language; shortLabel: string; label: string }> = [
  { code: "en", shortLabel: "EN", label: "English" },
  { code: "bg", shortLabel: "BG", label: "Bulgarian" },
];

const LanguageFlag = ({ language }: { language: Language }) => {
  const flagId = useId();
  const clipId = `${flagId}-clip`;
  const crossClipId = `${flagId}-cross`;

  if (language === "bg") {
    return (
      <span className={styles.flag} aria-hidden="true">
        <span className={styles.white}></span>
        <span className={styles.green}></span>
        <span className={styles.red}></span>
      </span>
    );
  }

  return (
    <span className={styles.flag} aria-hidden="true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 60 30"
        preserveAspectRatio="xMidYMid slice"
      >
        <clipPath id={clipId}>
          <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <clipPath id={crossClipId}>
          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
          <path
            d="M0,0 L60,30 M60,0 L0,30"
            clipPath={`url(#${crossClipId})`}
            stroke="#C8102E"
            strokeWidth="4"
          />
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
        </g>
      </svg>
    </span>
  );
};

export const LanguageSelector = ({ isMobile }: { isMobile?: boolean }) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "bg" ? "en" : "bg");
  };

  if (isMobile) {
    return (
      <div className={styles.mobileLangContainer}>
        <div className={styles.mobileLangWrapper} data-active-lang={language}>
          <span className={styles.mobileLangIndicator} aria-hidden="true"></span>
          {LANGUAGES.map(({ code, shortLabel, label }) => (
            <button
              key={code}
              type="button"
              className={`${styles.mobileLangOption} ${
                language === code ? styles.activeLang : styles.inactiveLang
              }`}
              onClick={() => setLanguage(code)}
              aria-label={`Switch language to ${label}`}
              aria-pressed={language === code}
            >
              <LanguageFlag language={code} />
              <span className={styles.mobileLangText}>{shortLabel}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={styles.langSelector}
      aria-label={`Switch language to ${language === "bg" ? "English" : "Bulgarian"}`}
      data-active-lang={language}
      onClick={toggleLanguage}
    >
      <span className={styles.langGlow} aria-hidden="true"></span>
      <span className={styles.langLabels} aria-hidden="true">
        <span>EN</span>
        <span>BG</span>
      </span>
      <span className={styles.langFlagWrap}>
        <LanguageFlag language={language} />
      </span>
    </button>
  );
};
