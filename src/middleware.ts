import { type NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

/**
 * Non controlliamo qui le env Supabase: su Vercel il middleware gira su **Edge** e a volte
 * `process.env.NEXT_PUBLIC_*` non coincide con il runtime Node → redirect infinito a /configurazione.
 * La sessione viene aggiornata solo se le env ci sono (vedi `updateSession`).
 */
export async function middleware(request: NextRequest) {
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
