import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { AboutManifesto } from "@/components/sections/AboutManifesto";
import { AboutStats } from "@/components/sections/AboutStats";
import { AboutFounder } from "@/components/sections/AboutFounder";
import { AboutStory } from "@/components/sections/AboutStory";
import { Missions } from "@/components/sections/Missions";
import { AboutGlobalReach } from "@/components/sections/AboutGlobalReach";
import { SectorsBand } from "@/components/sections/SectorsBand";
import { BuildingBand } from "@/components/sections/BuildingBand";
import { ContactCta } from "@/components/sections/ContactCta";
import { ABOUT_COPY } from "@/lib/content";

export const metadata: Metadata = {
  title: "About — Global Expertise",
  description:
    "Rawan Emgawer delivers bespoke architecture, interiors, and masterplanning defined by clarity, precision, and refined design intelligence.",
  alternates: { canonical: "/about-global-expertise" },
  keywords: [
    "global expertise",
    "design solutions",
    "cultural adaptability",
    "Libya architecture",
  ],
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={ABOUT_COPY.eyebrow}
        title={ABOUT_COPY.title}
        intro={ABOUT_COPY.intro}
      />
      <AboutManifesto />
      <AboutStats />
      <AboutFounder />
      <AboutStory />
      <SectorsBand />
      <Missions />
      <AboutGlobalReach />
      <BuildingBand />
      <ContactCta />
    </>
  );
}
