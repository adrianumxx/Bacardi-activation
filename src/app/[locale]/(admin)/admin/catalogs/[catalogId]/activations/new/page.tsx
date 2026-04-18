import Link from "next/link";
import { notFound } from "next/navigation";

import { createActivationAction } from "@/app/actions/admin-activations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_BOOKINGS_PAGE_URL } from "@/lib/bookings-default";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_REQUIREMENTS_JSON } from "@/lib/defaults";
import { getLocale, localizedPath } from "@/lib/i18n/server";

export default async function NewActivationPage({
  params,
  searchParams,
}: {
  params: { catalogId: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const locale = getLocale();
  const supabase = await createClient();
  const { data: catalog } = await supabase
    .from("catalogs")
    .select("id, name")
    .eq("id", params.catalogId)
    .maybeSingle();

  if (!catalog) notFound();

  const error = typeof searchParams?.error === "string" ? searchParams.error : null;

  return (
    <div className="space-y-6">
      <div>
        <Link
          className="text-sm text-muted-foreground hover:underline"
          href={localizedPath(`/admin/catalogs/${catalog.id}`, locale)}
        >
          Torna al catalogo
        </Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Nuova attivazione</h1>
        <p className="mt-2 text-sm text-muted-foreground">{catalog.name}</p>
      </div>

      {error ? (
        <Card>
          <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Dettagli</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createActivationAction.bind(null, catalog.id)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titolo</Label>
              <Input id="title" name="title" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                name="type"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue="ORDER_PROMO"
              >
                <option value="ORDER_PROMO">ORDER_PROMO (es. 5+1)</option>
                <option value="ONSITE_EVENT">ONSITE_EVENT (bar + staff)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrizione</Label>
              <Textarea id="description" name="description" rows={4} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product_name">Prodotto (promo)</Label>
                <Input id="product_name" name="product_name" placeholder="Es. BACARDÍ Carta Blanca" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cocktail_name">Cocktail / servizio (evento)</Label>
                <Input id="cocktail_name" name="cocktail_name" placeholder="Es. Mojito signature" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookings_url">Microsoft Bookings URL</Label>
              <Input
                id="bookings_url"
                name="bookings_url"
                defaultValue={DEFAULT_BOOKINGS_PAGE_URL}
                placeholder="https://book.ms/b/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">Ordine</Label>
              <Input id="sort_order" name="sort_order" type="number" defaultValue={0} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements_markdown">Testo requisiti (markdown-ish)</Label>
              <Textarea
                id="requirements_markdown"
                name="requirements_markdown"
                rows={8}
                placeholder={"Esempio:\n- Spazio minimo 3x3m\n- Accesso carico merci\n"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements_json">Regole automatiche (JSON)</Label>
              <Textarea
                id="requirements_json"
                name="requirements_json"
                rows={14}
                className="font-mono text-xs"
                defaultValue={DEFAULT_REQUIREMENTS_JSON}
              />
              <p className="text-xs text-muted-foreground">
                Le chiavi devono combaciare con lo schema attributi del catalogo.
              </p>
            </div>

            <Button type="submit">Crea</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
