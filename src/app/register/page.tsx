import Link from "next/link";

import { registerWithPasswordAction } from "@/app/actions/auth-credentials";
import { MarketingBackdrop } from "@/components/landing/marketing-backdrop";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { explainSupabaseEnvIssues, isSupabaseConfigured } from "@/lib/env";
import { instrumentDisplay } from "@/lib/fonts/instrument-display";
import { cn } from "@/lib/utils";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const errorRaw = typeof searchParams?.error === "string" ? searchParams.error : null;
  const error = errorRaw
    ? (() => {
        try {
          return decodeURIComponent(errorRaw);
        } catch {
          return errorRaw;
        }
      })()
    : null;

  const configured = isSupabaseConfigured();
  const envHints = explainSupabaseEnvIssues();

  return (
    <div className={cn(instrumentDisplay.variable, "relative flex min-h-dvh flex-col text-foreground")}>
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
              Crea un account
            </CardTitle>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Email e password. In Supabase abilita “Email” con password e, se serve, disattiva la conferma email in
              sviluppo.
            </p>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            {!configured ? (
              <div className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-3 text-sm leading-relaxed text-foreground">
                <p className="font-medium text-amber-950 dark:text-amber-100">Configura prima Supabase in .env.local.</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  {envHints.map((hint) => (
                    <li key={hint}>{hint}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs">
                  <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                    Torna al login
                  </Link>
                </p>
              </div>
            ) : null}

            {error ? <p className="text-sm leading-relaxed text-destructive">{error}</p> : null}

            {configured ? (
              <form action={registerWithPasswordAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="nome@azienda.it"
                    className="h-11 border-border/80 bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    placeholder="Almeno 6 caratteri"
                    className="h-11 border-border/80 bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Ripeti password</Label>
                  <Input
                    id="confirm"
                    name="confirm"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    placeholder="Ripeti la password"
                    className="h-11 border-border/80 bg-background"
                  />
                </div>
                <Button type="submit" className="h-11 w-full text-base font-semibold">
                  Registrati
                </Button>
              </form>
            ) : null}

            <p className="text-center text-sm text-muted-foreground">
              Hai già un account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                Accedi
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
