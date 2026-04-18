import { cn } from "@/lib/utils";

const WORDMARK_SRC = "/brand/bacardi-wordmark.svg";

/**
 * Wordmark ufficiale BACARDÍ + ® come SVG in `public/brand/` (bianco su trasparente).
 * Non sostituire con testo generico: coerenza con il marchio e resa identica ovunque.
 */
export function BacardiWordmarkLockup({ text, className }: { text: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG locale, stesso motivo del bollino
    <img
      src={WORDMARK_SRC}
      width={200}
      height={36}
      alt={text}
      decoding="async"
      className={cn(
        "inline-block h-8 w-auto max-w-full origin-left object-contain object-left select-none",
        "motion-safe:transition-[filter] motion-safe:duration-200 motion-safe:group-hover:brightness-110",
        className,
      )}
    />
  );
}
