import { createClient } from "@/lib/supabase/server";

export async function getActiveCatalogForClient() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("catalogs")
    .select("id, name, starts_at, ends_at, status, attribute_schema")
    .order("starts_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return null;
  return data;
}
