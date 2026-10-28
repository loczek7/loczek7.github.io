"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Sun.module.css";

type SunProps = {
  label: string;
  tip: string;
};

// Clickable sun in the middle of the galaxy: two shock rings and a toast
// that disappears after 3.5 s (same timing as the prototype).
export function Sun({ label, tip }: SunProps) {
  // Incremented on every click so the rings remount and replay.
  const [burst, setBurst] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const pop = () => {
    setBurst((n) => n + 1);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setBurst(0), 3500);
  };

  return (
    <>
      <button
        type="button"
        className={styles.sun}
        aria-label={label}
        onClick={pop}
      />
      <div className={styles.label} aria-hidden="true">
        Marceli Duraziński
      </div>
      {burst > 0 && (
        <div key={burst} className={styles.layer} aria-hidden="true">
          <div className={styles.burst} />
          <div className={`${styles.burst} ${styles.b2}`} />
        </div>
      )}
      <div className={styles.layer} role="status">
        {burst > 0 && <div className={styles.toast}>{tip}</div>}
      </div>
    </>
  );
}
