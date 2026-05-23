import { Reveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/elements/SectionEyebrow";

interface Props {
  eyebrow: string;
  title: string;
  intro?: string;
}

export function PageHero({ eyebrow, title, intro }: Props) {
  return (
    <section className="relative pt-40 md:pt-48 pb-20 md:pb-28 bg-[var(--color-paper)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid gap-10 md:grid-cols-[1fr_1fr] md:gap-20 items-end">
        <div className="space-y-6">
          <Reveal>
            <SectionEyebrow label={eyebrow} />
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.02]">
              {title}
            </h1>
          </Reveal>
        </div>
        {intro && (
          <Reveal delay={0.1}>
            <p className="text-[17px] md:text-lg leading-relaxed text-[var(--color-mute)] max-w-xl md:pb-3">
              {intro}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
