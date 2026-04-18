"use server";

import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/env";
import { getLocale, localizedPath } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      /* session già assente o cookie non scrivibili */
    }
  }
  redirect(localizedPath("/login", getLocale()));
}
