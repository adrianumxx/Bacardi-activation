"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/session";
import { requirementsPayloadSchema } from "@/lib/zod/requirements";
import { createClient } from "@/lib/supabase/server";
import type { ActivationType } from "@/types/database";

export async function createActivation(catalogId: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const type = String(formData.get("type") ?? "ORDER_PROMO") as ActivationType;
  const description = String(formData.get("description") ?? "") || null;
  const product_name = String(formData.get("product_name") ?? "") || null;
  const cocktail_name = String(formData.get("cocktail_name") ?? "") || null;
  const bookings_url = String(formData.get("bookings_url") ?? "").trim() || null;
  const requirements_markdown =
    String(formData.get("requirements_markdown") ?? "") || null;
  const requirements_raw = String(formData.get("requirements_json") ?? "");
  const sort_order = Number(String(formData.get("sort_order") ?? "0"));

  if (!title) return { ok: false as const, error: "Titolo obbligatorio." };

  let requirements;
  try {
    requirements = requirementsPayloadSchema.parse(JSON.parse(requirements_raw));
  } catch {
    return { ok: false as const, error: "requirements JSON non valido." };
  }

  const { data, error } = await supabase
    .from("activations")
    .insert({
      catalog_id: catalogId,
      type,
      title,
      description,
      product_name,
      cocktail_name,
      requirements,
      requirements_markdown,
      bookings_url,
      sort_order: Number.isFinite(sort_order) ? sort_order : 0,
    })
    .select("id")
    .maybeSingle();

  if (error || !data) return { ok: false as const, error: error?.message ?? "Errore DB." };

  revalidatePath(`/admin/catalogs/${catalogId}`);
  revalidatePath("/portal");
  return { ok: true as const, id: data.id };
}

export async function updateActivation(
  catalogId: string,
  activationId: string,
  formData: FormData,
) {
  await requireAdmin();
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const type = String(formData.get("type") ?? "ORDER_PROMO") as ActivationType;
  const description = String(formData.get("description") ?? "") || null;
  const product_name = String(formData.get("product_name") ?? "") || null;
  const cocktail_name = String(formData.get("cocktail_name") ?? "") || null;
  const bookings_url = String(formData.get("bookings_url") ?? "").trim() || null;
  const requirements_markdown =
    String(formData.get("requirements_markdown") ?? "") || null;
  const requirements_raw = String(formData.get("requirements_json") ?? "");
  const sort_order = Number(String(formData.get("sort_order") ?? "0"));

  if (!title) return { ok: false as const, error: "Titolo obbligatorio." };

  let requirements;
  try {
    requirements = requirementsPayloadSchema.parse(JSON.parse(requirements_raw));
  } catch {
    return { ok: false as const, error: "requirements JSON non valido." };
  }

  const { error } = await supabase
    .from("activations")
    .update({
      type,
      title,
      description,
      product_name,
      cocktail_name,
      requirements,
      requirements_markdown,
      bookings_url,
      sort_order: Number.isFinite(sort_order) ? sort_order : 0,
    })
    .eq("id", activationId)
    .eq("catalog_id", catalogId);

  if (error) return { ok: false as const, error: error.message };

  revalidatePath(`/admin/catalogs/${catalogId}`);
  revalidatePath("/portal");
  revalidatePath(`/portal/activations/${activationId}`);
  return { ok: true as const };
}

export async function deleteActivation(catalogId: string, activationId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("activations")
    .delete()
    .eq("id", activationId)
    .eq("catalog_id", catalogId);

  if (error) return { ok: false as const, error: error.message };

  revalidatePath(`/admin/catalogs/${catalogId}`);
  revalidatePath("/portal");
  return { ok: true as const };
}

export async function createActivationAction(catalogId: string, formData: FormData) {
  const res = await createActivation(catalogId, formData);
  if (res.ok) redirect(`/admin/catalogs/${catalogId}?createdActivation=1`);
  redirect(
    `/admin/catalogs/${catalogId}/activations/new?error=${encodeURIComponent(res.error)}`,
  );
}

export async function updateActivationAction(
  catalogId: string,
  activationId: string,
  formData: FormData,
) {
  const res = await updateActivation(catalogId, activationId, formData);
  if (res.ok) redirect(`/admin/catalogs/${catalogId}?savedActivation=1`);
  redirect(
    `/admin/catalogs/${catalogId}/activations/${activationId}?error=${encodeURIComponent(res.error)}`,
  );
}

export async function deleteActivationAction(catalogId: string, activationId: string) {
  const res = await deleteActivation(catalogId, activationId);
  if (res.ok) redirect(`/admin/catalogs/${catalogId}?deletedActivation=1`);
  redirect(
    `/admin/catalogs/${catalogId}/activations/${activationId}?error=${encodeURIComponent(res.error)}`,
  );
}
