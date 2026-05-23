"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal, LinerReveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/elements/SectionEyebrow";
import { PrimaryButton } from "@/components/elements/PrimaryButton";
import { PROCESS } from "@/lib/content";
import { Compass, PenTool, Layers, KeyRound, type LucideIcon } from "lucide-react";
import { EASE_OUT_STRONG } from "@/lib/easing";

const STEP_ICONS: LucideIcon[] = [Compass, PenTool, Layers, KeyRound];

// Per-card sticky offsets that produce the staircase on desktop:
// each successive card starts further down its column, so when the section
// scrolls past, the cards lock at `top:120px` one after the next.
const STAIRCASE_MT = ["lg:mt-0", "lg:mt-[120px]", "lg:mt-[220px]", "lg:mt-[320px]"];

export function Process() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative bg-[var(--color-paper-warm)] pt-24 md:pt-32 pb-12 md:pb-16">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 w-full max-w-[230px]">
            <Reveal>
              <SectionEyebrow label="Our Working Process" />
            </Reveal>
            <div className="flex-1">
              <LinerReveal
                className="h-px bg-[var(--color-ink)]/25"
                orientation="horizontal"
                delay={0.1}
              />
            </div>
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="w-full max-w-[826px] overflow-hidden">
              <Reveal
                as="h2"
                delay={0.15}
                className="font-display text-4xl md:text-5xl lg:text-[64px] leading-[1.05] tracking-tight text-[var(--color-ink)]"
              >
                Where your vision and our expertise come together
              </Reveal>
            </div>
            <Reveal delay={0.2} className="shrink-0">
              <PrimaryButton href="/contactus" label="Start a Conversation" />
            </Reveal>
          </div>
        </div>

        {/* ── Cards: sticky staircase on desktop ─────────────────────────── */}
        {/* IMPORTANT: this wrapper is a plain <div>, not a motion element.
            A motion ancestor can establish a containing block that breaks
            `position: sticky` on the cards. Each card animates itself. */}
        <div className="relative mt-16 md:mt-20">
          {/* Decorative vertical liners (desktop only). 5 bars spaced evenly
              behind the cards; each grows 0%→100% height on entry, staggered. */}
          <div
            aria-hidden
            className="hidden lg:flex absolute inset-0 z-0 justify-between items-stretch pointer-events-none"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <LinerReveal
                key={i}
                className="w-px bg-[var(--color-ink)]/15"
                orientation="vertical"
                delay={0.3 + i * 0.08}
                duration={1.0}
              />
            ))}
          </div>

          {/* Cards grid — plain div so sticky works. Each card is a
              motion.div with whileInView + per-index delay for the stagger. */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:items-start">
            {PROCESS.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? Compass;
              return (
                <motion.div
                  key={step.number}
                  className={`flex flex-col bg-[var(--color-paper)] p-8 lg:max-h-[400px] lg:sticky lg:top-[120px] ${STAIRCASE_MT[i] ?? ""}`}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 28 }
                  }
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                    margin: "0px 0px -10% 0px",
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0.35 : 0.7,
                    delay: prefersReducedMotion ? 0 : 0.1 + i * 0.1,
                    ease: EASE_OUT_STRONG,
                  }}
                >
                  {/* Icon medallion */}
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-[var(--color-gold-warm)]/15 text-[var(--color-gold-warm)]">
                    <Icon size={28} strokeWidth={1.4} />
                  </div>

                  {/* Step number — small label */}
                  <span className="mt-6 text-[11px] uppercase tracking-[0.26em] text-[var(--color-mute)]">
                    Step {step.number}
                  </span>

                  {/* Title — natural spacing below the step label */}
                  <div className="mt-4 mb-4">
                    <h3 className="font-display text-2xl md:text-3xl tracking-tight text-[var(--color-ink)]">
                      {step.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm md:text-[15px] leading-relaxed text-[var(--color-mute)]">
                    {step.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
