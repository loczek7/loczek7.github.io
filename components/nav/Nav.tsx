"use client";

import { useEffect, useState } from "react";
import { cvHref, type Locale, type Messages } from "@/lib/i18n";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CloseIcon, DownloadIcon, MenuIcon } from "@/components/ui/icons";
import { LangSwitch } from "./LangSwitch";
import styles from "./Nav.module.css";

type NavProps = {
  locale: Locale;
  t: Messages["nav"];
  downloadCv: string;
};

export function Nav({ locale, t, downloadCv }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const links = [
    { href: "#about", label: t.about },
    { href: "#projects", label: t.projects },
    { href: "#stack", label: t.stack },
    { href: "#contact", label: t.contact },
  ];

  // Lock page scroll while the mobile menu is open. Esc closes it, and so
  // does widening the window past the burger breakpoint.
  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 901px)");
    const onDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      root.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [menuOpen]);

  return (
    <>
      <header className={styles.nav}>
        <div className={styles.inner}>
          <a href="#top" className={styles.logo} onClick={closeMenu}>
            <span className={styles.logoSun} aria-hidden="true" />
            <span className={`display ${styles.logoText}`}>
              Marceli Duraziński
            </span>
          </a>
          <nav className={styles.links}>
            {links.map((link) => (
              <a key={link.href} className={styles.link} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className={styles.actions}>
            <LangSwitch locale={locale} label={t.langLabel} />
            <ButtonLink href="#contact" className={styles.cta}>
              {t.cta}
            </ButtonLink>
            <button
              type="button"
              className={styles.burger}
              aria-label={t.menuAria}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <nav id="mobile-menu" className={styles.mmenu} aria-label={t.menuAria}>
          {links.map((link) => (
            <a
              key={link.href}
              className={styles.mlink}
              href={link.href}
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
          <div className={styles.mcta}>
            <ButtonLink href={cvHref(locale)} download onClick={closeMenu}>
              <DownloadIcon />
              {downloadCv}
            </ButtonLink>
            <ButtonLink variant="ghost" href="#contact" onClick={closeMenu}>
              {t.cta}
            </ButtonLink>
          </div>
        </nav>
      )}
    </>
  );
}
