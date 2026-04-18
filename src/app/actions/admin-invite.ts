"use server";

import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/session";
import { siteUrl } from "@/lib/env";
import { getLocale, localizedPath } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/paths";
import { createServiceRoleClient } from "@/lib/supabase/service";

export async function inviteClientByEmail(email: string) {
  await requireAdmin();
  const locale = getLocale();
  const next = encodeURIComponent(localePath(locale, "/portal"));

  const trimmed = email.trim().toLowerCase();
  if (!trimmed.includes("@")) {
    return { ok: false as const, error: "Email non valida." };
  }

  try {
    const admin = createServiceRoleClient();
    const { error } = await admin.auth.admin.inviteUserByEmail(trimmed, {
      redirectTo: `${siteUrl()}/auth/callback?next=${next}`,
    });
    if (error) {
      return { ok: false as const, error: error.message };
    }
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error:
        "SUPABASE_SERVICE_ROLE_KEY mancante o non valida. Configura la chiave sul server.",
    };
  }
}

export async function inviteClientAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const res = await inviteClientByEmail(email);
  const loc = getLocale();
  if (res.ok) redirect(localizedPath("/admin/users?invited=1", loc));
  redirect(localizedPath(`/admin/users?error=${encodeURIComponent(res.error)}`, loc));
}
