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
    sending: "Sending...",
    greeting: "Hi! I am the Hashtag assistant. How can I help you today?",
    error: "I could not answer right now. Please try again in a moment.",
  },
  bg: {
    openLabel: "Отвори чат бота",
    closeLabel: "Затвори чат бота",
    title: "Асистент",
    subtitle: "На линия",
    placeholder: "Напиши съобщение...",
    send: "Изпрати",
    sending: "Изпращане...",
    greeting: "Здравей! Аз съм асистентът на Hashtag. С какво да помогна днес?",
    error: "Не успях да отговоря сега. Опитайте отново след момент.",
  },
} as const;

const CONVERSATION_STORAGE_KEY = "hashtag_chat_conversation_id";

export const ChatBotWidget = () => {
  const { language } = useLanguage();
  const t = uiText[language] ?? uiText.en;

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: "bot", text: t.greeting },
  ]);

  const nextIdRef = useRef(2);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setConversationId(window.localStorage.getItem(CONVERSATION_STORAGE_KEY) || "");
  }, []);

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
  }, [messages, isSending]);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  const appendBotMessage = (text: string) => {
    const botMessage: ChatMessage = {
      id: nextIdRef.current,
      role: "bot",
      text,
    };
    nextIdRef.current += 1;
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending) {
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
    setIsSending(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId,
        message: text,
        lang: language,
      }),
    }).catch(() => null);

    if (!response) {
      appendBotMessage(t.error);
      setIsSending(false);
      return;
    }

    const payload = await response.json().catch(() => null) as {
      conversationId?: string;
      message?: string;
      error?: string;
    } | null;

    if (!response.ok || !payload?.message) {
      appendBotMessage(payload?.error || t.error);
      setIsSending(false);
      return;
    }

    if (payload.conversationId) {
      setConversationId(payload.conversationId);
      window.localStorage.setItem(CONVERSATION_STORAGE_KEY, payload.conversationId);
    }

    appendBotMessage(payload.message);
    setIsSending(false);
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
            {isSending && (
              <div className={`${styles.message} ${styles.botMessage}`}>
                {t.sending}
              </div>
            )}
          </div>

          <form
            className={styles.inputArea}
            onSubmit={(event) => {
              event.preventDefault();
              void handleSend();
            }}
          >
            <input
              className={styles.input}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              disabled={isSending}
            />
            <button type="submit" className={styles.sendButton} disabled={!canSend}>
              {isSending ? t.sending : t.send}
            </button>
          </form>
        </section>
      )}

      {!isOpen && (
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setIsOpen(true)}
          aria-label={t.openLabel}
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
      )}
    </div>
  );
};
