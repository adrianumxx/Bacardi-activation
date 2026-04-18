"use server";

import { redirect } from "next/navigation";

import { getDictionary } from "@/i18n/get-dictionary";
import { isSupabaseConfigured, siteUrl } from "@/lib/env";
import { getLocale, localizedPath } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/paths";
import { createClient } from "@/lib/supabase/server";

function redirectLoginError(message: string): never {
  const locale = getLocale();
  redirect(localizedPath(`/login?error=${encodeURIComponent(message)}`, locale));
}

function redirectRegisterError(message: string): never {
  const locale = getLocale();
  redirect(localizedPath(`/register?error=${encodeURIComponent(message)}`, locale));
}

async function requireSupabaseForAuth() {
  if (!isSupabaseConfigured()) {
    const dict = await getDictionary(getLocale());
    redirectLoginError(dict.authCredentials.supabaseMissingLogin);
  }
  return createClient();
}

export async function loginWithPasswordAction(formData: FormData) {
  const dict = await getDictionary(getLocale());
  const locale = getLocale();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email.includes("@")) redirectLoginError(dict.authCredentials.invalidEmail);
  if (password.length < 6) redirectLoginError(dict.authCredentials.passwordMin);

  const supabase = await requireSupabaseForAuth();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirectLoginError(error.message);
  redirect(localizedPath("/portal", locale));
}

export async function signInWithGoogleAction() {
  const dict = await getDictionary(getLocale());
  const locale = getLocale();
  const supabase = await requireSupabaseForAuth();
  const origin = siteUrl();
  const next = encodeURIComponent(localePath(locale, "/portal"));
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${next}`,
      queryParams: { access_type: "online", prompt: "select_account" },
    },
  });
  if (error) redirectLoginError(error.message);
  const url = data.url;
  if (!url) {
    redirectLoginError(dict.authCredentials.googleStartFailed);
  }
  redirect(url);
}

export async function registerWithPasswordAction(formData: FormData) {
  const dict = await getDictionary(getLocale());
  const locale = getLocale();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!email.includes("@")) redirectRegisterError(dict.authCredentials.invalidEmail);
  if (password.length < 6) redirectRegisterError(dict.authCredentials.passwordMin);
  if (password !== confirm) redirectRegisterError(dict.authCredentials.passwordMismatch);

  if (!isSupabaseConfigured()) {
    redirectRegisterError(dict.authCredentials.supabaseMissingRegister);
  }

  const supabase = await createClient();
  const next = encodeURIComponent(localePath(locale, "/portal"));
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl()}/auth/callback?next=${next}`,
    },
  });

  if (error) redirectRegisterError(error.message);
  if (data.session) redirect(localizedPath("/portal", locale));
  redirect(localizedPath("/login?registered=1", locale));
}
