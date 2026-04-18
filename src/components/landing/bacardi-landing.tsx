import Link from "next/link";
import { ArrowRight, CalendarClock, ClipboardCheck, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
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
      <a
        href="#contenuto"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Salta al contenuto
      </a>

      {/* Atmosfera: mesh caldo + alone brand (no “purple slop”) */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-100 motion-safe:animate-landing-fade motion-safe:opacity-0"
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

      <header className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="group flex flex-col gap-0.5">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-muted-foreground transition-colors group-hover:text-foreground">
            Portale attivazioni
          </span>
          <span className="font-display text-2xl font-normal tracking-tight sm:text-3xl">
            Bacardi
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm" aria-label="Navigazione principale">
          {isAuthenticated ? (
            <Link
              href={portalHref}
              className={buttonVariants({
                size: "sm",
                className: "gap-1.5 rounded-full px-4 no-underline",
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
                  className: "rounded-full text-muted-foreground no-underline",
                })}
              >
                Come funziona
              </Link>
              <Link
                href={loginHref}
                className={buttonVariants({
                  size: "sm",
                  className: "rounded-full px-4 no-underline",
                })}
              >
                Accedi
              </Link>
            </>
          )}
        </nav>
      </header>

      <main id="contenuto" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <section className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16 lg:pt-4">
          <div>
            <p
              className={cn(
                "mb-5 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm",
                "opacity-100 motion-safe:animate-landing-in motion-safe:opacity-0 motion-safe:[animation-delay:80ms]",
              )}
            >
              <Sparkles className="size-3.5 text-primary" aria-hidden />
              Trimestre attivo · requisiti chiari · prenotazione guidata
            </p>
            <h1
              className={cn(
                "font-display text-balance text-4xl font-normal leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl",
                "opacity-100 motion-safe:animate-landing-in motion-safe:opacity-0 motion-safe:[animation-delay:140ms]",
              )}
            >
              Attivazioni sul territorio,{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10">con ordine e stile.</span>
                <span
                  className="absolute -inset-x-1 bottom-1 z-0 h-3 skew-x-[-10deg] bg-primary/15 sm:h-3.5"
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
              idoneo, apri Microsoft Bookings con un solo gesto.
            </p>
            <div
              className={cn(
                "mt-10 flex flex-col gap-3 sm:flex-row sm:items-center",
                "opacity-100 motion-safe:animate-landing-in motion-safe:opacity-0 motion-safe:[animation-delay:300ms]",
              )}
            >
              <Link
                href={isAuthenticated ? portalHref : loginHref}
                className={buttonVariants({
                  size: "lg",
                  className:
                    "h-12 gap-2 rounded-full px-8 text-base shadow-lg shadow-primary/20 no-underline",
                })}
              >
                {isAuthenticated ? "Scegli l’attivazione" : "Entra e scegli l’attivazione"}
                <ArrowRight className="size-5" aria-hidden />
              </Link>
              {isAuthenticated ? (
                <Link
                  href="/portal/profile"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "h-12 rounded-full px-7 no-underline",
                  })}
                >
                  Completa il profilo
                </Link>
              ) : (
                <Link
                  href="#come-funziona"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "h-12 rounded-full px-7 no-underline",
                  })}
                >
                  Scopri il percorso
                </Link>
              )}
            </div>
            <dl
              className={cn(
                "mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border/70 pt-10 text-sm",
                "opacity-100 motion-safe:animate-landing-in motion-safe:opacity-0 motion-safe:[animation-delay:380ms]",
              )}
            >
              <div>
                <dt className="text-muted-foreground">Flusso</dt>
                <dd className="mt-1 font-medium">Magic link sicuro</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Requisiti</dt>
                <dd className="mt-1 font-medium">Valutazione istantanea</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Prenota</dt>
                <dd className="mt-1 font-medium">Bookings integrato</dd>
              </div>
            </dl>
          </div>

          <div
            className={cn(
              "relative lg:justify-self-end",
              "opacity-100 motion-safe:animate-landing-in motion-safe:opacity-0 motion-safe:[animation-delay:200ms]",
            )}
          >
            <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-2xl shadow-foreground/10 sm:mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-foreground/[0.04]" />
              <div className="absolute left-6 top-6 right-6 rounded-2xl border border-border/50 bg-background/85 p-4 shadow-sm backdrop-blur-md">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Anteprima percorso
                </p>
                <p className="mt-2 font-display text-2xl tracking-tight">Catalogo trimestre</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Dettaglio attivazione · breakdown requisiti · CTA condizionata
                </p>
              </div>
              <div className="absolute bottom-6 left-6 right-6 space-y-3 rounded-2xl border border-border/50 bg-card/95 p-4 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">Idoneità punto vendita</span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    Live
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[72%] rounded-full bg-primary" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Esempio illustrativo dell’esperienza nel portale.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-8 -bottom-6 hidden h-36 w-36 rounded-full border border-dashed border-primary/25 sm:block" />
          </div>
        </section>

        <section
          id="come-funziona"
          className="mt-24 scroll-mt-24 sm:mt-32"
          aria-labelledby="come-funziona-titolo"
        >
          <div className="max-w-2xl">
            <h2
              id="come-funziona-titolo"
              className="font-display text-3xl font-normal tracking-tight sm:text-4xl"
            >
              Tre passi. Zero ambiguità.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Pensato per chi gestisce attivazioni sul campo: chiarezza prima della prenotazione.
            </p>
          </div>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            <li className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ClipboardCheck className="size-5" aria-hidden />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                01
              </p>
              <h3 className="mt-2 font-display text-xl tracking-tight">Accedi con invito</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Email verificata: niente password da ricordare, sessione moderna e sicura.
              </p>
            </li>
            <li className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="size-5" aria-hidden />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                02
              </p>
              <h3 className="mt-2 font-display text-xl tracking-tight">Scegli l’attivazione</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Catalogo ordinato per trimestre: requisiti leggibili, evidenze e stato idoneità.
              </p>
            </li>
            <li className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarClock className="size-5" aria-hidden />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                03
              </p>
              <h3 className="mt-2 font-display text-xl tracking-tight">Prenota se idoneo</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Microsoft Bookings si apre solo quando i requisiti sono soddisfatti: meno errori.
              </p>
            </li>
          </ol>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-card/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground">
            Esperienza dedicata al canale Italia. Per supporto operativo contatta il team Carda
            Bacardi.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            <Link className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" href={loginHref}>
              Accesso portale
            </Link>
            <Link
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              href="/configurazione"
            >
              Configurazione ambiente
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
