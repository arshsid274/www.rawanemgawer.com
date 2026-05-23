"use client";

import Image from "next/image";
import {
  Reveal,
  LinerReveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/elements/SectionEyebrow";

interface Sector {
  label: string;
  image: string;
  blurb: string;
}

const SECTORS: Sector[] = [
  {
    label: "Aviation",
    image: "/new_images/aviation design.png",
    blurb: "Airport interiors and transport-scale environments.",
  },
  {
    label: "Healthcare",
    image: "/new_images/health care design.png",
    blurb: "Hospitals and clinical campuses, patient-first.",
  },
  {
    label: "Commercial",
    image: "/new_images/commercial design.png",
    blurb: "Corporate HQs, retail, and hospitality.",
  },
  {
    label: "Residential",
    image: "/new_images/residential design.png",
    blurb: "Bespoke villas and refined private homes.",
  },
  {
    label: "Educational",
    image: "/new_images/educational design.png",
    blurb: "Schools and learning facilities, future-shaped.",
  },
  {
    label: "Workplace",
    image: "/new_images/work place design.png",
    blurb: "Considered offices and creative studios.",
  },
];

/**
 * SectorsBand — a 6-card grid of REA practice sectors with category
 * illustration on each card. Quiet hover lift + stagger entry.
 */
export function SectorsBand() {
  return (
    <section className="relative bg-[var(--color-paper-warm)] py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-col gap-5 mb-12 md:mb-16">
          <div className="flex items-center gap-4 w-full max-w-[260px]">
            <Reveal>
              <SectionEyebrow label="Sectors" />
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
              className="font-display font-normal text-[clamp(32px,4.2vw,60px)] leading-[1.04] tracking-[-0.02em] text-[var(--color-ink)] max-w-[760px]"
            >
              Six sectors. One design intelligence.
            </Reveal>
            <Reveal delay={0.18}>
              <p className="text-[14px] md:text-[15px] leading-[1.6] text-[var(--color-mute)] max-w-sm">
                From transport to home, the practice carries the same standards
                of clarity and craft across every brief.
              </p>
            </Reveal>
          </div>
        </div>

        <StaggerGroup
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          childDelay={0.08}
        >
          {SECTORS.map((s) => (
            <StaggerItem
              key={s.label}
              className="group relative aspect-[4/5] overflow-hidden bg-[var(--color-paper)] border border-[var(--color-ink)]/8"
            >
              <Image
                src={s.image}
                alt={s.label}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-strong)] group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 text-[var(--color-paper)]">
                <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] font-medium opacity-90">
                  {s.label}
                </p>
                <p className="mt-1.5 text-[13px] md:text-[14px] leading-snug opacity-85 max-w-[18ch]">
                  {s.blurb}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
