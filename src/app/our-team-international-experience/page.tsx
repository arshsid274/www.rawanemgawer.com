import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { TeamHero } from "@/components/sections/TeamHero";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { ContactCta } from "@/components/sections/ContactCta";
import { TEAM_COPY } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Team — International Experience",
  description:
    "Our team at Rawan Emgawer Architects brings extensive international expertise, delivering innovative design solutions shaped by global experience and collaborative excellence.",
  alternates: { canonical: "/our-team-international-experience" },
  keywords: [
    "international experience",
    "teamwork in design",
    "architecture team",
    "Dubai architects",
  ],
};

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow={TEAM_COPY.eyebrow}
        title={TEAM_COPY.title}
        intro={TEAM_COPY.intro}
      />
      <TeamHero />
      <TeamGrid />
      <ContactCta />
    </>
  );
}
