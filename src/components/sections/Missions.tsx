import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/elements/SectionEyebrow";
import { MISSIONS, ABOUT_COPY } from "@/lib/content";

export function Missions() {
  return (
    <section className="bg-[var(--color-paper)] py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="max-w-3xl mb-14 md:mb-20 space-y-5">
          <Reveal>
            <SectionEyebrow label="Our mission" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1]">
              {ABOUT_COPY.missionStatement}
            </h2>
          </Reveal>
        </div>

        <StaggerGroup
          className="grid gap-6 md:gap-8 md:grid-cols-2"
          childDelay={0.08}
        >
          {MISSIONS.map((m) => (
            <StaggerItem
              key={m.number}
              className="relative rounded-3xl border border-[var(--color-ink)]/10 bg-[var(--color-paper-warm)] p-8 md:p-10"
            >
              <span className="font-display text-sm text-[var(--color-mute)]">
                {m.number}
              </span>
              <h3 className="font-display text-2xl md:text-3xl tracking-tight mt-8 mb-4">
                {m.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-[var(--color-mute)]">
                {m.body}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
