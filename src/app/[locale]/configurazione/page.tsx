import Link from "next/link";

import { SupabaseSetupCallout } from "@/components/env/supabase-setup-callout";
import { LocaleDashSwitcher } from "@/components/i18n/locale-dash-switcher";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSupabaseEnvIssueKinds, isSupabaseConfigured } from "@/lib/env";
import { getLocale, localizedPath } from "@/lib/i18n/server";

export default async function ConfigurazionePage() {
  const locale = getLocale();
  const dict = await getDictionary(locale);
  const C = dict.config;
  const configured = isSupabaseConfigured();
  const supabaseIssueKinds = getSupabaseEnvIssueKinds();

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-foreground">
      <div className="mb-8 flex justify-end">
        <LocaleDashSwitcher locale={locale} copy={dict.localeSwitcher} variant="compact" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">{C.title}</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{C.p1}</p>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{C.h2}</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          {C.liUrl}{" "}
          <code className="rounded bg-muted px-1">https://xxxx.supabase.co</code>)
        </li>
        <li>
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
          {C.liAnon}
        </li>
        <li>
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">NEXT_PUBLIC_SITE_URL</code> {C.liSite}
        </li>
      </ul>

      <p className="mt-6 text-sm text-muted-foreground">
        {C.deploy} <strong>{C.deployBold}</strong> {C.deployEnd}
      </p>

      {!configured ? (
        <SupabaseSetupCallout env={dict.supabaseEnv} kinds={supabaseIssueKinds} className="mt-8" />
      ) : null}

      <div className="mt-8 rounded-xl border border-primary/15 bg-card/80 p-4 text-sm text-foreground ring-1 ring-white/[0.04]">
        <p className="font-medium text-foreground">{C.checksTitle}</p>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-muted-foreground">
          <li>{C.checksLi1}</li>
          <li>{C.checksLi2}</li>
          <li>{C.checksLi3}</li>
        </ul>
      </div>

      <p className="mt-8 text-sm">
        <Link className="text-primary underline underline-offset-4" href={localizedPath("/", locale)}>
          {C.homeLink}
        </Link>
      </p>
    </div>
  );
}
