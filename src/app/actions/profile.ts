"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { attributeSchemaPayload } from "@/lib/zod/catalog";
import { requireUser } from "@/lib/auth/session";
import { getLocale, localizedPath, revalidateAppPath } from "@/lib/i18n/server";

function coerceValue(
  type: "string" | "number" | "boolean",
  raw: FormDataEntryValue | null,
  present: boolean,
): string | number | boolean {
  if (type === "boolean") {
    if (!present) return false;
    const s = typeof raw === "string" ? raw : "";
    return s === "on" || s === "true";
  }
  if (raw === null) {
    if (type === "number") return 0;
    return "";
  }
  const s = typeof raw === "string" ? raw : "";
  if (type === "number") {
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  }
  return s;
}

export async function updateClientProfile(formData: FormData) {
  const user = await requireUser();
  const supabase = await createClient();

  const fullName = String(formData.get("full_name") ?? "");
  const companyName = String(formData.get("company_name") ?? "");

  const schemaRaw = String(formData.get("attribute_schema") ?? "[]");
  let schemaParsed;
  try {
    schemaParsed = attributeSchemaPayload.parse(JSON.parse(schemaRaw));
  } catch {
    return { ok: false as const, error: "Schema attributi non valido." };
  }

  const nextAttributes: Record<string, string | number | boolean> = {};
  for (const field of schemaParsed) {
    const key = `attr__${field.key}`;
    const present = formData.has(key);
    nextAttributes[field.key] = coerceValue(
      field.type,
      formData.get(key),
      present,
    );
  }

  const { error: pErr } = await supabase
    .from("profiles")
    .update({ full_name: fullName, company_name: companyName })
    .eq("id", user.id);

  if (pErr) return { ok: false as const, error: "Aggiornamento profilo fallito." };

  const { error: aErr } = await supabase.from("client_attributes").upsert(
    {
      profile_id: user.id,
      attributes: nextAttributes,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "profile_id" },
  );

  if (aErr) return { ok: false as const, error: "Salvataggio attributi fallito." };

  revalidateAppPath("/activations");
  revalidateAppPath("/portal/profile");
  return { ok: true as const };
}

export async function updateClientProfileAction(formData: FormData) {
  const res = await updateClientProfile(formData);
  const locale = getLocale();
  if (res.ok) redirect(localizedPath("/portal/profile?saved=1", locale));
  redirect(localizedPath(`/portal/profile?error=${encodeURIComponent(res.error)}`, locale));
}
