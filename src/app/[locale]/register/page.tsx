import Link from "next/link";

import { registerWithPasswordAction } from "@/app/actions/auth-credentials";
import { BacardiWordmarkLockup } from "@/components/brand/bacardi-wordmark-lockup";
import { LocaleDashSwitcher } from "@/components/i18n/locale-dash-switcher";
import { MarketingBackdrop } from "@/components/landing/marketing-backdrop";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SupabaseSetupCallout } from "@/components/env/supabase-setup-callout";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSupabaseEnvIssueKinds, isSupabaseConfigured } from "@/lib/env";
import { getLocale, localizedPath } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const locale = getLocale();
  const dict = await getDictionary(locale);
  const R = dict.register;
  const L = dict.login;

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
  const supabaseIssueKinds = getSupabaseEnvIssueKinds();

  const homeHref = localizedPath("/", locale);
  const loginHref = localizedPath("/login", locale);
  const configHref = localizedPath("/configurazione", locale);

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
              {R.title}
            </CardTitle>
            <p className="text-sm leading-relaxed text-muted-foreground">{R.subtitle}</p>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            {!configured ? (
              <SupabaseSetupCallout env={dict.supabaseEnv} kinds={supabaseIssueKinds}>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <Link
                    href={configHref}
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "flex h-11 flex-1 items-center justify-center text-base font-semibold shadow-md shadow-primary/15 no-underline",
                    )}
                  >
                    {dict.supabaseEnv.configCta}
                  </Link>
                  <Link
                    href={loginHref}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "flex h-11 flex-1 items-center justify-center border-primary/25 bg-transparent text-base font-semibold no-underline sm:max-w-[12rem]",
                    )}
                  >
                    {R.backLogin}
                  </Link>
                </div>
              </SupabaseSetupCallout>
            ) : null}

            {error ? <p className="text-sm leading-relaxed text-destructive">{error}</p> : null}

            {configured ? (
              <form action={registerWithPasswordAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{R.email}</Label>
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
                  <Label htmlFor="password">{R.password}</Label>
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
                  <Label htmlFor="confirm">{R.confirm}</Label>
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
                  {R.submit}
                </Button>
              </form>
            ) : null}

            <p className="text-center text-sm text-muted-foreground">
              {R.hasAccount}{" "}
              <Link
                href={loginHref}
                className="font-medium text-primary underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                {R.loginLink}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
