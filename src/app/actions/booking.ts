"use server";

import { getDictionary } from "@/i18n/get-dictionary";
import { requireUser } from "@/lib/auth/session";
import { resolveBookingsUrl } from "@/lib/bookings-default";
import { getLocale } from "@/lib/i18n/server";
import { evaluateActivationEligibility } from "@/lib/requirements/activation";
import { createClient } from "@/lib/supabase/server";

export async function logBookingClick(activationId: string) {
  const dict = await getDictionary(getLocale());
  const user = await requireUser();
  const supabase = await createClient();

  const { data: activation, error: actErr } = await supabase
    .from("activations")
    .select("id, bookings_url, requirements, catalog_id")
    .eq("id", activationId)
    .maybeSingle();

  if (actErr || !activation) {
    return { ok: false as const, error: dict.booking.notFound };
  }

  const bookingsUrl = resolveBookingsUrl(activation.bookings_url);

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
      error: dict.booking.notEligible,
    };
  }

  const { error: insErr } = await supabase.from("booking_click_logs").insert({
    profile_id: user.id,
    activation_id: activation.id,
  });

  if (insErr) {
    return { ok: false as const, error: dict.booking.logFail };
  }

  return { ok: true as const, url: bookingsUrl };
}
