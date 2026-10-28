import type { CSSProperties } from "react";
import { Planets3D } from "@/components/three/Planets3D";
import { layers, solarOrbits, type PlanetSpec } from "./planets";
import styles from "./Cosmos.module.css";

function Globe({ texture, roll, glow, size, left, right, top }: PlanetSpec) {
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

// Planets of the CSS solar system: placed at -size/2 so they sit on the orbit.
function OrbitGlobe(props: Omit<PlanetSpec, "left" | "top">) {
  const half = `${-props.size / 2}px`;
  return <Globe {...props} left={half} top={half} />;
}

const orbitClass = [styles.o3a, styles.o3b, styles.o3c];

// Fixed background layer behind all content: nebulae, aurora, a solar system
// and three parallax layers of planets. Purely decorative.
// The planets are WebGL 3D (Planets3D); the CSS version below is the
// fallback and is hidden once the 3D scene has rendered.
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

      <div className={styles.flat}>
        <div className={styles.scene3d}>
          <div className={styles.cam}>
            <div className={styles.solar}>
              <div className={styles.star3} />
              {solarOrbits.map((orbit, i) => (
                <div
                  key={orbit.radius}
                  className={`${styles.orb3} ${orbitClass[i] ?? ""}`}
                >
                  <div className={styles.pl3}>
                    {orbit.ringed && <div className={styles.ring3} />}
                    <OrbitGlobe {...orbit.planet} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {layers.map((layer) => (
          <div
            key={layer.name}
            className={`${styles.par} ${styles[layer.name]}`}
          >
            {layer.planets.map((planet) => (
              <Globe
                key={`${planet.left ?? planet.right}-${planet.top}`}
                {...planet}
              />
            ))}
          </div>
        ))}
      </div>

      <Planets3D />
    </div>
  );
}
