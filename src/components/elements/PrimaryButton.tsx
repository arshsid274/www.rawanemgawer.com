import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  href: string;
  label: string;
  variant?: "ink" | "paper";
  className?: string;
}

export function PrimaryButton({
  href,
  label,
  variant = "ink",
  className,
}: Props) {
  const base =
    "group inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-medium transition-all duration-500 ease-[var(--ease-out-strong)]";
  const styles =
    variant === "ink"
      ? "bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)]"
      : "bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)]";

  return (
    <Link href={href} className={`${base} ${styles} ${className ?? ""}`}>
      <span>{label}</span>
      <span className="grid place-items-center h-7 w-7 rounded-full bg-white/10 group-hover:bg-black/15 transition-colors">
        <ArrowRight
          size={14}
          className="transition-transform duration-500 ease-[var(--ease-out-strong)] group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
