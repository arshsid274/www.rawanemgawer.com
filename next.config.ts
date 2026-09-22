import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Source images in public/ are already AVIF. Next's default is
    // formats: ['image/webp'], which re-encodes them to WebP — measurably
    // larger than the AVIF originals (9.49 MB vs 5.41 MB across the same 64
    // files). Listing AVIF first keeps AVIF for browsers that accept it and
    // falls back to WebP for those that don't.
    formats: ["image/avif", "image/webp"],
    // Optimised variants are immutable here (filenames change when art
    // changes), so let the CDN hold them for a month instead of 4 hours.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
