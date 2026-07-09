"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ChatBotWidget.module.scss";
import { useLanguage } from "@/Hooks/useLanguage.ts";

type MessageRole = "bot" | "user";

interface ChatMessage {
  id: number;
  role: MessageRole;
  text: string;
}

const uiText = {
  en: {
    openLabel: "Open chatbot",
    closeLabel: "Close chatbot",
    title: "Assistant",
    subtitle: "Online now",
    placeholder: "Type your message...",
    send: "Send",
    greeting: "Hi! I am the Hashtag assistant. How can I help you today?",
  },
  bg: {
    openLabel: "Отвори чат бот",
    closeLabel: "Затвори чат бот",
    title: "Асистент",
    subtitle: "На линия",
    placeholder: "Напиши съобщение...",
    send: "Изпрати",
    greeting: "Здравей! Аз съм асистентът на Hashtag. С какво да помогна днес?",
  },
} as const;

export const ChatBotWidget = () => {
  const { language } = useLanguage();
  const t = uiText[language] ?? uiText.en;

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: "bot", text: t.greeting },
  ]);

  const nextIdRef = useRef(2);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages((current) => {
      if (current.length === 1 && current[0].role === "bot") {
        return [{ ...current[0], text: t.greeting }];
      }
      return current;
    });
  }, [t.greeting]);

  useEffect(() => {
    if (!listRef.current) {
      return;
    }
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) {
      return;
    }

    const userMessage: ChatMessage = {
      id: nextIdRef.current,
      role: "user",
      text,
    };
    nextIdRef.current += 1;

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
  };

  return (
    <div className={styles.widget}>
      {isOpen && (
        <section className={styles.chatWindow} aria-label={t.title}>
          <header className={styles.header}>
            <div>
              <h3 className={styles.title}>{t.title}</h3>
              <p className={styles.subtitle}>{t.subtitle}</p>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label={t.closeLabel}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div className={styles.messages} ref={listRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${message.role === "bot" ? styles.botMessage : styles.userMessage}`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <form
            className={styles.inputArea}
            onSubmit={(event) => {
              event.preventDefault();
              handleSend();
            }}
          >
            <input
              className={styles.input}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
            />
            <button type="submit" className={styles.sendButton} disabled={!canSend}>
              {t.send}
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? t.closeLabel : t.openLabel}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path
            d="M6 10.5C6 8.01472 8.01472 6 10.5 6H17.5C19.9853 6 22 8.01472 22 10.5V14.5C22 16.9853 19.9853 19 17.5 19H13L9.5 22V19.0007C7.53818 18.7592 6 17.0867 6 15.0625V10.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="11" cy="12.5" r="1" fill="currentColor" />
          <circle cx="14" cy="12.5" r="1" fill="currentColor" />
          <circle cx="17" cy="12.5" r="1" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
};
