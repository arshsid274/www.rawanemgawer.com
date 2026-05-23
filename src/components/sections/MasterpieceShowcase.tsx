"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useInView,
} from "framer-motion";
import { PROJECTS } from "@/lib/content";
import { EASE_OUT_STRONG } from "@/lib/easing";

/**
 * MasterpieceShowcase — full-viewport landmark project showcase.
 *
 * Layout:
 *   • Full-bleed background photo (changes per slide) with a dark blurred wash
 *   • Top-centred eyebrow + huge Playfair title + subtitle
 *   • Centered featured image "card" (portrait crop) overlaying the bg
 *   • Bottom: a horizontal line, then a left/right grid —
 *       LEFT  = project name + description
 *       RIGHT = "01 / 04" slide index, huge year, category
 *   • Custom pill cursor on hover shows "Prev" / "Next" on left / right half
 *   • Click left half = previous slide, right half = next slide
 *
 * Intro choreography (mirrors the original .intro state):
 *   • Image card translated 100% below its final position
 *   • Cont area (bottom split) clip-path inset(100% 0 0 0)
 *   • Blur on the bg gradient is 0
 *   • Title is offset and faded
 * Then everything settles into the resting state.
 */

const SLIDES = PROJECTS.slice(0, 4).map((p) => ({
  slug: p.slug,
  bg: p.image,
  eyebrow: "Signature Work",
  title: p.title,
  subtitle: p.location,
  name: p.title,
  description: p.blurb,
  year: p.year,
  category: p.category,
}));

export function MasterpieceShowcase() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [activeIdx, setActiveIdx] = useState(0);
  const [intro, setIntro] = useState(true);
  const [cursor, setCursor] = useState<{
    x: number;
    y: number;
    side: "prev" | "next" | null;
  }>({ x: 0, y: 0, side: null });
  const sectionRef = useRef<HTMLElement>(null);
  const total = SLIDES.length;

  // ── Exit intro state when section enters viewport ───────────────────
  // The choreography (image card sliding up, clip-path opening, blur
  // settling, eyebrow + title fading in) only runs once the user has
  // scrolled to the section, so it isn't wasted off-screen.
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (prefersReducedMotion) {
      setIntro(false);
      return;
    }
    if (!inView) return;
    const t = setTimeout(() => setIntro(false), 350);
    return () => clearTimeout(t);
  }, [prefersReducedMotion, inView]);

  // ── Slide navigation ────────────────────────────────────────────────
  const goNext = useCallback(() => {
    setActiveIdx((i) => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setActiveIdx((i) => (i - 1 + total) % total);
  }, [total]);

  // ── Mouse tracking for custom cursor pill ───────────────────────────
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const side: "prev" | "next" = x < rect.width / 2 ? "prev" : "next";
    setCursor({ x, y, side });
  }, []);

  const onPointerLeave = useCallback(() => {
    setCursor((c) => ({ ...c, side: null }));
  }, []);

  const onSectionClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < rect.width / 2) goPrev();
      else goNext();
    },
    [goNext, goPrev],
  );

  const active = SLIDES[activeIdx];

  return (
    <section
      ref={sectionRef}
      aria-label="Masterpieces"
      className="relative w-full h-[100vh] min-h-[680px] overflow-hidden cursor-none flex flex-col"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onSectionClick}
    >
      {/* ── 1. Background images (crossfade on slide change) ─────────── */}
      <div aria-hidden className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.div
            key={active.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3, ease: EASE_OUT_STRONG }}
            className="absolute inset-0"
          >
            <Image
              src={active.bg}
              alt=""
              fill
              priority={activeIdx === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {/* Blurred dark wash overlay — fades up from the intro state */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={
            intro
              ? { opacity: 0, backdropFilter: "blur(0px)" }
              : { opacity: 1, backdropFilter: "blur(5px)" }
          }
          transition={{ duration: 1.0, ease: EASE_OUT_STRONG }}
          className="absolute inset-0 bg-black/45"
          style={{ WebkitBackdropFilter: intro ? "blur(0px)" : "blur(5px)" }}
        />
      </div>

      {/* ── 2. TOP zone — eyebrow + title + location ────────────────── */}
      <header className="relative z-10 pt-28 md:pt-32 lg:pt-36 pb-4 text-center text-[var(--color-paper)] pointer-events-none px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={intro ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT_STRONG, delay: 0.4 }}
          className="text-[10px] md:text-[11px] uppercase tracking-[0.36em] font-medium inline-flex items-center gap-3 text-[var(--color-paper)]/75"
        >
          <span className="h-1 w-1 rounded-full bg-[var(--color-paper)]/40" />
          {active.eyebrow}
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.h2
            key={`title-${active.slug}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: EASE_OUT_STRONG }}
            className="mt-3 md:mt-4 font-display font-normal text-[clamp(28px,4.5vw,72px)] leading-[1.02] tracking-[-0.02em]"
          >
            {active.title}
          </motion.h2>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={`sub-${active.slug}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: 0.5,
              ease: EASE_OUT_STRONG,
              delay: 0.05,
            }}
            className="mt-3 md:mt-4 text-[10px] md:text-[11px] uppercase tracking-[0.32em] text-[var(--color-paper)]/70"
          >
            {active.subtitle}
          </motion.p>
        </AnimatePresence>
      </header>

      {/* ── 3. MIDDLE zone — featured image, true vertical centre ───── */}
      <div className="relative z-10 flex-1 grid place-items-center px-6 py-6 pointer-events-none">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={intro ? { y: 40, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE_OUT_STRONG, delay: 0.2 }}
          className="relative w-[200px] sm:w-[240px] md:w-[300px] lg:w-[340px] aspect-[7/9] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]"
        >
          <AnimatePresence>
            <motion.div
              key={`card-${active.slug}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8, ease: EASE_OUT_STRONG }}
              className="absolute inset-0"
            >
              <Image
                src={active.bg}
                alt={active.title}
                fill
                sizes="(max-width: 768px) 60vw, 340px"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── 4. BOTTOM zone — line, left description, right year ─────── */}
      <motion.footer
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        animate={
          intro
            ? { clipPath: "inset(100% 0 0 0)" }
            : { clipPath: "inset(0% 0 0 0)" }
        }
        transition={{ duration: 1.0, ease: EASE_OUT_STRONG, delay: 0.25 }}
        className="relative z-10 pointer-events-none text-[var(--color-paper)]"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="h-px w-full bg-[var(--color-paper)]/35" />
        </div>

        <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-5 md:pt-7 pb-10 md:pb-14 grid gap-6 md:grid-cols-[1.4fr_1fr] md:gap-12 items-start">
          {/* LEFT — description only (no duplicate title) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`left-${active.slug}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: EASE_OUT_STRONG }}
              className="flex flex-col gap-2 md:gap-3 max-w-2xl"
            >
              <p className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] font-medium text-[var(--color-paper)]/60">
                The Project
              </p>
              <p className="text-[13px] md:text-[14px] leading-[1.65] tracking-[0.005em] text-[var(--color-paper)]/85">
                {active.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* RIGHT — index, year, category */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`right-${active.slug}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: EASE_OUT_STRONG, delay: 0.05 }}
              className="flex items-end justify-between md:justify-end gap-6 md:gap-10"
            >
              <div className="flex flex-col gap-1 md:items-end">
                <p className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] font-medium text-[var(--color-paper)]/60">
                  Slide
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-normal text-[clamp(28px,3vw,42px)] leading-[0.9] tracking-[-0.02em]">
                    {String(activeIdx + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] md:text-xs uppercase tracking-[0.24em] text-[var(--color-paper)]/55 pb-1">
                    / {String(total).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 md:items-end">
                <p className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] font-medium text-[var(--color-paper)]/60">
                  Completed
                </p>
                <p className="font-display font-normal text-[clamp(40px,5vw,72px)] leading-[0.9] tracking-[-0.025em]">
                  {active.year}
                </p>
              </div>

              <div className="flex flex-col gap-1 md:items-end">
                <p className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] font-medium text-[var(--color-paper)]/60">
                  Type
                </p>
                <p className="text-[12px] md:text-sm uppercase tracking-[0.18em] text-[var(--color-paper)]/90 font-medium">
                  {active.category}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.footer>

      {/* ── 5. Custom pill cursor ────────────────────────────────────── */}
      <motion.div
        aria-hidden
        animate={{
          x: cursor.x,
          y: cursor.y,
          opacity: cursor.side ? 1 : 0,
        }}
        transition={{
          x: { duration: 0.15, ease: "easeOut" },
          y: { duration: 0.15, ease: "easeOut" },
          opacity: { duration: 0.2 },
        }}
        className="fixed left-0 top-0 z-50 pointer-events-none flex items-center gap-3 bg-[var(--color-paper)] text-[var(--color-ink)] rounded-full border-2 border-white/40 px-5 h-12 will-change-transform"
        style={{ translate: "-50% -50%" }}
      >
        {cursor.side === "prev" ? (
          <>
            <span
              aria-hidden
              className="inline-block w-2 h-3 -rotate-180"
              style={{
                clipPath: "polygon(0 50%, 100% 0, 100% 100%)",
                background: "currentColor",
              }}
            />
            <span className="text-sm font-medium">Prev</span>
          </>
        ) : (
          <>
            <span className="text-sm font-medium">Next</span>
            <span
              aria-hidden
              className="inline-block w-2 h-3"
              style={{
                clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                background: "currentColor",
              }}
            />
          </>
        )}
      </motion.div>

      {/* ── 6. Pagination dots (bottom-centre, mobile-friendly) ──────── */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-3 md:bottom-5 z-20 flex items-center gap-2.5 pointer-events-auto">
        {SLIDES.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            aria-label={`Go to ${s.title}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveIdx(i);
            }}
            className={`h-1.5 rounded-full transition-all duration-500 ease-[var(--ease-out-strong)] ${
              i === activeIdx
                ? "w-10 bg-[var(--color-paper)]"
                : "w-3 bg-[var(--color-paper)]/40 hover:bg-[var(--color-paper)]/70"
            }`}
            style={{ cursor: "none" }}
          />
        ))}
      </div>

      {/* ── 7. Subtle gradient on top so chrome (header) stays legible ── */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-10"
      />
    </section>
  );
}
