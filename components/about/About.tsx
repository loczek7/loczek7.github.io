import type { Messages } from "@/lib/i18n";
import styles from "./About.module.css";

type AboutProps = {
  t: Messages["about"];
};

export function About({ t }: AboutProps) {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.grid}>
        <div className={`reveal ${styles.text}`}>
          <span className="kicker">{t.kicker}</span>
          <h2 className={`display ${styles.title}`}>{t.title}</h2>
          <p className={styles.p}>{t.p1}</p>
          <p className={styles.p}>{t.p2}</p>
        </div>
        <dl className={`reveal ${styles.cards}`}>
          {t.cards.map((card) => (
            <div key={card.label} className={`glass ${styles.card}`}>
              <dt className={`kicker ${styles.cardLabel}`}>{card.label}</dt>
              <dd className={styles.cardValue}>{card.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
