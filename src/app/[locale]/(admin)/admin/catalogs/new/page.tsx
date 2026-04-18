import Link from "next/link";

import { createCatalogAction } from "@/app/actions/admin-catalogs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_ATTRIBUTE_SCHEMA } from "@/lib/defaults";
import { getLocale, localizedPath } from "@/lib/i18n/server";

export default async function NewCatalogPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const locale = getLocale();
  const error = typeof searchParams?.error === "string" ? searchParams.error : null;

  return (
    <div className="space-y-6">
      <div>
        <Link
          className="text-sm text-muted-foreground hover:underline"
          href={localizedPath("/admin/catalogs", locale)}
        >
          Torna ai cataloghi
        </Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Nuovo catalogo</h1>
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
          <form action={createCatalogAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome trimestre</Label>
              <Input id="name" name="name" required placeholder="Q2 2026 — Belgium" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="starts_at">Inizio</Label>
                <Input id="starts_at" name="starts_at" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ends_at">Fine</Label>
                <Input id="ends_at" name="ends_at" type="date" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Stato</Label>
              <select
                id="status"
                name="status"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue="draft"
              >
                <option value="draft">draft</option>
                <option value="active">active</option>
                <option value="archived">archived</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Solo un catalogo dovrebbe essere <span className="font-medium">active</span> nel
                periodo corrente.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attribute_schema">Schema attributi (JSON)</Label>
              <Textarea
                id="attribute_schema"
                name="attribute_schema"
                rows={10}
                className="font-mono text-xs"
                defaultValue={DEFAULT_ATTRIBUTE_SCHEMA}
              />
            </div>

            <Button type="submit">Crea</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
