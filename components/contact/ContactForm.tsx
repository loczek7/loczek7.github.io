"use client";

import { useState, type FormEvent } from "react";
import type { Messages } from "@/lib/i18n";
import { ArrowRightIcon } from "@/components/ui/icons";
import buttonStyles from "@/components/ui/Button.module.css";
import styles from "./ContactForm.module.css";

type ContactFormProps = {
  t: Messages["contact"];
};

// TODO(phase 3): actually send the message (fetch to an external form
// service, validation, honeypot + Turnstile, error state). For now it only
// shows the success state, exactly like the prototype.
export function ContactForm({ t }: ContactFormProps) {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className={styles.sent} role="status">
        <span className={`display ${styles.ok}`}>{t.formOk}</span>
        <button
          type="button"
          className={`${buttonStyles.btn} ${buttonStyles.ghost}`}
          onClick={() => setSent(false)}
        >
          {t.formAgain}
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label className={styles.field}>
        <span>{t.formName}</span>
        <input type="text" name="name" autoComplete="name" required />
      </label>
      <label className={styles.field}>
        <span>{t.formEmail}</span>
        <input type="email" name="email" autoComplete="email" required />
      </label>
      <label className={styles.field}>
        <span>{t.formMsg}</span>
        <textarea name="message" required />
      </label>
      <button
        type="submit"
        className={`${buttonStyles.btn} ${buttonStyles.primary} ${styles.submit}`}
      >
        {t.formSend}
        <ArrowRightIcon />
      </button>
    </form>
  );
}
