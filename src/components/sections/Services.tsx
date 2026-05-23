"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { SERVICES, type Service } from "@/lib/content";

// ── Animation — Webflow-style translate + blur + opacity ──────────────────
const fadeUpBlur: Variants = {
  hidden: { y: "3.125rem", filter: "blur(0.4375rem)", opacity: 0 },
  visible: { y: 0, filter: "blur(0px)", opacity: 1 },
};

const easeOutCubic = [0.22, 1, 0.36, 1] as [number, number, number, number];

const makeTransition = (delay: number) => ({
  y: { duration: 0.9, ease: easeOutCubic, delay },
  opacity: { duration: 0.7, ease: "easeOut" as const, delay },
  filter: { duration: 0.7, ease: "easeOut" as const, delay },
});

// ── Tiny SVG icons (geometric primitives) ─────────────────────────────────
function ArrowIcon({ stroke = "var(--color-paper)" }: { stroke?: string }) {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
      <path
        d="M1 8L8 1M8 1H2M8 1V7"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" fill="none" aria-hidden="true">
      <path
        d="M10.5 0L12.55 8.45L21 10.5L12.55 12.55L10.5 21L8.45 12.55L0 10.5L8.45 8.45L10.5 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ── Single service row — hover to reveal description + image + sweep ──────
function ServiceRow({
  service,
  index,
  prefersReducedMotion,
}: {
  service: Service;
  index: number;
  prefersReducedMotion: boolean | null;
}) {
  const delay = index * 0.09;

  return (
    <motion.div
      variants={fadeUpBlur}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={makeTransition(prefersReducedMotion ? 0 : delay)}
      className="group flex flex-col w-full overflow-hidden border-t border-[var(--color-ink)]/12"
    >
      <div className="flex flex-col md:flex-row w-full">
        {/* LEFT — number, label, title, expand-on-hover description + bullets */}
        <Link
          href="#services"
          className="flex flex-col gap-4 flex-1 px-6 py-8 md:px-8 md:py-10 hover:no-underline"
        >
          <div className="flex items-center gap-3">
            <span className="text-[0.8rem] font-light tracking-widest text-[var(--color-mute)]/60">
              {service.number}.
            </span>
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold-warm)]">
              {service.title}
            </span>
          </div>

          <h3 className="font-display text-[1.5rem] md:text-[1.75rem] leading-tight text-[var(--color-ink)] m-0">
            {service.blurb}
          </h3>

          {/* Hidden block — reveals on group-hover */}
          <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-[20rem] group-hover:opacity-100 transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
            <div className="flex flex-col gap-5 pt-1">
              <p className="text-[0.9375rem] leading-relaxed text-[var(--color-mute)] m-0">
                {service.detail}
              </p>
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[var(--color-gold-warm)]" />
                    <span className="text-[0.875rem] text-[var(--color-mute)]">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Link>

        {/* RIGHT — image column, expands on hover */}
        <Link
          href="#services"
          tabIndex={-1}
          aria-hidden="true"
          className="relative flex items-end justify-end w-full md:w-[45%] lg:w-[48%] overflow-hidden max-h-0 group-hover:max-h-[40rem] transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        >
          <div className="relative w-full h-full min-h-[15rem] overflow-hidden scale-105 group-hover:scale-100 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="(max-width: 767px) 100vw, 45vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
          {/* Arrow badge */}
          <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[var(--color-gold-warm)] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
            <ArrowIcon />
          </div>
        </Link>

        {/* Mobile-only arrow */}
        <div className="md:hidden flex items-center justify-end px-6 pb-6">
          <div className="w-8 h-8 rounded-full bg-[var(--color-ink)] flex items-center justify-center">
            <ArrowIcon />
          </div>
        </div>
      </div>

      {/* Bottom fill line — sweeps full-width on hover */}
      <div className="relative h-px w-full bg-[var(--color-ink)]/12 mt-auto">
        <div className="absolute inset-y-0 left-0 w-0 group-hover:w-full bg-[var(--color-gold-warm)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
      </div>
    </motion.div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────
export function Services() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="services"
      className="w-full bg-[var(--color-paper)] py-20 md:py-28"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 lg:px-12">
        <div className="flex flex-col gap-12 md:gap-16">
          {/* Header */}
          <div className="flex flex-col items-center gap-5 text-center">
            <motion.div
              variants={fadeUpBlur}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={makeTransition(prefersReducedMotion ? 0 : 0)}
              className="flex items-center gap-2.5 text-[var(--color-gold-warm)]"
            >
              <span className="w-[18px] h-[18px] shrink-0">
                <StarIcon />
              </span>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase">
                What We Do
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUpBlur}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={makeTransition(prefersReducedMotion ? 0 : 0.09)}
              className="font-display text-[2rem] md:text-[2.75rem] lg:text-[3.25rem] leading-tight text-[var(--color-ink)] max-w-[760px] m-0"
            >
              Four practices, one design intelligence.
            </motion.h2>

            <motion.p
              variants={fadeUpBlur}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={makeTransition(prefersReducedMotion ? 0 : 0.18)}
              className="text-base md:text-lg font-light text-[var(--color-mute)] tracking-wide m-0"
            >
              From concept to completion.{" "}
              <span className="text-[var(--color-gold-warm)] font-medium">
                Shaped by context.
              </span>
            </motion.p>
          </div>

          {/* Rows */}
          <div className="flex flex-col w-full">
            {SERVICES.map((service, i) => (
              <ServiceRow
                key={service.number}
                service={service}
                index={i}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
