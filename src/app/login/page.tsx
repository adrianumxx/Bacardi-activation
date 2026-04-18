import Link from "next/link";

import { loginAction } from "@/app/actions/login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const sent = searchParams?.sent === "1";
  const error = typeof searchParams?.error === "string" ? searchParams.error : null;

  return (
    <div className="mx-auto flex min-h-screen min-h-dvh max-w-md flex-col justify-center bg-background px-4 py-10 text-foreground">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Accedi</CardTitle>
          <p className="text-sm text-muted-foreground">
            Riceverai un magic link via email (invito o accesso con OTP).
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {sent ? (
            <p className="text-sm">
              Controlla la posta: ti abbiamo inviato un link per accedere.
            </p>
          ) : null}
          {error === "auth" ? (
            <p className="text-sm text-destructive">
              Autenticazione non riuscita. Riprova dal link email o richiedi un nuovo accesso.
            </p>
          ) : null}

          <form className="space-y-4" action={loginAction}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="nome@azienda.it"
              />
            </div>
            <Button type="submit" className="w-full">
              Invia link di accesso
            </Button>
          </form>

          <p className="text-xs text-muted-foreground">
            Problemi di accesso? Contatta il team Carda Bacardi.
          </p>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Link className="underline" href="/">
          Torna alla home
        </Link>
      </p>
    </div>
  );
}
