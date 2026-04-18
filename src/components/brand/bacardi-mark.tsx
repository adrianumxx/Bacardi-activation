import { cn } from "@/lib/utils";

/**
 * Segno stilizzato ispirato al tondo BACARDÍ (anelli bianco / nero / bianco attorno al rosso primario).
 * Non riproduce il pipistrello ufficiale — per asset marchio usare il DAM / brand center.
 */
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
      {/* Anelli concentrici: bianco → nero → bianco (sopra fondo scuro si legge il bordo esterno chiaro) */}
      <circle cx="50" cy="50" r="49.2" fill="#ffffff" />
      <circle cx="50" cy="50" r="47.4" fill="#0a0a0a" />
      <circle cx="50" cy="50" r="45.6" fill="#ffffff" />
      <circle cx="50" cy="50" r="43.4" fill="var(--bacardi-red, #d91e27)" />
      <text
        x="50"
        y="57"
        textAnchor="middle"
        fontSize="34"
        fontWeight="900"
        fontFamily="var(--font-brand-display), system-ui, sans-serif"
        fill="#0a0a0a"
        letterSpacing="-0.06em"
      >
        B
      </text>
    </svg>
  );
}
