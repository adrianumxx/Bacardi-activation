"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/env";

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email.includes("@")) {
    return { ok: false as const, error: "Inserisci un indirizzo email valido." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl()}/auth/callback`,
    },
  });

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function loginAction(formData: FormData) {
  const res = await sendMagicLink(formData);
  if (res.ok) redirect("/login?sent=1");
  redirect(`/login?error=${encodeURIComponent(res.error)}`);
}
