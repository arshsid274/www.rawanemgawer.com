"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Reveal,
  LinerReveal,
} from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/elements/SectionEyebrow";
import { EASE_OUT_STRONG } from "@/lib/easing";

/**
 * TeamHero — culture / collaboration band for the Team page.
 *   • Wide cinematic team photo on the left with a soft Ken-Burns scale.
 *   • Vertical "people discussing" photo on the right, smaller.
 *   • A short culture tagline runs above and a quote runs underneath.
 */
export function TeamHero() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <section className="relative bg-[var(--color-paper-warm)] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col gap-5 mb-12 md:mb-16">
          <div className="flex items-center gap-4 w-full max-w-[260px]">
            <Reveal>
              <SectionEyebrow label="Studio Culture" />
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
            <Reveal
              as="h2"
              delay={0.12}
              className="font-display font-normal text-[clamp(32px,4.2vw,60px)] leading-[1.04] tracking-[-0.02em] text-[var(--color-ink)] max-w-[680px]"
            >
              A practice built on conversation, craft, and care.
            </Reveal>
            <Reveal delay={0.18}>
              <p className="text-[14px] md:text-[15px] leading-[1.6] text-[var(--color-mute)] max-w-sm">
                We work in close collaboration — with clients, consultants, and
                each other — so every project carries the same standard from
                brief to handover.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Two-image cinematic band */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-[1.6fr_1fr]">
          {/* LEFT — wide team photo with Ken-Burns */}
          <motion.div
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.06 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 1.4,
              ease: EASE_OUT_STRONG,
            }}
            className="relative aspect-[16/10] md:aspect-[5/4] overflow-hidden bg-[var(--color-soft)]"
          >
            <Image
              src="/new_images/Teams.avif"
              alt="Rawan Emgawer Architect — the studio team"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
              priority={false}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 text-[var(--color-paper)]">
              <p className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] font-medium opacity-90">
                The Studio · Sheffield · Dubai
              </p>
              <p className="mt-2 font-display tracking-tight text-xl md:text-2xl lg:text-[28px] leading-[1.15] max-w-[28ch]">
                Architecture is, above all, a team practice.
              </p>
            </div>
          </motion.div>

          {/* RIGHT — vertical "people discussing" photo */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 0.9,
              delay: prefersReducedMotion ? 0 : 0.15,
              ease: EASE_OUT_STRONG,
            }}
            className="relative aspect-[3/4] md:aspect-auto overflow-hidden bg-[var(--color-soft)]"
          >
            <Image
              src="/new_images/peopel_discussing.avif"
              alt="REA team discussing a project"
              fill
              sizes="(max-width: 768px) 100vw, 38vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 text-[var(--color-paper)]">
              <p className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] font-medium opacity-90">
                In Conversation
              </p>
              <p className="mt-1 text-[13px] md:text-[14px] opacity-85 max-w-[24ch]">
                Every project begins with listening.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Quote underneath */}
        <Reveal delay={0.2}>
          <blockquote className="mt-10 md:mt-14 max-w-3xl">
            <p className="font-display italic text-[clamp(20px,2.2vw,30px)] leading-[1.35] tracking-[-0.005em] text-[var(--color-ink)]/85">
              &ldquo;The right plan, the right material, the right light. The
              rest is patience.&rdquo;
            </p>
            <footer className="mt-4 text-[11px] uppercase tracking-[0.28em] font-medium text-[var(--color-gold-warm)]">
              — Rawan Emgawer, Founder
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
