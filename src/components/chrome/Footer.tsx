import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";
import { NAV_LINKS, SITE_META } from "@/lib/content";

export function Footer() {
  return (
    <footer className="mt-32 bg-[var(--color-ink)] text-[var(--color-paper)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="relative h-11 w-11 overflow-hidden rounded-full bg-white/10">
                <Image
                  src="/new_images/Logo no bg.avif"
                  alt=""
                  fill
                  sizes="44px"
                  className="object-contain p-1"
                />
              </span>
              <span className="font-display text-xl leading-tight">
                Rawan Emgawer
                <span className="block text-[11px] tracking-[0.18em] uppercase text-white/60 mt-0.5">
                  Architect — REA CO
                </span>
              </span>
            </Link>
            <p className="text-white/65 max-w-sm text-[15px] leading-relaxed">
              {SITE_META.footerTagline}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href={SITE_META.social.instagram}
                aria-label="Instagram"
                className="grid place-items-center h-10 w-10 rounded-full border border-white/15 hover:bg-white/10 transition-colors"
              >
                <Instagram size={16} />
              </Link>
              <Link
                href={SITE_META.social.facebook}
                aria-label="Facebook"
                className="grid place-items-center h-10 w-10 rounded-full border border-white/15 hover:bg-white/10 transition-colors"
              >
                <Facebook size={16} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/55 mb-5">
              Navigate
            </h4>
            <ul className="space-y-3 text-[15px]">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/55 mb-5">
              Contact
            </h4>
            <ul className="space-y-3 text-[15px]">
              <li>
                <a href={`mailto:${SITE_META.email}`} className="link-underline">
                  {SITE_META.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE_META.phone.replace(/\s/g, "")}`}
                  className="link-underline"
                >
                  {SITE_META.phone}
                </a>
              </li>
              <li className="text-white/65">{SITE_META.location}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/55 mb-5">
              Offices
            </h4>
            <ul className="space-y-3 text-[15px] text-white/75">
              {SITE_META.offices.map((office) => (
                <li key={office}>{office}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-white/50">{SITE_META.copyright}</p>
          <p className="text-xs text-white/40 tracking-[0.18em] uppercase">
            Where Design Becomes Legacy
          </p>
        </div>
      </div>
    </footer>
  );
}
