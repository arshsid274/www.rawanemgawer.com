interface Props {
  label: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionEyebrow({ label, align = "left", className }: Props) {
  return (
    <div
      className={`flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-[var(--color-mute)] ${
        align === "center" ? "justify-center" : ""
      } ${className ?? ""}`}
    >
      <span
        aria-hidden
        className="h-px w-8 bg-[var(--color-mute)]/40"
      />
      <span>{label}</span>
    </div>
  );
}
