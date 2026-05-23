"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { PROJECTS } from "@/lib/content";
import { EASE_OUT_STRONG, EASE_IN_OUT_STRONG } from "@/lib/easing";

interface Props {
  limit?: number;
}

/**
 * Selected Works — stack-to-fan entry + cursor-driven horizontal scroll.
 *
 * UX behaviours:
 *   1. Decorative concentric circles animate in (opacity + scale).
 *   2. Cards start stacked at the centre of the row, each with a small
 *      random rotation. They unfold by rotating to 0 first, then translating
 *      to their natural positions — staggered outward from the centre.
 *   3. On desktop pointer-fine devices, cursor X drives the track's
 *      translateX via a spring (dead-zone in the middle 20% so the track
 *      doesn't react when the cursor sits idle in the centre).
 *   4. Hovering a card swaps in its title + category as the active heading.
 *   5. Below desktop breakpoint: a regular scroll-snap horizontal row with
 *      arrow buttons and dots.
 */
export function FeaturedProjects({ limit = 6 }: Props) {
  const items = PROJECTS.slice(0, limit);
  const total = items.length;
  const prefersReducedMotion = useReducedMotion() ?? false;

  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Per-card initial translateX — measured from the ghost track so each
  // card knows exactly how far to shift to put its centre at the viewport
  // centre (independent of the row's left-aligned natural layout).
  const [cardOffsets, setCardOffsets] = useState<number[]>([]);
  // Active card index (set by hover; falls back to a "no active" state).
  const [active, setActive] = useState<number | null>(null);
  // Index for the mobile carousel nav.
  const [navIdx, setNavIdx] = useState(0);

  const hasEntered = useInView(sectionRef, { once: true, amount: 0.2 });

  // Cursor-driven track translateX, spring-smoothed.
  const trackX = useSpring(0, { stiffness: 80, damping: 22, mass: 0.6 });

  // Per-card initial rotation — synchronous so it's ready on first render,
  // and framer captures it correctly in the initial snapshot.
  const rotations = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => {
        const dir = (i + Math.floor(i / 2)) % 2 === 0 ? -1 : 1;
        const distFromCenter = Math.abs(i - (total - 1) / 2);
        return dir * (distFromCenter + 1) * 4; // ±4° → ±14°
      }),
    [total],
  );

  // ── Measure per-card offsets from the off-screen ghost track ─────────────
  // Each ghost shares the real track's flex layout, so its offsetLeft within
  // its (absolutely positioned) parent equals the real card's natural x. The
  // viewport centre is `viewportRef.clientWidth / 2`, and the offset we want
  // is `viewportCentre - cardCentre` — the translateX that lifts each card
  // from its natural position to the viewport centre for the stacked pose.
  useLayoutEffect(() => {
    const measure = () => {
      const root = measureRef.current;
      const viewport = viewportRef.current;
      if (!root || !viewport) return;
      const ghosts = root.querySelectorAll<HTMLElement>("[data-ghost]");
      if (ghosts.length < 1) return;
      const viewportCentre = viewport.clientWidth / 2;
      const offsets = Array.from(ghosts).map((g) => {
        const cardCentre = g.offsetLeft + g.offsetWidth / 2;
        return Math.round(viewportCentre - cardCentre);
      });
      setCardOffsets(offsets);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // ── Cursor-driven scroll (desktop only) ──────────────────────────────────
  useEffect(() => {
    if (prefersReducedMotion) return;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    let active = false;

    const recompute = () => {
      active = window.matchMedia("(min-width: 1025px) and (pointer: fine)").matches;
      if (!active) trackX.set(0);
    };
    recompute();
    window.addEventListener("resize", recompute);

    const onMove = (e: PointerEvent) => {
      if (!active || !hasEntered) return;
      const rect = viewport.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const w = rect.width;
      // Tight 10% dead zones at each edge so the row can fully park at left
      // or right; the middle 80% of cursor travel maps to the full scrub.
      const leftEdge = w * 0.1;
      const rightEdge = w * 0.9;
      const trackWidth = track.scrollWidth;
      const maxScroll = Math.max(0, trackWidth - w);

      let pct: number;
      if (x <= leftEdge) pct = 0;
      else if (x >= rightEdge) pct = 1;
      else pct = (x - leftEdge) / (rightEdge - leftEdge);

      // Row is left-aligned at rest: trackX=0 shows the first cards;
      // trackX=-maxScroll shows the last cards.
      trackX.set(-pct * maxScroll);
    };

    const onLeave = () => {
      // Drift back to the starting (left-aligned) position when cursor leaves.
      trackX.set(0);
    };

    viewport.addEventListener("pointermove", onMove);
    viewport.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("resize", recompute);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("pointerleave", onLeave);
    };
  }, [hasEntered, prefersReducedMotion, trackX]);

  // ── Mobile carousel nav (only used on small screens) ─────────────────────
  const goNav = (i: number) => setNavIdx(((i % total) + total) % total);
  const nextNav = () => goNav(navIdx + 1);
  const prevNav = () => goNav(navIdx - 1);

  useEffect(() => {
    if (!hasEntered || cardOffsets.length === 0) return;
    if (window.matchMedia("(min-width: 1025px)").matches) return;
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[navIdx] as HTMLElement | undefined;
    if (!card) return;
    const containerW = track.clientWidth;
    const targetLeft = card.offsetLeft - (containerW - card.clientWidth) / 2;
    track.scrollTo({
      left: targetLeft,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [navIdx, hasEntered, cardOffsets.length, prefersReducedMotion]);

  // Per-card initial X — measured offset that pins each card's centre at the
  // viewport centre regardless of where the row sits in flex layout.
  const initialX = (i: number) =>
    prefersReducedMotion ? 0 : (cardOffsets[i] ?? 0);

  // Per-card ripple stagger for the fly-out (centre cards leave first).
  const rippleDelay = (i: number) => {
    if (prefersReducedMotion) return 0;
    const distFromCenter = Math.abs(i - (total - 1) / 2);
    return 0.08 * distFromCenter;
  };

  // ── Intro phase timing (seconds, from hasEntered) ────────────────────────
  // T_APPEAR : cards fade in (all together, in scattered-stacked pose)
  // T_DWELL  : hold the visible stack so the user can read it
  // T_DEROT  : rotate-to-0 (cards align while still stacked at centre)
  // T_FLYOUT : translate-out + scale-up, staggered as a ripple from centre
  const T_APPEAR_START = 0.15;
  const T_APPEAR_DUR = 0.35;
  const T_DEROT_START = T_APPEAR_START + T_APPEAR_DUR + 0.3; // 0.8s
  const T_DEROT_DUR = 0.5;
  const T_FLYOUT_START = T_DEROT_START + T_DEROT_DUR + 0.05; // 1.35s
  const T_FLYOUT_DUR = 1.0;

  const activeProject = active !== null ? items[active] : null;

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      aria-label="Selected works"
      className="relative bg-[var(--color-paper)] py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      {/* Decorative concentric circles + crosshair lines that fade in first. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={hasEntered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: EASE_OUT_STRONG }}
        className="pointer-events-none absolute inset-0 grid place-items-center -z-0"
      >
        <div className="relative aspect-square w-[120vw] md:w-[90vw] lg:w-[64vw]">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={hasEntered ? { scale: 1, opacity: 1 } : { scale: 0.92, opacity: 0 }}
            transition={{ duration: 1.4, ease: EASE_OUT_STRONG }}
            className="absolute inset-0 rounded-full border border-[var(--color-ink)]/8"
          />
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={hasEntered ? { scale: 1, opacity: 0.7 } : { scale: 0.85, opacity: 0 }}
            transition={{ duration: 1.4, delay: 0.15, ease: EASE_OUT_STRONG }}
            className="absolute inset-[8%] rounded-full border border-dashed border-[var(--color-gold-warm)]/30"
          />
        </div>
      </motion.div>

      {/* Centred header */}
      <div className="relative mx-auto max-w-[1100px] px-6 md:px-10 text-center mb-14 md:mb-20">
        <Reveal>
          <p className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[var(--color-mute)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-ink)]/30" />
            Selected Works
          </p>
        </Reveal>
        <div className="relative mt-5 min-h-[3.5rem] md:min-h-[5rem] lg:min-h-[6rem]">
          <AnimatePresence mode="wait">
            <motion.h2
              key={activeProject?.slug ?? "default"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: EASE_OUT_STRONG }}
              className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-[var(--color-ink)]"
            >
              {activeProject ? activeProject.title : "A curated selection of projects"}
            </motion.h2>
          </AnimatePresence>
        </div>
        <Reveal delay={0.1}>
          <ul className="mt-5 hidden md:flex flex-wrap justify-center gap-x-8 gap-y-2 text-[11px] uppercase tracking-[0.24em]">
            {items.map((p, i) => (
              <li
                key={p.slug}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className={`cursor-default transition-[color,opacity] duration-500 ease-[var(--ease-out-strong)] ${
                  active === i
                    ? "text-[var(--color-gold-warm)] opacity-100"
                    : "text-[var(--color-mute)] opacity-60"
                }`}
              >
                {p.category}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-2xl mx-auto text-[15px] md:text-base leading-relaxed text-[var(--color-mute)]">
            Exploring light, proportion, and the balance between nature and
            structure — across aviation, healthcare, residential, retail, and
            corporate environments.
          </p>
        </Reveal>
      </div>

      {/* Carousel area */}
      <div
        ref={viewportRef}
        className="relative overflow-hidden lg:overflow-visible"
      >
        {/* Edge fades */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-[var(--color-paper)] to-transparent z-10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-[var(--color-paper)] to-transparent z-10"
        />

        {/* Off-screen measurement track (same widths/gaps) */}
        <div
          ref={measureRef}
          aria-hidden
          className="absolute -top-[9999px] left-0 right-0 flex gap-5 md:gap-6 lg:gap-7 px-[10vw] md:px-[12vw] pointer-events-none"
        >
          {items.map((p) => (
            <div
              key={`ghost-${p.slug}`}
              data-ghost
              className="shrink-0 w-[240px] md:w-[320px] lg:w-[380px] aspect-[5/6]"
            />
          ))}
        </div>

        {/* Real track. Desktop: framer-motion x driven by cursor.
            Mobile/tablet: native horizontal scroll-snap. */}
        <motion.div
          ref={trackRef}
          style={{ x: trackX }}
          className="flex gap-5 md:gap-6 lg:gap-7 px-[10vw] md:px-[12vw] pb-10 lg:overflow-visible overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cardOffsets.length > 0 && items.map((p, i) => (
            <motion.article
              key={p.slug}
              data-card-index={i}
              style={{ zIndex: total - i }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setNavIdx(i)}
              initial={{
                x: initialX(i),
                opacity: 0,
                scale: 0.9,
                rotate: rotations[i],
              }}
              animate={
                hasEntered
                  ? { x: 0, opacity: 1, scale: 1, rotate: 0 }
                  : undefined
              }
              transition={{
                // Phase A — appear: cards fade in together while still
                // stacked + tilted at the row centre.
                opacity: {
                  duration: T_APPEAR_DUR,
                  delay: T_APPEAR_START,
                  ease: EASE_OUT_STRONG,
                },
                // Phase B — de-rotate: stack aligns to 0° in place.
                rotate: {
                  duration: T_DEROT_DUR,
                  delay: T_DEROT_START,
                  ease: EASE_IN_OUT_STRONG,
                },
                // Phase C — fly out: translate to natural position + scale
                // up, rippling from the centre outward.
                x: {
                  duration: T_FLYOUT_DUR,
                  delay: T_FLYOUT_START + rippleDelay(i),
                  ease: EASE_IN_OUT_STRONG,
                },
                scale: {
                  duration: T_FLYOUT_DUR,
                  delay: T_FLYOUT_START + rippleDelay(i),
                  ease: EASE_IN_OUT_STRONG,
                },
              }}
              className="snap-center shrink-0 cursor-pointer w-[240px] md:w-[320px] lg:w-[380px] aspect-[5/6] will-change-transform"
            >
              <Link
                href={`/portfolio-architectural-solutions#${p.slug}`}
                className="group relative block h-full w-full overflow-hidden rounded-[3px] bg-[var(--color-soft)] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)] transition-[box-shadow,clip-path] duration-500 ease-[var(--ease-out-strong)] hover:shadow-[0_50px_80px_-30px_rgba(0,0,0,0.45)] [clip-path:inset(20px_0_20px_0)] hover:[clip-path:inset(0_0_0_0)]"
                aria-label={`${p.title} — ${p.location}, ${p.year}`}
              >
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 60vw, 380px"
                  className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-strong)] group-hover:scale-[1.06]"
                  priority={i === 0}
                />
                {/* Dim layer so the white text always reads; deepens on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/20 to-black/55 transition-opacity duration-500 ease-[var(--ease-out-strong)] group-hover:opacity-90" />
                {/* Top-centred title + blurb (blurb reveals on hover) */}
                <div className="absolute inset-x-0 top-0 pt-12 md:pt-14 lg:pt-16 px-6 text-center text-[var(--color-paper)]">
                  <h3 className="font-display text-2xl md:text-[28px] lg:text-[32px] leading-tight drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[12px] md:text-[13px] leading-relaxed opacity-0 translate-y-2 transition-[opacity,transform] duration-500 ease-[var(--ease-out-strong)] group-hover:opacity-90 group-hover:translate-y-0">
                    {p.blurb}
                  </p>
                </div>
                {/* Bottom-centred View More CTA */}
                <div className="absolute inset-x-0 bottom-0 pb-10 md:pb-12 lg:pb-14 px-6 flex justify-center text-[var(--color-paper)]">
                  <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] opacity-90 group-hover:opacity-100 transition-opacity duration-500 ease-[var(--ease-out-strong)]">
                    View More
                    <span className="grid h-7 w-7 place-items-center rounded-full border border-[var(--color-paper)]/60 transition-transform duration-500 ease-[var(--ease-out-strong)] group-hover:translate-x-1">
                      <ArrowUpRight size={12} />
                    </span>
                  </span>
                </div>
                {/* Tiny corner meta */}
                <div className="absolute left-4 top-4 text-[9px] uppercase tracking-[0.24em] text-[var(--color-paper)]/70">
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(total).padStart(2, "0")}
                </div>
                <div className="absolute right-4 top-4 text-[9px] uppercase tracking-[0.24em] text-[var(--color-paper)]/70">
                  {p.category}
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {/* Mobile/tablet nav (hidden on desktop where cursor controls) */}
        <div className="relative z-20 mx-auto max-w-[1100px] px-6 md:px-10 flex items-center justify-between mt-6 md:mt-2 lg:hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous project"
              onClick={prevNav}
              className="grid place-items-center h-12 w-12 rounded-full border border-[var(--color-ink)]/15 text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors duration-500 ease-[var(--ease-out-strong)]"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-display text-sm tabular-nums text-[var(--color-mute)] w-12 text-center">
              {String(navIdx + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
            <button
              type="button"
              aria-label="Next project"
              onClick={nextNav}
              className="grid place-items-center h-12 w-12 rounded-full border border-[var(--color-ink)]/15 text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors duration-500 ease-[var(--ease-out-strong)]"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <Link
            href="/portfolio-architectural-solutions"
            className="inline-flex items-center gap-2 text-sm tracking-wide link-underline pb-1 text-[var(--color-ink)]"
          >
            View all
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Desktop "View all" link */}
        <div className="hidden lg:flex justify-center mt-10">
          <Link
            href="/portfolio-architectural-solutions"
            className="inline-flex items-center gap-2 text-sm tracking-wide link-underline pb-1 text-[var(--color-ink)]"
          >
            View all projects
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Hint for desktop cursor-scroll */}
        <div className="hidden lg:flex justify-center mt-4">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-mute)]/70">
            Move cursor to scroll
          </p>
        </div>
      </div>
    </section>
  );
}
