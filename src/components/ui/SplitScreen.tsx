import Link from "next/link";
import styles from "./SplitScreen.module.css";

type Side = {
  title: string;
  subLinks: string[];
  cta: { label: string; href: string };
};

interface Props {
  left?: Side;
  right?: Side;
}

const defaultLeft: Side = {
  title: "Architecture",
  subLinks: ["Residential", "Commercial", "Masterplanning"],
  cta: {
    label: "Explore Projects",
    href: "/portfolio-architectural-solutions",
  },
};

const defaultRight: Side = {
  title: "Interiors",
  subLinks: ["Space Planning", "Custom Millwork", "Materials"],
  cta: { label: "View Services", href: "#services" },
};

export default function SplitScreen({
  left = defaultLeft,
  right = defaultRight,
}: Props) {
  return (
    <section
      className={styles.container}
      aria-label="Practice areas"
    >
      <div className={`${styles.splitSide} ${styles.leftSide}`}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h2 className={styles.title}>{left.title}</h2>
          <div className={styles.subLinks}>
            {left.subLinks.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          <Link href={left.cta.href} className={styles.actionBtn}>
            {left.cta.label}
          </Link>
        </div>
      </div>

      <div className={`${styles.splitSide} ${styles.rightSide}`}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h2 className={styles.title}>{right.title}</h2>
          <div className={styles.subLinks}>
            {right.subLinks.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          <Link href={right.cta.href} className={styles.actionBtn}>
            {right.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
