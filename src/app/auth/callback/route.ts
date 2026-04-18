import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import type { Database } from "@/types/database";
import { getPublicEnvSafe } from "@/lib/env";

/** Origin pubblico (Vercel mette x-forwarded-host). */
function publicOrigin(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (host) {
    return `${proto}://${host}`;
  }
  return new URL(request.url).origin;
}

/**
 * PKCE / magic link: i cookie di sessione devono essere applicati alla Response del redirect.
 * L’origin del redirect deve coincidere con il dominio pubblico (vedi x-forwarded-* su Vercel).
 */
export async function GET(request: NextRequest) {
  const env = getPublicEnvSafe();
  if (!env) {
    return NextResponse.redirect(new URL("/configurazione", publicOrigin(request)));
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextRaw = url.searchParams.get("next") ?? "/portal";
  const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/portal";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=auth", publicOrigin(request)));
  }

  const origin = publicOrigin(request);
  const redirectUrl = new URL(next, origin);
  const response = NextResponse.redirect(redirectUrl);

  try {
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
        new URL(`/login?error=${encodeURIComponent(error.message)}`, origin),
      );
    }

    return response;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Errore sconosciuto";
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(msg)}`, origin),
    );
  }
}
