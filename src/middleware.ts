import { type NextRequest, NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/env";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isSupabaseConfigured()) {
    if (!pathname.startsWith("/configurazione")) {
      const url = request.nextUrl.clone();
      url.pathname = "/configurazione";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  try {
    return await updateSession(request);
  } catch {
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
