import { cn } from "@/lib/utils";

/** Marchio stilizzato (cerchio Bacardi + lettera) — allineato ai colori ufficiali su fondo scuro. */
export function BacardiMark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? 40 : size === "lg" ? 72 : 52;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={dim}
      height={dim}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <circle cx="50" cy="50" r="46" fill="#D71920" />
      <circle cx="50" cy="50" r="41.5" fill="none" stroke="#ffffff" strokeWidth="2.2" />
      <circle cx="50" cy="50" r="48.5" fill="none" stroke="#0a0a0a" strokeWidth="2.8" />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontSize="38"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        fill="#0a0a0a"
        letterSpacing="-0.06em"
      >
        B
      </text>
    </svg>
  );
}
