"use client";

import { useEffect, useRef } from "react";
import styles from "./ScrollProgress.module.css";

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const rocket = useRef<SVGSVGElement>(null);

  // Native scroll timelines drive both elements in CSS. Where they are
  // missing, follow the scroll position here instead (one update per frame).
  useEffect(() => {
    if (CSS.supports("animation-timeline: scroll()")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      if (rocket.current) {
        rocket.current.style.transform = `translateX(calc((100vw - 44px) * ${p}))`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    if (styles.manual) rocket.current?.classList.add(styles.manual);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div ref={bar} className={styles.progress} aria-hidden="true" />
      <svg
        ref={rocket}
        className={styles.rocket}
        width="40"
        height="20"
        viewBox="0 0 40 20"
        aria-hidden="true"
      >
        <path d="M8 10 L0 5 L3 10 L0 15Z" fill="#ffb347" />
        <path d="M8 4 H24 Q36 4 40 10 Q36 16 24 16 H8Z" fill="#e8eaff" />
        <circle cx="27" cy="10" r="3" fill="#3de0ff" />
        <path d="M10 4 L16 0 L19 4Z" style={{ fill: "var(--accent)" }} />
        <path d="M10 16 L16 20 L19 16Z" style={{ fill: "var(--accent)" }} />
      </svg>
    </>
  );
}
