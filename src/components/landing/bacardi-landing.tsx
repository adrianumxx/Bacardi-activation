import Link from "next/link";
import { ArrowRight, CalendarClock, Grid3X3, LogIn, Sparkles } from "lucide-react";

import { BacardiMark } from "@/components/brand/bacardi-mark";
import { BacardiWordmarkLockup } from "@/components/brand/bacardi-wordmark-lockup";
import { BacardiBrandsSlideshow } from "@/components/landing/bacardi-brands-slideshow";
import { LocaleDashSwitcher } from "@/components/i18n/locale-dash-switcher";
import { MarketingBackdrop } from "@/components/landing/marketing-backdrop";
import { buttonVariants } from "@/components/ui/button";
import type { AppLocale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

type BacardiLandingProps = {
  className?: string;
  isAuthenticated: boolean;
  locale: AppLocale;
  dict: Dictionary;
};

export function BacardiLanding({ className, isAuthenticated, locale, dict }: BacardiLandingProps) {
  const L = dict.landing;
  const homeHref = localePath(locale, "/");
  const catalogHref = localePath(locale, "/activations");
  const loginHref = localePath(locale, "/login");
  const profileHref = localePath(locale, "/portal/profile");
  const configHref = localePath(locale, "/configurazione");

  return (
    <div
      className={cn(
        "relative isolate min-h-dvh overflow-x-hidden bg-background text-foreground",
        className,
      )}
    >
      <MarketingBackdrop variant="landing" />

      <a
        href="#contenuto"
        className={cn(
          "absolute left-4 top-0 z-[100] -translate-y-[120%] rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg",
          "outline-none transition-transform duration-200 ease-out",
          "focus:translate-y-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        {L.skipToContent}
      </a>

      <header className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-4 px-4 py-6 sm:items-center sm:gap-6 sm:px-6 lg:px-8">
        <Link
          href={homeHref}
          className="group flex items-center gap-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={L.brandAria}
        >
          <BacardiMark size="md" className="motion-safe:transition-transform motion-safe:group-hover:scale-[1.03]" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-neutral-300 transition-colors group-hover:text-neutral-100">
              {L.portalEyebrow}
            </span>
            <BacardiWordmarkLockup text={L.brandName} className="h-9 w-auto sm:h-11" />
          </div>
        </Link>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:max-w-[min(100%,28rem)] sm:items-end">
          <LocaleDashSwitcher locale={locale} copy={dict.localeSwitcher} variant="landing" />
          <nav className="flex flex-wrap items-center justify-end gap-2 text-sm" aria-label="Navigazione principale">
          {isAuthenticated ? (
            <Link
              href={catalogHref}
              className={buttonVariants({
                size: "sm",
                className:
                  "min-h-10 gap-1.5 rounded-full px-4 font-semibold text-primary-foreground no-underline shadow-md shadow-primary/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              })}
            >
              {L.navCatalog}
              <ArrowRight className="size-4 opacity-90" aria-hidden />
            </Link>
          ) : (
            <>
              <Link
                href="#come-funziona"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className:
                    "min-h-10 rounded-full text-neutral-300 no-underline hover:bg-white/[0.06] hover:text-neutral-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                })}
              >
                {L.navHow}
              </Link>
              <Link
                href={loginHref}
                className={buttonVariants({
                  size: "sm",
                  className:
                    "min-h-10 rounded-full px-4 font-semibold text-primary-foreground no-underline shadow-md shadow-primary/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                })}
              >
                {L.navLogin}
              </Link>
            </>
          )}
          </nav>
        </div>
      </header>

      <main id="contenuto" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <section
          aria-labelledby="hero-heading"
          className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16 lg:pt-4"
        >
          <div>
            <p
              className={cn(
                "mb-5 inline-flex min-h-10 max-w-full flex-wrap items-center gap-2 rounded-full border border-white/15 bg-card/85 px-3 py-1.5 text-xs font-medium text-neutral-200 shadow-sm backdrop-blur-sm",
                "opacity-100 motion-safe:animate-landing-in motion-safe:opacity-0 motion-safe:[animation-delay:80ms]",
              )}
            >
              <Sparkles className="size-3.5 shrink-0 text-primary" aria-hidden />
              <span>{L.pill}</span>
            </p>
            <h1
              id="hero-heading"
              className={cn(
                "font-display text-balance text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl",
                "opacity-100 motion-safe:animate-landing-in motion-safe:opacity-0 motion-safe:[animation-delay:140ms]",
              )}
            >
              {L.heroLine1}{" "}
              <span className="relative inline-block text-primary sm:whitespace-nowrap">
                <span className="relative z-10">{L.heroHighlight}</span>
                <span
                  className="absolute -inset-x-1 bottom-1 z-0 h-3 skew-x-[-10deg] bg-primary/20 sm:h-3.5"
                  aria-hidden
                />
              </span>
            </h1>
            <p
              className={cn(
                "mt-6 max-w-xl text-pretty text-base leading-relaxed text-neutral-300 sm:text-lg",
                "opacity-100 motion-safe:animate-landing-in motion-safe:opacity-0 motion-safe:[animation-delay:220ms]",
              )}
            >
              {L.heroP}
            </p>
            <div
              className={cn(
                "mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center",
                "opacity-100 motion-safe:animate-landing-in motion-safe:opacity-0 motion-safe:[animation-delay:300ms]",
              )}
            >
              <Link
                href={catalogHref}
                className={buttonVariants({
                  size: "lg",
                  className:
                    "min-h-12 gap-2 rounded-full px-8 text-base font-semibold text-primary-foreground no-underline shadow-lg shadow-primary/35 transition-[transform,box-shadow] hover:shadow-xl hover:shadow-primary/30 motion-safe:active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                })}
              >
                {isAuthenticated ? L.ctaEnterAuthed : L.ctaEnterGuest}
                <ArrowRight className="size-5 opacity-90" aria-hidden />
              </Link>
              {isAuthenticated ? (
                <Link
                  href={profileHref}
                  className={buttonVariants({
                    variant: "secondary",
                    size: "lg",
                    className:
                      "min-h-12 rounded-full border border-white/10 bg-secondary px-7 text-base font-medium text-foreground no-underline transition-[transform,box-shadow] motion-safe:active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  })}
                >
                  {L.ctaProfile}
                </Link>
              ) : (
                <Link
                  href="#come-funziona"
                  className={buttonVariants({
                    variant: "secondary",
                    size: "lg",
                    className:
                      "min-h-12 rounded-full border border-white/10 bg-secondary px-7 text-base font-medium text-foreground no-underline transition-[transform,box-shadow] motion-safe:active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  })}
                >
                  {L.ctaDiscover}
                </Link>
              )}
            </div>
            <dl
              className={cn(
                "mt-14 grid grid-cols-1 gap-6 border-t border-border/70 pt-10 text-sm sm:grid-cols-3 sm:gap-8",
                "opacity-100 motion-safe:animate-landing-in motion-safe:opacity-0 motion-safe:[animation-delay:380ms]",
              )}
            >
              <div className="sm:border-l sm:border-border/60 sm:pl-6 first:sm:border-l-0 first:sm:pl-0">
                <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  {L.statsAccess}
                </dt>
                <dd className="mt-1.5 font-medium leading-snug text-neutral-100">{L.statsAccessVal}</dd>
              </div>
              <div className="sm:border-l sm:border-border/60 sm:pl-6">
                <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  {L.statsReq}
                </dt>
                <dd className="mt-1.5 font-medium leading-snug text-neutral-100">{L.statsReqVal}</dd>
              </div>
              <div className="sm:border-l sm:border-border/60 sm:pl-6">
                <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  {L.statsBook}
                </dt>
                <dd className="mt-1.5 font-medium leading-snug text-neutral-100">{L.statsBookVal}</dd>
              </div>
            </dl>
          </div>

          <div
            className={cn(
              "relative lg:justify-self-end",
              "opacity-100 motion-safe:animate-landing-in motion-safe:opacity-0 motion-safe:[animation-delay:200ms]",
            )}
          >
            <figure
              className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-2xl shadow-primary/10 ring-1 ring-white/10 sm:mx-auto lg:mx-0"
              aria-label={L.previewFigureAria}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-foreground/[0.06]" />
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.12]" aria-hidden>
                <BacardiMark size="lg" className="scale-[2.2] blur-[1px]" />
              </div>
              <div className="absolute left-5 top-5 right-5 rounded-2xl border border-border/60 bg-background/90 p-4 shadow-sm backdrop-blur-md sm:left-6 sm:top-6 sm:right-6 sm:p-5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  {L.previewEyebrow}
                </p>
                <p className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-foreground">
                  {L.previewTitle}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-300">{L.previewDesc}</p>
              </div>
              <div className="absolute bottom-5 left-5 right-5 space-y-3 rounded-2xl border border-border/60 bg-card/95 p-4 shadow-lg backdrop-blur-sm sm:bottom-6 sm:left-6 sm:right-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">{L.previewEligibility}</span>
                  <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {L.previewLive}
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-muted"
                  role="presentation"
                  aria-hidden
                >
                  <div className="h-full w-[72%] rounded-full bg-primary" />
                </div>
                <Link
                  href={catalogHref}
                  className={buttonVariants({
                    size: "default",
                    className:
                      "inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg text-xs font-bold uppercase tracking-wide no-underline",
                  })}
                >
                  {L.previewCta}
                  <ArrowRight className="size-3.5 opacity-90" aria-hidden />
                </Link>
              </div>
            </figure>
            <div
              className="pointer-events-none absolute -right-8 -bottom-6 hidden h-36 w-36 rounded-full border border-dashed border-primary/30 sm:block"
              aria-hidden
            />
          </div>
        </section>

        <BacardiBrandsSlideshow copy={dict.brandShowcase} />

        <section
          id="come-funziona"
          className="mt-24 scroll-mt-28 sm:mt-36"
          aria-labelledby="come-funziona-titolo"
        >
          <div className="max-w-2xl">
            <h2
              id="come-funziona-titolo"
              className="font-display text-3xl font-extrabold uppercase tracking-tight text-balance sm:text-4xl"
            >
              {L.stepsTitle}
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              {L.stepsSubtitle}
            </p>
          </div>
          <ol className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
            <li
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm",
                "transition-[transform,box-shadow,border-color] duration-300 ease-out",
                "motion-safe:hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg",
                "focus-within:ring-2 focus-within:ring-inset focus-within:ring-ring",
                "opacity-100 motion-safe:animate-landing-in motion-safe:opacity-0 motion-safe:[animation-delay:420ms]",
              )}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
              <div className="relative z-10 mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                <Grid3X3 className="size-5" aria-hidden />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {L.step1n}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-tight text-foreground">
                {L.step1t}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{L.step1d}</p>
            </li>
            <li
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm",
                "transition-[transform,box-shadow,border-color] duration-300 ease-out",
                "motion-safe:hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg",
                "focus-within:ring-2 focus-within:ring-inset focus-within:ring-ring",
                "opacity-100 motion-safe:animate-landing-in motion-safe:opacity-0 motion-safe:[animation-delay:500ms]",
              )}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
              <div className="relative z-10 mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                <LogIn className="size-5" aria-hidden />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {L.step2n}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-tight text-foreground">
                {L.step2t}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{L.step2d}</p>
            </li>
            <li
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm",
                "transition-[transform,box-shadow,border-color] duration-300 ease-out",
                "motion-safe:hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg",
                "focus-within:ring-2 focus-within:ring-inset focus-within:ring-ring",
                "opacity-100 motion-safe:animate-landing-in motion-safe:opacity-0 motion-safe:[animation-delay:580ms]",
              )}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
              <div className="relative z-10 mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                <CalendarClock className="size-5" aria-hidden />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {L.step3n}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-tight text-foreground">
                {L.step3t}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{L.step3d}</p>
            </li>
          </ol>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-card/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-8">
          <div className="max-w-md space-y-3">
            <div className="flex items-center gap-3">
              <BacardiMark size="sm" />
              <p className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
                {L.footerBrand}
              </p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{L.footerCopy}</p>
            <p className="font-heritage text-[0.72rem] font-semibold italic tracking-[0.12em] text-primary/95">
              {L.footerPurpose}
            </p>
            <p className="font-heritage text-[0.72rem] leading-relaxed text-muted-foreground/90 sm:max-w-md">
              {L.footerHeritage}
            </p>
            <p className="mt-2 text-[0.58rem] leading-relaxed text-muted-foreground/65 sm:max-w-xl">{L.footerLegal}</p>
          </div>
          <nav className="flex flex-col gap-3 text-sm sm:items-end" aria-label="Link di servizio">
            <Link
              className="w-fit rounded-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              href={loginHref}
            >
              {L.footerAccess}
            </Link>
            <Link
              className="w-fit rounded-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              href={configHref}
            >
              {L.footerConfig}
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
