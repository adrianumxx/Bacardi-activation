import { cn } from "@/lib/utils";

const BOLLINO_SRC = "/brand/bacardi-bollino.svg";

const dimMap = { sm: 40, md: 52, lg: 72 } as const;

/**
 * Bollino BACARDÍ (SVG in `public/`, trasparente fuori dal tondo).
 * Usa `<img>` (non `next/image`): gli SVG da `/public` con `Image` in produzione richiedono `dangerouslyAllowSVG` e spesso risultano rotti su Vercel.
 */
export function BacardiMark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const dim = dimMap[size];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- asset SVG locale, caricamento diretto affidabile
    <img
      src={BOLLINO_SRC}
      width={dim}
      height={dim}
      alt=""
      decoding="async"
      className={cn("shrink-0 select-none object-contain", className)}
      aria-hidden
    />
  );
}
