import Image from "next/image";
import { cvHref, type Locale, type Messages } from "@/lib/i18n";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowRightIcon, DownloadIcon } from "@/components/ui/icons";
import portrait from "@/public/images/portrait.webp";
import styles from "./Hero.module.css";

type HeroProps = {
  locale: Locale;
  t: Messages["hero"];
  downloadCv: string;
};

export function Hero({ locale, t, downloadCv }: HeroProps) {
  return (
    <section id="top" className={styles.hero}>
      <span className={`${styles.shoot} ${styles.shoot1}`} aria-hidden="true" />
      <span className={`${styles.shoot} ${styles.shoot2}`} aria-hidden="true" />
      <div className={styles.grid}>
        <div className={`hero-copy ${styles.copy}`}>
          <span className={styles.eyebrow}>
            <b aria-hidden="true" />
            {t.open}
          </span>
          <h1 className={`display ${styles.title}`}>
            {t.pre}
            <span className={styles.name}>Marceli!</span>
          </h1>
          <p className={styles.sub}>{t.sub}</p>
          <p className={styles.tagline}>{t.tagline}</p>
          <div className={styles.btns}>
            <ButtonLink href={cvHref(locale)} download className={styles.btn}>
              <DownloadIcon />
              {downloadCv}
            </ButtonLink>
            <ButtonLink variant="ghost" href="#contact" className={styles.btn}>
              {t.ctaContact}
            </ButtonLink>
            <a className={styles.link} href="#projects">
              {t.ctaProjects}
              <ArrowRightIcon />
            </a>
          </div>
        </div>
        <div className={styles.orb}>
          <div className={styles.halo} aria-hidden="true" />
          <div className={`${styles.ring} ${styles.r1}`} aria-hidden="true">
            <i />
          </div>
          <div className={`${styles.ring} ${styles.r2}`} aria-hidden="true">
            <i />
          </div>
          <div className={styles.photo}>
            <div className={styles.photoIn}>
              <Image
                src={portrait}
                alt={t.photoAlt}
                className={styles.portrait}
                sizes="(max-width: 900px) 350px, 456px"
                preload
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.cue} aria-hidden="true">
        <span>{t.cue}</span>
        <span className={styles.cueLine} />
      </div>
    </section>
  );
}
