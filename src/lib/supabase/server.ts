import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

import { getPublicEnvSafe } from "@/lib/env";

export async function createClient() {
  const cookieStore = await cookies();
  const env = getPublicEnvSafe();
  if (!env) {
    throw new Error("Supabase non configurato (variabili NEXT_PUBLIC_* mancanti).");
  }
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = env;

  return createServerClient<Database>(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component: read-only cookies
          }
        },
      },
    },
  );
}
