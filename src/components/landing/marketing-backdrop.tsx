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
          <div className="absolute inset-0 bg-[radial-gradient(85%_45%_at_50%_-15%,rgba(188,36,50,0.1),transparent_58%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(12,10,9,0.035)_100%)]" />
        </div>
        <div
          className="pointer-events-none fixed inset-0 -z-10 bg-landing-noise opacity-[0.028] mix-blend-multiply"
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
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_-10%,rgba(188,36,50,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_100%_20%,rgba(139,21,48,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(165deg,transparent_40%,rgba(12,10,9,0.04)_100%)]" />
      </div>
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-landing-noise opacity-[0.035] mix-blend-multiply"
        aria-hidden
      />
    </>
  );
}
