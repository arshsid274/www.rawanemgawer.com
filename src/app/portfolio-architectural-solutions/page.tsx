import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { MasterpieceShowcase } from "@/components/sections/MasterpieceShowcase";
import { MagicCarousel } from "@/components/sections/MagicCarousel";
import { SpacesMosaic } from "@/components/sections/SpacesMosaic";
import { ContactCta } from "@/components/sections/ContactCta";
import { PORTFOLIO_COPY } from "@/lib/content";

export const metadata: Metadata = {
  title: "Portfolio — Architectural Solutions",
  description:
    "A curated selection of projects exploring light, proportion, and the balance between nature and structure.",
  alternates: { canonical: "/portfolio-architectural-solutions" },
  keywords: [
    "architectural solutions",
    "sustainable cities",
    "community well-being",
    "Libya architecture",
    "Dubai architecture",
  ],
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow={PORTFOLIO_COPY.eyebrow}
        title={PORTFOLIO_COPY.title}
        intro={PORTFOLIO_COPY.intro}
      />
      <MasterpieceShowcase />
      <MagicCarousel />
      <SpacesMosaic />
      <ContactCta />
    </>
  );
}
