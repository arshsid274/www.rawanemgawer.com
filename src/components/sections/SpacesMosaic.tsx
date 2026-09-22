"use client";

import Image from "next/image";
import {
  Reveal,
  LinerReveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/elements/SectionEyebrow";

interface Tile {
  label: string;
  caption: string;
  image: string;
  span?: "wide" | "tall";
}

const TILES: Tile[] = [
  {
    label: "Natural Birth Suite",
    caption: "Aviva Hospital — Benghazi",
    image: "/new_images/natural birth area.avif",
    span: "wide",
  },
  {
    label: "Surgery Area",
    caption: "Aviva Hospital — Benghazi",
    image: "/new_images/surgery area render.avif",
  },
  {
    label: "VIP Recovery Room",
    caption: "Aviva Hospital — Benghazi",
    image: "/new_images/VIP recovery room.avif",
  },
  {
    label: "Sky Pool",
    caption: "BNG Hills Villa — Benghazi",
    image: "/new_images/sky pool render.avif",
    span: "tall",
  },
  {
    label: "Living Room",
    caption: "BNG Hills Villa — Benghazi",
    image: "/new_images/living_room.avif",
  },
  {
    label: "Terrace",
    caption: "BNG Hills Villa — Benghazi",
    image: "/new_images/terrace design.avif",
  },
  {
    label: "Conference Room",
    caption: "Oil & Gas Headquarters — Jebal Ali",
    image: "/new_images/conference room 1.avif",
  },
  {
    label: "Meeting Room",
    caption: "Oil & Gas Headquarters — Jebal Ali",
    image: "/new_images/meeting room.avif",
  },
  {
    label: "Departure Hall",
    caption: "Khalifa Airport — Zwatina",
    image: "/new_images/Departure_waiting_Hall.avif",
  },
];

/**
 * SpacesMosaic — interior detail gallery. A loose 3-column grid with two
 * accent tiles (one wide, one tall) for visual rhythm. Each tile fades in
 * with a stagger and lifts gently on hover.
 */
export function SpacesMosaic() {
  return (
    <section className="relative bg-[var(--color-paper)] py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-col gap-5 mb-12 md:mb-16">
          <div className="flex items-center gap-4 w-full max-w-[260px]">
            <Reveal>
              <SectionEyebrow label="Inside the Spaces" />
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
              Crafted interiors, room by room.
            </Reveal>
            <Reveal delay={0.18}>
              <p className="text-[14px] md:text-[15px] leading-[1.6] text-[var(--color-mute)] max-w-sm">
                A glimpse inside selected projects — from medical theatres to
                private terraces, each space shaped with the same standard of
                care.
              </p>
            </Reveal>
          </div>
        </div>

        <StaggerGroup
          className="grid grid-cols-2 md:grid-cols-3 auto-rows-[260px] md:auto-rows-[320px] gap-3 md:gap-5"
          childDelay={0.06}
        >
          {TILES.map((t) => (
            <StaggerItem
              key={t.image}
              className={`group relative overflow-hidden bg-[var(--color-soft)] ${
                t.span === "wide"
                  ? "md:col-span-2"
                  : t.span === "tall"
                    ? "row-span-2"
                    : ""
              }`}
            >
              <Image
                src={t.image}
                alt={t.label}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-[1000ms] ease-[var(--ease-out-strong)] group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-90 transition-opacity duration-500 ease-[var(--ease-out-strong)] group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-[var(--color-paper)]">
                <p className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] font-medium opacity-90">
                  {t.caption}
                </p>
                <p className="mt-1 text-[14px] md:text-base font-display tracking-tight">
                  {t.label}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
