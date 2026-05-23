"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { ArrowUp } from "lucide-react";
import { EASE_OUT_STRONG } from "@/lib/easing";

/**
 * Closing brand band — wide horizontal panel (~3.7:1) with a grey text
 * column on the left and an imagery column on the right. The image
 * motion-blurs in proportion to scroll velocity, so as the user scrolls
 * up or down the figure smears and settles when motion stops.
 */
export function ContactCta() {
  const prefersReducedMotion = useReducedMotion();

  // ── Scroll-driven motion blur on the right-hand image ────────────────
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, {
    damping: 50,
    stiffness: 380,
    mass: 0.5,
  });
  // Map |velocity| (px/s) to a blur amount in px. Clamped so fast scrolls
  // don't blow out to absurd values.
  const blurAmount = useTransform(
    smoothVelocity,
    [-2800, -400, 0, 400, 2800],
    [14, 2, 0, 2, 14],
    { clamp: true },
  );
  const filter = useMotionTemplate`blur(${blurAmount}px)`;

  return (
    <section
      aria-label="Practice"
      className="relative w-full overflow-hidden h-[360px] sm:h-[400px] md:h-[460px] lg:h-[520px]"
    >
      <div className="flex h-full w-full">
        {/* ── LEFT — grey text panel ─────────────────────────────────── */}
        <div className="relative shrink-0 w-[48%] md:w-[40%] lg:w-[36%] bg-[var(--color-soft)] flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16">
          <motion.p
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 0.7,
              ease: EASE_OUT_STRONG,
            }}
            className="text-[10px] sm:text-[11px] md:text-xs uppercase tracking-[0.32em] text-[var(--color-mute)]"
          >
            Rawan Emgawer Architects
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: prefersReducedMotion ? 0.35 : 0.9,
              delay: prefersReducedMotion ? 0 : 0.12,
              ease: EASE_OUT_STRONG,
            }}
            className="mt-3 sm:mt-4 md:mt-5 font-display text-xl sm:text-2xl md:text-[32px] lg:text-[40px] leading-[1.15] tracking-tight text-[var(--color-ink)] max-w-[440px]"
          >
            Architecture that becomes legacy.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 0.7,
              delay: prefersReducedMotion ? 0 : 0.24,
              ease: EASE_OUT_STRONG,
            }}
            className="mt-5 sm:mt-7 md:mt-9"
          >
            <Link
              href="/about-global-expertise"
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-ink)]/40 px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 md:py-3.5 text-xs sm:text-sm tracking-wide text-[var(--color-ink)] transition-colors duration-500 ease-[var(--ease-out-strong)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
            >
              Go to Website
            </Link>
          </motion.div>
        </div>

        {/* ── RIGHT — image with scroll-velocity motion blur ─────────── */}
        <div className="relative flex-1 overflow-hidden bg-[var(--color-soft)]">
          <motion.div
            style={prefersReducedMotion ? undefined : { filter }}
            className="absolute inset-0 will-change-[filter]"
          >
            <Image
              src="/new_images/Teams.png"
              alt=""
              fill
              priority={false}
              className="object-cover"
              sizes="(max-width: 768px) 60vw, 64vw"
            />
          </motion.div>

          {/* Scroll-to-top button — bottom-right pill */}
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth",
              })
            }
            aria-label="Scroll to top"
            className="absolute bottom-4 right-4 md:bottom-7 md:right-7 grid place-items-center h-10 w-10 md:h-12 md:w-12 rounded-full border border-[var(--color-gold-warm)] bg-[var(--color-paper)]/85 backdrop-blur-sm text-[var(--color-ink)] transition-colors duration-500 ease-[var(--ease-out-strong)] hover:bg-[var(--color-gold-warm)] hover:text-[var(--color-paper)]"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
