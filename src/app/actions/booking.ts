"use server";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import { evaluateActivationEligibility } from "@/lib/requirements/activation";

export async function logBookingClick(activationId: string) {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: activation, error: actErr } = await supabase
    .from("activations")
    .select("id, bookings_url, requirements, catalog_id")
    .eq("id", activationId)
    .maybeSingle();

  if (actErr || !activation) {
    return { ok: false as const, error: "Attivazione non trovata." };
  }

  if (!activation.bookings_url) {
    return {
      ok: false as const,
      error: "URL Microsoft Bookings non configurato per questa attivazione.",
    };
  }

  const { data: attrsRow } = await supabase
    .from("client_attributes")
    .select("attributes")
    .eq("profile_id", user.id)
    .maybeSingle();

  const eligibility = evaluateActivationEligibility(
    activation.requirements,
    attrsRow?.attributes ?? {},
  );

  if (!eligibility.ok) {
    return {
      ok: false as const,
      error: "Non sei idoneo per questa attivazione. Aggiorna il profilo o verifica i requisiti.",
    };
  }

  const { error: insErr } = await supabase.from("booking_click_logs").insert({
    profile_id: user.id,
    activation_id: activation.id,
  });

  if (insErr) {
    return { ok: false as const, error: "Impossibile registrare il click. Riprova." };
  }

  return { ok: true as const, url: activation.bookings_url };
}
