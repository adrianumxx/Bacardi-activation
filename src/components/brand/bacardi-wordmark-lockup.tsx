import { cn } from "@/lib/utils";

/** Wordmark tipografico BACARDÍ + ® (stile lockup consumer, carbone su nero + alone leggibilità). */
export function BacardiWordmarkLockup({ text, className }: { text: string; className?: string }) {
  return (
    <span
      className={cn(
        "bacardi-lockup-wordmark font-display font-extrabold uppercase tracking-tight transition-[filter] duration-200 will-change-[filter] group-hover:brightness-[1.2]",
        className,
      )}
    >
      {text}
      <sup
        className="ml-0.5 align-super text-[0.45em] font-semibold tracking-normal text-neutral-500 no-underline"
        aria-hidden
      >
        ®
      </sup>
    </span>
  );
}
