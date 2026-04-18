import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

import { getPublicEnvSafe } from "@/lib/env";

export function createClient() {
  const env = getPublicEnvSafe();
  if (!env) {
    throw new Error("Supabase non configurato.");
  }
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = env;
  return createBrowserClient<Database>(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
