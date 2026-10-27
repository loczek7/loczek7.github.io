"use client";

import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { localeLabels, locales, type Locale } from "@/lib/i18n";
import styles from "./LangSwitch.module.css";

type LangSwitchProps = {
  locale: Locale;
  label: string;
};

// The section currently under the sticky nav, so switching language keeps
// the reader where they were, even if they scrolled without clicking a link.
function currentSectionId(): string | null {
  const navOffset = 84;
  let current: string | null = null;
  for (const section of document.querySelectorAll<HTMLElement>("section[id]")) {
    if (section.getBoundingClientRect().top <= navOffset + 1) {
      current = section.id;
    }
  }
  return current;
}

export function LangSwitch({ locale, label }: LangSwitchProps) {
  const router = useRouter();

  const switchTo = (target: Locale) => (event: MouseEvent) => {
    if (target === locale) {
      event.preventDefault();
      return;
    }
    // Let modified clicks (new tab, etc.) use the plain href.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    const id = currentSectionId() ?? window.location.hash.slice(1);
    router.push(id ? `/${target}/#${id}` : `/${target}/`);
  };

  return (
    <div className={styles.lang} role="group" aria-label={label}>
      {locales.map((target) => (
        <a
          key={target}
          href={`/${target}/`}
          hrefLang={target}
          lang={target}
          aria-current={target === locale ? "true" : undefined}
          className={`${styles.option} ${target === locale ? styles.on : ""}`}
          onClick={switchTo(target)}
        >
          {localeLabels[target]}
        </a>
      ))}
    </div>
  );
}
