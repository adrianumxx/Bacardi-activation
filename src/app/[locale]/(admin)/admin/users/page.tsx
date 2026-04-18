import Link from "next/link";

import { inviteClientAction } from "@/app/actions/admin-invite";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getLocale, localizedPath } from "@/lib/i18n/server";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const locale = getLocale();
  const invited = searchParams?.invited === "1";
  const error = typeof searchParams?.error === "string" ? searchParams.error : null;

  return (
    <div className="space-y-6">
      <div>
        <Link
          className="text-sm text-muted-foreground hover:underline"
          href={localizedPath("/admin", locale)}
        >
          Torna alla dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Inviti clienti</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Richiede <span className="font-medium">SUPABASE_SERVICE_ROLE_KEY</span> sul server. Il
          destinatario riceverà un invito email con link di accesso.
        </p>
      </div>

      {invited ? (
        <Card>
          <CardContent className="pt-6 text-sm">Invito inviato.</CardContent>
        </Card>
      ) : null}
      {error ? (
        <Card>
          <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Nuovo invito</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={inviteClientAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email cliente</Label>
              <Input id="email" name="email" type="email" required placeholder="cliente@bar.it" />
            </div>
            <Button type="submit">Invia invito</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
