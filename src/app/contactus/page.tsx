import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { CONTACT_COPY } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Whether you're at the beginning of your architectural journey or ready to start construction, we're here to listen and explore possibilities together.",
  alternates: { canonical: "/contactus" },
  keywords: ["contact", "Dubai architect", "Sheffield architect"],
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow={CONTACT_COPY.eyebrow}
        title={CONTACT_COPY.title}
        intro={CONTACT_COPY.intro}
      />
      <ContactForm />
    </>
  );
}
