"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal, LinerReveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/elements/SectionEyebrow";
import { SITE_META } from "@/lib/content";
import { EASE_OUT_STRONG } from "@/lib/easing";
import { MapPin } from "lucide-react";

interface Office {
  city: string;
  country: string;
  region: string;
  role: string;
  coords: string;
}

const OFFICES: Office[] = [
  {
    city: "Sheffield",
    country: "United Kingdom",
    region: "Europe & UK",
    role:
      "Studio HQ — design leadership, technical drawings, and British architectural standards.",
    coords: "53.3811° N · 1.4701° W",
  },
  {
    city: "Dubai",
    country: "United Arab Emirates",
    region: "Gulf & MENA",
    role:
      "Regional base — client engagement, site supervision, and project delivery across the Gulf and North Africa.",
    coords: "25.2048° N · 55.2708° E",
  },
  {
    city: "Qingdao",
    country: "China",
    region: "East Asia",
    role:
      "East Asia liaison — international consultant network, materials sourcing, and cross-cultural project coordination.",
    coords: "36.0671° N · 120.3826° E",
  },
  {
    city: "Benghazi",
    country: "Libya",
    region: "North Africa",
    role:
      "Local delivery — flagship projects across the city and surrounding region, with on-site supervision through to handover.",
    coords: "32.1167° N · 20.0667° E",
  },
  {
    city: "Istanbul",
    country: "Turkey",
    region: "Anatolia & Levant",
    role:
      "Regional gateway — emerging market engagements, partner consultancies, and bridge between European and Gulf practices.",
    coords: "41.0082° N · 28.9784° E",
  },
];

const REGIONS = [
  "United Kingdom",
  "United Arab Emirates",
  "Libya",
  "China",
  "Turkey",
  "Europe",
];

/**
 * AboutGlobalReach — two office cards with city + country + role copy,
 * plus a horizontal regions ticker beneath. Card sequence animates in
 * with a stagger from the left.
 */
export function AboutGlobalReach() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <section className="relative bg-[var(--color-paper)] py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col gap-5 mb-14 md:mb-20">
          <div className="flex items-center gap-4 w-full max-w-[230px]">
            <Reveal>
              <SectionEyebrow label="Global Reach" />
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
              className="font-display font-normal text-[clamp(34px,4.5vw,64px)] leading-[1.04] tracking-[-0.02em] text-[var(--color-ink)] max-w-[760px]"
            >
              Two offices.<br className="hidden md:block" /> One studio voice.
            </Reveal>
            <Reveal delay={0.18}>
              <p className="text-[14px] md:text-[15px] leading-[1.6] text-[var(--color-mute)] max-w-sm">
                Operating from Sheffield and Dubai, the practice delivers
                projects across the Gulf, Europe, and East Asia with a
                consistent design intelligence.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Offices */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {OFFICES.map((office, i) => (
            <motion.article
              key={office.city}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: prefersReducedMotion ? 0.3 : 0.8,
                delay: prefersReducedMotion ? 0 : 0.18 + i * 0.12,
                ease: EASE_OUT_STRONG,
              }}
              className="group relative flex flex-col gap-5 md:gap-7 p-7 md:p-10 border border-[var(--color-ink)]/12 bg-[var(--color-paper-warm)] overflow-hidden"
            >
              {/* Index + pin */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <MapPin
                    size={16}
                    strokeWidth={1.6}
                    className="text-[var(--color-gold-warm)]"
                  />
                  <span className="text-[10px] uppercase tracking-[0.28em] font-medium text-[var(--color-mute)]">
                    {String(i + 1).padStart(2, "0")} / {String(OFFICES.length).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.28em] font-medium text-[var(--color-gold-warm)]">
                  {office.region}
                </span>
              </div>

              {/* City name */}
              <div>
                <h3 className="font-display font-normal text-[clamp(40px,5.5vw,80px)] leading-[0.95] tracking-[-0.025em] text-[var(--color-ink)]">
                  {office.city}
                </h3>
                <p className="mt-2 text-[12px] md:text-sm uppercase tracking-[0.2em] text-[var(--color-mute)]">
                  {office.country}
                </p>
              </div>

              {/* Role */}
              <p className="text-[14px] md:text-[15px] leading-[1.65] text-[var(--color-ink)]/85 max-w-md">
                {office.role}
              </p>

              {/* Coords + accent line on hover */}
              <div className="mt-2 pt-5 border-t border-[var(--color-ink)]/15 flex items-center justify-between text-[11px] md:text-xs text-[var(--color-mute)]">
                <span className="font-display italic tracking-tight">
                  {office.coords}
                </span>
                <span className="uppercase tracking-[0.24em] font-medium">
                  Operational
                </span>
              </div>

              {/* Accent fill that sweeps on hover */}
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px bg-[var(--color-gold-warm)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[var(--ease-out-strong)]"
              />
            </motion.article>
          ))}
        </div>

        {/* Regions ticker */}
        <Reveal delay={0.2}>
          <div className="mt-12 md:mt-16 pt-8 border-t border-[var(--color-ink)]/12 flex flex-wrap items-center gap-x-8 gap-y-3">
            <p className="text-[10px] uppercase tracking-[0.32em] font-medium text-[var(--color-gold-warm)] mr-4">
              Active in
            </p>
            {REGIONS.map((r) => (
              <p
                key={r}
                className="text-[12px] md:text-sm uppercase tracking-[0.18em] text-[var(--color-ink)]/80"
              >
                {r}
              </p>
            ))}
          </div>
        </Reveal>

        {/* Contact strip */}
        <Reveal delay={0.28}>
          <div className="mt-10 md:mt-14 flex flex-col md:flex-row gap-4 md:gap-10 items-start md:items-center">
            <a
              href={`mailto:${SITE_META.email}`}
              className="text-[14px] md:text-base font-display tracking-tight text-[var(--color-ink)] hover:text-[var(--color-gold-warm)] transition-colors duration-500"
            >
              {SITE_META.email}
            </a>
            <span className="hidden md:block h-4 w-px bg-[var(--color-ink)]/25" />
            <a
              href={`tel:${SITE_META.phone.replace(/\s/g, "")}`}
              className="text-[14px] md:text-base font-display tracking-tight text-[var(--color-ink)] hover:text-[var(--color-gold-warm)] transition-colors duration-500"
            >
              {SITE_META.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
