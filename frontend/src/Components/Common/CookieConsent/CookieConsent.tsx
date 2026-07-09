"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useLanguage } from "@/Hooks/useLanguage.ts";
import styles from "./CookieConsent.module.scss";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = "hashtag_cookie_consent";
export const COOKIE_SETTINGS_EVENT = "hashtag:open-cookie-settings";
const COOKIE_CHOICE_EVENT = "hashtag:cookie-choice-changed";

const text = {
  en: {
    body: "We use necessary cookies to run the website. With your consent, we also use optional analytics technologies to understand usage and improve the service.",
    accept: "Accept analytics",
    decline: "Decline",
    policy: "Cookie Policy",
  },
  bg: {
    body: "Използваме необходими бисквитки за работата на сайта. С ваше съгласие използваме и незадължителни аналитични технологии, за да разбираме употребата и да подобряваме услугата.",
    accept: "Приемам аналитиката",
    decline: "Отказвам",
    policy: "Политика за бисквитки",
  },
} as const;

const getCookieChoice = () => {
  if (typeof window === "undefined") {
    return "server";
  }

  return window.localStorage.getItem(STORAGE_KEY) || "";
};

const subscribeToCookieChoice = (onStoreChange: () => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(COOKIE_CHOICE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(COOKIE_CHOICE_EVENT, onStoreChange);
  };
};

export const CookieConsent = () => {
  const { language } = useLanguage();
  const t = text[language] ?? text.en;
  const cookieChoice = useSyncExternalStore(subscribeToCookieChoice, getCookieChoice, () => "server");
  const [isForcedOpen, setIsForcedOpen] = useState(false);
  const isVisible = isForcedOpen || cookieChoice === "";

  useEffect(() => {
    const openCookieSettings = () => setIsForcedOpen(true);

    window.addEventListener(COOKIE_SETTINGS_EVENT, openCookieSettings);
    return () => {
      window.removeEventListener(COOKIE_SETTINGS_EVENT, openCookieSettings);
    };
  }, []);

  const saveChoice = (choice: "accepted" | "declined") => {
    window.localStorage.setItem(STORAGE_KEY, choice);
    window.dispatchEvent(new Event(COOKIE_CHOICE_EVENT));
    window.gtag?.("consent", "update", {
      analytics_storage: choice === "accepted" ? "granted" : "denied",
    });
    setIsForcedOpen(false);
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
