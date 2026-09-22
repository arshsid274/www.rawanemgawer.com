"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionTemplate,
  cubicBezier,
  type MotionValue,
} from "framer-motion";
import HeroTextOverlay from "./HeroTextOverlay";

/**
 * Single sticky scroll experience: canvas frame sequence → slider phase.
 *
 * Layout: a 1000vh outer container with a 100vh sticky inner stage. As the
 * user scrolls 0 → 1 across the outer container:
 *
 *   0      → 0.60   CANVAS  240 webp frames play through. HeroTextOverlay
 *                            (giant "Where Design / Becomes Legacy") rises
 *                            and fades out over the first ~4% of scroll.
 *
 *   0.60   → 0.72   ENTRY    Canvas freezes on frame 240 (last). Dark left
 *                            panel slides in from -100%X with a focus-pulling
 *                            blur. Right half stays exposed showing the canvas.
 *
 *   0.72   → 0.81   HANDOFF  Slide 0's right photo crossfades over the canvas
 *                            frame (with a subtle blur peak masking the swap).
 *                            Slide 0 text rises into the dark panel.
 *
 *   0.81 → 1.0      CYCLE    Slides 1 → 2 → 3 crossfade through text + photos
 *                            with subtle Ken-Burns scale. Indicator dots match.
 *
 * The canvas render loop diffs frame index — no redundant redraws after the
 * canvas phase ends. All motion uses hardware-accelerated transform/filter
 * strings (Emil: framer-motion x/y shorthand isn't HW-accelerated; full
 * transform strings stay smooth even with the preloader on the main thread).
 */

// ── Phase boundaries on global scroll progress [0, 1] ───────────────────────
const CANVAS_END = 0.6;
const SLIDE_COUNT = 3;
// Local progress within the slider phase (scroll 0.6 → 1.0):
const ENTRY_END_LOCAL = 0.12;
const CYCLE_LEN_LOCAL = (1 - ENTRY_END_LOCAL) / SLIDE_COUNT;
// Half-width of a slide-to-slide crossfade window, in slider-local units.
// The full crossfade is 2 × FADE_HALF and is centered on each slide boundary,
// so slide N fades 1 → 0 while slide N+1 fades 0 → 1 across the same window.
const FADE_HALF = CYCLE_LEN_LOCAL * 0.18;

const easeOut = cubicBezier(0.23, 1, 0.32, 1);
const linear = (t: number) => t;

interface Slide {
  eyebrow: string;
  heading: string;
  body: string;
  leftImage: string;
  leftAlt: string;
  rightImage: string;
  rightAlt: string;
}

const SLIDES: Slide[] = [
  {
    eyebrow: "01 — Sanctuary",
    heading: "Open the doors and step into spaces shaped for stillness.",
    body: "Healthcare environments where light, proportion, and circulation work together — places that calm before they care.",
    leftImage: "/images/aviva-hospital-day.avif",
    leftAlt: "Aviva Hospital — daylight elevation",
    rightImage: "/images/aviva-hospital-perimeter.jpeg",
    rightAlt: "Aviva Hospital — perimeter at dusk",
  },
  {
    eyebrow: "02 — Commerce",
    heading: "Buildings that hold a brand without ever needing to shout.",
    body: "Headquarters, retail, and hospitality designed at the scale of a person — confident, considered, quietly luxurious.",
    leftImage: "/images/pathos-gold-boutique.avif",
    leftAlt: "Pathos Gold Boutique interior",
    rightImage: "/images/oil-gas-headquarters.avif",
    rightAlt: "Oil & Gas Headquarters facade",
  },
  {
    eyebrow: "03 — Home",
    heading: "A villa is the slowest building you will ever live in.",
    body: "Residences shaped around how you actually live — long sightlines, generous thresholds, materials that age into themselves.",
    leftImage: "/images/bng-hills-villa-02.avif",
    leftAlt: "BNG Hills Villa interior",
    rightImage: "/images/bng-hills-villa-01.avif",
    rightAlt: "BNG Hills Villa elevation",
  },
];

export default function AircraftScroll() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;

  // ── Scroll-driven video scrubbing. Replaces the old 230-frame canvas
  // sequence: the browser now decodes on demand instead of us holding 230
  // decoded 1920x1080 bitmaps resident, and the payload drops ~88%.
  //
  // The video is never played, only seeked. It is muted + playsInline so iOS
  // permits programmatic seeking without a user gesture, and it is encoded
  // with a keyframe every 10 frames so each seek lands cheaply.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationId: number;
    let lastTarget = -1;
    let duration = 0;

    const onMeta = () => {
      duration = video.duration || 0;
    };
    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) onMeta();

    // Some browsers will not decode or seek until the element is kicked once.
    // play() returns undefined on older engines, so guard before chaining.
    const kick = video.play();
    if (kick && typeof kick.then === "function") {
      kick.then(() => video.pause()).catch(() => {});
    }

    const render = () => {
      const container = containerRef.current;
      if (!container || duration <= 0) {
        animationId = requestAnimationFrame(render);
        return;
      }

      const rect = container.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const scrollProgress =
        scrollable > 0 ? Math.max(0, Math.min(1, -rect.top / scrollable)) : 0;

      // Clamp at CANVAS_END so the video holds its last frame for the whole
      // slider phase - same behaviour as the old canvas freeze.
      const canvasProgress = Math.min(1, scrollProgress / CANVAS_END);
      const target = canvasProgress * duration;

      // Only seek on a meaningful delta. Rewriting currentTime every frame
      // starves the decoder and shows up as judder.
      if (Math.abs(target - lastTarget) > 1 / 60 && !video.seeking) {
        video.currentTime = target;
        lastTarget = target;
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // ── Scroll progress for the slider overlay. Goes 0 → 1 over the slider
  // phase (scroll progress 0.6 → 1.0); clamped before/after.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const sliderProgress = useTransform(
    scrollYProgress,
    [CANVAS_END, 1],
    [0, 1],
  );

  // Entry: dark panel slides in.
  const entryX = useTransform(
    sliderProgress,
    [0, ENTRY_END_LOCAL],
    prefersReducedMotion ? ["0%", "0%"] : ["-100%", "0%"],
    { ease: easeOut },
  );
  const entryBlur = useTransform(
    sliderProgress,
    [0, ENTRY_END_LOCAL],
    prefersReducedMotion ? [0, 0] : [10, 0],
    { ease: easeOut },
  );
  const entryOpacity = useTransform(
    sliderProgress,
    [0, ENTRY_END_LOCAL * 0.4, ENTRY_END_LOCAL],
    [0, 0.85, 1],
    { ease: easeOut },
  );
  const entryTransform = useMotionTemplate`translateX(${entryX})`;
  const entryFilter = useMotionTemplate`blur(${entryBlur}px)`;

  // Slide 0 right photo: starts at 0 (canvas is showing the last frame) and
  // crossfades in at the front of slide 0's window. Then fades out via a
  // shared window with slide 1's fade-in so the total opacity stays ≈ 1
  // throughout the transition (no double-bright moment).
  const handoffMid = ENTRY_END_LOCAL + CYCLE_LEN_LOCAL * 0.25;
  const handoffEnd = ENTRY_END_LOCAL + CYCLE_LEN_LOCAL * 0.5;
  // End of slide 0's slot = boundary with slide 1.
  const boundary01 = ENTRY_END_LOCAL + CYCLE_LEN_LOCAL;
  const rightO0 = useTransform(
    sliderProgress,
    [
      0,
      ENTRY_END_LOCAL,
      handoffEnd,
      boundary01 - FADE_HALF,
      boundary01 + FADE_HALF,
    ],
    [0, 0, 1, 1, 0],
    { ease: [linear, easeOut, linear, easeOut] },
  );
  const handoffBlurPx = useTransform(
    sliderProgress,
    [ENTRY_END_LOCAL, handoffMid, handoffEnd],
    prefersReducedMotion ? [0, 0, 0] : [0, 4, 0],
    { ease: [easeOut, easeOut] },
  );
  const handoffFilter = useMotionTemplate`blur(${handoffBlurPx}px)`;

  const rightO1 = useSlideOpacity(sliderProgress, 1);
  const rightO2 = useSlideOpacity(sliderProgress, 2);
  const rightOpacities = [rightO0, rightO1, rightO2];

  // Left-content opacities (text + inset photo). Slide 0 text rises in
  // alongside the handoff so the dark panel isn't blank during entry, then
  // fades out via the shared boundary window with slide 1.
  const o0 = useTransform(
    sliderProgress,
    [
      ENTRY_END_LOCAL * 0.5,
      ENTRY_END_LOCAL,
      boundary01 - FADE_HALF,
      boundary01 + FADE_HALF,
    ],
    [0, 1, 1, 0],
    { ease: [easeOut, linear, easeOut] },
  );
  const o1 = useSlideOpacity(sliderProgress, 1);
  const o2 = useSlideOpacity(sliderProgress, 2);
  const opacities = [o0, o1, o2];

  const s0 = useSlideScale(sliderProgress, 0, prefersReducedMotion);
  const s1 = useSlideScale(sliderProgress, 1, prefersReducedMotion);
  const s2 = useSlideScale(sliderProgress, 2, prefersReducedMotion);
  const scales = [s0, s1, s2];

  const y0 = useSlideY(sliderProgress, 0, prefersReducedMotion);
  const y1 = useSlideY(sliderProgress, 1, prefersReducedMotion);
  const y2 = useSlideY(sliderProgress, 2, prefersReducedMotion);
  const ys = [y0, y1, y2];

  return (
    <section
      ref={containerRef}
      aria-label="Hero sequence and practice introduction"
      className="relative z-10"
      style={{ height: "1000vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Layer 1: Video — scrubs during CANVAS, holds last frame after.
            object-cover reproduces the old drawImage cover math exactly. */}
        <video
          ref={videoRef}
          aria-label="Architectural design transformation animation"
          className="absolute inset-0 w-full h-full object-cover"
          poster="/video/sequence-1-poster.avif"
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
        >
          <source src="/video/sequence-1.webm" type="video/webm" />
          <source src="/video/sequence-1.mp4" type="video/mp4" />
        </video>

        {/* Layer 2: Hero text overlay — fades up & out early in CANVAS phase */}
        <HeroTextOverlay containerRef={containerRef} />

        {/* Layer 3: Right-side slide photos — render over the canvas during the
            slider phase. Apply the handoff blur to the wrapper so it affects
            slide 0 only (slides 1/2 fade in cleanly after the handoff). */}
        <div className="absolute inset-0 md:left-1/2 pointer-events-none">
          <motion.div
            key="slide-0-right"
            style={{ opacity: rightOpacities[0], filter: handoffFilter }}
            className="absolute inset-0 will-change-[opacity,filter]"
            aria-hidden
          >
            <motion.div
              style={{ scale: scales[0] }}
              className="absolute inset-0"
            >
              <Image
                src={SLIDES[0].rightImage}
                alt={SLIDES[0].rightAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          {SLIDES.slice(1).map((s, idx) => {
            const i = idx + 1;
            return (
              <motion.div
                key={`right-${i}`}
                style={{ opacity: rightOpacities[i] }}
                className="absolute inset-0"
                aria-hidden
              >
                <motion.div
                  style={{ scale: scales[i] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={s.rightImage}
                    alt={s.rightAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>
            );
          })}

          {/* Mobile dim so text reads on top of the photo */}
          <div
            className="absolute inset-0 bg-black/45 md:hidden"
            aria-hidden
          />
        </div>

        {/* Layer 4: Left dark panel — slides in from the left during ENTRY */}
        <motion.div
          style={{
            transform: entryTransform,
            filter: entryFilter,
            opacity: entryOpacity,
          }}
          className="absolute inset-0 md:right-1/2 bg-[#F5F1EA] will-change-[transform,filter,opacity] pointer-events-none"
        >
          <div className="relative w-full h-full flex flex-col justify-end p-8 md:p-14 lg:p-20 text-[var(--color-ink)]">
            {/* Text block — each slide stacks in the same slot */}
            <div className="relative max-w-xl min-h-[260px] md:min-h-[280px] mb-8 md:mb-12">
              {SLIDES.map((s, i) => (
                <motion.div
                  key={`text-${i}`}
                  style={{ opacity: opacities[i], y: ys[i] }}
                  className="absolute inset-0 space-y-4 md:space-y-5"
                  aria-hidden={i === 0 ? undefined : true}
                >
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--color-gold-warm)]">
                    {s.eyebrow}
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] text-[var(--color-ink)]">
                    {s.heading}
                  </h2>
                  <p className="text-[15px] md:text-base leading-relaxed text-[var(--color-mute)] max-w-md">
                    {s.body}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Inset photo (bottom-left), changes with the slide */}
            <div className="relative w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 overflow-hidden rounded-md shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
              {SLIDES.map((s, i) => (
                <motion.div
                  key={`left-${i}`}
                  style={{ opacity: opacities[i] }}
                  className="absolute inset-0"
                  aria-hidden={i === 0 ? undefined : true}
                >
                  <motion.div
                    style={{ scale: scales[i] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={s.leftImage}
                      alt={s.leftAlt}
                      fill
                      sizes="(max-width: 768px) 160px, 256px"
                      className="object-cover"
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Layer 5: Slide indicators (top-right) */}
        <div className="absolute top-6 right-6 md:top-10 md:right-10 z-10 flex flex-col gap-2 pointer-events-none">
          {SLIDES.map((_, i) => (
            <motion.span
              key={`dot-${i}`}
              style={{ opacity: opacities[i] }}
              className="block h-px w-10 bg-[var(--color-paper)]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- transform helpers (operate on sliderProgress 0..1) ----------
//
// Crossfade design: every slide-to-slide boundary is a single shared window
// of total width 2 * FADE_HALF, centered on the boundary. Slide N's fade-out
// and slide N+1's fade-in inhabit the SAME window — at the midpoint both are
// at 50% opacity, so total visible "ink" stays ≈ 1 and you never see two
// fully-rendered slides at once.

function useSlideOpacity(progress: MotionValue<number>, i: number) {
  const start = ENTRY_END_LOCAL + i * CYCLE_LEN_LOCAL;
  const end = start + CYCLE_LEN_LOCAL;
  // Stable zone is [start + FADE_HALF, end - FADE_HALF]. Fade-in & fade-out
  // windows extend FADE_HALF on each side of those points (i.e. each crossfade
  // straddles a slide boundary).
  const fadeInStart = start - FADE_HALF;
  const fadeInEnd = start + FADE_HALF;
  const fadeOutStart = end - FADE_HALF;
  const fadeOutEnd = end + FADE_HALF;
  // Last slide doesn't fade out — it stays visible until the container exits.
  if (i === SLIDE_COUNT - 1) {
    return useTransform(
      progress,
      [fadeInStart, fadeInEnd, 2, 2],
      [0, 1, 1, 1],
      { ease: [easeOut, linear, linear] },
    );
  }
  return useTransform(
    progress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [0, 1, 1, 0],
    { ease: [easeOut, linear, easeOut] },
  );
}

function useSlideScale(
  progress: MotionValue<number>,
  i: number,
  reduced: boolean,
) {
  const start = ENTRY_END_LOCAL + i * CYCLE_LEN_LOCAL;
  const end = start + CYCLE_LEN_LOCAL;
  const range: [number, number] = reduced ? [1, 1] : [1.06, 1];
  return useTransform(progress, [start, end], range);
}

function useSlideY(
  progress: MotionValue<number>,
  i: number,
  reduced: boolean,
) {
  const start = ENTRY_END_LOCAL + i * CYCLE_LEN_LOCAL;
  const end = start + CYCLE_LEN_LOCAL;
  if (reduced) return useTransform(progress, [0, 1], [0, 0]);
  return useTransform(
    progress,
    [start - FADE_HALF, start + FADE_HALF, end - FADE_HALF, end + FADE_HALF],
    [12, 0, 0, -12],
    { ease: [easeOut, linear, easeOut] },
  );
}
