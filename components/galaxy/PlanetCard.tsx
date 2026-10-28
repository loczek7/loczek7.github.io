import Image from "next/image";
import { ArrowRightIcon, PlusIcon } from "@/components/ui/icons";
import type { Project, ProjectCopy } from "./projects";
import styles from "./Galaxy.module.css";

type PlanetCardProps = {
  project: Project;
  copy: ProjectCopy;
  // 1–5, used for the mobile order when the columns collapse.
  number: number;
  detailsLabel: string;
  onDetails: () => void;
};

export function PlanetCard({
  project,
  copy,
  number,
  detailsLabel,
  onDetails,
}: PlanetCardProps) {
  const sphereClass = [
    styles.sphere,
    styles[`s-${project.sphere}`],
    project.ringed ? styles.ringed : "",
  ].join(" ");

  return (
    <article className={`reveal ${styles.planet}`} style={{ order: number }}>
      <div className={styles.sphereBox} aria-hidden="true">
        <div
          className={styles.moonOrbit}
          style={{ animationDuration: project.moonDuration }}
        >
          <i />
        </div>
        <div
          className={sphereClass}
          style={{ animationDelay: project.sphereDelay }}
        />
      </div>
      <div className={`glass ${styles.info}`}>
        <span className={`kicker ${styles.planetKicker}`}>{copy.planet}</span>
        <h3 className="display">{copy.name}</h3>
        <div className={styles.shot}>
          <div className={styles.shotBar} aria-hidden="true">
            <i />
            <i />
            <i />
            <span>{copy.shotLabel}</span>
          </div>
          {project.shot ? (
            <Image
              src={project.shot}
              alt={copy.shotAlt}
              className={styles.shotImg}
              sizes="(max-width: 900px) 360px, 320px"
            />
          ) : (
            <div className={styles.shotBody}>
              <span className={`display ${styles.shotEvent}`}>
                Stocznia Sound 2027
              </span>
              <span className={styles.shotTagline}>
                {"shotTagline" in copy ? copy.shotTagline : ""}
              </span>
            </div>
          )}
        </div>
        <p>{copy.desc}</p>
        <ul className={styles.chips}>
          {project.chips.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
        </ul>
        <div className={styles.acts}>
          <button
            type="button"
            className={styles.details}
            aria-label={`${detailsLabel}: ${copy.name}`}
            aria-haspopup="dialog"
            onClick={onDetails}
          >
            {detailsLabel}
            <PlusIcon />
          </button>
          <a className={styles.more} href={project.repo}>
            {copy.repoLabel}
            <ArrowRightIcon />
          </a>
          {project.demo && (
            <a
              className={styles.more}
              href={project.demo}
              target="_blank"
              rel="noopener"
            >
              Demo
              <ArrowRightIcon />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
