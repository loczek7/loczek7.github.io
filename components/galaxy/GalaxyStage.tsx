"use client";

import { useId, useState } from "react";
import type { Messages } from "@/lib/i18n";
import { Modal } from "@/components/ui/Modal";
import { PlanetCard } from "./PlanetCard";
import { ProjectDialog } from "./ProjectDialog";
import { Sun } from "./Sun";
import { columns, getProject, order, type ProjectId } from "./projects";
import styles from "./Galaxy.module.css";

type GalaxyStageProps = {
  t: Messages["galaxy"];
};

export function GalaxyStage({ t }: GalaxyStageProps) {
  const [openId, setOpenId] = useState<ProjectId | null>(null);
  // Keeps the last project rendered while the dialog closes.
  const [shownId, setShownId] = useState<ProjectId>("axel");
  const titleId = useId();

  const open = (id: ProjectId) => {
    setShownId(id);
    setOpenId(id);
  };

  const renderColumn = (ids: ProjectId[]) =>
    ids.map((id) => (
      <PlanetCard
        key={id}
        project={getProject(id)}
        copy={t.projects[id]}
        number={order.indexOf(id) + 1}
        detailsLabel={t.details}
        onDetails={() => open(id)}
      />
    ));

  return (
    <div className={styles.stage}>
      <div className={`${styles.orbit} ${styles.o1}`} aria-hidden="true">
        <i />
      </div>
      <div className={`${styles.orbit} ${styles.o2}`} aria-hidden="true">
        <i />
      </div>
      <div className={`${styles.orbit} ${styles.o3}`} aria-hidden="true">
        <i />
      </div>
      <Sun label={t.sunAria} tip={t.sunTip} />

      <div className={styles.col}>{renderColumn(columns.left)}</div>
      <div className={`${styles.col} ${styles.right}`}>
        {renderColumn(columns.right)}
      </div>

      <Modal
        open={openId !== null}
        onClose={() => setOpenId(null)}
        labelledBy={titleId}
        closeLabel={t.close}
      >
        <ProjectDialog
          project={getProject(shownId)}
          copy={t.projects[shownId]}
          t={t}
          titleId={titleId}
        />
      </Modal>
    </div>
  );
}
