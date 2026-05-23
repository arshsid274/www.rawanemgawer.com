"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * SmoothScroll — Lenis-driven inertial wheel scrolling on desktop pointers.
 *
 * Route-change behaviour: Next.js' default scroll-to-top on `<Link>` calls
 * `window.scrollTo(0, 0)`, but Lenis intercepts the wheel and maintains
 * its own virtual scroll offset. That offset isn't reset by Next's
 * navigation, so subsequent pages would mount with Lenis still pointing
 * to the previous page's scroll Y. The `usePathname` watcher below resets
 * both Lenis' virtual offset AND the window scroll on every pathname
 * change, so every new page always starts at the top.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || isTouch) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll to the top on every route change. Run after the new
  // route's components have mounted (useEffect after commit) so the page
  // is already painted at top.
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true, force: true });
    }
    // Belt-and-braces: ensure window scroll is at 0 even on touch /
    // reduced-motion where Lenis isn't running.
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
