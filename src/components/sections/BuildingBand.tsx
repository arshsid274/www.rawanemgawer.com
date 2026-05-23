import { Reveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/elements/SectionEyebrow";
import { ABOUT_COPY } from "@/lib/content";

export function BuildingBand() {
  return (
    <section className="relative bg-[var(--color-ink)] text-[var(--color-paper)] py-24 md:py-36 overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-[var(--color-gold)]/15 blur-3xl"
      />
      <div className="relative mx-auto max-w-[1100px] px-6 md:px-10 text-center space-y-6">
        <Reveal>
          <SectionEyebrow
            label="Commitment"
            align="center"
            className="text-white/55 [&>span:first-child]:bg-white/30"
          />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-5xl md:text-6xl leading-[1.04]">
            {ABOUT_COPY.buildingHeadline}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-2xl mx-auto text-[17px] md:text-lg leading-relaxed text-white/70">
            {ABOUT_COPY.buildingBody}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
