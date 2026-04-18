import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export async function requireUser() {
  if (!isSupabaseConfigured()) redirect("/configurazione");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
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
  if (profile?.role !== "admin") redirect("/portal");
  return { user, profile, role: profile.role as UserRole };
}
