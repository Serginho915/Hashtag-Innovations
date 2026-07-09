"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/Hooks/useLanguage.ts";
import styles from "./CookieConsent.module.scss";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = "hashtag_cookie_consent";

const text = {
  en: {
    body: "We use necessary cookies and, with your consent, Google Analytics cookies to understand how the website is used.",
    accept: "Accept analytics",
    decline: "Decline",
    policy: "Cookie Policy",
  },
  bg: {
    body: "Използваме необходими бисквитки и, с ваше съгласие, Google Analytics бисквитки, за да разбираме как се използва сайтът.",
    accept: "Приемам аналитиката",
    decline: "Отказвам",
    policy: "Политика за бисквитки",
  },
} as const;

export const CookieConsent = () => {
  const { language } = useLanguage();
  const t = text[language] ?? text.en;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!window.localStorage.getItem(STORAGE_KEY));
  }, []);

  const saveChoice = (choice: "accepted" | "declined") => {
    window.localStorage.setItem(STORAGE_KEY, choice);
    window.gtag?.("consent", "update", {
      analytics_storage: choice === "accepted" ? "granted" : "denied",
    });
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <section className={styles.banner} aria-label={t.policy}>
      <p className={styles.text}>{t.body}</p>
      <div className={styles.actions}>
        <button className={styles.button} type="button" onClick={() => saveChoice("accepted")}>
          {t.accept}
        </button>
        <button
          className={`${styles.button} ${styles.secondaryButton}`}
          type="button"
          onClick={() => saveChoice("declined")}
        >
          {t.decline}
        </button>
        <Link className={styles.link} href={`/${language}/cookies`}>
          {t.policy}
        </Link>
      </div>
    </section>
  );
};
