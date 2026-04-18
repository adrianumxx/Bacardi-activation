import Link from "next/link";

import {
  loginWithPasswordAction,
  signInWithGoogleAction,
} from "@/app/actions/auth-credentials";
import { loginMagicLinkAction } from "@/app/actions/login";
import { MarketingBackdrop } from "@/components/landing/marketing-backdrop";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { explainSupabaseEnvIssues, isSupabaseConfigured } from "@/lib/env";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const sent = searchParams?.sent === "1";
  const registered = searchParams?.registered === "1";
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

  const configured = isSupabaseConfigured();
  const envHints = explainSupabaseEnvIssues();

  return (
    <div className="relative flex min-h-dvh flex-col text-foreground">
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
            <CardTitle className="font-display text-2xl font-extrabold tracking-tight sm:text-[1.65rem]">
              Accedi al portale
            </CardTitle>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Email e password, Google, oppure link via email se il tuo account è già invitato.
            </p>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            {!configured ? (
              <div className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-3 text-sm leading-relaxed text-foreground">
                <p className="font-medium text-amber-950 dark:text-amber-100">
                  Per accedere serve un progetto Supabase collegato.
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  {envHints.map((hint) => (
                    <li key={hint}>{hint}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  Dopo aver salvato <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.7rem]">.env.local</code>,{" "}
                  <strong className="text-foreground">riavvia</strong> il server (
                  <code className="rounded bg-muted px-1 font-mono text-[0.7rem]">Ctrl+C</code> poi{" "}
                  <code className="rounded bg-muted px-1 font-mono text-[0.7rem]">npm run dev</code>).
                </p>
                <p className="mt-2 text-xs">
                  <Link
                    href="/configurazione"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Pagina configurazione
                  </Link>
                </p>
              </div>
            ) : null}

            {sent ? (
              <p className="rounded-lg border border-border/80 bg-muted/40 px-3 py-2.5 text-sm leading-relaxed">
                Controlla la posta: ti abbiamo inviato un link per accedere.
              </p>
            ) : null}
            {registered ? (
              <p className="rounded-lg border border-border/80 bg-muted/40 px-3 py-2.5 text-sm leading-relaxed">
                Registrazione inviata. Se Supabase richiede conferma email, apri il link nella posta; altrimenti puoi
                accedere subito qui sotto.
              </p>
            ) : null}
            {error === "auth" ? (
              <p className="text-sm leading-relaxed text-destructive">
                Autenticazione non riuscita. Riprova o usa email e password.
              </p>
            ) : null}
            {error && error !== "auth" ? (
              <p className="text-sm leading-relaxed text-destructive">{error}</p>
            ) : null}

            {configured ? (
              <>
                <form action={signInWithGoogleAction}>
                  <Button type="submit" variant="outline" className="h-11 w-full text-base font-semibold">
                    Continua con Google
                  </Button>
                </form>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center" aria-hidden>
                    <span className="w-full border-t border-border/80" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-wider">
                    <span className="bg-card px-2 text-muted-foreground">oppure email</span>
                  </div>
                </div>

                <form action={loginWithPasswordAction} className="space-y-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="h-11 border-border/80 bg-background transition-[box-shadow] focus-visible:ring-2"
                    />
                  </div>
                  <Button type="submit" className="h-11 w-full text-base font-semibold shadow-md shadow-primary/15">
                    Accedi
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  Non hai un account?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-primary underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  >
                    Registrati
                  </Link>
                </p>

                <details className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm">
                  <summary className="cursor-pointer select-none font-medium text-foreground">
                    Accedi con link email (magic link)
                  </summary>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Se hai ricevuto un invito o preferisci l’accesso senza password, usa la tua email qui sotto.
                  </p>
                  <form action={loginMagicLinkAction} className="mt-3 space-y-3">
                    <Input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="nome@azienda.it"
                      className="h-10 border-border/80 bg-background"
                    />
                    <Button type="submit" variant="secondary" className="h-10 w-full">
                      Invia link di accesso
                    </Button>
                  </form>
                </details>
              </>
            ) : null}

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
