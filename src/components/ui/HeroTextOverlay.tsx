"use client";

import { useEffect, useRef } from "react";
import { playfairDisplay } from "@/lib/fonts";
import styles from "./HeroTextOverlay.module.css";

interface Props {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Springs-style hero overlay. As the user scrolls into the AircraftScroll
 * sequence, the whole block translates Y from 0% → -50% and fades out.
 * Mirrors Springs' parallax pair:
 *   --100-0 → translateY(0%)   opacity 1
 *   --150-0 → translateY(-50%) opacity 0
 *
 * Animation window is the first ~7% of the AircraftScroll's 600vh container,
 * which is roughly 42vh of scroll — matches the Springs feel. Curve is a
 * cubic ease-out so the rise feels intentional, not linear.
 */
// Container is 1000vh; ~42vh of scroll = 0.042 normalized. Text fully fades
// out before frame 24/240 of the canvas sequence, leaving the rest of the
// canvas clear for the architecture sequence.
const EXIT_BY = 0.042;
const HIDE_BY = 0.06;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function HeroTextOverlay({ containerRef }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const update = () => {
      const container = containerRef.current;
      const wrap = wrapRef.current;
      if (!container || !wrap) {
        rafId = requestAnimationFrame(update);
        return;
      }

      const rect = container.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress =
        scrollable > 0
          ? Math.max(0, Math.min(1, -rect.top / scrollable))
          : 0;

      if (progress >= HIDE_BY) {
        wrap.style.display = "none";
        rafId = requestAnimationFrame(update);
        return;
      }

      wrap.style.display = "";

      const p = Math.min(1, progress / EXIT_BY);
      const eased = easeOut(p);

      // Springs: translateY(0%) → translateY(-50%), opacity 1 → 0.
      wrap.style.transform = `translate3d(0, ${-eased * 50}%, 0)`;
      wrap.style.opacity = String(1 - eased);

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [containerRef]);

  return (
    <div className={styles.overlay} aria-hidden="true">
      <div ref={wrapRef} className={styles.wrap}>
        <span className={styles.eyebrow}>Rawan Emgawer Architects</span>
        <h1 className={`${playfairDisplay.className} ${styles.headline}`}>
          Where Design
          <br />
          Becomes <em>Legacy</em>
        </h1>
        <p className={styles.subline}>
          Architecture, Interiors,
          <br />
          and Large-Scale Environments
          <br />
          Built for Longevity.
        </p>
      </div>
    </div>
  );
}
