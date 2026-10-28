import Image from "next/image";
import type { Messages } from "@/lib/i18n";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { Project, ProjectCopy } from "./projects";
import styles from "./ProjectDialog.module.css";

type ProjectDialogProps = {
  project: Project;
  copy: ProjectCopy;
  t: Messages["galaxy"];
  titleId: string;
};

// Content of the "Details" modal; the frame itself is ui/Modal.
export function ProjectDialog({
  project,
  copy,
  t,
  titleId,
}: ProjectDialogProps) {
  const links = [
    { label: copy.repoLabel, href: project.repo },
    ...(project.demo ? [{ label: "Demo", href: project.demo }] : []),
  ];

  return (
    <div className={styles.grid}>
      <div>
        {project.shot ? (
          <Image
            src={project.shot}
            alt={copy.alt}
            className={styles.img}
            sizes="(max-width: 900px) 100vw, 420px"
          />
        ) : (
          <div className={styles.art} aria-hidden="true">
            <div className={`${styles.miniOrbit} ${styles.mo1}`}>
              <i />
            </div>
            <div className={`${styles.miniOrbit} ${styles.mo2}`}>
              <i />
            </div>
            <div className={styles.miniSun} />
          </div>
        )}
        <ul className={styles.chips}>
          {project.tech.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <div className={styles.links}>
          {links.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener">
              {link.label}
              <ArrowRightIcon />
            </a>
          ))}
        </div>
      </div>
      <div>
        <span className="kicker">{copy.kicker}</span>
        <h3 id={titleId} className={`display ${styles.title}`}>
          {copy.name}
        </h3>
        <p className={styles.summary}>{copy.summary}</p>
        <h4 className={styles.h}>{t.dlgRole}</h4>
        <p className={styles.role}>{copy.role}</p>
        <h4 className={styles.h}>{t.dlgFeatures}</h4>
        <ul className={styles.list}>
          {copy.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <h4 className={styles.h}>{t.dlgChallenge}</h4>
        <div className={styles.placeholder}>{t.dlgChallengePh}</div>
      </div>
    </div>
  );
}
