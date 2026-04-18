import { redirect } from "next/navigation";

import { getLocale, localizedPath } from "@/lib/i18n/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export async function requireUser() {
  const locale = await getLocale();
  if (!isSupabaseConfigured()) redirect(localizedPath("/configurazione", locale));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(localizedPath("/login", locale));
  return user;
}

export async function getOptionalUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfileForUser(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, full_name, company_name")
    .eq("id", userId)
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function requireAdmin() {
  const user = await requireUser();
  const profile = await getProfileForUser(user.id);
  const locale = await getLocale();
  if (profile?.role !== "admin") redirect(localizedPath("/activations", locale));
  return { user, profile, role: profile.role as UserRole };
}
