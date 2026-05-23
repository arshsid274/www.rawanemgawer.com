"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE_META } from "@/lib/content";
import { EASE_OUT_STRONG, EASE_DRAWER } from "@/lib/easing";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT_STRONG }}
        className="fixed top-0 inset-x-0 z-50 px-4 pt-4 md:px-8 md:pt-6"
      >
        <div
          className={`mx-auto max-w-[1400px] flex items-center justify-between rounded-full px-4 py-2.5 md:px-6 md:py-3 transition-[background,border,box-shadow] duration-500 ease-[var(--ease-out-strong)] ${
            scrolled
              ? "glass-dark text-[var(--color-paper)] shadow-[0_10px_40px_-20px_rgba(0,0,0,0.4)]"
              : "bg-transparent text-[var(--color-paper)]"
          }`}
        >
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Rawan Emgawer Architects — home"
          >
            <span className="relative h-9 w-9 md:h-10 md:w-10 overflow-hidden rounded-full bg-white/10">
              <Image
                src="/new_images/Logo no bg.png"
                alt=""
                fill
                sizes="40px"
                className="object-contain p-0.5"
                priority
              />
            </span>
            <span className="font-display text-base md:text-lg leading-none tracking-tight">
              Rawan Emgawer
              <span className="block text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-current/70 mt-0.5">
                Architect — REA CO
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm tracking-wide link-underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/contactus"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-[var(--color-paper)] text-[var(--color-ink)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] transition-colors duration-500 ease-[var(--ease-out-strong)]"
          >
            Get in Touch
            <span aria-hidden>→</span>
          </Link>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full glass-dark"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT_STRONG }}
            className="fixed inset-0 z-40 md:hidden bg-[var(--color-ink)]/95 backdrop-blur-xl text-[var(--color-paper)]"
          >
            <motion.nav
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE_DRAWER, delay: 0.05 }}
              className="h-full flex flex-col justify-center px-8 gap-6 pt-20"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-4xl tracking-tight"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-8 pt-6 border-t border-white/15 text-sm text-white/70 space-y-1">
                <p>{SITE_META.email}</p>
                <p>{SITE_META.phone}</p>
                <p>{SITE_META.offices.join(" · ")}</p>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
