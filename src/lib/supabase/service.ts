import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

import { getServiceEnv } from "@/lib/env";

export function createServiceRoleClient() {
  const env = getServiceEnv();
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
