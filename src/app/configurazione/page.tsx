import Link from "next/link";

export default function ConfigurazionePage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-foreground">
      <h1 className="text-2xl font-semibold tracking-tight">Configurazione Supabase mancante</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        L’app non trova le variabili d’ambiente pubbliche di Supabase. Senza di esse non è possibile
        autenticarsi né leggere il database: in produzione compare l’errore generico “Application
        error”.
      </p>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Cosa impostare (es. su Vercel)
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          — URL del progetto (es.{" "}
          <code className="rounded bg-muted px-1">https://xxxx.supabase.co</code>)
        </li>
        <li>
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          — chiave anon dalla dashboard Supabase
        </li>
        <li>
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">NEXT_PUBLIC_SITE_URL</code>{" "}
          — URL pubblico del sito (es. il dominio Vercel), utile per i link email
        </li>
      </ul>

      <p className="mt-6 text-sm text-muted-foreground">
        Dopo aver salvato le variabili, esegui un nuovo <strong>Deploy</strong> (o “Redeploy”) così
        Next.js le incorpora nel build.
      </p>

      <p className="mt-8 text-sm">
        <Link className="text-primary underline underline-offset-4" href="/">
          Torna alla home
        </Link>
      </p>
    </div>
  );
}
