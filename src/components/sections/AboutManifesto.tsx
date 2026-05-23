"use client";

import { Reveal, LinerReveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/elements/SectionEyebrow";
import { ABOUT_COPY, HOME_COPY } from "@/lib/content";

/**
 * AboutManifesto — split-layout philosophy band.
 *   LEFT  = eyebrow + horizontal liner + big serif manifesto with one
 *           emphasised word in gold-warm.
 *   RIGHT = lead paragraph + supporting body paragraph.
 */
export function AboutManifesto() {
  return (
    <section className="relative bg-[var(--color-paper)] py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20 lg:gap-28 items-start">
          {/* LEFT — eyebrow + liner + manifesto */}
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex items-center gap-4 w-full max-w-[260px]">
              <Reveal>
                <SectionEyebrow label="Our Manifesto" />
              </Reveal>
              <div className="flex-1">
                <LinerReveal
                  className="h-px bg-[var(--color-ink)]/25"
                  orientation="horizontal"
                  delay={0.1}
                />
              </div>
            </div>

            <Reveal
              as="h2"
              delay={0.15}
              className="font-display font-normal text-[clamp(32px,4.2vw,60px)] leading-[1.08] tracking-[-0.02em] text-[var(--color-ink)]"
            >
              We design spaces that{" "}
              <span className="text-[var(--color-gold-warm)] italic">
                enhance community well-being
              </span>
              {" "}— refined, contextual, and built to last.
            </Reveal>
          </div>

          {/* RIGHT — supporting copy */}
          <div className="flex flex-col gap-6 md:pt-2 lg:pt-3">
            <Reveal delay={0.2}>
              <p className="text-[17px] md:text-lg leading-[1.55] text-[var(--color-ink)]/85">
                {ABOUT_COPY.intro}
              </p>
            </Reveal>
            <Reveal delay={0.28}>
              <p className="text-[14px] md:text-[15px] leading-[1.65] text-[var(--color-mute)]">
                {HOME_COPY.aboutBlurb}
              </p>
            </Reveal>

            {/* Two small inline stats / pillars */}
            <Reveal delay={0.36}>
              <div className="mt-4 grid grid-cols-2 gap-6 pt-6 border-t border-[var(--color-ink)]/12">
                {HOME_COPY.philosophyTags.map((tag) => (
                  <div key={tag.title} className="flex flex-col gap-2">
                    <p className="text-[10px] uppercase tracking-[0.28em] font-medium text-[var(--color-gold-warm)]">
                      {tag.title}
                    </p>
                    <p className="text-[13px] md:text-[14px] leading-[1.55] text-[var(--color-ink)]/85">
                      {tag.body}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
