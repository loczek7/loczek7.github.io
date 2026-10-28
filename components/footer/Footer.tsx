import styles from "./Footer.module.css";

type FooterProps = {
  right: string;
};

export function Footer({ right }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <span>© 2026 Marceli Duraziński</span>
      <span>{right}</span>
    </footer>
  );
}
