import { redirect } from "next/navigation";

import { getLocale, localizedPath } from "@/lib/i18n/server";

export default function PortalHomeRedirect() {
  redirect(localizedPath("/activations", getLocale()));
}
