import Link from "next/link";
import { Instrument_Serif } from "next/font/google";

import { loginAction } from "@/app/actions/login";
import { MarketingBackdrop } from "@/components/landing/marketing-backdrop";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const display = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-landing-display",
  display: "swap",
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const sent = searchParams?.sent === "1";
  const errorRaw = typeof searchParams?.error === "string" ? searchParams.error : null;
  const error =
    errorRaw && errorRaw !== "auth"
      ? (() => {
          try {
            return decodeURIComponent(errorRaw);
          } catch {
            return errorRaw;
          }
        })()
      : errorRaw;

  return (
    <div className={cn(display.variable, "relative flex min-h-dvh flex-col text-foreground")}>
      <MarketingBackdrop variant="subtle" />

      <header className="mx-auto flex w-full max-w-md items-start justify-between gap-4 px-4 pt-8 sm:pt-10">
        <Link
          href="/"
          className="group flex flex-col gap-0.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Torna alla presentazione del portale"
        >
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground transition-colors group-hover:text-foreground">
            Portale attivazioni
          </span>
          <span className="font-display text-2xl tracking-tight text-foreground">Bacardi</span>
        </Link>
      </header>

      <div className="flex flex-1 flex-col justify-center px-4 py-10">
        <Card className="mx-auto w-full max-w-md border-border/80 shadow-xl shadow-foreground/[0.06] ring-1 ring-black/[0.03] dark:ring-white/[0.05]">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="font-display text-2xl font-normal tracking-tight sm:text-[1.65rem]">
              Accedi al portale
            </CardTitle>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Riceverai un magic link via email (invito o accesso con OTP).
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {sent ? (
              <p className="rounded-lg border border-border/80 bg-muted/40 px-3 py-2.5 text-sm leading-relaxed">
                Controlla la posta: ti abbiamo inviato un link per accedere.
              </p>
            ) : null}
            {error === "auth" ? (
              <p className="text-sm leading-relaxed text-destructive">
                Autenticazione non riuscita. Riprova dal link email o richiedi un nuovo accesso.
              </p>
            ) : null}
            {error && error !== "auth" ? (
              <p className="text-sm leading-relaxed text-destructive">{error}</p>
            ) : null}

            <form className="space-y-4" action={loginAction}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  placeholder="nome@azienda.it"
                  className="h-11 border-border/80 bg-background transition-[box-shadow] focus-visible:ring-2"
                />
              </div>
              <Button type="submit" className="h-11 w-full text-base font-semibold shadow-md shadow-primary/15">
                Invia link di accesso
              </Button>
            </form>

            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              Problemi di accesso?{" "}
              <span className="text-foreground/90">Contatta il team Carda Bacardi.</span>
            </p>
          </CardContent>
        </Card>

        <p className="mx-auto mt-8 max-w-md text-center text-xs text-muted-foreground">
          <Link
            href="/"
            className="rounded-sm underline-offset-4 transition-colors hover:text-foreground hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Torna alla presentazione del portale
          </Link>
        </p>
      </div>
    </div>
  );
}
