import type { Messages } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Offer.module.css";

// Dot colour per card, in the prototype's order (.od, .od.b, .od.g, .od.p).
const dots = [styles.violet, styles.cyan, styles.green, styles.pink];

type OfferProps = {
  t: Messages["offer"];
};

export function Offer({ t }: OfferProps) {
  return (
    <section id="offer" className={styles.offer}>
      <SectionHeading kicker={t.kicker} title={t.title} spacing={32} />
      <div className={`reveal ${styles.grid}`}>
        {t.items.map((item, i) => (
          <div key={item.title} className={`glass ${styles.card}`}>
            <span
              className={`${styles.dot} ${dots[i] ?? ""}`}
              aria-hidden="true"
            />
            <h3 className={`display ${styles.title}`}>{item.title}</h3>
            <p className={styles.text}>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
