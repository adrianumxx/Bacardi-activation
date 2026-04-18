"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-foreground">
      <h1 className="text-xl font-semibold">Errore applicazione</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Si è verificato un errore lato server. In produzione il dettaglio è nei log Vercel (cerca il
        digest qui sotto).
      </p>
      {error.digest ? (
        <p className="mt-4 rounded-md border bg-muted/50 p-3 font-mono text-xs">
          Digest: {error.digest}
        </p>
      ) : null}
      <p className="mt-4 text-sm text-muted-foreground">
        Controlla: migrazione SQL eseguita su Supabase, variabili env su Vercel, redirect URL in
        Supabase Auth.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium"
          onClick={() => reset()}
        >
          Riprova
        </button>
        <Link
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
          href="/login"
        >
          Vai al login
        </Link>
      </div>
    </div>
  );
}
