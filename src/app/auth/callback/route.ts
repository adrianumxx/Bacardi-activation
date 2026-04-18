import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import type { Database } from "@/types/database";
import { getPublicEnvSafe } from "@/lib/env";

/**
 * PKCE / magic link: i cookie di sessione devono essere applicati alla Response del redirect.
 * Usare solo `cookies()` di Next qui spesso non persiste la sessione dopo il redirect.
 */
export async function GET(request: NextRequest) {
  const env = getPublicEnvSafe();
  if (!env) {
    return NextResponse.redirect(new URL("/configurazione", request.url));
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextRaw = url.searchParams.get("next") ?? "/portal";
  const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/portal";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=auth", request.url));
  }

  const redirectUrl = new URL(next, url.origin);
  const response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url),
    );
  }

  return response;
}
