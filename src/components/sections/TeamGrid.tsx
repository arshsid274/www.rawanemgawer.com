import Image from "next/image";
import { StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { TEAM_MEMBERS } from "@/lib/content";

export function TeamGrid() {
  return (
    <section className="bg-[var(--color-paper)] py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <StaggerGroup
          className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4"
          childDelay={0.05}
        >
          {TEAM_MEMBERS.map((m) => (
            <StaggerItem key={`${m.name}-${m.role}`} className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--color-soft)]">
                <Image
                  src={m.image}
                  alt={`${m.name}, ${m.role}`}
                  fill
                  sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 24vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-strong)] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="font-display text-xl tracking-tight">{m.name}</h3>
                <p className="text-sm text-[var(--color-mute)]">{m.role}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
