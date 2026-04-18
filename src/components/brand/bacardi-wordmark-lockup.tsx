import { cn } from "@/lib/utils";

/** Wordmark tipografico BACARDÍ + ® (stile lockup consumer, carbone su nero + alone leggibilità). */
export function BacardiWordmarkLockup({ text, className }: { text: string; className?: string }) {
  return (
    <span
      className={cn(
        "font-display font-extrabold uppercase tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] transition-[filter] duration-200 will-change-[filter] group-hover:brightness-110",
        className,
      )}
    >
      {text}
      <sup
        className="ml-0.5 align-super text-[0.45em] font-semibold tracking-normal text-white/75 no-underline"
        aria-hidden
      >
        ®
      </sup>
    </span>
  );
}
