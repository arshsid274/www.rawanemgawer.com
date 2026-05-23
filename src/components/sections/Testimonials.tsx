"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/elements/SectionEyebrow";
import { TESTIMONIALS } from "@/lib/content";
import { EASE_OUT_STRONG } from "@/lib/easing";

export function Testimonials() {
  const [idx, setIdx] = useState(0);
  const total = TESTIMONIALS.length;
  const current = TESTIMONIALS[idx];
  const sectionRef = useRef<HTMLElement>(null);
  // First testimonial body only mounts once the section is in view, so
  // its fade-up plays when the user actually sees it (not on initial mount).
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });

  const go = (delta: number) =>
    setIdx((prev) => (prev + delta + total) % total);

  return (
    <section
      ref={sectionRef}
      className="bg-[var(--color-ink)] text-[var(--color-paper)] py-24 md:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="space-y-5 mb-12 md:mb-16">
          <Reveal>
            <SectionEyebrow
              label="In their words"
              className="text-white/55 [&>span:first-child]:bg-white/30"
            />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.05] max-w-2xl">
              Trust is built one detail at a time.
            </h2>
          </Reveal>
        </div>

        <div className="relative grid md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-end">
          <div className="min-h-[260px] md:min-h-[220px]">
            <Quote
              size={36}
              className="text-[var(--color-gold)] mb-6"
              aria-hidden
            />
            <AnimatePresence mode="wait">
              {inView && (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.55, ease: EASE_OUT_STRONG }}
                >
                  <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl leading-[1.25] max-w-3xl">
                    &ldquo;{current.quote}&rdquo;
                  </blockquote>
                  <footer className="mt-8 flex items-center gap-3 text-sm">
                    <span className="h-px w-8 bg-white/30" aria-hidden />
                    <span className="text-white/90">{current.author}</span>
                    <span className="text-white/50">·</span>
                    <span className="text-white/60">{current.role}</span>
                  </footer>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => go(-1)}
              className="grid place-items-center h-12 w-12 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-display text-sm tabular-nums text-white/55 w-10 text-center">
              {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => go(1)}
              className="grid place-items-center h-12 w-12 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
