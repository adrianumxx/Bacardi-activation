"use server";

import { redirect } from "next/navigation";

import { isSupabaseConfigured, siteUrl } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email.includes("@")) {
    return { ok: false as const, error: "Inserisci un indirizzo email valido." };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false as const,
      error:
        "Supabase non configurato. Aggiungi NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local nella radice del progetto, poi riavvia `npm run dev`.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl()}/auth/callback`,
      },
    });

    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Errore di connessione a Supabase.";
    return { ok: false as const, error: msg };
  }
}

export async function loginMagicLinkAction(formData: FormData) {
  const res = await sendMagicLink(formData);
  if (res.ok) redirect("/login?sent=1");
  redirect(`/login?error=${encodeURIComponent(res.error)}`);
}
