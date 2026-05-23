import Image from "next/image";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { PROJECTS } from "@/lib/content";

export function ProjectsList() {
  return (
    <section className="bg-[var(--color-paper)] py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 space-y-24 md:space-y-32">
        {PROJECTS.map((p, i) => {
          const reverse = i % 2 === 1;
          return (
            <article
              key={p.slug}
              id={p.slug}
              className={`grid items-center gap-10 md:gap-16 md:grid-cols-2 ${
                reverse ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <Reveal>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[var(--color-soft)]">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 90vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <div className="space-y-6 max-w-xl">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--color-mute)]">
                    <span>{p.category}</span>
                    <span aria-hidden>·</span>
                    <span>{p.year}</span>
                  </div>
                  <h3 className="font-display text-3xl md:text-5xl leading-[1.05]">
                    {p.title}
                  </h3>
                  <p className="text-sm text-[var(--color-mute)]">
                    {p.location}
                  </p>
                  <p className="text-[15px] md:text-base leading-relaxed text-[var(--color-ink)]/80">
                    {p.blurb}
                  </p>
                  <StaggerGroup
                    className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--color-ink)]/10"
                    childDelay={0.05}
                  >
                    <StaggerItem>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-mute)]">
                        Year
                      </p>
                      <p className="font-display text-lg mt-1">{p.year}</p>
                    </StaggerItem>
                    <StaggerItem>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-mute)]">
                        Sector
                      </p>
                      <p className="font-display text-lg mt-1">{p.category}</p>
                    </StaggerItem>
                    <StaggerItem>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-mute)]">
                        Location
                      </p>
                      <p className="font-display text-lg mt-1">
                        {p.location.split(",")[0]}
                      </p>
                    </StaggerItem>
                  </StaggerGroup>
                </div>
              </Reveal>
            </article>
          );
        })}
      </div>
    </section>
  );
}
