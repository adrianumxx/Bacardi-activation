import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookingsCta } from "@/components/portal/bookings-cta";
import { SupabaseSetupCallout } from "@/components/env/supabase-setup-callout";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveBookingsUrl } from "@/lib/bookings-default";
import { createClient } from "@/lib/supabase/server";
import { evaluateActivationEligibility } from "@/lib/requirements/activation";
import { embedOne } from "@/lib/supabase/embed";
import { getLocale, localizedPath } from "@/lib/i18n/server";
import { isSupabaseConfigured, getSupabaseEnvIssueKinds } from "@/lib/env";
import { cn } from "@/lib/utils";
import type { Json } from "@/types/database";

export default async function PublicActivationDetailPage({ params }: { params: { id: string } }) {
  const locale = getLocale();
  const dict = await getDictionary(locale);
  const A = dict.activation;
  const H = dict.portalHome;
  const B = dict.booking;

  if (!isSupabaseConfigured()) {
    const kinds = getSupabaseEnvIssueKinds();
    const configHref = localizedPath("/configurazione", locale);
    return (
      <Card>
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

  const { data: activation, error } = await supabase
    .from("activations")
    .select(
      "id, title, type, description, product_name, cocktail_name, requirements, requirements_markdown, bookings_url, catalogs ( name, starts_at, ends_at )",
    )
    .eq("id", params.id)
    .maybeSingle();

  if (error || !activation) notFound();

  const attrsRes = user
    ? await supabase.from("client_attributes").select("attributes").eq("profile_id", user.id).maybeSingle()
    : { data: null };
  const attrs = (attrsRes.data?.attributes ?? {}) as Json;

  const eligibility = user ? evaluateActivationEligibility(activation.requirements, attrs) : null;

  const catalog = embedOne<{ name: string; starts_at: string; ends_at: string }>(activation.catalogs);

  const bookingsResolved = resolveBookingsUrl(activation.bookings_url);
  const canBook = Boolean(user && eligibility?.ok && bookingsResolved);

  const backHref = localizedPath("/activations", locale);
  const loginNext = encodeURIComponent(localizedPath(`/activations/${params.id}`, locale));
  const loginHref = localizedPath(`/login?next=${loginNext}`, locale);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link className="text-sm text-muted-foreground hover:underline" href={backHref}>
            {A.backCatalog}
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{activation.title}</h1>
        </div>
        {user && eligibility ? (
          <Badge variant={eligibility.ok ? "default" : "secondary"}>
            {eligibility.ok ? H.eligible : H.notEligible}
          </Badge>
        ) : (
          <Badge variant="outline">{dict.publicActivations.guestBadge}</Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{A.summary}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              {activation.type === "ORDER_PROMO" ? H.promoBadge : H.eventBadge}
            </Badge>
            {catalog?.name ? <Badge variant="outline">{catalog.name}</Badge> : null}
          </div>
          {activation.description ? <p>{activation.description}</p> : null}
          {activation.type === "ORDER_PROMO" && activation.product_name ? (
            <p>
              <span className="font-medium">{H.product}</span> {activation.product_name}
            </p>
          ) : null}
          {activation.type === "ONSITE_EVENT" && activation.cocktail_name ? (
            <p>
              <span className="font-medium">{H.cocktail}</span> {activation.cocktail_name}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{user ? A.requirements : A.guestRequirementsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {!user ? (
            <p className="text-muted-foreground">{A.guestRequirementsP}</p>
          ) : eligibility && !eligibility.ok ? (
            <div className="rounded-md border bg-muted/40 p-3">
              <div className="font-medium">{A.notEligibleTitle}</div>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                {eligibility.failures.map((f) => (
                  <li key={f.id}>{f.messageIt}</li>
                ))}
              </ul>
              <p className="mt-3 text-muted-foreground">
                {A.notEligibleHint}{" "}
                <Link className="underline" href={localizedPath("/portal/profile", locale)}>
                  {A.profileLink}
                </Link>{" "}
                {A.notEligibleEnd}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">{A.eligibleP}</p>
          )}

          {activation.requirements_markdown ? (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="font-medium">{A.opsTitle}</div>
                <div className="whitespace-pre-wrap rounded-md border bg-background p-3 font-mono text-xs leading-relaxed">
                  {activation.requirements_markdown}
                </div>
              </div>
            </>
          ) : null}

          {!user ? (
            <Link href={loginHref} className={cn(buttonVariants(), "inline-flex w-full sm:w-auto no-underline")}>
              {A.guestLoginCta}
            </Link>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{A.bookingCardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">{A.bookingP}</p>
          {!activation.bookings_url?.trim() ? (
            <p className="text-xs text-muted-foreground">
              {A.bookingDefault}{" "}
              <strong className="text-foreground">{A.bookingDefaultBold}</strong>
              {A.bookingDefaultEnd}
            </p>
          ) : null}
          {user ? (
            <BookingsCta
              activationId={activation.id}
              disabled={!canBook}
              toastOk={B.toastOk}
              ctaLabel={B.ctaLabel}
              ctaLoading={B.ctaLoading}
            />
          ) : (
            <Link
              href={loginHref}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "inline-flex w-full sm:w-auto no-underline",
              )}
            >
              {A.guestLoginToBook}
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
