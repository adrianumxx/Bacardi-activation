import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { DEFAULT_LOCALE, isAppLocale, type AppLocale } from "@/i18n/config";

import { localePath } from "./paths";

/** Impostato dal middleware a partire dal segmento `[locale]` nell’URL. */
export function getLocale(): AppLocale {
  const raw = headers().get("x-bacardi-locale");
  if (isAppLocale(raw)) return raw;
  return DEFAULT_LOCALE;
}

export function localizedPath(path: string, locale: AppLocale): string {
  return localePath(locale, path);
}

/** `revalidatePath` con prefisso lingua corrente (header). */
export function revalidateAppPath(internalPath: string) {
  revalidatePath(localizedPath(internalPath, getLocale()));
}
