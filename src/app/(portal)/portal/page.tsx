import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarClock, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_BOOKINGS_PAGE_URL } from "@/lib/bookings-default";
import { createClient } from "@/lib/supabase/server";
import { evaluateActivationEligibility } from "@/lib/requirements/activation";
import { embedOne } from "@/lib/supabase/embed";
import { cn } from "@/lib/utils";

export default async function PortalHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: attrsRow } = await supabase
    .from("client_attributes")
    .select("attributes")
    .eq("profile_id", user.id)
    .maybeSingle();

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
          <CardTitle>Errore</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Impossibile caricare le attivazioni. Verifica la connessione a Supabase e le variabili
          d’ambiente.
        </CardContent>
      </Card>
    );
  }

  if (!activations?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nessuna attivazione disponibile</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Non risulta un catalogo attivo per questo periodo. Torna più tardi o contatta il team
          Carda Bacardi.
        </CardContent>
      </Card>
    );
  }

  const attrs = attrsRow?.attributes ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl border border-primary/35 bg-primary/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <CalendarClock className="size-5" aria-hidden />
          </div>
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-foreground">
              Prenotazione referente
            </p>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Apri direttamente la pagina Microsoft Bookings del referente per slot e disponibilità.
            </p>
          </div>
        </div>
        <a
          href={DEFAULT_BOOKINGS_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ size: "default" }),
            "shrink-0 gap-2 self-start sm:self-center",
          )}
        >
          Bookings
          <ExternalLink className="size-4" aria-hidden />
        </a>
      </div>

      <div>
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight">Catalogo attività</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Qui trovi le attivazioni del trimestre corrente. L’idoneità è calcolata in base al tuo
          profilo: completa i dati in{" "}
          <Link className="underline" href="/portal/profile">
            Profilo
          </Link>
          .
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {activations.map((a) => {
          const eligibility = evaluateActivationEligibility(a.requirements, attrs);
          const catalog = embedOne<{ name: string }>(a.catalogs);
          return (
            <Card key={a.id} className="overflow-hidden">
              <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-lg">{a.title}</CardTitle>
                  <Badge variant={eligibility.ok ? "default" : "secondary"}>
                    {eligibility.ok ? "Idoneo" : "Non idoneo"}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {a.type === "ORDER_PROMO" ? "Promo ordini" : "Evento on-site"}
                  </Badge>
                  {catalog?.name ? <Badge variant="outline">{catalog.name}</Badge> : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {a.description ? (
                  <p className="text-muted-foreground">{a.description}</p>
                ) : null}
                {a.type === "ORDER_PROMO" && a.product_name ? (
                  <p>
                    <span className="font-medium">Prodotto:</span> {a.product_name}
                  </p>
                ) : null}
                {a.type === "ONSITE_EVENT" && a.cocktail_name ? (
                  <p>
                    <span className="font-medium">Cocktail / servizio:</span> {a.cocktail_name}
                  </p>
                ) : null}

                {!eligibility.ok ? (
                  <div className="rounded-md border bg-muted/40 p-3 text-sm">
                    <div className="font-medium">Da sistemare</div>
                    <ul className="mt-2 list-disc space-y-1 pl-4">
                      {eligibility.failures.map((f) => (
                        <li key={f.id}>{f.messageIt}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <Link
                  className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
                  href={`/portal/activations/${a.id}`}
                >
                  Dettagli e prenotazione
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
