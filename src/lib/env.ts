import { z } from "zod";

/** Trim + rimuove slash finale (Supabase accetta l’URL con o senza /). */
function trimUrl(value: string | undefined): string | undefined {
  const t = value?.trim();
  if (!t) return undefined;
  return t.replace(/\/+$/, "");
}

/**
 * Accetta `https://dominio`, oppure solo `dominio.it` (aggiunge https://).
 * Stringa vuota → undefined (campo ignorato).
 */
function normalizeOptionalSiteUrl(value: string | undefined): string | undefined {
  const t = value?.trim();
  if (!t) return undefined;
  const withScheme = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  return withScheme.replace(/\/+$/, "");
}

const publicCoreSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20, "anon key troppo corta"),
});

const publicEnvSchema = publicCoreSchema.extend({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

/** Non lancia: utile in middleware e nella home per evitare 500 se mancano le env in produzione. */
export function getPublicEnvSafe(): PublicEnv | null {
  const supabaseUrl = trimUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const siteCandidate = normalizeOptionalSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

  const core = publicCoreSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
  });
  if (!core.success) return null;

  let siteUrlParsed: string | undefined;
  if (siteCandidate) {
    const siteCheck = z.string().url().safeParse(siteCandidate);
    siteUrlParsed = siteCheck.success ? siteCheck.data : undefined;
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: core.data.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: core.data.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: siteUrlParsed,
  };
}

export function isSupabaseConfigured(): boolean {
  return getPublicEnvSafe() !== null;
}

/** Codici problema env (traduzione lato UI / i18n). */
export type SupabaseEnvIssueKind =
  | "missing_url"
  | "invalid_url"
  | "non_https_url"
  | "missing_anon_key"
  | "short_anon_key"
  | "unknown";

/** Elenco problemi rilevati sulle variabili pubbliche Supabase (nessun segreto in output). */
export function getSupabaseEnvIssueKinds(): SupabaseEnvIssueKind[] {
  if (getPublicEnvSafe()) return [];

  const kinds: SupabaseEnvIssueKind[] = [];
  const supabaseUrl = trimUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl) {
    kinds.push("missing_url");
  } else {
    try {
      const u = new URL(supabaseUrl);
      if (u.protocol !== "https:") {
        kinds.push("non_https_url");
      }
    } catch {
      kinds.push("invalid_url");
    }
  }

  if (!anonKey) {
    kinds.push("missing_anon_key");
  } else if (anonKey.length < 20) {
    kinds.push("short_anon_key");
  }

  if (kinds.length === 0) {
    kinds.push("unknown");
  }

  return kinds;
}

export function getPublicEnv(): PublicEnv {
  const env = getPublicEnvSafe();
  if (!env) {
    throw new Error(
      "Variabili Supabase mancanti o non valide. Imposta NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY (es. in Vercel → Project → Settings → Environment Variables) e ridistribuisci.",
    );
  }
  return env;
}

const serviceEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
});

export function getServiceEnv() {
  const pub = getPublicEnvSafe();
  if (!pub) {
    throw new Error("Variabili pubbliche Supabase mancanti.");
  }
  return serviceEnvSchema.parse({
    ...pub,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  });
}

export function siteUrl() {
  const env = getPublicEnvSafe();
  if (env?.NEXT_PUBLIC_SITE_URL) return env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const v = normalizeOptionalSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (v) return v.replace(/\/$/, "");
  return "http://localhost:3000";
}
