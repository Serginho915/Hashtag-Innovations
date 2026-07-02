"use client";

import { FormEvent, useState } from "react";
import styles from "./LoginPage.module.scss";

interface LoginFormProps {
  nextPath: string;
}

export const LoginForm = ({ nextPath }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        next: nextPath,
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as { next?: string };
      window.location.assign(data.next || "/admin");
      return;
    }

    setError("Invalid administrator credentials.");
    setIsSubmitting(false);
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <label className={styles.loginField}>
        <span>Username</span>
        <input
          autoComplete="username"
          autoFocus
          name="username"
          onChange={(event) => setUsername(event.target.value)}
          required
          type="text"
          value={username}
        />
      </label>

      <label className={styles.loginField}>
        <span>Password</span>
        <input
          autoComplete="current-password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </label>

      {error && <p className={styles.loginError}>{error}</p>}

      <button className={styles.loginButton} disabled={isSubmitting} type="submit">
        {isSubmitting ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
};
