import type { Metadata } from "next";
import { playfairDisplay, inter } from "@/lib/fonts";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Navbar } from "@/components/chrome/Navbar";
import { Footer } from "@/components/chrome/Footer";
import { SITE_META } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_META.url),
  title: {
    default: SITE_META.title,
    template: `%s | ${SITE_META.shortName}`,
  },
  description: SITE_META.description,
  keywords: [
    "Rawan Emgawer Architects",
    "REA CO",
    "architecture",
    "interior architecture",
    "masterplanning",
    "Libya architecture",
    "Dubai architecture",
    "residential architecture",
    "commercial architecture",
    "healthcare architecture",
  ],
  authors: [{ name: SITE_META.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_META.url,
    siteName: SITE_META.name,
    title: SITE_META.title,
    description: SITE_META.description,
    images: [{ url: "/logo.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_META.name,
    description: SITE_META.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfairDisplay.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
        <SmoothScroll />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
