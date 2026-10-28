import { cvHref, type Locale, type Messages } from "@/lib/i18n";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DownloadIcon } from "@/components/ui/icons";
import { ContactForm } from "./ContactForm";
import styles from "./Contact.module.css";

// TODO(phase 2): real addresses for Gmail, LinkedIn and GitHub.
const links = {
  gmail: "#",
  linkedin: "#",
  github: "#",
};

type ContactProps = {
  locale: Locale;
  t: Messages["contact"];
  downloadCv: string;
};

export function Contact({ locale, t, downloadCv }: ContactProps) {
  return (
    <section id="contact" className={styles.contact}>
      <div className={`reveal glass ${styles.card}`}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.grid}>
          <div className={styles.copy}>
            <span className="kicker">{t.kicker}</span>
            <h2 className={`display ${styles.title}`}>{t.title}</h2>
            <p className={styles.text}>{t.text}</p>
            <div className={styles.links}>
              <ButtonLink href={links.gmail}>Gmail</ButtonLink>
              <ButtonLink variant="ghost" href={links.linkedin}>
                LinkedIn
              </ButtonLink>
              <ButtonLink variant="ghost" href={links.github}>
                GitHub
              </ButtonLink>
            </div>
            <ButtonLink variant="ghost" href={cvHref(locale)} download>
              <DownloadIcon />
              {downloadCv}
            </ButtonLink>
          </div>
          <div className={`glass ${styles.formBox}`}>
            <ContactForm t={t} />
          </div>
        </div>
      </div>
    </section>
  );
}
