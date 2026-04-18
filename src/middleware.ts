import { NextRequest, NextResponse } from "next/server";

import { DEFAULT_LOCALE, LOCALES, type AppLocale } from "@/i18n/config";
import { updateSession } from "@/lib/supabase/middleware";

function extractLocale(pathname: string): AppLocale | null {
  const seg = pathname.split("/")[1];
  if (seg && LOCALES.includes(seg as AppLocale)) return seg as AppLocale;
  return null;
}

/**
 * Prefisso lingua `/it/...` + header `x-bacardi-locale` per RSC e server actions.
 * `/auth/callback`, asset e immagini OG restano fuori dal prefisso.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/twitter-image") ||
    pathname === "/favicon.ico" ||
    /\.(?:ico|png|svg|jpg|jpeg|gif|webp)$/.test(pathname)
  ) {
    return updateSession(request);
  }

  const locale = extractLocale(pathname);
  if (!locale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-bacardi-locale", locale);

  const requestWithLocale = new NextRequest(request, {
    headers: requestHeaders,
  });

  return updateSession(requestWithLocale);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
