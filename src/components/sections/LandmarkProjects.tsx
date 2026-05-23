"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal, LinerReveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/elements/SectionEyebrow";
import { PROJECTS } from "@/lib/content";
import { EASE_OUT_STRONG } from "@/lib/easing";

const LANDMARKS = PROJECTS.slice(0, 5);
const AUTOPLAY_MS = 5000;

/**
 * LandmarkProjects — horizontal swiper of REA's signature works. Native
 * scroll-snap + framer-motion entry. Pagination dots + prev/next + autoplay
 * (autoplay pauses while the user is dragging / hovering and resumes after).
 */
export function LandmarkProjects() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = LANDMARKS.length;

  // ── Scroll-driven active index ───────────────────────────────────────
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const center = track.scrollLeft + track.clientWidth / 2;
        let bestIdx = 0;
        let bestDist = Infinity;
        Array.from(track.children).forEach((child, i) => {
          const el = child as HTMLElement;
          const elCenter = el.offsetLeft + el.offsetWidth / 2;
          const dist = Math.abs(center - elCenter);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        });
        setActiveIdx(bestIdx);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // ── Programmatic scroll-to-card ──────────────────────────────────────
  const scrollToIndex = useCallback(
    (i: number, behavior: ScrollBehavior = "smooth") => {
      const track = trackRef.current;
      if (!track) return;
      const card = track.children[i] as HTMLElement | undefined;
      if (!card) return;
      const targetLeft = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
      track.scrollTo({ left: targetLeft, behavior });
    },
    [],
  );

  const goNext = useCallback(() => {
    scrollToIndex((activeIdx + 1) % total);
  }, [activeIdx, total, scrollToIndex]);

  const goPrev = useCallback(() => {
    scrollToIndex((activeIdx - 1 + total) % total);
  }, [activeIdx, total, scrollToIndex]);

  // ── Autoplay (pauses on hover, drag, or reduced motion) ──────────────
  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;
    const id = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [goNext, isPaused, prefersReducedMotion]);

  // ── Card data + animation timing (entry stagger) ─────────────────────
  const cards = useMemo(
    () =>
      LANDMARKS.map((p, i) => ({
        ...p,
        entryDelay: 0.12 + i * 0.08,
      })),
    [],
  );

  return (
    <section
      aria-label="Landmark projects"
      className="relative w-full bg-[var(--color-paper-warm)] py-20 md:py-28 overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 mb-10 md:mb-14">
          <div className="flex items-center gap-4 w-full max-w-[260px]">
            <Reveal>
              <SectionEyebrow label="Landmark Projects" />
            </Reveal>
            <div className="flex-1">
              <LinerReveal
                className="h-px bg-[var(--color-ink)]/25"
                orientation="horizontal"
                delay={0.1}
              />
            </div>
          </div>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="w-full max-w-[760px] overflow-hidden">
              <Reveal
                as="h2"
                delay={0.15}
                className="font-display text-4xl md:text-5xl lg:text-[56px] leading-[1.05] tracking-tight text-[var(--color-ink)]"
              >
                A selection of signature works.
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <p className="text-sm md:text-base text-[var(--color-mute)] max-w-xs">
                Projects that define the practice — built across aviation,
                healthcare, retail, and residence.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ── Slider area: edge-to-edge with side padding for snap centres ── */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onPointerDown={() => setIsPaused(true)}
        onPointerUp={() => setIsPaused(false)}
      >
        <div
          ref={trackRef}
          className="flex gap-5 md:gap-7 lg:gap-9 overflow-x-auto snap-x snap-mandatory scroll-smooth px-[10vw] md:px-[18vw] lg:px-[22vw] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: prefersReducedMotion ? 0.3 : 0.8,
                delay: prefersReducedMotion ? 0 : p.entryDelay,
                ease: EASE_OUT_STRONG,
              }}
              className="group relative snap-center shrink-0 w-[80vw] md:w-[55vw] lg:w-[42vw] aspect-[4/5] overflow-hidden rounded-[3px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]"
              onClick={() => scrollToIndex(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  scrollToIndex(i);
                }
              }}
            >
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 80vw, (max-width: 1024px) 55vw, 42vw"
                priority={i < 2}
                className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-strong)] group-hover:scale-[1.04]"
              />
              {/* Soft gradient for legibility of bottom overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
              {/* Top-left meta */}
              <div className="absolute left-5 top-5 md:left-7 md:top-7 text-[10px] uppercase tracking-[0.28em] text-[var(--color-paper)]/85">
                {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </div>
              {/* Top-right arrow on hover */}
              <div className="absolute right-5 top-5 md:right-7 md:top-7 grid place-items-center h-9 w-9 rounded-full border border-[var(--color-paper)]/60 text-[var(--color-paper)] opacity-0 translate-y-1 transition-all duration-500 ease-[var(--ease-out-strong)] group-hover:opacity-100 group-hover:translate-y-0">
                <ArrowUpRight size={14} />
              </div>
              {/* Bottom overlay */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10 text-[var(--color-paper)]">
                <p className="text-[11px] uppercase tracking-[0.28em] opacity-85 mb-3">
                  {p.category} · {p.year}
                </p>
                <h3 className="font-display text-2xl md:text-3xl lg:text-[40px] leading-[1.05] tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-[12px] md:text-sm opacity-80">{p.location}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Prev / Next arrows (desktop) ─────────────────────────────── */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous landmark"
          className="hidden md:grid absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 place-items-center h-12 w-12 rounded-full border border-[var(--color-ink)]/30 bg-[var(--color-paper)]/85 backdrop-blur-sm text-[var(--color-ink)] transition-colors duration-500 ease-[var(--ease-out-strong)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] z-10"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next landmark"
          className="hidden md:grid absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 place-items-center h-12 w-12 rounded-full border border-[var(--color-ink)]/30 bg-[var(--color-paper)]/85 backdrop-blur-sm text-[var(--color-ink)] transition-colors duration-500 ease-[var(--ease-out-strong)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] z-10"
        >
          <ArrowRight size={16} />
        </button>
      </div>

      {/* ── Pagination dots ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 mt-8 md:mt-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {LANDMARKS.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to ${p.title}`}
              className={`h-1.5 rounded-full transition-all duration-500 ease-[var(--ease-out-strong)] ${
                i === activeIdx
                  ? "w-10 bg-[var(--color-ink)]"
                  : "w-4 bg-[var(--color-ink)]/25 hover:bg-[var(--color-ink)]/50"
              }`}
            />
          ))}
        </div>
        <Link
          href="#magic-carousel"
          className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[var(--color-mute)] hover:text-[var(--color-ink)] transition-colors"
        >
          View all projects
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </section>
  );
}
