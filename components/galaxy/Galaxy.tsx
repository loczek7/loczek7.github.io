import type { Messages } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalaxyStage } from "./GalaxyStage";
import styles from "./Galaxy.module.css";

type GalaxyProps = {
  t: Messages["galaxy"];
};

export function Galaxy({ t }: GalaxyProps) {
  return (
    <section id="projects" className={styles.section}>
      <SectionHeading
        kicker={t.kicker}
        title={t.title}
        sub={t.sub}
        spacing={56}
        center
      />
      <GalaxyStage t={t} />
    </section>
  );
}
