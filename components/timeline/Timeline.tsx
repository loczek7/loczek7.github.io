import type { Messages } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Timeline.module.css";

// Dot colour per milestone, in the prototype's order:
// studies, Wirtualna Polska, OTO OKO, AXEL, Backstage, today.
const dots = [
  styles.violet,
  styles.amber,
  styles.cyan,
  styles.violet,
  styles.green,
  styles.now,
];

type TimelineProps = {
  t: Messages["timeline"];
};

export function Timeline({ t }: TimelineProps) {
  return (
    <section id="timeline" className={styles.section}>
      <SectionHeading kicker={t.kicker} title={t.title} spacing={48} />
      <ol className={styles.timeline}>
        {t.items.map((item, i) => (
          <li key={item.year} className="reveal">
            <div
              className={`${styles.dot} ${dots[i] ?? ""}`}
              aria-hidden="true"
            />
            <span className={styles.year}>{item.year}</span>
            <h3 className={`display ${styles.title}`}>{item.title}</h3>
            <p className={styles.text}>{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
