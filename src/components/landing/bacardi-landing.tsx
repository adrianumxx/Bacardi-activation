import Link from "next/link";
import { ArrowRight, CalendarClock, ClipboardCheck, ExternalLink, Sparkles } from "lucide-react";

import { BacardiMark } from "@/components/brand/bacardi-mark";
import { MarketingBackdrop } from "@/components/landing/marketing-backdrop";
import { buttonVariants } from "@/components/ui/button";
import { DEFAULT_BOOKINGS_PAGE_URL } from "@/lib/bookings-default";
import { cn } from "@/lib/utils";

type BacardiLandingProps = {
  className?: string;
  isAuthenticated: boolean;
};

export function BacardiLanding({ className, isAuthenticated }: BacardiLandingProps) {
  const portalHref = "/portal";
  const loginHref = "/login";

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
        Salta al contenuto
      </a>

      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:gap-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Bacardi — portale attivazioni, home"
        >
          <BacardiMark size="md" className="motion-safe:transition-transform motion-safe:group-hover:scale-[1.03]" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground transition-colors group-hover:text-foreground">
              Portale attivazioni
            </span>
            <span className="font-display text-2xl font-extrabold uppercase tracking-tight text-foreground sm:text-3xl">
              Bacardi
            </span>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-2 text-sm" aria-label="Navigazione principale">
          <a
            href={DEFAULT_BOOKINGS_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className:
                "min-h-10 gap-1.5 rounded-full border-primary/40 bg-transparent px-3 text-foreground no-underline hover:border-primary hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            })}
          >
            <ExternalLink className="size-3.5 shrink-0 opacity-80" aria-hidden />
            Bookings
          </a>
          {isAuthenticated ? (
            <Link
              href={portalHref}
              className={buttonVariants({
                size: "sm",
                className:
                  "min-h-10 gap-1.5 rounded-full px-4 no-underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              })}
            >
              Catalogo
              <ArrowRight className="size-4 opacity-80" aria-hidden />
            </Link>
          ) : (
            <>
              <Link
                href="#come-funziona"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className:
                    "min-h-10 rounded-full text-muted-foreground no-underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                })}
              >
                Come funziona
              </Link>
              <Link
                href={loginHref}
                className={buttonVariants({
                  size: "sm",
                  className:
                    "min-h-10 rounded-full px-4 no-underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                })}
              >
                Accedi
              </Link>
            </>
          )}
        </nav>
      </header>

      <main id="contenuto" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <section
          aria-labelledby="hero-heading"
          className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16 lg:pt-4"
        >
          <div>
            <p
              className={cn(
                "mb-5 inline-flex min-h-10 max-w-full flex-wrap items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm",
                "opacity-100 motion-safe:animate-landing-in motion-safe:opacity-0 motion-safe:[animation-delay:80ms]",
              )}
            >
              <Sparkles className="size-3.5 shrink-0 text-primary" aria-hidden />
              <span>Trimestre attivo · requisiti chiari · Microsoft Bookings</span>
            </p>
            <h1
              id="hero-heading"
              className={cn(
                "font-display text-balance text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl",
                "opacity-100 motion-safe:animate-landing-in motion-safe:opacity-0 motion-safe:[animation-delay:140ms]",
              )}
            >
              Attivazioni sul territorio,{" "}
              <span className="relative inline-block text-primary sm:whitespace-nowrap">
                <span className="relative z-10">con ordine e stile.</span>
                <span
                  className="absolute -inset-x-1 bottom-1 z-0 h-3 skew-x-[-10deg] bg-primary/20 sm:h-3.5"
                  aria-hidden
                />
              </span>
            </h1>
            <p
              className={cn(
                "mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg",
                "opacity-100 motion-safe:animate-landing-in motion-safe:opacity-0 motion-safe:[animation-delay:220ms]",
              )}
            >
              Esplora il catalogo, verifica in tempo reale i requisiti del tuo punto vendita e, se
              idoneo, apri la pagina Microsoft Bookings del referente in un clic.
            </p>
            <div
              className={cn(
                "mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center",
                "opacity-100 motion-safe:animate-landing-in motion-safe:opacity-0 motion-safe:[animation-delay:300ms]",
              )}
            >
              <Link
                href={isAuthenticated ? portalHref : loginHref}
                className={buttonVariants({
                  size: "lg",
                  className:
                    "min-h-12 gap-2 rounded-full px-8 text-base shadow-lg shadow-primary/30 no-underline transition-[transform,box-shadow] hover:shadow-xl hover:shadow-primary/25 motion-safe:active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                })}
              >
                {isAuthenticated ? "Scegli l’attivazione" : "Entra e scegli l’attivazione"}
                <ArrowRight className="size-5" aria-hidden />
              </Link>
              <a
                href={DEFAULT_BOOKINGS_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className:
                    "min-h-12 gap-2 rounded-full border-primary/50 px-7 text-base no-underline hover:border-primary hover:bg-primary/10 motion-safe:active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                })}
              >
                <CalendarClock className="size-5 shrink-0" aria-hidden />
                Prenota su Bookings
              </a>
              {isAuthenticated ? (
                <Link
                  href="/portal/profile"
                  className={buttonVariants({
                    variant: "secondary",
                    size: "lg",
                    className:
                      "min-h-12 rounded-full px-7 no-underline transition-[transform,box-shadow] motion-safe:active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  })}
                >
                  Profilo
                </Link>
              ) : (
                <Link
                  href="#come-funziona"
                  className={buttonVariants({
                    variant: "secondary",
                    size: "lg",
                    className:
                      "min-h-12 rounded-full px-7 no-underline transition-[transform,box-shadow] motion-safe:active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  })}
                >
                  Scopri il percorso
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
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Accesso
                </dt>
                <dd className="mt-1.5 font-medium leading-snug">Email, password o Google</dd>
              </div>
              <div className="sm:border-l sm:border-border/60 sm:pl-6">
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Requisiti
                </dt>
                <dd className="mt-1.5 font-medium leading-snug">Valutazione istantanea</dd>
              </div>
              <div className="sm:border-l sm:border-border/60 sm:pl-6">
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Prenota
                </dt>
                <dd className="mt-1.5 font-medium leading-snug">Microsoft Bookings</dd>
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
              aria-label="Anteprima illustrativa: catalogo trimestre, dettaglio requisiti e indicatore di idoneità punto vendita."
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-foreground/[0.06]" />
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.12]" aria-hidden>
                <BacardiMark size="lg" className="scale-[2.2] blur-[1px]" />
              </div>
              <div className="absolute left-5 top-5 right-5 rounded-2xl border border-border/60 bg-background/90 p-4 shadow-sm backdrop-blur-md sm:left-6 sm:top-6 sm:right-6 sm:p-5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Anteprima percorso
                </p>
                <p className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-foreground">
                  Catalogo trimestre
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Dettaglio attivazione, breakdown requisiti e call to action condizionata all’idoneità.
                </p>
              </div>
              <div className="absolute bottom-5 left-5 right-5 space-y-3 rounded-2xl border border-border/60 bg-card/95 p-4 shadow-lg backdrop-blur-sm sm:bottom-6 sm:left-6 sm:right-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">Idoneità punto vendita</span>
                  <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    Live
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-muted"
                  role="presentation"
                  aria-hidden
                >
                  <div className="h-full w-[72%] rounded-full bg-primary" />
                </div>
                <a
                  href={DEFAULT_BOOKINGS_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-center text-xs font-bold uppercase tracking-wide text-primary-foreground no-underline transition-opacity hover:opacity-90"
                >
                  Apri Bookings
                  <ExternalLink className="size-3.5" aria-hidden />
                </a>
              </div>
            </figure>
            <div
              className="pointer-events-none absolute -right-8 -bottom-6 hidden h-36 w-36 rounded-full border border-dashed border-primary/30 sm:block"
              aria-hidden
            />
          </div>
        </section>

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
              Tre passi. Zero ambiguità.
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              Pensato per chi gestisce attivazioni sul campo: chiarezza e coerenza prima della
              prenotazione.
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
                <ClipboardCheck className="size-5" aria-hidden />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                01
              </p>
              <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-tight text-foreground">
                Accedi al portale
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Email e password, Google oppure link invito: sessione sicura e tracciabile.
              </p>
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
                <Sparkles className="size-5" aria-hidden />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                02
              </p>
              <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-tight text-foreground">
                Scegli l’attivazione
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Catalogo ordinato per trimestre: requisiti leggibili, evidenze e stato idoneità.
              </p>
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
                03
              </p>
              <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-tight text-foreground">
                Prenota su Bookings
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Pagina Microsoft Bookings del referente; dal catalogo il pulsante si attiva solo se
                idoneo.
              </p>
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
                Bacardi Italia
              </p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Esperienza dedicata al canale Italia. Per supporto operativo contatta il team Carda
              Bacardi.
            </p>
          </div>
          <nav className="flex flex-col gap-3 text-sm sm:items-end" aria-label="Link di servizio">
            <a
              href={DEFAULT_BOOKINGS_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit rounded-sm font-medium text-primary underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Microsoft Bookings — referente
            </a>
            <Link
              className="w-fit rounded-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              href={loginHref}
            >
              Accesso portale
            </Link>
            <Link
              className="w-fit rounded-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              href="/configurazione"
            >
              Configurazione ambiente
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
