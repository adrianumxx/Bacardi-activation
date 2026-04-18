import Link from "next/link";
import { notFound } from "next/navigation";

import {
  deleteActivationAction,
  updateActivationAction,
} from "@/app/actions/admin-activations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_BOOKINGS_PAGE_URL } from "@/lib/bookings-default";
import { createClient } from "@/lib/supabase/server";
import { getLocale, localizedPath } from "@/lib/i18n/server";

export default async function EditActivationPage({
  params,
  searchParams,
}: {
  params: { catalogId: string; activationId: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const locale = getLocale();
  const supabase = await createClient();
  const { data: activation, error } = await supabase
    .from("activations")
    .select("*")
    .eq("id", params.activationId)
    .eq("catalog_id", params.catalogId)
    .maybeSingle();

  if (error || !activation) notFound();

  const requirementsText = JSON.stringify(activation.requirements ?? { rules: [] }, null, 2);
  const errorMsg = typeof searchParams?.error === "string" ? searchParams.error : null;

  return (
    <div className="space-y-6">
      <div>
        <Link
          className="text-sm text-muted-foreground hover:underline"
          href={localizedPath(`/admin/catalogs/${params.catalogId}`, locale)}
        >
          Torna al catalogo
        </Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Modifica attivazione</h1>
        <p className="mt-2 text-sm text-muted-foreground">{activation.title}</p>
      </div>

      {errorMsg ? (
        <Card>
          <CardContent className="pt-6 text-sm text-destructive">{errorMsg}</CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Dettagli</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={updateActivationAction.bind(null, params.catalogId, params.activationId)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="title">Titolo</Label>
              <Input id="title" name="title" required defaultValue={activation.title} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                name="type"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue={activation.type}
              >
                <option value="ORDER_PROMO">ORDER_PROMO</option>
                <option value="ONSITE_EVENT">ONSITE_EVENT</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrizione</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={activation.description ?? ""}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product_name">Prodotto (promo)</Label>
                <Input
                  id="product_name"
                  name="product_name"
                  defaultValue={activation.product_name ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cocktail_name">Cocktail / servizio (evento)</Label>
                <Input
                  id="cocktail_name"
                  name="cocktail_name"
                  defaultValue={activation.cocktail_name ?? ""}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookings_url">Microsoft Bookings URL</Label>
              <Input
                id="bookings_url"
                name="bookings_url"
                defaultValue={activation.bookings_url?.trim() || DEFAULT_BOOKINGS_PAGE_URL}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">Ordine</Label>
              <Input
                id="sort_order"
                name="sort_order"
                type="number"
                defaultValue={activation.sort_order}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements_markdown">Testo requisiti</Label>
              <Textarea
                id="requirements_markdown"
                name="requirements_markdown"
                rows={8}
                defaultValue={activation.requirements_markdown ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements_json">Regole automatiche (JSON)</Label>
              <Textarea
                id="requirements_json"
                name="requirements_json"
                rows={14}
                className="font-mono text-xs"
                defaultValue={requirementsText}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit">Salva</Button>
            </div>
          </form>

          <div className="mt-8 border-t pt-6">
            <form action={deleteActivationAction.bind(null, params.catalogId, params.activationId)}>
              <Button type="submit" variant="destructive">
                Elimina attivazione
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
