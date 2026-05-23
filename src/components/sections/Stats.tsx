import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { STATS, HOME_COPY } from "@/lib/content";

export function Stats() {
  return (
    <section className="relative py-20 md:py-28 bg-[var(--color-ink)] text-[var(--color-paper)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20 items-center">
        <Reveal>
          <p className="text-[17px] md:text-lg leading-relaxed text-white/75 max-w-md">
            {HOME_COPY.aboutBlurb}
          </p>
        </Reveal>

        <StaggerGroup
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          childDelay={0.08}
        >
          {STATS.map((s) => (
            <StaggerItem
              key={s.label}
              className="rounded-2xl border border-white/10 p-6 md:p-7 glass-dark"
            >
              <div className="font-display text-4xl md:text-5xl text-[var(--color-paper)]">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/55">
                {s.label}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
