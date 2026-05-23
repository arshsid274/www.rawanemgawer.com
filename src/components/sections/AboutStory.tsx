"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, LinerReveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/elements/SectionEyebrow";
import { EASE_OUT_STRONG } from "@/lib/easing";

/**
 * AboutStory — "scrolling story + sticky line-art skyline" pattern.
 *
 *   LEFT  = a hand-crafted SVG skyline of 6 building silhouettes drawn
 *           from many thin horizontal stroke lines. As the section enters
 *           the viewport, each line draws itself in (pathLength 0 → 1)
 *           with a left-to-right stagger so the skyline "constructs" from
 *           the leftmost tower to the rightmost. The whole left column is
 *           position: sticky so the skyline stays pinned while the right
 *           column scrolls past.
 *   RIGHT = a long-form narrative scrolling past it.
 */

interface Tower {
  x: number;
  width: number;
  topY: number;
  baseY: number;
  lines: number; // horizontal line count inside
  roof?: "flat" | "triangle";
}

const VIEW_W = 800;
const VIEW_H = 900;

const TOWERS: Tower[] = [
  { x: 40, width: 60, topY: 260, baseY: 870, lines: 30 },
  { x: 115, width: 110, topY: 180, baseY: 870, lines: 38 },
  { x: 250, width: 95, topY: 80, baseY: 870, lines: 48 },
  { x: 370, width: 130, topY: 310, baseY: 870, lines: 26 },
  { x: 525, width: 90, topY: 420, baseY: 870, lines: 22, roof: "triangle" },
  { x: 640, width: 110, topY: 540, baseY: 870, lines: 17 },
];

// Curved landscape baseline at the bottom — a single bezier wave.
const LANDSCAPE_PATH =
  "M 0 870 C 120 866, 260 880, 400 868 S 660 858, 800 880";

const PARAGRAPHS = [
  "Rawan Emgawer Architect operates across architecture, interiors, and large-scale environments. The practice has delivered work spanning aviation, healthcare, government, retail, and bespoke residence — handled at every scale with the same exacting standard of detail.",
  "Similarly, in the field of master-planning and civil scope, the studio brings together a multidisciplinary team and a network of trusted consultants. From perimeter design at flagship healthcare campuses to interior master-planning of national-scale aviation projects, REA has resolved the technical complexity of large works with a clear, considered approach.",
  "Especially through 2024 and 2025, the practice has expanded its presence in the Gulf — completing the Khalifa Airport interior, the Oil & Gas Headquarters in Jebel Ali, and the Aviva Hospital campus in Benghazi. Each is a continuation of the studio's commitment to thoughtful, lasting design.",
  "Leveraging extensive international experience — gained across the Gulf, Europe, and East Asia — the studio collaborates with clients and consultants worldwide to deliver architecture that meets the expectations of culture, climate, and place. British architectural standards underpin a process that adapts cleanly to each region.",
  "From the first conversation to the final handover, the work is shaped by clarity, precision, and care. The studio builds for the long term — for the people who inhabit the spaces, and for the cities and landscapes that hold them.",
];

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;

  // Generate every drawable segment (outline edges + interior lines + roof
  // shapes + landscape curve) with a deterministic order so the stagger
  // walks left-to-right across the skyline.
  type Segment =
    | {
        kind: "line";
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        order: number;
      }
    | {
        kind: "polyline";
        points: string;
        order: number;
      };

  const segments: Segment[] = [];
  let segCount = 0;

  TOWERS.forEach((t) => {
    const towerOrder = t.x; // base order = x position (left-to-right)

    // Outline of each tower
    if (t.roof === "triangle") {
      // Triangular-roof tower outline as a polyline (no fill)
      const apexX = t.x + t.width / 2;
      const apexY = t.topY - 24;
      segments.push({
        kind: "polyline",
        points: `${t.x},${t.baseY} ${t.x},${t.topY} ${apexX},${apexY} ${t.x + t.width},${t.topY} ${t.x + t.width},${t.baseY}`,
        order: towerOrder + segCount++ * 0.001,
      });
    } else {
      // Flat-top rectangle outline as a polyline
      segments.push({
        kind: "polyline",
        points: `${t.x},${t.baseY} ${t.x},${t.topY} ${t.x + t.width},${t.topY} ${t.x + t.width},${t.baseY}`,
        order: towerOrder + segCount++ * 0.001,
      });
    }

    // Interior horizontal lines — denser near the top, sparser near the
    // base, to read like topographic contour lines folded onto a facade.
    const inset = 4;
    const totalH = t.baseY - t.topY;
    for (let i = 0; i < t.lines; i++) {
      // ease the spacing so lines bunch toward the top
      const tnorm = i / Math.max(1, t.lines - 1);
      const eased = Math.pow(tnorm, 1.35);
      const y = t.topY + eased * totalH;
      segments.push({
        kind: "line",
        x1: t.x + inset,
        y1: y,
        x2: t.x + t.width - inset,
        y2: y,
        order: towerOrder + i * 0.5 + segCount++ * 0.001,
      });
    }
  });

  // Sort so the stagger draws left-to-right
  segments.sort((a, b) => a.order - b.order);

  // Total stagger window for the draw-in (in seconds)
  const totalStagger = 1.8;
  const totalDrawDuration = 1.2;

  return (
    <section
      ref={sectionRef}
      aria-label="Story"
      className="relative bg-[var(--color-paper)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col gap-5 mb-14 md:mb-20">
          <div className="flex items-center gap-4 w-full max-w-[260px]">
            <Reveal>
              <SectionEyebrow label="Practice & Portfolio" />
            </Reveal>
            <div className="flex-1">
              <LinerReveal
                className="h-px bg-[var(--color-ink)]/25"
                orientation="horizontal"
                delay={0.1}
              />
            </div>
          </div>
          <Reveal
            as="h2"
            delay={0.12}
            className="font-display font-normal text-[clamp(34px,4.5vw,68px)] leading-[1.04] tracking-[-0.02em] text-[var(--color-ink)] max-w-[820px]"
          >
            We design{" "}
            <span className="italic text-[var(--color-gold-warm)]">
              for the long term
            </span>{" "}
            — across cities, scales, and cultures.
          </Reveal>
        </div>

        {/* Sticky line-art skyline + scrolling story */}
        <div className="grid gap-10 md:gap-16 lg:gap-24 md:grid-cols-[1fr_1.1fr] items-start">
          {/* LEFT — sticky SVG skyline */}
          <div className="md:sticky md:top-24 lg:top-32 self-start">
            <motion.svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              xmlns="http://www.w3.org/2000/svg"
              className="block w-full h-auto text-[var(--color-gold-warm)]"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              {/* All building strokes — each draws in via pathLength 0→1 */}
              {segments.map((seg, i) => {
                // map index to a 0..1 stagger position along the total window
                const t = i / Math.max(1, segments.length - 1);
                const delay = prefersReducedMotion ? 0 : t * totalStagger;
                if (seg.kind === "line") {
                  return (
                    <motion.line
                      key={`seg-${i}`}
                      x1={seg.x1}
                      y1={seg.y1}
                      x2={seg.x2}
                      y2={seg.y2}
                      strokeWidth={0.65}
                      initial={
                        prefersReducedMotion
                          ? { pathLength: 1, opacity: 1 }
                          : { pathLength: 0, opacity: 0 }
                      }
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{
                        pathLength: {
                          duration: prefersReducedMotion ? 0 : totalDrawDuration,
                          delay,
                          ease: EASE_OUT_STRONG,
                        },
                        opacity: {
                          duration: 0.2,
                          delay,
                        },
                      }}
                    />
                  );
                }
                // polyline outline
                return (
                  <motion.polyline
                    key={`seg-${i}`}
                    points={seg.points}
                    strokeWidth={1}
                    initial={
                      prefersReducedMotion
                        ? { pathLength: 1, opacity: 1 }
                        : { pathLength: 0, opacity: 0 }
                    }
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      pathLength: {
                        duration: prefersReducedMotion ? 0 : totalDrawDuration * 1.2,
                        delay,
                        ease: EASE_OUT_STRONG,
                      },
                      opacity: { duration: 0.2, delay },
                    }}
                  />
                );
              })}

              {/* Curved landscape baseline */}
              <motion.path
                d={LANDSCAPE_PATH}
                strokeWidth={0.8}
                initial={
                  prefersReducedMotion
                    ? { pathLength: 1, opacity: 0.7 }
                    : { pathLength: 0, opacity: 0 }
                }
                whileInView={{ pathLength: 1, opacity: 0.7 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  pathLength: {
                    duration: prefersReducedMotion ? 0 : 1.8,
                    delay: prefersReducedMotion ? 0 : totalStagger + 0.1,
                    ease: EASE_OUT_STRONG,
                  },
                  opacity: {
                    duration: 0.4,
                    delay: prefersReducedMotion ? 0 : totalStagger + 0.1,
                  },
                }}
              />
            </motion.svg>

            {/* Tiny pillar labels underneath the skyline */}
            <div className="hidden md:flex mt-8 items-center gap-6 text-[10px] uppercase tracking-[0.28em] font-medium text-[var(--color-mute)]">
              <span className="text-[var(--color-gold-warm)]">Architecture</span>
              <span className="h-3 w-px bg-[var(--color-ink)]/20" />
              <span>Interiors</span>
              <span className="h-3 w-px bg-[var(--color-ink)]/20" />
              <span>Master-planning</span>
            </div>
          </div>

          {/* RIGHT — long-form scrolling narrative */}
          <div className="flex flex-col gap-10 md:gap-14">
            {PARAGRAPHS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: prefersReducedMotion ? 0.3 : 0.8,
                  ease: EASE_OUT_STRONG,
                }}
                className="flex flex-col gap-3 md:gap-4"
              >
                <span className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] font-medium text-[var(--color-gold-warm)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[15px] md:text-[17px] leading-[1.65] tracking-[0.005em] text-[var(--color-ink)]/85">
                  {p}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
