"use server";

import { redirect } from "next/navigation";

import { getDictionary } from "@/i18n/get-dictionary";
import { isSupabaseConfigured, siteUrl } from "@/lib/env";
import { getLocale, localizedPath } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";

export async function sendMagicLink(formData: FormData) {
  const locale = getLocale();
  const dict = await getDictionary(locale);
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email.includes("@")) {
    return { ok: false as const, error: dict.authCredentials.invalidEmail };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false as const,
      error: dict.authCredentials.magicSupabaseEnv,
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl()}/auth/callback?next=${encodeURIComponent(
          localizedPath("/portal", locale),
        )}`,
      },
    });

    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  } catch (e) {
    const msg = e instanceof Error ? e.message : dict.authCredentials.magicConnection;
    return { ok: false as const, error: msg };
  }
}

export async function loginMagicLinkAction(formData: FormData) {
  const res = await sendMagicLink(formData);
  const loc = getLocale();
  if (res.ok) redirect(localizedPath("/login?sent=1", loc));
  redirect(localizedPath(`/login?error=${encodeURIComponent(res.error)}`, loc));
}
