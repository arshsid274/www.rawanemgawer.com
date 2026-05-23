"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/elements/SectionEyebrow";
import { FAQS } from "@/lib/content";
import { EASE_DRAWER } from "@/lib/easing";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-[var(--color-paper)] py-24 md:py-36">
      <div className="mx-auto max-w-[1100px] px-6 md:px-10">
        <div className="text-center space-y-5 mb-14 md:mb-20">
          <Reveal>
            <SectionEyebrow label="FAQ" align="center" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.05]">
              Answers, before you ask.
            </h2>
          </Reveal>
        </div>

        <ul className="border-t border-[var(--color-ink)]/12">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <li
                key={f.question}
                className="border-b border-[var(--color-ink)]/12"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-6 md:py-7 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-lg md:text-2xl tracking-tight">
                    {f.question}
                  </span>
                  <span
                    className={`grid place-items-center h-10 w-10 rounded-full border border-[var(--color-ink)]/15 transition-all duration-500 ease-[var(--ease-out-strong)] ${
                      isOpen
                        ? "rotate-45 bg-[var(--color-ink)] text-[var(--color-paper)]"
                        : "rotate-0"
                    }`}
                  >
                    <Plus size={16} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE_DRAWER }}
                      className="overflow-hidden"
                    >
                      <p className="pb-7 pr-14 text-[15px] md:text-base leading-relaxed text-[var(--color-mute)] max-w-3xl">
                        {f.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
