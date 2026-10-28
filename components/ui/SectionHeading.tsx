import styles from "./SectionHeading.module.css";

type SectionHeadingProps = {
  kicker: string;
  title: string;
  // Space below the heading; differs per section in the prototype.
  spacing: number;
};

export function SectionHeading({
  kicker,
  title,
  spacing,
}: SectionHeadingProps) {
  return (
    <div
      className={`reveal ${styles.heading}`}
      style={{ marginBottom: spacing }}
    >
      <span className="kicker">{kicker}</span>
      <h2 className={`display ${styles.title}`}>{title}</h2>
    </div>
  );
}
