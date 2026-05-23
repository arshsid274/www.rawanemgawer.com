"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { EASE_OUT_STRONG } from "@/lib/easing";

type Direction = "up" | "right" | "left";

interface Props {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
  as?: "div" | "section" | "span" | "li" | "h1" | "h2" | "h3" | "p" | "a";
  amount?: number;
  distance?: number;
}

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
  as = "div",
  amount = 0.15,
  distance = 32,
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  const dir = prefersReducedMotion
    ? {}
    : direction === "up"
      ? { y: distance }
      : direction === "right"
        ? { x: -distance }
        : { x: distance };

  const variants: Variants = {
    hidden: { opacity: 0, ...dir },
    visible: { opacity: 1, x: 0, y: 0 },
  };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin: "0px 0px -10% 0px" }}
      variants={variants}
      transition={{
        duration: prefersReducedMotion ? 0.35 : 0.8,
        delay: prefersReducedMotion ? 0 : delay,
        ease: EASE_OUT_STRONG,
      }}
    >
      {children}
    </MotionTag>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  baseDelay?: number;
  childDelay?: number;
  amount?: number;
}

export function StaggerGroup({
  children,
  className,
  baseDelay = 0,
  childDelay = 0.08,
  amount = 0.15,
}: StaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin: "0px 0px -10% 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: prefersReducedMotion ? 0 : baseDelay,
            staggerChildren: prefersReducedMotion ? 0 : childDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "a";
}) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, ...(prefersReducedMotion ? {} : { y: 28 }) },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: prefersReducedMotion ? 0.35 : 0.7,
            ease: EASE_OUT_STRONG,
          },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}

interface LinerProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
  delay?: number;
  duration?: number;
  amount?: number;
}

/**
 * Thin animated bar that grows from 0% → 100% in one axis as it enters view.
 * The element itself IS the line; pass the colour/size via className
 * (`h-px bg-…` for horizontal, `w-px h-full bg-…` for vertical). The
 * `overflow: hidden` on the wrapper ensures the bar reveals cleanly from
 * its origin edge rather than scaling.
 */
export function LinerReveal({
  className,
  orientation = "vertical",
  delay = 0,
  duration = 0.9,
  amount = 0.2,
}: LinerProps) {
  const prefersReducedMotion = useReducedMotion();
  const sizeKey = orientation === "vertical" ? "height" : "width";

  return (
    <motion.div
      aria-hidden
      className={className}
      style={{ overflow: "hidden" }}
      initial={{ [sizeKey]: prefersReducedMotion ? "100%" : "0%" }}
      whileInView={{ [sizeKey]: "100%" }}
      viewport={{ once: true, amount, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: prefersReducedMotion ? 0.3 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: EASE_OUT_STRONG,
      }}
    />
  );
}
