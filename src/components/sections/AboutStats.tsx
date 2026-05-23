"use client";

import { Reveal, LinerReveal, StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { STATS } from "@/lib/content";

/**
 * AboutStats — animated counter band. Numbers spin up from 0 → value on
 * scroll-in, with a stagger across the 4 cells.
 */
export function AboutStats() {
  return (
    <section className="relative bg-[var(--color-ink)] text-[var(--color-paper)] py-24 md:py-32 overflow-hidden">
      {/* Subtle decorative grid lines */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-paper) 1px, transparent 1px), linear-gradient(to bottom, var(--color-paper) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-col gap-5 mb-14 md:mb-20">
          <div className="flex items-center gap-4 w-full max-w-[260px]">
            <Reveal>
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-[var(--color-paper)]/75 font-medium">
                <span
                  aria-hidden
                  className="h-px w-8 bg-[var(--color-paper)]/40"
                />
                <span>By the Numbers</span>
              </div>
            </Reveal>
            <div className="flex-1">
              <LinerReveal
                className="h-px bg-[var(--color-paper)]/30"
                orientation="horizontal"
                delay={0.1}
              />
            </div>
          </div>
          <Reveal
            as="h2"
            delay={0.12}
            className="font-display font-normal text-[clamp(32px,4.2vw,60px)] leading-[1.05] tracking-[-0.02em] max-w-[760px]"
          >
            A practice shaped by years of considered work.
          </Reveal>
        </div>

        <StaggerGroup
          className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-10"
          childDelay={0.12}
        >
          {STATS.map((stat) => (
            <StaggerItem
              key={stat.label}
              className="flex flex-col gap-3 md:gap-4 border-t border-[var(--color-paper)]/20 pt-6 md:pt-8"
            >
              <p className="font-display font-normal text-[clamp(48px,7vw,104px)] leading-[0.9] tracking-[-0.03em]">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  duration={1.6}
                />
              </p>
              <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] font-medium text-[var(--color-paper)]/70">
                {stat.label}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
