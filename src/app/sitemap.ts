import type { MetadataRoute } from "next";
import { SITE_META, NAV_LINKS } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return NAV_LINKS.map((link) => ({
    url: `${SITE_META.url}${link.href === "/" ? "" : link.href}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: link.href === "/" ? 1 : 0.8,
  }));
}
