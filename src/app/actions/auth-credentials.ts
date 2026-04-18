"use server";

import { redirect } from "next/navigation";

import { isSupabaseConfigured, siteUrl } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

function loginError(message: string): never {
  redirect(`/login?error=${encodeURIComponent(message)}`);
}

function registerError(message: string): never {
  redirect(`/register?error=${encodeURIComponent(message)}`);
}

async function requireSupabaseForAuth() {
  if (!isSupabaseConfigured()) {
    loginError(
      "Supabase non configurato: aggiungi NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local nella radice del progetto, poi riavvia `npm run dev`.",
    );
  }
  return createClient();
}

export async function loginWithPasswordAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email.includes("@")) loginError("Inserisci un indirizzo email valido.");
  if (password.length < 6) loginError("La password deve avere almeno 6 caratteri.");

  const supabase = await requireSupabaseForAuth();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) loginError(error.message);
  redirect("/portal");
}

export async function signInWithGoogleAction() {
  const supabase = await requireSupabaseForAuth();
  const origin = siteUrl();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: { access_type: "online", prompt: "select_account" },
    },
  });
  if (error) loginError(error.message);
  const url = data.url;
  if (!url) {
    loginError(
      "Impossibile avviare Google: verifica il provider in Supabase (Authentication → Providers → Google).",
    );
  }
  redirect(url);
}

export async function registerWithPasswordAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!email.includes("@")) registerError("Inserisci un indirizzo email valido.");
  if (password.length < 6) registerError("La password deve avere almeno 6 caratteri.");
  if (password !== confirm) registerError("Le password non coincidono.");

  if (!isSupabaseConfigured()) {
    registerError(
      "Supabase non configurato: aggiungi NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, poi riavvia il server di sviluppo.",
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl()}/auth/callback`,
    },
  });

  if (error) registerError(error.message);
  if (data.session) redirect("/portal");
  redirect("/login?registered=1");
}
