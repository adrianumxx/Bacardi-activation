import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupabaseSetupCallout } from "@/components/env/supabase-setup-callout";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary } from "@/i18n/get-dictionary";
import { isSupabaseConfigured, getSupabaseEnvIssueKinds } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { evaluateActivationEligibility } from "@/lib/requirements/activation";
import { embedOne } from "@/lib/supabase/embed";
import { getLocale, localizedPath } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";
import type { Json } from "@/types/database";

export default async function PublicActivationsPage() {
  const locale = getLocale();
  const dict = await getDictionary(locale);
  const H = dict.portalHome;
  const P = dict.publicActivations;

  if (!isSupabaseConfigured()) {
    const kinds = getSupabaseEnvIssueKinds();
    const configHref = localizedPath("/configurazione", locale);
    return (
      <Card className="border-border/80">
        <CardHeader>
          <CardTitle>{dict.supabaseEnv.setupTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <SupabaseSetupCallout env={dict.supabaseEnv} kinds={kinds}>
            <Link href={configHref} className={cn(buttonVariants(), "mt-3 inline-flex no-underline")}>
              {dict.supabaseEnv.configCta}
            </Link>
          </SupabaseSetupCallout>
        </CardContent>
      </Card>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const attrsRes = user
    ? await supabase.from("client_attributes").select("attributes").eq("profile_id", user.id).maybeSingle()
    : { data: null };
  const attrsRow = attrsRes.data;

  const { data: activations, error } = await supabase
    .from("activations")
    .select(
      "id, title, type, description, product_name, cocktail_name, requirements, bookings_url, sort_order, catalogs ( name, starts_at, ends_at )",
    )
    .order("sort_order", { ascending: true });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{H.loadErrorTitle}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{H.loadErrorBody}</CardContent>
      </Card>
    );
  }

  if (!activations?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{H.emptyTitle}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{H.emptyBody}</CardContent>
      </Card>
    );
  }

  const attrs = (attrsRow?.attributes ?? {}) as Json;
  const authed = Boolean(user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight">{H.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {authed ? (
            <>
              {H.intro}{" "}
              <Link className="underline" href={localizedPath("/portal/profile", locale)}>
                {H.profileLink}
              </Link>
              {H.introEnd}
            </>
          ) : (
            P.introGuest
          )}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {activations.map((a) => {
          const eligibility = authed ? evaluateActivationEligibility(a.requirements, attrs) : null;
          const catalog = embedOne<{ name: string }>(a.catalogs);
          return (
            <Card key={a.id} className="overflow-hidden">
              <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-lg">{a.title}</CardTitle>
                  {authed && eligibility ? (
                    <Badge variant={eligibility.ok ? "default" : "secondary"}>
                      {eligibility.ok ? H.eligible : H.notEligible}
                    </Badge>
                  ) : (
                    <Badge variant="outline">{P.guestBadge}</Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{a.type === "ORDER_PROMO" ? H.promoBadge : H.eventBadge}</Badge>
                  {catalog?.name ? <Badge variant="outline">{catalog.name}</Badge> : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {a.description ? <p className="text-muted-foreground">{a.description}</p> : null}
                {a.type === "ORDER_PROMO" && a.product_name ? (
                  <p>
                    <span className="font-medium">{H.product}</span> {a.product_name}
                  </p>
                ) : null}
                {a.type === "ONSITE_EVENT" && a.cocktail_name ? (
                  <p>
                    <span className="font-medium">{H.cocktail}</span> {a.cocktail_name}
                  </p>
                ) : null}

                {authed && eligibility && !eligibility.ok ? (
                  <div className="rounded-md border bg-muted/40 p-3 text-sm">
                    <div className="font-medium">{H.todoTitle}</div>
                    <ul className="mt-2 list-disc space-y-1 pl-4">
                      {eligibility.failures.map((f) => (
                        <li key={f.id}>{f.messageIt}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <Link
                  className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
                  href={localizedPath(`/activations/${a.id}`, locale)}
                >
                  {H.detailsCta}
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
