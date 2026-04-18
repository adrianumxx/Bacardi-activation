import Link from "next/link";
import { notFound } from "next/navigation";

import {
  cloneCatalogAction,
  updateCatalogAction,
} from "@/app/actions/admin-catalogs";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { getLocale, localizedPath } from "@/lib/i18n/server";

function banner(searchParams?: Record<string, string | string[] | undefined>) {
  if (searchParams?.saved === "1") return "Salvato.";
  if (searchParams?.cloned === "1") return "Catalogo clonato.";
  if (searchParams?.createdActivation === "1") return "Attivazione creata.";
  if (searchParams?.savedActivation === "1") return "Attivazione aggiornata.";
  if (searchParams?.deletedActivation === "1") return "Attivazione eliminata.";
  return null;
}

export default async function AdminCatalogDetailPage({
  params,
  searchParams,
}: {
  params: { catalogId: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const locale = getLocale();
  const supabase = await createClient();
  const { data: catalog, error } = await supabase
    .from("catalogs")
    .select("id, name, starts_at, ends_at, status, attribute_schema")
    .eq("id", params.catalogId)
    .maybeSingle();

  if (error || !catalog) notFound();

  const { data: activations } = await supabase
    .from("activations")
    .select("id, title, type, sort_order, bookings_url")
    .eq("catalog_id", catalog.id)
    .order("sort_order", { ascending: true });

  const schemaText = JSON.stringify(catalog.attribute_schema ?? [], null, 2);
  const okBanner = banner(searchParams);
  const err =
    typeof searchParams?.error === "string" ? searchParams.error : null;

  return (
    <div className="space-y-8">
      <div>
        <Link
          className="text-sm text-muted-foreground hover:underline"
          href={localizedPath("/admin/catalogs", locale)}
        >
          Torna ai cataloghi
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">{catalog.name}</h1>
          <Badge variant="outline">{catalog.status}</Badge>
        </div>
      </div>

      {okBanner ? (
        <Card>
          <CardContent className="pt-6 text-sm">{okBanner}</CardContent>
        </Card>
      ) : null}
      {err ? (
        <Card>
          <CardContent className="pt-6 text-sm text-destructive">{err}</CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Modifica catalogo</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateCatalogAction.bind(null, catalog.id)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" required defaultValue={catalog.name} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="starts_at">Inizio</Label>
                <Input
                  id="starts_at"
                  name="starts_at"
                  type="date"
                  required
                  defaultValue={catalog.starts_at}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ends_at">Fine</Label>
                <Input
                  id="ends_at"
                  name="ends_at"
                  type="date"
                  required
                  defaultValue={catalog.ends_at}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Stato</Label>
              <select
                id="status"
                name="status"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue={catalog.status}
              >
                <option value="draft">draft</option>
                <option value="active">active</option>
                <option value="archived">archived</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attribute_schema">Schema attributi (JSON)</Label>
              <Textarea
                id="attribute_schema"
                name="attribute_schema"
                rows={12}
                className="font-mono text-xs"
                defaultValue={schemaText}
              />
            </div>

            <Button type="submit">Salva catalogo</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clona catalogo</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={cloneCatalogAction.bind(null, catalog.id)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clone_name">Nome nuovo catalogo</Label>
              <Input id="clone_name" name="name" required placeholder="Q3 2026 — Belgium" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clone_starts_at">Inizio</Label>
                <Input id="clone_starts_at" name="starts_at" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clone_ends_at">Fine</Label>
                <Input id="clone_ends_at" name="ends_at" type="date" required />
              </div>
            </div>
            <Button type="submit" variant="secondary">
              Clona (draft) + copia attivazioni
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
          <CardTitle>Attivazioni</CardTitle>
          <Link
            className={buttonVariants({ size: "sm" })}
            href={localizedPath(`/admin/catalogs/${catalog.id}/activations/new`, locale)}
          >
            Nuova attivazione
          </Link>
        </CardHeader>
        <CardContent>
          {!activations?.length ? (
            <p className="text-sm text-muted-foreground">Nessuna attivazione in questo catalogo.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titolo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activations.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{a.type}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {a.bookings_url?.trim() ? "URL dedicato" : "Default referente"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        className={buttonVariants({ size: "sm", variant: "outline" })}
                        href={localizedPath(
                          `/admin/catalogs/${catalog.id}/activations/${a.id}`,
                          locale,
                        )}
                      >
                        Modifica
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
