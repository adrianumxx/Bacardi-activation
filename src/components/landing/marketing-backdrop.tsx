import { cn } from "@/lib/utils";

type MarketingBackdropProps = {
  /** `landing`: mesh completo; `subtle`: alone leggero per pagine secondarie (es. login). */
  variant?: "landing" | "subtle";
  className?: string;
};

export function MarketingBackdrop({ variant = "landing", className }: MarketingBackdropProps) {
  if (variant === "subtle") {
    return (
      <>
        <div
          className={cn(
            "pointer-events-none fixed inset-0 -z-10 motion-safe:animate-landing-fade opacity-100 motion-safe:opacity-0",
            className,
          )}
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(85%_50%_at_50%_-20%,rgba(215,25,32,0.22),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(215,25,32,0.06)_100%)]" />
        </div>
        <div
          className="pointer-events-none fixed inset-0 -z-10 bg-landing-noise opacity-[0.04] mix-blend-soft-light"
          aria-hidden
        />
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          "pointer-events-none fixed inset-0 -z-10 opacity-100 motion-safe:animate-landing-fade motion-safe:opacity-0",
          className,
        )}
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_10%_-10%,rgba(215,25,32,0.35),transparent_52%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_55%_at_95%_15%,rgba(215,25,32,0.18),transparent_48%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(168deg,rgba(0,0,0,0)_35%,rgba(215,25,32,0.08)_100%)]" />
      </div>
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-landing-noise opacity-[0.055] mix-blend-soft-light"
        aria-hidden
      />
    </>
  );
}
