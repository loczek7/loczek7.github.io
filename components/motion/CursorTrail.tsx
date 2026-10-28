"use client";

import { useEffect } from "react";
import styles from "./CursorTrail.module.css";

export function CursorTrail() {
  // Same as the prototype: the pointer position goes into CSS variables on
  // <html>; the dots' CSS transitions do the trailing.
  useEffect(() => {
    const style = document.documentElement.style;
    const move = (event: MouseEvent) => {
      style.setProperty("--mx", `${event.clientX}px`);
      style.setProperty("--my", `${event.clientY}px`);
    };
    document.addEventListener("mousemove", move, { passive: true });
    return () => document.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className={styles.trail} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}
