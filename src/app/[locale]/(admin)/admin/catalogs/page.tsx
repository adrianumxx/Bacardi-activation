import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default async function AdminCatalogsPage() {
  const locale = getLocale();
  const supabase = await createClient();
  const { data: catalogs, error } = await supabase
    .from("catalogs")
    .select("id, name, starts_at, ends_at, status, created_at")
    .order("starts_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Cataloghi</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Un catalogo attivo per periodo definisce le attivazioni visibili ai clienti.
          </p>
        </div>
        <Link className={buttonVariants()} href={localizedPath("/admin/catalogs/new", locale)}>
          Nuovo catalogo
        </Link>
      </div>

      {error ? (
        <Card>
          <CardHeader>
            <CardTitle>Errore</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{error.message}</CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Elenco</CardTitle>
        </CardHeader>
        <CardContent>
          {!catalogs?.length ? (
            <p className="text-sm text-muted-foreground">Nessun catalogo ancora creato.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Periodo</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {catalogs.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.starts_at} → {c.ends_at}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{c.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        className={buttonVariants({ size: "sm", variant: "outline" })}
                        href={localizedPath(`/admin/catalogs/${c.id}`, locale)}
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
