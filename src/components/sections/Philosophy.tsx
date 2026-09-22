"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { playfairDisplay } from "@/lib/fonts";
import { HOME_COPY } from "@/lib/content";

/**
 * Philosophy band — full-bleed portrait, revealed via a Springs-style
 * sticky-under-previous overlap (NOT a curtain).
 *
 * Springs implements this with `.sticky--under-previous { margin-top: -100vh; ... }`
 * + a 100vh `::after` spacer that adds the scroll distance back. Here we do
 * the same with concrete CSS: a 200vh outer, a 100vh sticky inner that pins
 * to top:0 during the entire overlap.
 *
 *   • Outer container is 200vh tall, `margin-top: -100vh` → renders at
 *     document position [AircraftScroll.end - 100vh, AircraftScroll.end + 100vh].
 *   • Inner is `position: sticky; top: 0; height: 100vh` → pins to the
 *     viewport top through the entire 100vh sticky range.
 *   • AircraftScroll above has `z-10` so its slider canvas stays on top
 *     during the first half of the overlap. As the user scrolls into the
 *     overlap region, the slider's sticky inner naturally slides up out of
 *     view, revealing this section that was already there underneath.
 *   • No clip-path, no black plate, no curtain. The reveal IS the slider
 *     scrolling away.
 *
 * Cursor effects: golden glow + lagging inner accent (mix-blend-screen),
 * spring-tracked. Photo counter-parallax. Big word tilt.
 */
export function Philosophy() {
  const containerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [pointerActive, setPointerActive] = useState(false);

  // Track the inner (sticky) element so the cursor effects map to the
  // viewport-pinned region, not the 200vh outer.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  // Subtle photo scale 1.06 → 1.00 during the overlap so the photo "breathes"
  // as the slider slides away.
  const photoEntryScale = useTransform(
    scrollYProgress,
    [0.2, 0.7],
    prefersReducedMotion ? [1, 1] : [1.06, 1],
  );

  // ── Pointer-tracked springs (cursor glow + photo parallax + word tilt) ────
  const glowX = useSpring(0, { stiffness: 70, damping: 16, mass: 0.6 });
  const glowY = useSpring(0, { stiffness: 70, damping: 16, mass: 0.6 });
  const trailX = useSpring(0, { stiffness: 35, damping: 20, mass: 1.2 });
  const trailY = useSpring(0, { stiffness: 35, damping: 20, mass: 1.2 });
  const normX = useSpring(0, { stiffness: 50, damping: 18, mass: 0.8 });
  const normY = useSpring(0, { stiffness: 50, damping: 18, mass: 0.8 });

  const bgX = useTransform(normX, [-1, 1], [22, -22]);
  const bgY = useTransform(normY, [-1, 1], [14, -14]);
  const wordTiltX = useTransform(normX, [-1, 1], [-10, 10]);
  const wordTiltY = useTransform(normY, [-1, 1], [-6, 6]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = innerRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      glowX.set(px);
      glowY.set(py);
      trailX.set(px);
      trailY.set(py);
      normX.set((px / rect.width) * 2 - 1);
      normY.set((py / rect.height) * 2 - 1);
      if (!pointerActive) setPointerActive(true);
    };
    const onEnter = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      glowX.jump(e.clientX - rect.left);
      glowY.jump(e.clientY - rect.top);
      trailX.jump(e.clientX - rect.left);
      trailY.jump(e.clientY - rect.top);
    };
    const onLeave = () => {
      const rect = el.getBoundingClientRect();
      glowX.set(rect.width / 2);
      glowY.set(rect.height / 2);
      trailX.set(rect.width / 2);
      trailY.set(rect.height / 2);
      normX.set(0);
      normY.set(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [
    glowX,
    glowY,
    trailX,
    trailY,
    normX,
    normY,
    pointerActive,
    prefersReducedMotion,
  ]);

  return (
    <section
      ref={containerRef}
      id="philosophy"
      aria-label="Practice philosophy"
      className="relative z-0 w-full text-[var(--color-paper)]"
      style={{ height: "200vh", marginTop: "-100vh" }}
    >
      <div
        ref={innerRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {/* Background photo — always rendered. No clip, no black plate. */}
        <motion.div
          style={{
            scale: photoEntryScale,
            x: prefersReducedMotion ? 0 : bgX,
            y: prefersReducedMotion ? 0 : bgY,
          }}
          className="absolute -inset-[3%] will-change-transform"
        >
          <Image
            src="/images/team-rawan-emgawer_Landscape.jpeg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            // No priority: this section sits ~1000vh below the fold behind the
            // hero sequence. priority injected a <link rel="preload"> that
            // competed with the hero's own first paint.
            loading="lazy"
          />
        </motion.div>

        {/* Dark gradient overlays for text legibility */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/40"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/15"
        />

        {/* Cursor glow + lagging inner accent (mix-blend-screen) */}
        <motion.div
          aria-hidden
          style={{
            x: glowX,
            y: glowY,
            opacity: pointerActive ? 1 : 0,
          }}
          className="pointer-events-none absolute top-0 left-0 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-gold)]/25 blur-[100px] transition-opacity duration-700 will-change-transform mix-blend-screen"
        />
        <motion.div
          aria-hidden
          style={{
            x: trailX,
            y: trailY,
            opacity: pointerActive ? 0.9 : 0,
          }}
          className="pointer-events-none absolute top-0 left-0 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-gold)]/20 blur-[60px] transition-opacity duration-700 will-change-transform mix-blend-screen"
        />

        {/* Content */}
        <div className="relative h-full mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14 flex flex-col">
          <div className="pt-32 md:pt-40 lg:pt-44 max-w-[440px]">
            <p className="text-[15px] md:text-base leading-[1.5] text-[var(--color-paper)]/85">
              {HOME_COPY.philosophyShortBody}
            </p>
          </div>

          <div className="flex-1" />

          <div className="pb-10 md:pb-14 lg:pb-20 flex flex-col items-end text-right">
            <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] text-[var(--color-paper)]/80 mb-3 md:mb-5">
              {HOME_COPY.philosophyEyebrow}
            </p>
            <motion.h2
              style={{
                x: prefersReducedMotion ? 0 : wordTiltX,
                y: prefersReducedMotion ? 0 : wordTiltY,
              }}
              className={`${playfairDisplay.className} leading-[0.86] tracking-[-0.02em] text-[var(--color-paper)] will-change-transform`}
            >
              <span
                className="block"
                style={{ fontSize: "clamp(5rem, 18vw, 17rem)" }}
              >
                {HOME_COPY.philosophyWord}
              </span>
            </motion.h2>
          </div>
        </div>
      </div>
    </section>
  );
}
