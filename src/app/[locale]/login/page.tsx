import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  loginWithPasswordAction,
  signInWithGoogleAction,
} from "@/app/actions/auth-credentials";
import { loginMagicLinkAction } from "@/app/actions/login";
import { BacardiWordmarkLockup } from "@/components/brand/bacardi-wordmark-lockup";
import { LocaleDashSwitcher } from "@/components/i18n/locale-dash-switcher";
import { MarketingBackdrop } from "@/components/landing/marketing-backdrop";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SupabaseSetupCallout } from "@/components/env/supabase-setup-callout";
import { getDictionary } from "@/i18n/get-dictionary";
import { sanitizePostLoginRedirect } from "@/lib/auth/post-login-redirect";
import { getSupabaseEnvIssueKinds, isSupabaseConfigured } from "@/lib/env";
import { getLocale, localizedPath } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const locale = getLocale();
  const dict = await getDictionary(locale);
  const L = dict.login;

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
  const supabaseIssueKinds = getSupabaseEnvIssueKinds();

  const homeHref = localizedPath("/", locale);
  const configHref = localizedPath("/configurazione", locale);
  const registerHref = localizedPath("/register", locale);
  const catalogHref = localizedPath("/activations", locale);

  const nextRaw = typeof searchParams?.next === "string" ? searchParams.next : null;
  const nextSafe = sanitizePostLoginRedirect(locale, nextRaw);

  return (
    <div className="relative flex min-h-dvh flex-col text-foreground">
      <MarketingBackdrop variant="subtle" />

      <header className="mx-auto flex w-full max-w-md items-start justify-between gap-4 px-4 pt-8 sm:pt-10">
        <Link
          href={homeHref}
          className="group flex flex-col gap-0.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={L.backHome}
        >
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground transition-colors group-hover:text-foreground">
            {dict.landing.portalEyebrow}
          </span>
          <BacardiWordmarkLockup text={dict.landing.brandName} className="h-9 w-auto sm:h-10" />
        </Link>
        <LocaleDashSwitcher locale={locale} copy={dict.localeSwitcher} variant="compact" />
      </header>

      <div className="flex flex-1 flex-col justify-center px-4 py-10">
        <Card className="mx-auto w-full max-w-md border-border/80 shadow-xl shadow-foreground/[0.06] ring-1 ring-black/[0.03] dark:ring-white/[0.05]">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="font-display text-2xl font-extrabold tracking-tight sm:text-[1.65rem]">
              {L.title}
            </CardTitle>
            <p className="text-sm leading-relaxed text-muted-foreground">{L.subtitle}</p>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div className="rounded-xl border border-primary/25 bg-primary/[0.08] p-4">
              <p className="text-sm leading-relaxed text-muted-foreground">{L.catalogTeaser}</p>
              <Link
                href={catalogHref}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "mt-3 inline-flex h-10 w-full items-center justify-center gap-2 font-semibold no-underline sm:w-full",
                )}
              >
                {L.catalogCta}
                <ArrowRight className="size-4 opacity-90" aria-hidden />
              </Link>
            </div>

            {!configured ? (
              <SupabaseSetupCallout env={dict.supabaseEnv} kinds={supabaseIssueKinds}>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {L.supabaseHint}{" "}
                  <code className="rounded bg-muted/80 px-1 py-0.5 font-mono text-[0.7rem]">.env.local</code>,{" "}
                  <strong className="font-semibold text-foreground">{L.supabaseRestart}</strong> {L.supabaseDev} (
                  <kbd className="rounded bg-muted/80 px-1 font-mono text-[0.7rem]">Ctrl+C</kbd>{" "}
                  <kbd className="rounded bg-muted/80 px-1 font-mono text-[0.7rem]">npm run dev</kbd>).
                </p>
                <Link
                  href={configHref}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "mt-3 flex h-11 w-full items-center justify-center text-base font-semibold shadow-md shadow-primary/15 no-underline",
                  )}
                >
                  {dict.supabaseEnv.configCta}
                </Link>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  <Link
                    href={configHref}
                    className="font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {L.configLink}
                  </Link>
                </p>
              </SupabaseSetupCallout>
            ) : null}

            {sent ? (
              <p className="rounded-lg border border-border/80 bg-muted/40 px-3 py-2.5 text-sm leading-relaxed">
                {L.sentMagic}
              </p>
            ) : null}
            {registered ? (
              <p className="rounded-lg border border-border/80 bg-muted/40 px-3 py-2.5 text-sm leading-relaxed">
                {L.registered}
              </p>
            ) : null}
            {error === "auth" ? (
              <p className="text-sm leading-relaxed text-destructive">{L.authFail}</p>
            ) : null}
            {error && error !== "auth" ? (
              <p className="text-sm leading-relaxed text-destructive">{error}</p>
            ) : null}

            {configured ? (
              <>
                <form action={signInWithGoogleAction}>
                  <input type="hidden" name="next" value={nextSafe} />
                  <Button type="submit" variant="outline" className="h-11 w-full text-base font-semibold">
                    {L.googleCta}
                  </Button>
                </form>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center" aria-hidden>
                    <span className="w-full border-t border-border/80" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-wider">
                    <span className="bg-card px-2 text-muted-foreground">{L.divider}</span>
                  </div>
                </div>

                <form action={loginWithPasswordAction} className="space-y-4">
                  <input type="hidden" name="next" value={nextSafe} />
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      {L.email}
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
                      {L.password}
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
                    {L.submitPassword}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  {L.noAccount}{" "}
                  <Link
                    href={registerHref}
                    className="font-medium text-primary underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  >
                    {L.registerLink}
                  </Link>
                </p>

                <details className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm">
                  <summary className="cursor-pointer select-none font-medium text-foreground">
                    {L.magicSummary}
                  </summary>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{L.magicHelp}</p>
                  <form action={loginMagicLinkAction} className="mt-3 space-y-3">
                    <input type="hidden" name="next" value={nextSafe} />
                    <Input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="nome@azienda.it"
                      className="h-10 border-border/80 bg-background"
                    />
                    <Button type="submit" variant="secondary" className="h-10 w-full">
                      {L.magicSubmit}
                    </Button>
                  </form>
                </details>
              </>
            ) : null}

            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              {L.support} <span className="text-foreground/90">{L.supportBold}</span>
            </p>
          </CardContent>
        </Card>

        <p className="mx-auto mt-8 max-w-md text-center text-xs text-muted-foreground">
          <Link
            href={homeHref}
            className="rounded-sm underline-offset-4 transition-colors hover:text-foreground hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {L.backBrand}
          </Link>
        </p>
      </div>
    </div>
  );
}
