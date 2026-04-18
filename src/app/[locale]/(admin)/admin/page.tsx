import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocale, localizedPath } from "@/lib/i18n/server";

export default async function AdminHomePage() {
  const locale = getLocale();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Pannello admin</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Gestisci cataloghi trimestrali, attivazioni, URL Microsoft Bookings e inviti clienti.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cataloghi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Crea, attiva, archivia e clona i cataloghi per ogni trimestre.</p>
            <Link
              className="font-medium text-primary underline-offset-4 hover:underline"
              href={localizedPath("/admin/catalogs", locale)}
            >
              Apri cataloghi
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inviti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Invita un cliente via email (Supabase invierà il link di accesso).</p>
            <Link
              className="font-medium text-primary underline-offset-4 hover:underline"
              href={localizedPath("/admin/users", locale)}
            >
              Apri inviti
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
