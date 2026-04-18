"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/session";
import { attributeSchemaPayload } from "@/lib/zod/catalog";
import { createClient } from "@/lib/supabase/server";

export async function createCatalog(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const starts_at = String(formData.get("starts_at") ?? "");
  const ends_at = String(formData.get("ends_at") ?? "");
  const status = String(formData.get("status") ?? "draft");
  const attribute_schema_raw = String(formData.get("attribute_schema") ?? "[]");

  if (!name) return { ok: false as const, error: "Nome obbligatorio." };

  let attribute_schema;
  try {
    attribute_schema = attributeSchemaPayload.parse(JSON.parse(attribute_schema_raw));
  } catch {
    return { ok: false as const, error: "attribute_schema JSON non valido." };
  }

  const { data, error } = await supabase
    .from("catalogs")
    .insert({
      name,
      starts_at,
      ends_at,
      status: status as "draft" | "active" | "archived",
      attribute_schema,
    })
    .select("id")
    .maybeSingle();

  if (error || !data) return { ok: false as const, error: error?.message ?? "Errore DB." };

  revalidatePath("/admin/catalogs");
  return { ok: true as const, id: data.id };
}

export async function updateCatalog(catalogId: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const starts_at = String(formData.get("starts_at") ?? "");
  const ends_at = String(formData.get("ends_at") ?? "");
  const status = String(formData.get("status") ?? "draft");
  const attribute_schema_raw = String(formData.get("attribute_schema") ?? "[]");

  if (!name) return { ok: false as const, error: "Nome obbligatorio." };

  let attribute_schema;
  try {
    attribute_schema = attributeSchemaPayload.parse(JSON.parse(attribute_schema_raw));
  } catch {
    return { ok: false as const, error: "attribute_schema JSON non valido." };
  }

  const { error } = await supabase
    .from("catalogs")
    .update({
      name,
      starts_at,
      ends_at,
      status: status as "draft" | "active" | "archived",
      attribute_schema,
    })
    .eq("id", catalogId);

  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/catalogs");
  revalidatePath(`/admin/catalogs/${catalogId}`);
  return { ok: true as const };
}

export async function cloneCatalog(sourceCatalogId: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const starts_at = String(formData.get("starts_at") ?? "");
  const ends_at = String(formData.get("ends_at") ?? "");

  if (!name) return { ok: false as const, error: "Nome obbligatorio." };

  const { data: src, error: srcErr } = await supabase
    .from("catalogs")
    .select("name, attribute_schema, status")
    .eq("id", sourceCatalogId)
    .maybeSingle();

  if (srcErr || !src) return { ok: false as const, error: "Catalogo sorgente non trovato." };

  const { data: created, error: insErr } = await supabase
    .from("catalogs")
    .insert({
      name,
      starts_at,
      ends_at,
      status: "draft",
      attribute_schema: src.attribute_schema,
    })
    .select("id")
    .maybeSingle();

  if (insErr || !created) {
    return { ok: false as const, error: insErr?.message ?? "Errore creazione catalogo." };
  }

  const { data: acts, error: actsErr } = await supabase
    .from("activations")
    .select(
      "type, title, description, product_name, cocktail_name, requirements, requirements_markdown, bookings_url, sort_order",
    )
    .eq("catalog_id", sourceCatalogId);

  if (actsErr) return { ok: false as const, error: actsErr.message };

  if (acts && acts.length > 0) {
    const rows = acts.map((a) => ({
      catalog_id: created.id,
      type: a.type,
      title: a.title,
      description: a.description,
      product_name: a.product_name,
      cocktail_name: a.cocktail_name,
      requirements: a.requirements,
      requirements_markdown: a.requirements_markdown,
      bookings_url: a.bookings_url,
      sort_order: a.sort_order,
    }));
    const { error: copyErr } = await supabase.from("activations").insert(rows);
    if (copyErr) return { ok: false as const, error: copyErr.message };
  }

  revalidatePath("/admin/catalogs");
  revalidatePath(`/admin/catalogs/${created.id}`);
  return { ok: true as const, id: created.id };
}

export async function createCatalogAction(formData: FormData) {
  const res = await createCatalog(formData);
  if (res.ok) redirect(`/admin/catalogs/${res.id}`);
  redirect(`/admin/catalogs/new?error=${encodeURIComponent(res.error)}`);
}

export async function updateCatalogAction(catalogId: string, formData: FormData) {
  const res = await updateCatalog(catalogId, formData);
  if (res.ok) redirect(`/admin/catalogs/${catalogId}?saved=1`);
  redirect(
    `/admin/catalogs/${catalogId}?error=${encodeURIComponent(res.error)}`,
  );
}

export async function cloneCatalogAction(sourceCatalogId: string, formData: FormData) {
  const res = await cloneCatalog(sourceCatalogId, formData);
  if (res.ok) redirect(`/admin/catalogs/${res.id}?cloned=1`);
  redirect(
    `/admin/catalogs/${sourceCatalogId}?error=${encodeURIComponent(res.error)}`,
  );
}
