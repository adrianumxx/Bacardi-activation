import { redirect } from "next/navigation";

import { getLocale, localizedPath } from "@/lib/i18n/server";

export default function LegacyPortalActivationRedirect({ params }: { params: { id: string } }) {
  redirect(localizedPath(`/activations/${params.id}`, getLocale()));
}
