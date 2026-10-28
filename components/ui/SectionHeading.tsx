import styles from "./SectionHeading.module.css";

type SectionHeadingProps = {
  kicker: string;
  title: string;
  // Space below the heading; differs per section in the prototype.
  spacing: number;
  // Optional lead paragraph; the galaxy heading is centred and has one.
  sub?: string;
  center?: boolean;
};

export function SectionHeading({
  kicker,
  title,
  spacing,
  sub,
  center = false,
}: SectionHeadingProps) {
  return (
    <div
      className={`reveal ${styles.heading} ${center ? styles.center : ""}`}
      style={{ marginBottom: spacing }}
    >
      <span className="kicker">{kicker}</span>
      <h2 className={`display ${styles.title}`}>{title}</h2>
      {sub && <p className={styles.sub}>{sub}</p>}
    </div>
  );
}
