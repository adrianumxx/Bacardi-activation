import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { DEFAULT_LOCALE, LOCALES, type AppLocale } from "@/i18n/config";
import type { Database } from "@/types/database";
import { sanitizePostLoginRedirect } from "@/lib/auth/post-login-redirect";
import { getPublicEnvSafe } from "@/lib/env";
import { localePath } from "@/lib/i18n/paths";

/** Origin pubblico (Vercel mette x-forwarded-host). */
function publicOrigin(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (host) {
    return `${proto}://${host}`;
  }
  return new URL(request.url).origin;
}

/** Se `path` non ha già un prefisso lingua, usa il default (es. `/portal` → `/it/portal`). */
function withLocalePrefix(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const first = normalized.split("/")[1];
  if (first && LOCALES.includes(first as AppLocale)) return normalized;
  return localePath(DEFAULT_LOCALE, normalized);
}

function localeFromPrefixedPath(prefixed: string): AppLocale {
  const seg = prefixed.split("/")[1];
  if (seg && LOCALES.includes(seg as AppLocale)) return seg as AppLocale;
  return DEFAULT_LOCALE;
}

/**
 * PKCE / OAuth: i cookie di sessione devono essere applicati alla Response del redirect.
 * `next` viene normalizzato con prefisso lingua se mancante.
 */
export async function GET(request: NextRequest) {
  const env = getPublicEnvSafe();
  const origin = publicOrigin(request);
  if (!env) {
    return NextResponse.redirect(new URL(withLocalePrefix("/configurazione"), origin));
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextRaw = url.searchParams.get("next") ?? "/activations";
  const nextClean =
    nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/activations";
  const nextPrefixed = withLocalePrefix(nextClean);
  const locale = localeFromPrefixedPath(nextPrefixed);
  const safeNext = sanitizePostLoginRedirect(locale, nextPrefixed);

  if (!code) {
    return NextResponse.redirect(new URL(withLocalePrefix("/login?error=auth"), origin));
  }

  const redirectUrl = new URL(safeNext, origin);
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
        new URL(
          withLocalePrefix(`/login?error=${encodeURIComponent(error.message)}`),
          origin,
        ),
      );
    }

    return response;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Errore sconosciuto";
    return NextResponse.redirect(
      new URL(withLocalePrefix(`/login?error=${encodeURIComponent(msg)}`), origin),
    );
  }
}
