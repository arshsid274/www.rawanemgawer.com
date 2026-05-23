"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, LinerReveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/elements/SectionEyebrow";
import { PrimaryButton } from "@/components/elements/PrimaryButton";
import { TEAM_MEMBERS } from "@/lib/content";
import { EASE_OUT_STRONG } from "@/lib/easing";

const FOUNDER = TEAM_MEMBERS[0];

const BIO_PARAGRAPHS = [
  "Rawan Emgawer founded the practice in pursuit of architecture that is grounded in context — buildings that respond to climate, culture, and the people who inhabit them.",
  "Educated to British architectural standards and informed by work across the Gulf, Europe, and East Asia, her approach favours clarity over spectacle: the right plan, the right material, the right light.",
];

/**
 * AboutFounder — large founder portrait + lead role + bio + signature CTA.
 * Image side scales in with a soft Ken-Burns; the text column does a
 * standard scroll-up reveal.
 */
export function AboutFounder() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <section className="relative bg-[var(--color-paper-warm)] py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-col gap-5 mb-14 md:mb-20">
          <div className="flex items-center gap-4 w-full max-w-[200px]">
            <Reveal>
              <SectionEyebrow label="Founder" />
            </Reveal>
            <div className="flex-1">
              <LinerReveal
                className="h-px bg-[var(--color-ink)]/25"
                orientation="horizontal"
                delay={0.1}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16 lg:gap-24 items-center">
          {/* LEFT — portrait */}
          <motion.div
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.08 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 1.4,
              ease: EASE_OUT_STRONG,
            }}
            className="relative aspect-[4/5] overflow-hidden rounded-[3px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]"
          >
            <Image
              src={FOUNDER.image}
              alt={FOUNDER.name}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
              priority={false}
            />
          </motion.div>

          {/* RIGHT — role, name, bio, CTA */}
          <div className="flex flex-col gap-6 md:gap-8">
            <Reveal>
              <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] font-medium text-[var(--color-gold-warm)]">
                {FOUNDER.role}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="font-display font-normal text-[clamp(40px,5.5vw,84px)] leading-[1.02] tracking-[-0.025em] text-[var(--color-ink)]">
                {FOUNDER.name}
              </h2>
            </Reveal>

            <div className="flex flex-col gap-4 md:gap-5 mt-2 md:mt-4 max-w-2xl">
              {BIO_PARAGRAPHS.map((p, i) => (
                <Reveal key={i} delay={0.16 + i * 0.06}>
                  <p className="text-[14px] md:text-[15px] leading-[1.65] text-[var(--color-ink)]/85">
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.32}>
              <div className="mt-4 md:mt-6 flex items-center gap-6">
                <PrimaryButton
                  href="/our-team-international-experience"
                  label="Meet the team"
                />
                <p className="font-display italic text-[18px] md:text-xl text-[var(--color-ink)]/80">
                  — Rawan
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
