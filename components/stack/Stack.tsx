import type { Messages } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Stack.module.css";

// Float animation offsets, so neighbouring chips don't bob in sync.
const delays = ["", styles.d1, styles.d2, styles.d3];

// [technology, delay index] — names and offsets as in the prototype.
type Chip = [name: string, delay: 0 | 1 | 2 | 3];

const frontend: Chip[] = [
  ["HTML5", 0],
  ["CSS3", 1],
  ["Sass", 2],
  ["JavaScript", 3],
  ["TypeScript", 0],
  ["React", 1],
  ["Next.js", 2],
  ["Vue", 3],
  ["Nuxt", 0],
];

const backend: Chip[] = [
  ["Node.js", 1],
  ["Express", 2],
  ["PostgreSQL", 3],
  ["Supabase", 0],
  ["Python", 1],
];

const mobile: Chip[] = [
  ["React Native", 0],
  ["Expo", 1],
  ["SQLite", 2],
  ["Zustand", 3],
];

const tools: Chip[] = [
  ["Git", 3],
  ["Jest", 2],
  ["GitHub", 0],
  ["Docker", 1],
  ["Vercel", 2],
  ["Figma", 3],
];

type StackProps = {
  t: Messages["stack"];
};

export function Stack({ t }: StackProps) {
  const groups = [
    { title: "Front-end", chips: frontend },
    { title: "Back-end", chips: backend },
    { title: "Mobile", chips: mobile },
    { title: t.tools, chips: tools },
  ];

  return (
    <section id="stack" className={styles.stack}>
      <SectionHeading kicker={t.kicker} title={t.title} spacing={40} />
      <div className={`reveal ${styles.grid}`}>
        {groups.map((group) => (
          <div key={group.title} className={`glass ${styles.group}`}>
            <h3 className={`display ${styles.groupTitle}`}>{group.title}</h3>
            <ul className={styles.chips}>
              {group.chips.map(([name, delay]) => (
                <li key={name} className={`${styles.chip} ${delays[delay]}`}>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
