import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

/** Non lancia: utile in middleware e nella home per evitare 500 se mancano le env in produzione. */
export function getPublicEnvSafe(): PublicEnv | null {
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL?.trim() || undefined,
  });
  return parsed.success ? parsed.data : null;
}

export function isSupabaseConfigured(): boolean {
  return getPublicEnvSafe() !== null;
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
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export function getServiceEnv() {
  return serviceEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
}

export function siteUrl() {
  const v = process.env.NEXT_PUBLIC_SITE_URL;
  if (v) return v.replace(/\/$/, "");
  return "http://localhost:3000";
}
