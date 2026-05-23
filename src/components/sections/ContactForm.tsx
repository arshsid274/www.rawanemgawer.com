"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowRight, Check } from "lucide-react";
import { CONTACT_COPY, SITE_META } from "@/lib/content";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-[var(--color-paper)] py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid gap-14 md:grid-cols-[1.2fr_1fr] md:gap-20">
        <Reveal>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-6 max-w-2xl"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <Field
                label={CONTACT_COPY.formLabels.firstName}
                id="firstName"
                name="firstName"
                required
              />
              <Field
                label={CONTACT_COPY.formLabels.lastName}
                id="lastName"
                name="lastName"
                required
              />
            </div>
            <Field
              label={CONTACT_COPY.formLabels.email}
              id="email"
              name="email"
              type="email"
              required
            />
            <Field
              label={CONTACT_COPY.formLabels.message}
              id="message"
              name="message"
              as="textarea"
              required
            />
            <button
              type="submit"
              disabled={submitted}
              className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] px-6 py-3 text-sm font-medium hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] transition-all duration-500 ease-[var(--ease-out-strong)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>
                {submitted ? "Message sent" : CONTACT_COPY.formLabels.submit}
              </span>
              <span className="grid place-items-center h-7 w-7 rounded-full bg-white/10 group-hover:bg-black/15 transition-colors">
                {submitted ? <Check size={14} /> : <ArrowRight size={14} />}
              </span>
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.05}>
          <aside className="rounded-3xl bg-[var(--color-paper-warm)] border border-[var(--color-ink)]/8 p-8 md:p-10 space-y-8">
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-3">
                Studio
              </h3>
              <p className="font-display text-2xl leading-snug">
                Dubai &amp; Sheffield
              </p>
              <p className="text-sm text-[var(--color-mute)] mt-2">
                Working globally from two offices.
              </p>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-3">
                Direct
              </h3>
              <p className="text-base">
                <a
                  href={`mailto:${SITE_META.email}`}
                  className="link-underline"
                >
                  {SITE_META.email}
                </a>
              </p>
              <p className="text-base mt-2">
                <a
                  href={`tel:${SITE_META.phone.replace(/\s/g, "")}`}
                  className="link-underline"
                >
                  {SITE_META.phone}
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-3">
                Response time
              </h3>
              <p className="text-sm text-[var(--color-mute)]">
                We reply to every inbound enquiry within two working days.
              </p>
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}

interface FieldProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  as?: "input" | "textarea";
  required?: boolean;
}

function Field({
  label,
  id,
  name,
  type = "text",
  as = "input",
  required,
}: FieldProps) {
  const baseClass =
    "w-full bg-transparent border-b border-[var(--color-ink)]/20 py-3 text-[15px] outline-none focus:border-[var(--color-ink)] transition-colors placeholder:text-[var(--color-mute)]/60";

  return (
    <label htmlFor={id} className="block space-y-2">
      <span className="block text-xs uppercase tracking-[0.18em] text-[var(--color-mute)]">
        {label}
      </span>
      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          required={required}
          className={`${baseClass} resize-none`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          className={baseClass}
        />
      )}
    </label>
  );
}
