import type { CSSProperties } from "react";
import styles from "./Cosmos.module.css";

type Texture = "earth" | "gas" | "ice" | "violet" | "moon" | "teal";

type GlobeProps = {
  texture: Texture;
  roll: string;
  glow: string;
  size: number;
  // Position: left/right/top as in the prototype (px or %).
  left?: string;
  right?: string;
  top: string;
};

function Globe({ texture, roll, glow, size, left, right, top }: GlobeProps) {
  const style = {
    left,
    right,
    top,
    width: size,
    height: size,
    "--glow": glow,
  } as CSSProperties;
  return (
    <div className={styles.globe} style={style}>
      <div
        className={`${styles.tex} ${styles[`tx-${texture}`]}`}
        style={{ "--roll": roll } as CSSProperties}
      />
    </div>
  );
}

// Planets of the 3D solar system: placed at -size/2 so they sit on the orbit.
function OrbitGlobe(props: Omit<GlobeProps, "left" | "top">) {
  const half = `${-props.size / 2}px`;
  return <Globe {...props} left={half} top={half} />;
}

const far: GlobeProps[] = [
  {
    texture: "violet",
    roll: "50s",
    glow: "rgba(205, 170, 255, 0.25)",
    size: 46,
    left: "8%",
    top: "10%",
  },
  {
    texture: "moon",
    roll: "80s",
    glow: "rgba(200, 205, 230, 0.2)",
    size: 38,
    left: "88%",
    top: "22%",
  },
  {
    texture: "earth",
    roll: "45s",
    glow: "rgba(90, 170, 255, 0.3)",
    size: 54,
    left: "72%",
    top: "48%",
  },
  {
    texture: "teal",
    roll: "60s",
    glow: "rgba(255, 120, 60, 0.3)",
    size: 42,
    left: "16%",
    top: "66%",
  },
  {
    texture: "ice",
    roll: "55s",
    glow: "rgba(120, 200, 255, 0.3)",
    size: 36,
    left: "52%",
    top: "86%",
  },
];

const mid: GlobeProps[] = [
  {
    texture: "ice",
    roll: "110s",
    glow: "rgba(105, 178, 251, 0.3)",
    size: 160,
    right: "6%",
    top: "14%",
  },
  {
    texture: "teal",
    roll: "130s",
    glow: "rgba(255, 120, 60, 0.28)",
    size: 190,
    left: "4%",
    top: "36%",
  },
  {
    texture: "earth",
    roll: "100s",
    glow: "rgba(90, 200, 120, 0.25)",
    size: 150,
    right: "10%",
    top: "60%",
  },
  {
    texture: "violet",
    roll: "140s",
    glow: "rgba(240, 190, 120, 0.3)",
    size: 170,
    left: "12%",
    top: "82%",
  },
];

const near: GlobeProps[] = [
  {
    texture: "violet",
    roll: "240s",
    glow: "rgba(240, 190, 120, 0.3)",
    size: 560,
    left: "-330px",
    top: "19%",
  },
  {
    texture: "ice",
    roll: "200s",
    glow: "rgba(105, 178, 251, 0.3)",
    size: 420,
    right: "-200px",
    top: "36%",
  },
  {
    texture: "moon",
    roll: "260s",
    glow: "rgba(197, 140, 255, 0.3)",
    size: 640,
    left: "-380px",
    top: "56%",
  },
  {
    texture: "teal",
    roll: "300s",
    glow: "rgba(200, 205, 230, 0.2)",
    size: 340,
    right: "-150px",
    top: "76%",
  },
];

// Fixed background layer behind all content: nebulae, aurora, a CSS-3D solar
// system and three parallax layers of planets. Purely decorative.
export function Cosmos() {
  return (
    <div className={styles.cosmos} aria-hidden="true">
      <div className={styles.nebs}>
        <div className={`${styles.neb} ${styles.n1}`} />
        <div className={`${styles.neb} ${styles.n2}`} />
        <div className={`${styles.neb} ${styles.n3}`} />
        <div className={`${styles.aurora} ${styles.a2}`} />
        <div className={`${styles.aurora} ${styles.a1}`} />
      </div>

      <div className={styles.scene3d}>
        <div className={styles.cam}>
          <div className={styles.solar}>
            <div className={styles.star3} />
            <div className={`${styles.orb3} ${styles.o3a}`}>
              <div className={styles.pl3}>
                <OrbitGlobe
                  texture="earth"
                  roll="40s"
                  glow="rgba(90, 170, 255, 0.4)"
                  size={72}
                />
              </div>
            </div>
            <div className={`${styles.orb3} ${styles.o3b}`}>
              <div className={styles.pl3}>
                <div className={styles.ring3} />
                <OrbitGlobe
                  texture="gas"
                  roll="70s"
                  glow="rgba(240, 190, 120, 0.35)"
                  size={120}
                />
              </div>
            </div>
            <div className={`${styles.orb3} ${styles.o3c}`}>
              <div className={styles.pl3}>
                <OrbitGlobe
                  texture="ice"
                  roll="55s"
                  glow="rgba(120, 200, 255, 0.4)"
                  size={84}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.par} ${styles.far}`}>
        {far.map((globe) => (
          <Globe key={`${globe.left ?? globe.right}-${globe.top}`} {...globe} />
        ))}
      </div>
      <div className={`${styles.par} ${styles.mid}`}>
        {mid.map((globe) => (
          <Globe key={`${globe.left ?? globe.right}-${globe.top}`} {...globe} />
        ))}
      </div>
      <div className={`${styles.par} ${styles.near}`}>
        {near.map((globe) => (
          <Globe key={`${globe.left ?? globe.right}-${globe.top}`} {...globe} />
        ))}
      </div>
    </div>
  );
}
