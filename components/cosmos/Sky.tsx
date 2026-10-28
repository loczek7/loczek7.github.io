import type { CSSProperties } from "react";
import styles from "./Sky.module.css";

// Same seeded generator and defaults as the prototype (starCount 170), run at
// build time, so the static HTML always has the same sky and no client JS.
const STAR_COUNT = 170;
const TINTS = ["#ffffff", "#ffffff", "#cfd8ff", "#ffe9c4"];

function createStars(count: number): CSSProperties[] {
  let seed = 20261001;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  return Array.from({ length: count }, () => {
    const big = rnd() > 0.88;
    const size = big ? 2.5 + rnd() * 1.5 : 1 + rnd() * 1.3;
    const tint = TINTS[Math.floor(rnd() * TINTS.length)];
    const glow = big
      ? `0 0 ${(6 + rnd() * 6).toFixed(1)}px ${tint}`
      : undefined;
    return {
      left: `${(rnd() * 100).toFixed(2)}%`,
      top: `${(rnd() * 100).toFixed(2)}%`,
      width: `${size.toFixed(1)}px`,
      height: `${size.toFixed(1)}px`,
      background: tint,
      boxShadow: glow,
      animationDuration: `${(2.5 + rnd() * 5).toFixed(1)}s`,
      animationDelay: `-${(rnd() * 6).toFixed(1)}s`,
    };
  });
}

const stars = createStars(STAR_COUNT);

export function Sky() {
  return (
    <div className={styles.sky} aria-hidden="true">
      {stars.map((style, i) => (
        <i key={i} className={styles.star} style={style} />
      ))}
    </div>
  );
}
