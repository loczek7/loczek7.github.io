import type { StaticImageData } from "next/image";
import type { Messages } from "@/lib/i18n";
import shotAxel from "@/public/images/shot-axel.png";
import shotOto from "@/public/images/shot-oto-oko.png";
import shotWp from "@/public/images/shot-wp.png";
import shotPortfolio from "@/public/images/shot-portfolio.png";

// Language-independent project data. Copy lives in messages/*.json under
// galaxy.projects.<id>.
export type ProjectId = "axel" | "oto" | "bs" | "wp" | "port";

export type ProjectCopy = Messages["galaxy"]["projects"][ProjectId];

export type Project = {
  id: ProjectId;
  // Planet look, see "Wygląd planet" in CLAUDE.md.
  sphere: "axel" | "oto" | "bs" | "wp" | "port";
  ringed?: boolean;
  // Animation timing from the prototype, so planets don't move in sync.
  moonDuration?: string;
  sphereDelay?: string;
  // null = no screenshot yet (Backstage shows a placeholder banner).
  shot: StaticImageData | null;
  chips: string[];
  tech: string[];
  // TODO(phase 2): real repository links ("#" as in the prototype).
  repo: string;
  demo?: string;
};

const projects: Record<ProjectId, Project> = {
  axel: {
    id: "axel",
    sphere: "axel",
    ringed: true,
    shot: shotAxel,
    chips: ["TypeScript", "Next.js", "Docker", "Ollama"],
    tech: ["TypeScript", "Next.js", "Docker", "Ollama"],
    repo: "#",
  },
  oto: {
    id: "oto",
    sphere: "oto",
    moonDuration: "24s",
    sphereDelay: "-2s",
    shot: shotOto,
    chips: ["Next.js", "Supabase", "TypeScript", "Zod"],
    tech: ["Next.js", "Supabase", "TypeScript", "Zod"],
    repo: "#",
    demo: "https://otooko.app/",
  },
  bs: {
    id: "bs",
    sphere: "bs",
    moonDuration: "18s",
    sphereDelay: "-3s",
    // TODO(phase 2): shot-backstage.png (map or festival schedule).
    shot: null,
    chips: ["React Native", "Expo", "TypeScript", "SQLite"],
    tech: [
      "Expo",
      "React Native",
      "TypeScript",
      "Expo Router",
      "Zustand",
      "expo-sqlite",
      "Supabase",
      "Leaflet",
      "Jest",
    ],
    repo: "#",
  },
  wp: {
    id: "wp",
    sphere: "wp",
    moonDuration: "21s",
    sphereDelay: "-4s",
    shot: shotWp,
    chips: ["Nuxt.js", "Vue.js", "TypeScript", "Sass"],
    tech: ["Nuxt.js", "Vue.js", "TypeScript", "Sass"],
    repo: "#",
  },
  port: {
    id: "port",
    sphere: "port",
    moonDuration: "15s",
    sphereDelay: "-6s",
    // TODO(phase 8): replace with a screenshot of the deployed site.
    shot: shotPortfolio,
    chips: ["Next.js", "React", "TypeScript"],
    tech: ["Next.js", "React", "TypeScript"],
    repo: "#",
  },
};

// Two columns as in the prototype; numbering (01–05) alternates between them.
// Below 900px the columns collapse and planets follow their number.
export const columns: { left: ProjectId[]; right: ProjectId[] } = {
  left: ["axel", "bs", "port"],
  right: ["oto", "wp"],
};

export const order: ProjectId[] = ["axel", "oto", "bs", "wp", "port"];

export function getProject(id: ProjectId): Project {
  return projects[id];
}
