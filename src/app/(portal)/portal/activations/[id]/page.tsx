import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookingsCta } from "@/components/portal/bookings-cta";
import { resolveBookingsUrl } from "@/lib/bookings-default";
import { createClient } from "@/lib/supabase/server";
import { evaluateActivationEligibility } from "@/lib/requirements/activation";
import { embedOne } from "@/lib/supabase/embed";

export default async function ActivationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: activation, error } = await supabase
    .from("activations")
    .select(
      "id, title, type, description, product_name, cocktail_name, requirements, requirements_markdown, bookings_url, catalogs ( name, starts_at, ends_at )",
    )
    .eq("id", params.id)
    .maybeSingle();

  if (error || !activation) notFound();

  const { data: attrsRow } = await supabase
    .from("client_attributes")
    .select("attributes")
    .eq("profile_id", user.id)
    .maybeSingle();

  const eligibility = evaluateActivationEligibility(
    activation.requirements,
    attrsRow?.attributes ?? {},
  );

  const catalog = embedOne<{ name: string; starts_at: string; ends_at: string }>(
    activation.catalogs,
  );

  const bookingsResolved = resolveBookingsUrl(activation.bookings_url);
  const canBook = eligibility.ok && Boolean(bookingsResolved);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link className="text-sm text-muted-foreground hover:underline" href="/portal">
            Torna al catalogo
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{activation.title}</h1>
        </div>
        <Badge variant={eligibility.ok ? "default" : "secondary"}>
          {eligibility.ok ? "Idoneo" : "Non idoneo"}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riepilogo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              {activation.type === "ORDER_PROMO" ? "Promo ordini" : "Evento on-site"}
            </Badge>
            {catalog?.name ? <Badge variant="outline">{catalog.name}</Badge> : null}
          </div>
          {activation.description ? <p>{activation.description}</p> : null}
          {activation.type === "ORDER_PROMO" && activation.product_name ? (
            <p>
              <span className="font-medium">Prodotto:</span> {activation.product_name}
            </p>
          ) : null}
          {activation.type === "ONSITE_EVENT" && activation.cocktail_name ? (
            <p>
              <span className="font-medium">Cocktail / servizio:</span> {activation.cocktail_name}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Requisiti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {!eligibility.ok ? (
            <div className="rounded-md border bg-muted/40 p-3">
              <div className="font-medium">Non sei ancora idoneo</div>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                {eligibility.failures.map((f) => (
                  <li key={f.id}>{f.messageIt}</li>
                ))}
              </ul>
              <p className="mt-3 text-muted-foreground">
                Aggiorna i dati in{" "}
                <Link className="underline" href="/portal/profile">
                  Profilo
                </Link>{" "}
                e ricontrolla questa pagina.
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Risulti idoneo in base ai dati del profilo. Completa comunque la prenotazione in
              Outlook per bloccare data e orario con il team.
            </p>
          )}

          {activation.requirements_markdown ? (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="font-medium">Dettagli operativi</div>
                <div className="whitespace-pre-wrap rounded-md border bg-background p-3 font-mono text-xs leading-relaxed">
                  {activation.requirements_markdown}
                </div>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prenotazione (Microsoft Bookings)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Il portale registra l’intenzione di prenotazione e apre la pagina pubblica di Microsoft
            Bookings. La conferma finale avviene nel tuo calendario Outlook completando il flusso
            Bookings.
          </p>
          {!activation.bookings_url?.trim() ? (
            <p className="text-xs text-muted-foreground">
              Per questa attivazione non è stato impostato un URL dedicato: si apre la{" "}
              <strong className="text-foreground">pagina Bookings predefinita del referente</strong>.
            </p>
          ) : null}
          <BookingsCta activationId={activation.id} disabled={!canBook} />
        </CardContent>
      </Card>
    </div>
  );
}
